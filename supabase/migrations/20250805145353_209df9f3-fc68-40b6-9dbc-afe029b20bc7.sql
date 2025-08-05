-- Add subcategory column to preference_options table
ALTER TABLE public.preference_options 
ADD COLUMN subcategory TEXT;

-- Add some example subcategories to existing data
UPDATE public.preference_options 
SET subcategory = CASE
  WHEN title IN ('Craft Beer Co', 'Bakery Dreams', 'Bistro Sjön', 'Kött & Kött') THEN 'Restauranger'
  ELSE NULL
END;