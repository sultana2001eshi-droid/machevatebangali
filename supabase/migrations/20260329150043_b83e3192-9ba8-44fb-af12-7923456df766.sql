
-- Create items table
CREATE TABLE public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT NOT NULL,
  description_en TEXT,
  detailed_description TEXT,
  detailed_description_en TEXT,
  category TEXT NOT NULL CHECK (category IN ('rice-type', 'rice-dish', 'fish')),
  subcategory TEXT,
  subcategory_en TEXT,
  location TEXT,
  location_en TEXT,
  nutrition TEXT,
  nutrition_en TEXT,
  cooking_method TEXT,
  cooking_method_en TEXT,
  origin TEXT,
  origin_en TEXT,
  cultural_importance TEXT,
  cultural_importance_en TEXT,
  taste TEXT,
  taste_en TEXT,
  price TEXT,
  price_en TEXT,
  cooking_steps TEXT[],
  cooking_steps_en TEXT[],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth needed)
CREATE POLICY "Anyone can read items"
  ON public.items
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can insert (we'll restrict by email in the app)
CREATE POLICY "Authenticated users can insert items"
  ON public.items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update items"
  ON public.items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete items"
  ON public.items
  FOR DELETE
  TO authenticated
  USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Allow public read access to images
CREATE POLICY "Public read access for images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');
