-- Create subcategories table
CREATE TABLE public.subcategories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on subcategories
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Create policies for subcategories
CREATE POLICY "Anyone can view subcategories" 
ON public.subcategories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage subcategories" 
ON public.subcategories 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add subcategory_id to preference_options and make subcategory nullable
ALTER TABLE public.preference_options 
ADD COLUMN subcategory_id uuid REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- Create trigger for subcategories updated_at
CREATE TRIGGER update_subcategories_updated_at
BEFORE UPDATE ON public.subcategories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();