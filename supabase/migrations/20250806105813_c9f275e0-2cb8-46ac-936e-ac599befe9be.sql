-- Update the RLS policy to allow users to join couples when user2_id is null
DROP POLICY "Users can update their couples" ON public.couples;

CREATE POLICY "Users can update their couples" 
ON public.couples 
FOR UPDATE 
USING (
  (auth.uid() = user1_id) OR 
  (auth.uid() = user2_id) OR 
  (user2_id IS NULL)
);