import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User } from "lucide-react";

const Profile = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUserId(session.user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setName(profile.name || "");
      }
    };

    getProfile();
  }, [navigate]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          name: name,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profil uppdaterad!",
        description: "Din profil har sparats framgångsrikt.",
      });

      navigate("/partner-link");
    } catch (error: any) {
      toast({
        title: "Ett fel uppstod",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka
        </Button>
      </div>

      {/* Profile Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <Card className="w-full max-w-md shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-accent flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl">Din profil</CardTitle>
            <CardDescription>
              Anpassa din profil för att personalisera upplevelsen
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Namn eller Smeknamn</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Vad vill du kallas?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Detta namn kommer din partner att se
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium text-sm mb-2">🔒 Integritet</h3>
                <p className="text-xs text-muted-foreground">
                  Dina preferenser förblir privata tills ni båda har gjort era val. 
                  Endast gemensamma intressen visas.
                </p>
              </div>
              
              <GradientButton 
                type="submit" 
                className="w-full" 
                disabled={loading || !name.trim()}
              >
                {loading ? "Sparar..." : "Spara profil"}
              </GradientButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;