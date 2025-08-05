-- Update RLS policy to allow reading couples by couple_code for joining
DROP POLICY IF EXISTS "Users can view their own couples" ON public.couples;

-- Create new policy that allows viewing couples for joining
CREATE POLICY "Users can view couples they belong to or when joining by code" 
ON public.couples 
FOR SELECT 
USING (
  -- Users can see couples they're already part of
  (auth.uid() = user1_id) OR 
  (auth.uid() = user2_id) OR 
  -- Or couples that are waiting for a partner (user2_id is null) for joining purposes
  (user2_id IS NULL)
);