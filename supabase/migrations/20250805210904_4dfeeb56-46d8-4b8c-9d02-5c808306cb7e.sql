-- Add visibility field to categories table
ALTER TABLE public.categories 
ADD COLUMN is_visible boolean NOT NULL DEFAULT true;

-- Add visibility field to preference_options table  
ALTER TABLE public.preference_options
ADD COLUMN is_visible boolean NOT NULL DEFAULT true;

-- Create admin policy for categories
CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create admin policy for preference_options
CREATE POLICY "Admins can manage preference options"
ON public.preference_options
FOR ALL
USING (true) 
WITH CHECK (true);