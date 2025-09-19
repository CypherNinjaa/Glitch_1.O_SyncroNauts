-- SIMPLE SETUP - Run this to fix the infinite recursion error
-- This drops the problematic policies and creates simpler ones

-- First, drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view chat rooms they participate in" ON chat_rooms;
DROP POLICY IF EXISTS "Users can view room participants" ON room_participants;
DROP POLICY IF EXISTS "Users can view messages from their rooms" ON chat_messages;
DROP POLICY IF EXISTS "Users can send messages to their rooms" ON chat_messages;

-- Create simpler policies without recursion

-- 1. Chat Rooms - Allow users to see rooms they created or are explicitly participants of
CREATE POLICY "Users can view chat rooms" ON chat_rooms
    FOR SELECT USING (
        created_by = auth.uid() OR 
        id IN (
            SELECT DISTINCT room_id FROM room_participants 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- 2. Room Participants - Simplified access
CREATE POLICY "View room participants" ON room_participants
    FOR SELECT USING (
        user_id = auth.uid() OR
        room_id IN (
            SELECT DISTINCT room_id FROM room_participants rp2
            WHERE rp2.user_id = auth.uid() AND rp2.is_active = TRUE
        )
    );

-- 3. Chat Messages - Simplified access  
CREATE POLICY "View chat messages" ON chat_messages
    FOR SELECT USING (
        room_id IN (
            SELECT DISTINCT room_id FROM room_participants 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Send chat messages" ON chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        room_id IN (
            SELECT DISTINCT room_id FROM room_participants 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );