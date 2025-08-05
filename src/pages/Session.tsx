import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Heart, Settings, Search } from "lucide-react";

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
        .order("sort_order", { nullsFirst: false })
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
          <h1 className="text-2xl font-bold">Vad vill ni göra?</h1>
          <p className="text-muted-foreground">Välj om ni vill ställa in preferenser eller utforska matchningar</p>
        </div>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Välj preferenser
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Utforska matchningar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Välj kategorier</h2>
                <p className="text-muted-foreground text-sm">Välj vilka områden ni vill utforska tillsammans</p>
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
          </TabsContent>

          <TabsContent value="matches" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Utforska matchningar</h2>
                <p className="text-muted-foreground text-sm">Se vad ni har gemensamt och upptäck nya möjligheter</p>
              </div>
              <div className="flex justify-center">
                <GradientButton 
                  onClick={() => navigate(`/results/${sessionId}`)}
                  className="text-lg px-8 py-4"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Visa matchningar
                </GradientButton>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Session;