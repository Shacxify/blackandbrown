
-- 1. Trigger-only SECURITY DEFINER functions: revoke EXECUTE from all API roles
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_demo_admin() FROM PUBLIC, anon, authenticated;

-- 2. Role check helpers: revoke from PUBLIC/anon; only authenticated (used in RLS) may call
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_permission(uuid, public.app_permission) FROM PUBLIC, anon;

-- 3. Explicit SELECT policy for public product-photos bucket
DROP POLICY IF EXISTS "Public can read product photos" ON storage.objects;
CREATE POLICY "Public can read product photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-photos');

-- 4. Tighten price_submissions insert: validate email format + length caps
DROP POLICY IF EXISTS "Anyone can submit a price request with valid info" ON public.price_submissions;
CREATE POLICY "Anyone can submit a price request with valid info"
ON public.price_submissions
FOR INSERT
TO public
WITH CHECK (
  length(trim(customer_name)) BETWEEN 1 AND 100
  AND length(trim(customer_email)) BETWEEN 3 AND 255
  AND customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND (customer_phone IS NULL OR length(trim(customer_phone)) BETWEEN 7 AND 30)
  AND length(trim(brand)) BETWEEN 1 AND 100
  AND length(trim(size)) BETWEEN 1 AND 40
);
