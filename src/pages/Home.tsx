import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Heart, Users, Settings, ArrowRight } from "lucide-react";

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [couple, setCouple] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUser(session.user);

      // Load user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!profileData) {
        navigate("/profile");
        return;
      }

      setProfile(profileData);

      // Check for existing couple - get the most recent valid couple
      const { data: coupleData } = await supabase
        .from("couples")
        .select(`
          *,
          profiles!couples_user1_id_fkey(name),
          profiles_user2:profiles!couples_user2_id_fkey(name)
        `)
        .or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`)
        .not("user2_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setCouple(coupleData);
      setLoading(false);
    };

    loadUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const startNewSession = async () => {
    if (!couple) return;

    try {
      const sessionName = `Session ${new Date().toLocaleDateString("sv-SE")}`;
      
      const { data, error } = await supabase
        .from("sessions")
        .insert({
          couple_id: couple.id,
          name: sessionName,
          status: "active"
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Ny session skapad!",
        description: "Välj kategorier för er session.",
      });

      navigate(`/session/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Ett fel uppstod",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4 animate-pulse">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Laddar...</p>
        </div>
      </div>
    );
  }

  const partnerName = couple?.user1_id === user?.id 
    ? couple?.profiles_user2?.name 
    : couple?.profiles?.name;

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Hej {profile?.name}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Välkommen till Together
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className="hover:bg-primary/10"
        >
          <Settings className="w-4 h-4 mr-2" />
          Logga ut
        </Button>
      </div>

      <div className="px-6 space-y-6">
        {!couple ? (
          /* Not paired yet */
          <div className="space-y-6">
            <Card className="shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-accent flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle>Koppla ihop med din partner</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  För att komma igång behöver ni koppla ihop era konton. 
                  Du kan antingen skapa en kod som din partner använder, 
                  eller gå med i en session med din partners kod.
                </p>
                
                <GradientButton 
                  onClick={() => navigate("/partner-link")}
                  className="w-full"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Koppla ihop med partner
                  <ArrowRight className="w-4 h-4 ml-2" />
                </GradientButton>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Paired - show dashboard */
          <div className="space-y-6">
            {/* Partner Status */}
            <Card className="shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Kopplad till {partnerName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Ni är redo att utforska tillsammans
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Vad vill ni göra?</h2>
              
              <GradientButton 
                onClick={startNewSession}
                className="w-full justify-start h-auto p-4"
              >
                <Heart className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Starta en ny session</div>
                  <div className="text-sm opacity-90">Utforska era preferenser tillsammans</div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </GradientButton>

              <Button 
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="w-full justify-start h-auto p-4"
              >
                <div className="text-left">
                  <div className="font-medium">Se alla sessioner</div>
                  <div className="text-sm opacity-90">Hantera och granska tidigare sessioner</div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;