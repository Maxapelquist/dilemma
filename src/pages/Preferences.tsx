import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";

const Preferences = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      const { data } = await supabase
        .from("preference_options")
        .select("*, subcategories(name, categories(name))")
        .limit(10);
      
      setOptions(data || []);
      setLoading(false);
    };

    loadOptions();
  }, []);

  const handleOptionToggle = (optionId: string) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    setSelectedOptions(newSelected);
  };

  const savePreferences = async () => {
    navigate(`/results/${sessionId}`);
  };

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
          onClick={() => navigate(`/session/${sessionId}`)}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka
        </Button>
      </div>

      <div className="px-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Välj dina preferenser</h1>
          <p className="text-muted-foreground">Markera vad som intresserar dig</p>
        </div>

        <div className="space-y-4">
          {options.map((option) => (
            <Card key={option.id} className="p-4">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedOptions.has(option.id)}
                    onCheckedChange={() => handleOptionToggle(option.id)}
                  />
                  <div>
                    <p className="font-medium">{option.name}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <GradientButton onClick={savePreferences} className="w-full">
          Spara preferenser
        </GradientButton>
      </div>
    </div>
  );
};

export default Preferences;