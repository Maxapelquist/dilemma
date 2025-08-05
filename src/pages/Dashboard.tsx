import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Settings, Users, Heart, Clock, CheckCircle, ExternalLink } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [couple, setCouple] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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

      // Load couple information (optional)
      const { data: coupleData } = await supabase
        .from("couples")
        .select("*")
        .or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`)
        .maybeSingle();

      setCouple(coupleData);

      // Load partner information if couple exists
      if (coupleData && coupleData.user2_id) {
        const partnerId = coupleData.user1_id === session.user.id ? coupleData.user2_id : coupleData.user1_id;
        
        const { data: partnerProfile } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", partnerId)
          .single();
        
        setCouple({
          ...coupleData,
          partnerName: partnerProfile?.name || "Partner"
        });

        // Load sessions if couple exists
        const { data: sessionsData } = await supabase
          .from("sessions")
          .select("*")
          .eq("couple_id", coupleData.id)
          .order("created_at", { ascending: false });

        setSessions(sessionsData || []);
      }

      // Load categories for exploration
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      setCategories(categoriesData || []);
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

  const partnerName = couple?.partnerName;

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {couple && couple.user2_id ? `Kopplad till ${partnerName}` : "Utforska kategorier och preferenser"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-6">
        {/* Partner Status or Connect to Partner */}
        {couple && couple.user2_id ? (
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
        ) : (
          <Card className="shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">Koppla till partner</h3>
                    <p className="text-sm text-muted-foreground">
                      Bjud in din partner för att starta sessioner tillsammans
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate("/partner-link")}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Koppla
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sessions - Main Content */}
        {couple && couple.user2_id ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Era sessioner</h2>
              <GradientButton 
                onClick={createNewSession}
                size="sm"
                className="h-9"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ny session
              </GradientButton>
            </div>
            
            {sessions.length === 0 ? (
              <Card className="shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">Ingen session än</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Skapa er första session för att börja utforska preferenser tillsammans
                  </p>
                  <GradientButton 
                    onClick={createNewSession}
                    className="mx-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Skapa första sessionen
                  </GradientButton>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {sessions.map((session) => (
                  <Card 
                    key={session.id} 
                    className="shadow-soft border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer hover:shadow-card transition-all duration-300 hover:scale-[1.02]"
                    onClick={() => navigate(`/session/${session.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                            {session.status === "completed" ? (
                              <CheckCircle className="w-6 h-6 text-primary-foreground" />
                            ) : (
                              <Clock className="w-6 h-6 text-primary-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">{session.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Skapad {new Date(session.created_at).toLocaleDateString("sv-SE")}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                            session.status === "completed" 
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                              : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
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
        ) : (
          // Not coupled yet - show simplified view
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Kom igång</h2>
            <Card className="shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Plus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Koppla till din partner</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  För att skapa sessioner behöver du först koppla till din partner
                </p>
                <Button 
                  onClick={() => navigate("/partner-link")}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Koppla till partner
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Categories to Explore */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Utforska kategorier</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className="shadow-soft border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer hover:shadow-card transition-all duration-300 hover:scale-[1.02]"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;