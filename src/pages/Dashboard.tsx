import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Settings, Users, Heart, Clock, CheckCircle, ExternalLink, Trash2 } from "lucide-react";

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

      // Load couple information - get the most recent valid couple
      const { data: coupleData } = await supabase
        .from("couples")
        .select("*")
        .or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`)
        .not("user2_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
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
        .eq("is_visible", true)
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

  const deleteSession = async (sessionId: string, sessionName: string) => {
    try {
      // Först ta bort alla user_preferences för denna session
      const { error: prefsError } = await supabase
        .from("user_preferences")
        .delete()
        .eq("session_id", sessionId);

      if (prefsError) throw prefsError;

      // Sedan ta bort sessionen själv
      const { error: sessionError } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionId);

      if (sessionError) throw sessionError;

      // Uppdatera lokalt state
      setSessions(sessions.filter(s => s.id !== sessionId));

      toast({
        title: "Session borttagen",
        description: `"${sessionName}" har tagits bort permanent.`,
      });
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
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {couple && couple.user2_id ? "Hemma" : "Välkommen"}
          </h1>
          <p className="text-muted-foreground">
            {couple && couple.user2_id ? 
              `Du och ${partnerName} utforskar tillsammans` : 
              "Utforska kategorier och skapa din första koppling"
            }
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-6">
        {/* Sessions - Primary Content */}
        {couple && couple.user2_id ? (
          <div className="space-y-6">
            {/* Partner Status - Enhanced */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-accent p-6 shadow-card border border-border/30">
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-accent-foreground">Du och {partnerName}</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-accent-foreground/80">Redo för äventyr</span>
                    </div>
                  </div>
                </div>
                <GradientButton 
                  onClick={createNewSession}
                  size="lg"
                  className="shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ny resa
                </GradientButton>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10"></div>
            </div>

            {/* Sessions List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Era gemensamma resor</h2>
              
              {sessions.length === 0 ? (
              <Card className="shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Er första resa väntar</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Skapa er första gemensamma session för att börja utforska vad ni båda längtar efter
                  </p>
                  <GradientButton 
                    onClick={createNewSession}
                    className="mx-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Starta er resa
                  </GradientButton>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                 {sessions.map((session) => (
                   <Card 
                     key={session.id} 
                     className="shadow-soft border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-card transition-all duration-300"
                   >
                     <CardContent className="p-6">
                       <div className="flex items-center justify-between">
                         <div 
                           className="flex items-center space-x-4 cursor-pointer flex-1"
                           onClick={() => navigate(`/session/${session.id}`)}
                         >
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
                         
                         <div className="flex items-center space-x-3">
                           <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                             session.status === "completed" 
                               ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                               : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                           }`}>
                             {session.status === "completed" ? "Avslutad" : "Aktiv"}
                           </div>
                           
                           <AlertDialog>
                             <AlertDialogTrigger asChild>
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                 onClick={(e) => e.stopPropagation()}
                               >
                                 <Trash2 className="w-4 h-4" />
                               </Button>
                             </AlertDialogTrigger>
                             <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Ta bort session</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   Är du säker på att du vill ta bort "{session.name}"? 
                                   Detta kommer att ta bort alla preferenser och matchningar för denna session permanent.
                                   Denna åtgärd kan inte ångras.
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel>Avbryt</AlertDialogCancel>
                                 <AlertDialogAction
                                   onClick={() => deleteSession(session.id, session.name)}
                                   className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                 >
                                   Ta bort
                                 </AlertDialogAction>
                               </AlertDialogFooter>
                             </AlertDialogContent>
                           </AlertDialog>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                ))}
              </div>
            )}
            </div>
          </div>
        ) : (
          // Not coupled yet - show simplified view
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center mb-2">Första steget</h2>
            <Card className="shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Plus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-3">Bjud in din partner</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  För att börja er gemensamma resa behöver ni koppla era konton tillsammans
                </p>
                <Button 
                  onClick={() => navigate("/partner-link")}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Bjud in partner
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Categories to Explore */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upptäck tillsammans</h2>
          
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