-- SIMPLE DATABASE INSPECTION - Start with these
-- Run each query separately in Supabase SQL Editor

-- 1. CHECK IF TABLES EXIST
SELECT table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'chat_rooms', 'room_participants', 'chat_messages')
ORDER BY table_name;

-- 2. CHECK RLS POLICIES (MOST IMPORTANT - this is likely causing the recursion)
SELECT 
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('chat_rooms', 'room_participants', 'chat_messages')
ORDER BY tablename, policyname;

-- 3. CHECK RLS STATUS
SELECT 
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'chat_rooms', 'room_participants', 'chat_messages');

-- 4. TEST AUTH FUNCTION
SELECT auth.uid() as current_user_id;

-- 5. CHECK BASIC TABLE COUNTS
SELECT 
    (SELECT COUNT(*) FROM profiles) as profiles_count,
    (SELECT COUNT(*) FROM chat_rooms) as chat_rooms_count,
    (SELECT COUNT(*) FROM room_participants) as room_participants_count,
    (SELECT COUNT(*) FROM chat_messages) as chat_messages_count;