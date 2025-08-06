-- Add DELETE policy for sessions table so couple members can delete sessions
CREATE POLICY "Couple members can delete sessions" 
ON public.sessions 
FOR DELETE 
USING (EXISTS (
  SELECT 1 
  FROM couples 
  WHERE couples.id = sessions.couple_id 
  AND (couples.user1_id = auth.uid() OR couples.user2_id = auth.uid())
));