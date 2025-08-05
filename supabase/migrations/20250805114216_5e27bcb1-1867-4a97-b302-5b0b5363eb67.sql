-- Add foreign key constraints to improve data integrity
ALTER TABLE public.couples 
ADD CONSTRAINT couples_user1_id_fkey 
FOREIGN KEY (user1_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.couples 
ADD CONSTRAINT couples_user2_id_fkey 
FOREIGN KEY (user2_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint for sessions
ALTER TABLE public.sessions 
ADD CONSTRAINT sessions_couple_id_fkey 
FOREIGN KEY (couple_id) REFERENCES public.couples(id) ON DELETE CASCADE;