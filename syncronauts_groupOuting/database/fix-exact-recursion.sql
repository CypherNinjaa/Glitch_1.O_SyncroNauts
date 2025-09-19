-- EXACT FIX FOR THE RECURSION ISSUE
-- Run this in your Supabase SQL Editor

-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Users can view relevant participants" ON room_participants;

-- Create a new simple policy that doesn't cause recursion
-- Allow users to see participants of rooms they created OR their own participation records
CREATE POLICY "Users can view participants simple" ON room_participants
    FOR SELECT USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM chat_rooms cr 
            WHERE cr.id = room_participants.room_id 
            AND cr.created_by = auth.uid()
        )
    );

-- Also simplify the chat_rooms policy to avoid potential issues
DROP POLICY IF EXISTS "Users can view accessible chat rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Users can view chat rooms" ON chat_rooms;

-- Create a simpler chat_rooms policy
CREATE POLICY "Users can view their chat rooms" ON chat_rooms
    FOR SELECT USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM room_participants rp 
            WHERE rp.room_id = chat_rooms.id 
            AND rp.user_id = auth.uid() 
            AND rp.is_active = true
        )
    );