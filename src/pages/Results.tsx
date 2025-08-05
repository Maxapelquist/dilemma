import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";

const Results = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setLoading(false);
          return;
        }

        // Hämta session-informationen för att få couple_id
        const { data: sessionData } = await supabase
          .from("sessions")
          .select("couple_id")
          .eq("id", sessionId)
          .single();

        if (!sessionData) {
          setLoading(false);
          return;
        }

        // Hämta couple-informationen för att få båda user_ids
        const { data: coupleData } = await supabase
          .from("couples")
          .select("user1_id, user2_id")
          .eq("id", sessionData.couple_id)
          .single();

        if (!coupleData) {
          setLoading(false);
          return;
        }

        const currentUserId = session.session.user.id;
        const partnerId = coupleData.user1_id === currentUserId 
          ? coupleData.user2_id 
          : coupleData.user1_id;

        // Först hämta partnerns preferenser för denna session
        const { data: partnerPrefs } = await supabase
          .from("user_preferences")
          .select("preference_option_id")
          .eq("session_id", sessionId)
          .eq("user_id", partnerId);

        if (!partnerPrefs || partnerPrefs.length === 0) {
          setMatches([]);
          setLoading(false);
          return;
        }

        const partnerPrefIds = partnerPrefs.map(p => p.preference_option_id);

        // Sedan hämta gemensamma preferenser
        const { data: matchingPrefs } = await supabase
          .from("user_preferences")
          .select(`
            preference_option_id,
            preference_options (
              title,
              description,
              categories (
                name,
                icon
              )
            )
          `)
          .eq("session_id", sessionId)
          .eq("user_id", currentUserId)
          .in("preference_option_id", partnerPrefIds);

        // Omvandla data för visning
        const matches = (matchingPrefs || []).map(match => ({
          name: match.preference_options?.title || '',
          description: match.preference_options?.description || '',
          category: match.preference_options?.categories?.name || '',
          icon: match.preference_options?.categories?.icon || '❤️'
        }));

        setMatches(matches);
      } catch (error) {
        console.error("Error loading matches:", error);
      }
      
      setLoading(false);
    };

    loadMatches();
  }, [sessionId]);

  if (loading) {
    return <div className="min-h-screen bg-gradient-background flex items-center justify-center">
      <p>Laddar...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="p-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Till dashboard
        </Button>
      </div>

      <div className="px-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Era gemensamma intressen!</h1>
          <p className="text-muted-foreground">Här är vad ni båda vill utforska</p>
        </div>

        <div className="space-y-4">
          {matches.length === 0 ? (
            <Card className="text-center p-8">
              <p className="text-muted-foreground">
                Ni har inga gemensamma preferenser än. Klicka på "Välj preferenser" för att börja!
              </p>
            </Card>
          ) : (
            matches.map((match, index) => (
              <Card key={index} className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <span className="text-2xl">{match.icon}</span>
                    <div>
                      <p>{match.name}</p>
                      <p className="text-sm text-muted-foreground font-normal">{match.category}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{match.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <GradientButton onClick={() => navigate("/dashboard")} className="w-full">
          Tillbaka till dashboard
        </GradientButton>
      </div>
    </div>
  );
};

export default Results;