-- RLS POLICIES INSPECTION - Run this to see the problematic policies
SELECT 
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('chat_rooms', 'room_participants', 'chat_messages')
ORDER BY tablename, policyname;