-- DATABASE INSPECTION COMMANDS
-- Run these SQL queries in your Supabase SQL Editor to help diagnose issues
-- Copy and paste each section separately and share the results

-- 1. CHECK ALL TABLES
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'chat_rooms', 'room_participants', 'chat_messages')
ORDER BY table_name;

-- 2. CHECK TABLE STRUCTURES (Fixed for Supabase)
-- Profiles table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Chat rooms table structure  
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'chat_rooms'
ORDER BY ordinal_position;

-- Room participants table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'room_participants'
ORDER BY ordinal_position;

-- Chat messages table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'chat_messages'
ORDER BY ordinal_position;

-- 3. CHECK ALL RLS POLICIES
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'chat_rooms', 'room_participants', 'chat_messages')
ORDER BY tablename, policyname;

-- 4. CHECK RLS STATUS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'chat_rooms', 'room_participants', 'chat_messages');

-- 5. CHECK EXISTING FUNCTIONS
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name IN ('generate_room_id', 'set_room_id', 'handle_new_user', 'join_room', 'join_room_simple')
ORDER BY routine_name;

-- 6. CHECK TRIGGERS
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 7. CHECK SAMPLE DATA (if any exists)
SELECT COUNT(*) as profiles_count FROM profiles;
SELECT COUNT(*) as chat_rooms_count FROM chat_rooms;
SELECT COUNT(*) as room_participants_count FROM room_participants;
SELECT COUNT(*) as chat_messages_count FROM chat_messages;

-- 8. TEST A SIMPLE QUERY (this will show if RLS is working)
SELECT 'RLS Test' as test, auth.uid() as current_user_id;

-- 9. CHECK INDEXES
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'chat_rooms', 'room_participants', 'chat_messages')
ORDER BY tablename, indexname;