-- Migrate existing subcategories from preference_options to subcategories table
INSERT INTO public.subcategories (name, category_id, sort_order, is_visible)
SELECT DISTINCT 
  p.subcategory,
  p.category_id,
  0,
  true
FROM public.preference_options p
WHERE p.subcategory IS NOT NULL 
  AND p.subcategory != ''
  AND p.category_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Update preference_options to use subcategory_id instead of subcategory text
UPDATE public.preference_options 
SET subcategory_id = s.id
FROM public.subcategories s
WHERE preference_options.subcategory = s.name 
  AND preference_options.category_id = s.category_id
  AND preference_options.subcategory IS NOT NULL;