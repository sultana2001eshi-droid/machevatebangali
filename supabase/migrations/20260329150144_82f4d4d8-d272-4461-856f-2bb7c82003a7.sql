
-- Drop overly permissive policies
DROP POLICY "Authenticated users can insert items" ON public.items;
DROP POLICY "Authenticated users can update items" ON public.items;
DROP POLICY "Authenticated users can delete items" ON public.items;

-- Create admin-only helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (auth.jwt() ->> 'email') = 'nasrullah.altaf0123@gmail.com'
$$;

-- Strict admin-only policies
CREATE POLICY "Admin can insert items"
  ON public.items
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update items"
  ON public.items
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete items"
  ON public.items
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Tighten storage policies for upload/update/delete
DROP POLICY "Authenticated users can upload images" ON storage.objects;
DROP POLICY "Authenticated users can update images" ON storage.objects;
DROP POLICY "Authenticated users can delete images" ON storage.objects;

CREATE POLICY "Admin can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images' AND public.is_admin());

CREATE POLICY "Admin can update images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images' AND public.is_admin());

CREATE POLICY "Admin can delete images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'images' AND public.is_admin());
