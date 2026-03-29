
CREATE TABLE public.hero_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read hero_images" ON public.hero_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can insert hero_images" ON public.hero_images FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin can update hero_images" ON public.hero_images FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin can delete hero_images" ON public.hero_images FOR DELETE TO authenticated USING (is_admin());
