-- =====================================================
-- ADDITIONAL AVATAR STORAGE CONFIGURATION
-- =====================================================
-- Run this after the main setup if you need additional configuration

-- =====================================================
-- 1. CONFIGURE BUCKET SETTINGS (Optional)
-- =====================================================
-- You can also configure these in the Supabase Dashboard > Storage

-- Update bucket settings for file size limits and allowed MIME types
UPDATE storage.buckets 
SET 
    file_size_limit = 5242880, -- 5MB limit
    allowed_mime_types = ARRAY[
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/webp'
    ]
WHERE id = 'avatars';

-- =====================================================
-- 2. AVATAR MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to generate avatar file path
CREATE OR REPLACE FUNCTION public.generate_avatar_path(user_uuid UUID, file_extension TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN user_uuid::text || '/avatar.' || LOWER(file_extension);
END;
$$ LANGUAGE plpgsql;

-- Function to validate avatar file
CREATE OR REPLACE FUNCTION public.validate_avatar_upload(file_name TEXT, file_size BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check file extension
    IF NOT (LOWER(file_name) ~ '\.(jpg|jpeg|png|gif|webp)$') THEN
        RETURN FALSE;
    END IF;
    
    -- Check file size (5MB = 5242880 bytes)
    IF file_size > 5242880 THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old avatars when uploading new ones
CREATE OR REPLACE FUNCTION public.cleanup_old_avatars()
RETURNS TRIGGER AS $$
BEGIN
    -- This would be called when avatar_url is updated
    -- Note: Actual file deletion needs to be handled in your application
    -- using the Supabase client, as SQL triggers can't directly delete storage files
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. CREATE TRIGGER FOR AVATAR CLEANUP
-- =====================================================

CREATE TRIGGER avatar_cleanup_trigger
    AFTER UPDATE OF avatar_url ON public.profiles
    FOR EACH ROW 
    WHEN (OLD.avatar_url IS DISTINCT FROM NEW.avatar_url)
    EXECUTE FUNCTION public.cleanup_old_avatars();

-- =====================================================
-- 4. HELPER QUERIES FOR AVATAR MANAGEMENT
-- =====================================================

-- View to see all users without avatars
CREATE OR REPLACE VIEW public.users_without_avatars AS
SELECT 
    id,
    email,
    full_name,
    username,
    created_at
FROM public.profiles
WHERE avatar_url IS NULL OR avatar_url = '';

-- View to see avatar storage usage per user
CREATE OR REPLACE VIEW public.avatar_storage_stats AS
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.avatar_url,
    CASE 
        WHEN p.avatar_url IS NOT NULL AND p.avatar_url != '' 
        THEN 'Has Avatar'
        ELSE 'No Avatar' 
    END as avatar_status
FROM public.profiles p;

-- Grant access to the new views
GRANT SELECT ON public.users_without_avatars TO authenticated;
GRANT SELECT ON public.avatar_storage_stats TO authenticated;

-- =====================================================
-- AVATAR STORAGE EXTENDED SETUP COMPLETE!
-- =====================================================