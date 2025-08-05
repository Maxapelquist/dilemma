-- Rensa felaktiga par där user1_id = user2_id
DELETE FROM couples WHERE user1_id = user2_id;

-- Rensa duplicerade par och behåll bara det senaste för varje användarpar
DELETE FROM couples c1 
WHERE EXISTS (
  SELECT 1 FROM couples c2 
  WHERE ((c1.user1_id = c2.user1_id AND c1.user2_id = c2.user2_id) 
         OR (c1.user1_id = c2.user2_id AND c1.user2_id = c2.user1_id))
    AND c2.created_at > c1.created_at
);