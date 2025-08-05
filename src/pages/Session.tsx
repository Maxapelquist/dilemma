import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart } from "lucide-react";

const Session = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("created_at");
      
      setCategories(data || []);
      setLoading(false);
    };

    loadCategories();
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
          Tillbaka
        </Button>
      </div>

      <div className="px-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Välj kategorier</h1>
          <p className="text-muted-foreground">Välj vilka områden ni vill utforska tillsammans</p>
        </div>

        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="cursor-pointer hover:shadow-card transition-shadow"
                  onClick={() => navigate(`/preferences/${sessionId}?category=${category.id}`)}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span>{category.name}</span>
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Session;