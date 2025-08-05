-- Add delete policies for categories
CREATE POLICY "Admins can delete categories" 
ON public.categories 
FOR DELETE 
USING (true);

-- Add delete policies for preference_options
CREATE POLICY "Admins can delete preference options"
ON public.preference_options
FOR DELETE
USING (true);