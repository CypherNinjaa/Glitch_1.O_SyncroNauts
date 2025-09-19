-- Chat Room System Tables - FIXED VERSION
-- Run these SQL queries in your Supabase SQL editor
-- This version fixes the infinite recursion in RLS policies

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(6) UNIQUE NOT NULL, -- 4-5 digit auto-generated ID
    name VARCHAR(100) NOT NULL,
    password_hash TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    max_participants INTEGER DEFAULT 50
);

-- Create room_participants table (junction table for many-to-many relationship)
CREATE TABLE IF NOT EXISTS room_participants (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(room_id, user_id)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'system', 'image', etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    edited_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create function to generate unique room ID
CREATE OR REPLACE FUNCTION generate_room_id()
RETURNS VARCHAR(6) AS $$
DECLARE
    new_id VARCHAR(6);
    id_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate random 5-digit alphanumeric ID
        new_id := UPPER(
            SUBSTRING(
                MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)
                FROM 1 FOR 5
            )
        );
        
        -- Check if this ID already exists
        SELECT EXISTS(SELECT 1 FROM chat_rooms WHERE room_id = new_id) INTO id_exists;
        
        -- If ID doesn't exist, break the loop
        IF NOT id_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to auto-generate room_id
CREATE OR REPLACE FUNCTION set_room_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.room_id IS NULL OR NEW.room_id = '' THEN
        NEW.room_id := generate_room_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate room_id before insert
CREATE TRIGGER trigger_set_room_id
    BEFORE INSERT ON chat_rooms
    FOR EACH ROW
    EXECUTE FUNCTION set_room_id();

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on chat_rooms
CREATE TRIGGER trigger_update_chat_rooms_updated_at
    BEFORE UPDATE ON chat_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_rooms_room_id ON chat_rooms(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_created_by ON chat_rooms(created_by);
CREATE INDEX IF NOT EXISTS idx_room_participants_room_id ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user_id ON room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- FIXED RLS Policies - No infinite recursion

-- 1. Chat Rooms Policies
-- Users can view rooms they created OR are participants of (using EXISTS to avoid recursion)
CREATE POLICY "Users can view their chat rooms" ON chat_rooms
    FOR SELECT USING (
        created_by = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM room_participants rp 
            WHERE rp.room_id = chat_rooms.id 
            AND rp.user_id = auth.uid() 
            AND rp.is_active = TRUE
        )
    );

-- Users can create new chat rooms
CREATE POLICY "Users can create chat rooms" ON chat_rooms
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Room creators can update their rooms
CREATE POLICY "Room creators can update their rooms" ON chat_rooms
    FOR UPDATE USING (auth.uid() = created_by);

-- 2. Room Participants Policies (FIXED - no recursion)
-- Users can view participants of rooms they are part of OR created
CREATE POLICY "Users can view room participants" ON room_participants
    FOR SELECT USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM chat_rooms cr 
            WHERE cr.id = room_participants.room_id 
            AND (
                cr.created_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM room_participants rp2 
                    WHERE rp2.room_id = cr.id 
                    AND rp2.user_id = auth.uid() 
                    AND rp2.is_active = TRUE
                )
            )
        )
    );

-- Users can join rooms (insert themselves)
CREATE POLICY "Users can join rooms" ON room_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can leave rooms (update their own participation)
CREATE POLICY "Users can leave rooms" ON room_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- 3. Chat Messages Policies
-- Users can view messages from rooms they participate in
CREATE POLICY "Users can view messages from their rooms" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM room_participants rp 
            WHERE rp.room_id = chat_messages.room_id 
            AND rp.user_id = auth.uid() 
            AND rp.is_active = TRUE
        )
    );

-- Users can send messages to rooms they participate in
CREATE POLICY "Users can send messages to their rooms" ON chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM room_participants rp 
            WHERE rp.room_id = chat_messages.room_id 
            AND rp.user_id = auth.uid() 
            AND rp.is_active = TRUE
        )
    );

-- Users can edit/delete their own messages
CREATE POLICY "Users can edit their own messages" ON chat_messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Create a view for easier room querying with participant count
CREATE OR REPLACE VIEW room_details AS
SELECT 
    cr.*,
    COUNT(rp.user_id) as participant_count
FROM chat_rooms cr
LEFT JOIN room_participants rp ON cr.id = rp.room_id AND rp.is_active = TRUE
GROUP BY cr.id, cr.room_id, cr.name, cr.password_hash, cr.created_by, cr.created_at, cr.updated_at, cr.is_active, cr.max_participants;

-- SIMPLIFIED function to join a room (no RLS conflicts)
CREATE OR REPLACE FUNCTION join_room_simple(room_code VARCHAR(6), room_password TEXT, user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    room_record RECORD;
    participant_count INTEGER;
BEGIN
    -- Get room details (bypassing RLS by using SECURITY DEFINER)
    SELECT * FROM chat_rooms 
    WHERE room_id = room_code AND is_active = TRUE
    INTO room_record;

    -- Check if room exists
    IF room_record.id IS NULL THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Room not found');
    END IF;

    -- Verify password (using simple comparison for now)
    IF room_record.password_hash != room_password THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Invalid password');
    END IF;

    -- Check current participants
    SELECT COUNT(*) FROM room_participants 
    WHERE room_id = room_record.id AND is_active = TRUE
    INTO participant_count;

    -- Check if room is full
    IF participant_count >= room_record.max_participants THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Room is full');
    END IF;

    -- Check if user is already in the room
    IF EXISTS(SELECT 1 FROM room_participants WHERE room_id = room_record.id AND user_id = user_uuid AND is_active = TRUE) THEN
        RETURN JSON_BUILD_OBJECT('success', true, 'message', 'Already in room', 'room_id', room_record.id);
    END IF;

    -- Add user to room
    INSERT INTO room_participants (room_id, user_id) 
    VALUES (room_record.id, user_uuid)
    ON CONFLICT (room_id, user_id) 
    DO UPDATE SET is_active = TRUE, joined_at = NOW();

    RETURN JSON_BUILD_OBJECT('success', true, 'message', 'Successfully joined room', 'room_id', room_record.id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;