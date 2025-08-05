import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Copy, Heart, Users } from "lucide-react";

const PartnerLink = () => {
  const [coupleCode, setCoupleCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [existingCouple, setExistingCouple] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUserId(session.user.id);

      // Check if user already has a couple
      const { data: couples } = await supabase
        .from("couples")
        .select("*")
        .or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`)
        .maybeSingle();

      if (couples && couples.user1_id !== couples.user2_id) {
        // Only set as existing if both users are different (properly paired)
        setExistingCouple(couples);
      }
    };

    checkUser();
  }, [navigate]);

  const generateCoupleCode = async () => {
    if (!userId) return;

    setLoading(true);

    try {
      // Generate a unique 6-digit code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data, error } = await supabase
        .from("couples")
        .insert({
          user1_id: userId,
          user2_id: null, // Will be updated when partner joins
          couple_code: code,
        })
        .select()
        .single();

      if (error) throw error;

      setCoupleCode(code);
      toast({
        title: "Parningskod skapad!",
        description: "Dela denna kod med din partner för att koppla samman er.",
      });
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

  const joinWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !joinCode.trim()) return;

    setLoading(true);

    try {
      // Find the couple with this code
      const { data: couple, error: findError } = await supabase
        .from("couples")
        .select("*")
        .eq("couple_code", joinCode.toUpperCase())
        .single();

      if (findError || !couple) {
        throw new Error("Ogiltig kod. Kontrollera koden och försök igen.");
      }

      if (couple.user1_id === userId) {
        throw new Error("Du kan inte använda din egen kod.");
      }

      // Update the couple to include the second user
      const { error: updateError } = await supabase
        .from("couples")
        .update({ user2_id: userId })
        .eq("id", couple.id);

      if (updateError) throw updateError;

      toast({
        title: "Framgångsrikt kopplad!",
        description: "Du är nu kopplad till din partner.",
      });

      // Wait a moment then navigate to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopierat!",
      description: "Koden har kopierats till urklipp.",
    });
  };

  if (existingCouple) {
    return (
      <div className="min-h-screen bg-gradient-background flex flex-col">
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

        <div className="flex-1 flex items-center justify-center px-6">
          <Card className="w-full max-w-md shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Ni är kopplade!</CardTitle>
              <CardDescription>
                Du och din partner är framgångsrikt sammankopplade
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-medium">{existingCouple.profiles?.name || "Partner 1"}</p>
                <p className="text-sm text-muted-foreground">+</p>
                <p className="font-medium">{existingCouple.profiles_user2?.name || "Partner 2"}</p>
              </div>
              
              <GradientButton 
                onClick={() => navigate("/dashboard")}
                className="w-full"
              >
                Gå till dashboard
              </GradientButton>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/profile")}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka
        </Button>
      </div>

      {/* Partner Link */}
      <div className="flex-1 flex items-center justify-center px-6">
        <Card className="w-full max-w-md shadow-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-accent flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl">Koppla till partner</CardTitle>
            <CardDescription>
              Skapa en kod eller gå med i din partners session
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="create" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Skapa kod</TabsTrigger>
                <TabsTrigger value="join">Gå med</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="space-y-4">
                <div className="text-center space-y-4">
                  {coupleCode ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-primary text-primary-foreground p-4 rounded-lg">
                        <p className="text-sm font-medium mb-2">Din parningskod:</p>
                        <p className="text-2xl font-bold tracking-wider">{coupleCode}</p>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(coupleCode)}
                        className="w-full"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Kopiera kod
                      </Button>
                      
                      <p className="text-xs text-muted-foreground">
                        Dela denna kod med din partner så de kan gå med
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Skapa en unik kod som din partner kan använda för att koppla till dig
                      </p>
                      
                      <GradientButton 
                        onClick={generateCoupleCode}
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? "Skapar..." : "Skapa parningskod"}
                      </GradientButton>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="join" className="space-y-4">
                <form onSubmit={joinWithCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="joinCode">Parningskod</Label>
                    <Input
                      id="joinCode"
                      type="text"
                      placeholder="Ange 6-siffrig kod"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      required
                    />
                  </div>
                  
                  <GradientButton 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || joinCode.length !== 6}
                  >
                    {loading ? "Ansluter..." : "Anslut till partner"}
                  </GradientButton>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerLink;