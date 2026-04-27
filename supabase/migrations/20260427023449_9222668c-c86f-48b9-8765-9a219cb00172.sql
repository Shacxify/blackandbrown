
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-photos', 'product-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'Public read product-photos'
  ) THEN
    CREATE POLICY "Public read product-photos"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'product-photos');
  END IF;
END $$;
