import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, Heart, Sparkles, ChevronDown, ChevronRight } from "lucide-react";

const Results = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [matchesByCategory, setMatchesByCategory] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

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

        // Hämta aktuell användares preferenser för denna session
        const { data: currentUserPrefs, error: currentUserError } = await supabase
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
          .eq("user_id", currentUserId);

        console.log("Current user preferences:", currentUserPrefs, "Error:", currentUserError);

        if (!currentUserPrefs || currentUserPrefs.length === 0) {
          console.log("No current user preferences found");
          setMatchesByCategory({});
          setLoading(false);
          return;
        }

        // Hitta gemensamma preferenser genom att räkna hur många som valt varje option
        const { data: allPrefsCount, error: countError } = await supabase
          .from("user_preferences")
          .select("preference_option_id")
          .eq("session_id", sessionId);

        console.log("All preferences count:", allPrefsCount, "Error:", countError);

        if (!allPrefsCount) {
          setMatchesByCategory({});
          setLoading(false);
          return;
        }

        // Räkna förekomster av varje preference_option_id
        const prefCounts = allPrefsCount.reduce((acc, pref) => {
          acc[pref.preference_option_id] = (acc[pref.preference_option_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        console.log("Preference counts:", prefCounts);

        // Filtrera ut bara de preferenser där båda användarna har valt (count = 2)
        const matchingOptions = currentUserPrefs.filter(pref => 
          prefCounts[pref.preference_option_id] === 2
        );

        console.log("Matching options:", matchingOptions);

        // Omvandla data för visning och gruppera per kategori
        const matches = matchingOptions.map(match => ({
          name: match.preference_options?.title || '',
          description: match.preference_options?.description || '',
          category: match.preference_options?.categories?.name || 'Övrigt',
          categoryIcon: match.preference_options?.categories?.icon || '❤️'
        }));

        // Gruppera matches per kategori
        const grouped = matches.reduce((acc, match) => {
          if (!acc[match.category]) {
            acc[match.category] = [];
          }
          acc[match.category].push(match);
          return acc;
        }, {} as Record<string, any[]>);

        setMatchesByCategory(grouped);
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
          {Object.keys(matchesByCategory).length === 0 ? (
            <Card className="text-center p-8">
              <p className="text-muted-foreground">
                Ni har inga gemensamma preferenser än. Klicka på "Välj preferenser" för att börja!
              </p>
            </Card>
          ) : (
            Object.entries(matchesByCategory).map(([category, matches]) => (
              <Card key={category} className="shadow-soft">
                <Collapsible
                  open={openCategories[category]}
                  onOpenChange={(isOpen) => 
                    setOpenCategories(prev => ({ ...prev, [category]: isOpen }))
                  }
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{matches[0]?.categoryIcon}</span>
                          <div>
                            <p>{category}</p>
                            <p className="text-sm text-muted-foreground font-normal">
                              {matches.length} gemensamma {matches.length === 1 ? 'preferens' : 'preferenser'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {matches.length}
                          </div>
                          {openCategories[category] ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      {matches.map((match, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border">
                          <h4 className="font-medium text-foreground mb-2">{match.name}</h4>
                          <p className="text-sm text-muted-foreground">{match.description}</p>
                        </div>
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
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