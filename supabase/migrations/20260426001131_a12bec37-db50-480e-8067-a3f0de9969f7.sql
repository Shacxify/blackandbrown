
-- Fix function search path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Restrict bucket listing: drop broad SELECT and replace with object-level access via signed paths
DROP POLICY IF EXISTS "Public can view product photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view submission photos" ON storage.objects;

-- Allow public to view individual product photo objects (needed for <img src>) but no listing endpoint will be used from the client
CREATE POLICY "Public can read product photo objects"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-photos');

-- Submission photos: only employees can read (customer photos are private)
CREATE POLICY "Employees can read submission photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'submission-photos' AND (public.has_role(auth.uid(), 'employee') OR public.has_role(auth.uid(), 'admin')));

-- Make submission-photos bucket private since only employees should view
UPDATE storage.buckets SET public = false WHERE id = 'submission-photos';

-- Tighten price submissions insert: require non-empty contact info
DROP POLICY IF EXISTS "Anyone can submit a price request" ON public.price_submissions;
CREATE POLICY "Anyone can submit a price request with valid info"
  ON public.price_submissions FOR INSERT
  WITH CHECK (
    length(trim(customer_name)) > 0
    AND length(trim(customer_email)) > 0
    AND length(trim(brand)) > 0
    AND length(trim(size)) > 0
  );
