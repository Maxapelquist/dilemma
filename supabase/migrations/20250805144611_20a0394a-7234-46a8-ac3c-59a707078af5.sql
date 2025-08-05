-- Update RLS policy to allow viewing preferences in same session for couple members
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preferences;

CREATE POLICY "Users can view preferences in their couple sessions" 
ON public.user_preferences 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM sessions s
    JOIN couples c ON s.couple_id = c.id
    WHERE s.id = user_preferences.session_id
    AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
  )
);