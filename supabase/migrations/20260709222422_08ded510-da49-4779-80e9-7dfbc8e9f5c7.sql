
-- 1. site_settings: only allow public read of the looking_for key
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
CREATE POLICY "Public can read looking_for setting"
  ON public.site_settings
  FOR SELECT
  USING (key = 'looking_for');

-- 2. submission-photos: tighten INSERT
DROP POLICY IF EXISTS "Anyone can upload submission photos" ON storage.objects;
CREATE POLICY "Anyone can upload submission photos to submissions folder"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'submission-photos'
    AND (storage.foldername(name))[1] = 'submissions'
    AND length(name) < 300
  );

-- 3. product-photos: remove broad listing SELECT policies (public bucket URLs still work)
DROP POLICY IF EXISTS "Public can read product photo objects" ON storage.objects;
DROP POLICY IF EXISTS "Public read product-photos" ON storage.objects;

-- 4. Revoke execute on SECURITY DEFINER functions from public/anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_permission(uuid, public.app_permission) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_demo_admin() FROM PUBLIC, anon, authenticated;
