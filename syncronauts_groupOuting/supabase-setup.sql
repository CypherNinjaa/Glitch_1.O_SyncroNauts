-- =====================================================
-- SUPABASE AUTHENTICATION SETUP FOR SYNCRONAUTS
-- =====================================================
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security (RLS) by default
-- This is usually enabled by default in Supabase, but let's make sure

-- =====================================================
-- 1. CREATE PROFILES TABLE
-- =====================================================
-- This extends the default auth.users table with additional user information

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE MEMBERS TABLE (for group outing members)
-- =====================================================
-- This table will store information about group members

CREATE TABLE IF NOT EXISTS public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    member_status TEXT DEFAULT 'active' CHECK (member_status IN ('active', 'inactive', 'pending')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'organizer', 'member')),
    phone TEXT,
    emergency_contact TEXT,
    dietary_restrictions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS members_user_id_idx ON public.members(user_id);
CREATE INDEX IF NOT EXISTS members_status_idx ON public.members(member_status);

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CREATE RLS POLICIES FOR PROFILES TABLE
-- =====================================================

-- Allow users to view all profiles (for member directory)
CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =====================================================
-- 6. CREATE RLS POLICIES FOR MEMBERS TABLE
-- =====================================================

-- Allow users to view all members
CREATE POLICY "Members are viewable by authenticated users" 
ON public.members FOR SELECT 
TO authenticated 
USING (true);

-- Allow users to insert their own member record
CREATE POLICY "Users can insert their own member record" 
ON public.members FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own member record
CREATE POLICY "Users can update their own member record" 
ON public.members FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow admins to update any member record
CREATE POLICY "Admins can update any member record" 
ON public.members FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.members 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- =====================================================
-- 7. CREATE FUNCTIONS FOR AUTOMATIC PROFILE CREATION
-- =====================================================

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    
    -- Also create a member record
    INSERT INTO public.members (user_id, profile_id, member_status)
    VALUES (NEW.id, NEW.id, 'active');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. CREATE TRIGGER FOR AUTOMATIC PROFILE CREATION
-- =====================================================

-- Trigger to automatically create profile and member record on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 9. CREATE FUNCTION TO UPDATE TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. CREATE TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 11. CREATE HELPFUL VIEWS
-- =====================================================

-- View to get complete member information
CREATE OR REPLACE VIEW public.member_profiles AS
SELECT 
    m.id as member_id,
    m.user_id,
    m.member_status,
    m.joined_at,
    m.role,
    m.phone,
    m.emergency_contact,
    m.dietary_restrictions,
    p.email,
    p.full_name,
    p.username,
    p.avatar_url,
    p.bio,
    p.created_at as profile_created_at
FROM public.members m
JOIN public.profiles p ON m.profile_id = p.id;

-- =====================================================
-- 12. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.members TO authenticated;
GRANT SELECT ON public.member_profiles TO authenticated;

-- =====================================================
-- 13. CREATE AVATAR STORAGE BUCKET
-- =====================================================

-- Create the avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 14. CREATE STORAGE POLICIES FOR AVATARS BUCKET
-- =====================================================

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own avatars
CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete their own avatar" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow anyone to view avatars (since bucket is public)
CREATE POLICY "Anyone can view avatars" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

-- =====================================================
-- 15. CREATE HELPER FUNCTION FOR AVATAR URL
-- =====================================================

-- Function to get the full avatar URL
CREATE OR REPLACE FUNCTION public.get_avatar_url(avatar_path TEXT)
RETURNS TEXT AS $$
BEGIN
    IF avatar_path IS NULL OR avatar_path = '' THEN
        RETURN NULL;
    END IF;
    
    -- Return the full public URL for the avatar
    RETURN 'https://saosbthflaspdcckgnqf.supabase.co/storage/v1/object/public/avatars/' || avatar_path;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 16. UPDATE PROFILES TABLE WITH AVATAR HELPER
-- =====================================================

-- Add a computed column for full avatar URL (view only)
CREATE OR REPLACE VIEW public.profiles_with_avatar_url AS
SELECT 
    *,
    CASE 
        WHEN avatar_url IS NOT NULL AND avatar_url != '' 
        THEN public.get_avatar_url(avatar_url)
        ELSE NULL 
    END as full_avatar_url
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.profiles_with_avatar_url TO authenticated;

-- =====================================================
-- AVATAR STORAGE SETUP COMPLETE!
-- =====================================================
-- Avatar storage structure:
-- - Bucket: 'avatars' (public bucket)
-- - File path format: {user_id}/avatar.{extension}
-- - Supported formats: jpg, jpeg, png, gif, webp
-- - Max file size: Configure in Supabase dashboard (default 50MB)
-- 
-- Example avatar upload path: 
-- 'f47ac10b-58cc-4372-a567-0e02b2c3d479/avatar.jpg'
--
-- Usage in your app:
-- 1. Upload avatar to: avatars/{user.id}/avatar.{ext}
-- 2. Store the path in profiles.avatar_url
-- 3. Use profiles_with_avatar_url view to get full URLs

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- After running this SQL:
-- 1. Users can sign up using Supabase Auth
-- 2. Profiles and member records are automatically created
-- 3. Users can view all members but only edit their own data
-- 4. Admins can edit any member data
-- 5. All data is protected by Row Level Security
-- 6. Avatar storage bucket is configured with proper policies
-- 7. Users can upload/update/delete their own avatars

-- Test the setup by signing up a user through your app!