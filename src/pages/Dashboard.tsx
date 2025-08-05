import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Settings, Users, Heart, Clock, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [couple, setCouple] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUser(session.user);

      // Load user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!profile) {
        navigate("/profile");
        return;
      }

      // Load couple information
      const { data: coupleData } = await supabase
        .from("couples")
        .select(`
          *,
          profiles!couples_user1_id_fkey(name),
          profiles_user2:profiles!couples_user2_id_fkey(name)
        `)
        .or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`)
        .single();

      if (!coupleData) {
        navigate("/partner-link");
        return;
      }

      setCouple(coupleData);

      // Load sessions for this couple
      const { data: sessionsData } = await supabase
        .from("sessions")
        .select("*")
        .eq("couple_id", coupleData.id)
        .order("created_at", { ascending: false });

      setSessions(sessionsData || []);
      setLoading(false);
    };

    loadDashboard();
  }, [navigate]);

  const createNewSession = async () => {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Kopplad till {partnerName}
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

      {/* Content */}
      <div className="px-6 space-y-6">
        {/* Partner Status */}
        <Card className="shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Ditt par</h3>
                <p className="text-sm text-muted-foreground">
                  Du och {partnerName} är redo att utforska tillsammans
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Snabbåtgärder</h2>
          
          <GradientButton 
            onClick={createNewSession}
            className="w-full justify-start h-auto p-4"
          >
            <Plus className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Starta ny session</div>
              <div className="text-sm opacity-90">Utforska nya preferenser tillsammans</div>
            </div>
          </GradientButton>
        </div>

        {/* Recent Sessions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Senaste sessioner</h2>
          
          {sessions.length === 0 ? (
            <Card className="shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Inga sessioner än</p>
                <p className="text-sm text-muted-foreground">
                  Skapa er första session för att komma igång
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <Card 
                  key={session.id} 
                  className="shadow-soft border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer hover:shadow-card transition-shadow"
                  onClick={() => navigate(`/session/${session.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                          {session.status === "completed" ? (
                            <CheckCircle className="w-5 h-5 text-primary-foreground" />
                          ) : (
                            <Clock className="w-5 h-5 text-primary-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{session.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.created_at).toLocaleDateString("sv-SE")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          session.status === "completed" 
                            ? "text-green-600" 
                            : "text-orange-600"
                        }`}>
                          {session.status === "completed" ? "Avslutad" : "Aktiv"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;