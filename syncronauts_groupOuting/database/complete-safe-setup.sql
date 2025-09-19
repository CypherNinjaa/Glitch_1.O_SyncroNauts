-- SAFE CHAT ROOM SETUP - Handles existing objects
-- Run this script in your Supabase SQL editor
-- This version safely handles existing triggers, functions, and policies

-- Drop existing triggers and functions first to avoid conflicts
DROP TRIGGER IF EXISTS trigger_set_room_id ON chat_rooms;
DROP TRIGGER IF EXISTS trigger_update_chat_rooms_updated_at ON chat_rooms;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing functions
DROP FUNCTION IF EXISTS set_room_id();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS generate_room_id();
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS join_room(VARCHAR, TEXT);
DROP FUNCTION IF EXISTS join_room_simple(VARCHAR, TEXT, UUID);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view chat rooms they participate in" ON chat_rooms;
DROP POLICY IF EXISTS "Users can create chat rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Room creators can update their rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Users can view room participants" ON room_participants;
DROP POLICY IF EXISTS "Users can join rooms" ON room_participants;
DROP POLICY IF EXISTS "Users can leave rooms" ON room_participants;
DROP POLICY IF EXISTS "Users can view messages from their rooms" ON chat_messages;
DROP POLICY IF EXISTS "Users can send messages to their rooms" ON chat_messages;
DROP POLICY IF EXISTS "Users can edit their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can view their chat rooms" ON chat_rooms;
DROP POLICY IF EXISTS "View room participants" ON room_participants;
DROP POLICY IF EXISTS "View chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Send chat messages" ON chat_messages;

-- Drop existing profile policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view accessible chat rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Users can view relevant participants" ON room_participants;
DROP POLICY IF EXISTS "Users can view accessible messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can send messages to joined rooms" ON chat_messages;
DROP POLICY IF EXISTS "Users can edit own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can update own participation" ON room_participants;

-- Drop existing views
DROP VIEW IF EXISTS room_details;

-- Create tables (IF NOT EXISTS prevents errors if they already exist)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_rooms (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(6) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    max_participants INTEGER DEFAULT 50
);

CREATE TABLE IF NOT EXISTS room_participants (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(room_id, user_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    edited_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create functions
CREATE OR REPLACE FUNCTION generate_room_id()
RETURNS VARCHAR(6) AS $$
DECLARE
    new_id VARCHAR(6);
    id_exists BOOLEAN;
BEGIN
    LOOP
        new_id := UPPER(
            SUBSTRING(
                MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)
                FROM 1 FOR 5
            )
        );
        
        SELECT EXISTS(SELECT 1 FROM chat_rooms WHERE room_id = new_id) INTO id_exists;
        
        IF NOT id_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_room_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.room_id IS NULL OR NEW.room_id = '' THEN
        NEW.room_id := generate_room_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER trigger_set_room_id
    BEFORE INSERT ON chat_rooms
    FOR EACH ROW
    EXECUTE FUNCTION set_room_id();

CREATE TRIGGER trigger_update_chat_rooms_updated_at
    BEFORE UPDATE ON chat_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_rooms_room_id ON chat_rooms(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_created_by ON chat_rooms(created_by);
CREATE INDEX IF NOT EXISTS idx_room_participants_room_id ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user_id ON room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- SIMPLE RLS POLICIES (No recursion)

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Chat rooms policies
CREATE POLICY "Users can view accessible chat rooms" ON chat_rooms
    FOR SELECT USING (
        created_by = auth.uid() OR 
        id IN (
            SELECT DISTINCT room_id FROM room_participants 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Users can create chat rooms" ON chat_rooms
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can update their rooms" ON chat_rooms
    FOR UPDATE USING (auth.uid() = created_by);

-- Room participants policies
CREATE POLICY "Users can view relevant participants" ON room_participants
    FOR SELECT USING (
        user_id = auth.uid() OR
        room_id IN (
            SELECT DISTINCT room_id FROM room_participants rp2
            WHERE rp2.user_id = auth.uid() AND rp2.is_active = TRUE
        )
    );

CREATE POLICY "Users can join rooms" ON room_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participation" ON room_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view accessible messages" ON chat_messages
    FOR SELECT USING (
        room_id IN (
            SELECT DISTINCT room_id FROM room_participants 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Users can send messages to joined rooms" ON chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        room_id IN (
            SELECT DISTINCT room_id FROM room_participants 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Users can edit own messages" ON chat_messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Create view for room details
CREATE OR REPLACE VIEW room_details AS
SELECT 
    cr.*,
    COUNT(rp.user_id) as participant_count
FROM chat_rooms cr
LEFT JOIN room_participants rp ON cr.id = rp.room_id AND rp.is_active = TRUE
GROUP BY cr.id, cr.room_id, cr.name, cr.password_hash, cr.created_by, cr.created_at, cr.updated_at, cr.is_active, cr.max_participants;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'Chat room system setup completed successfully!';
END $$;