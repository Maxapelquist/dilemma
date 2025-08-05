-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policy for everyone to view categories (public data)
CREATE POLICY "Anyone can view categories" 
ON public.categories 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample categories
INSERT INTO public.categories (name, description, icon) VALUES
('Restauranger', 'Upptäck nya smaker tillsammans', '🍽️'),
('Aktiviteter', 'Kul saker att göra tillsammans', '🎯'),
('Resor', 'Platser att utforska', '✈️'),
('Mat hemma', 'Recept och matlagning', '👨‍🍳'),
('Underhållning', 'Filmer, spel och mer', '🎬'),
('Sport & Fitness', 'Träning och fysiska aktiviteter', '💪');