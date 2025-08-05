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
      // For demo purposes, showing some example matches
      const demoMatches = [
        { name: "Holding hands", description: "Simple hand holding during walks" },
        { name: "Weekend getaways", description: "Short romantic trips together" },
        { name: "Beach destinations", description: "Tropical beaches and coastal areas" }
      ];
      
      setMatches(demoMatches);
      setLoading(false);
    };

    loadMatches();
  }, []);

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
          {matches.map((match, index) => (
            <Card key={index} className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-primary" />
                  <span>{match.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{match.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <GradientButton onClick={() => navigate("/dashboard")} className="w-full">
          Tillbaka till dashboard
        </GradientButton>
      </div>
    </div>
  );
};

export default Results;