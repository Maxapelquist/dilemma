import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";

const Preferences = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const loadOptions = async () => {
      if (!categoryId || !sessionId) {
        setLoading(false);
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        setLoading(false);
        return;
      }

      // Hämta kategorinamn
      const { data: categoryData } = await supabase
        .from("categories")
        .select("name")
        .eq("id", categoryId)
        .single();
      
      setCategoryName(categoryData?.name || '');

      // Hämta preferenser för vald kategori
      const { data } = await supabase
        .from("preference_options")
        .select("*")
        .eq("category_id", categoryId)
        .order("title");
      
      setOptions(data || []);

      // Hämta användarens sparade preferenser för denna session och kategori
      const { data: userPrefs } = await supabase
        .from("user_preferences")
        .select("preference_option_id")
        .eq("user_id", session.session.user.id)
        .eq("session_id", sessionId)
        .in("preference_option_id", (data || []).map(opt => opt.id));

      if (userPrefs) {
        const savedIds = new Set(userPrefs.map(pref => pref.preference_option_id));
        setSelectedOptions(savedIds);
      }

      setLoading(false);
    };

    loadOptions();
  }, [categoryId, sessionId]);

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
    if (!sessionId) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Du måste vara inloggad för att spara preferenser");
        return;
      }

      const userId = session.session.user.id;

      // Ta bort alla befintliga preferenser för denna kategori i denna session
      const { error: deleteError } = await supabase
        .from("user_preferences")
        .delete()
        .eq("user_id", userId)
        .eq("session_id", sessionId)
        .in("preference_option_id", options.map(opt => opt.id));

      if (deleteError) {
        console.error("Error deleting preferences:", deleteError);
        toast.error("Kunde inte uppdatera preferenser");
        return;
      }

      // Lägg till nya preferenser
      if (selectedOptions.size > 0) {
        const preferencesToInsert = Array.from(selectedOptions).map(optionId => ({
          user_id: userId,
          session_id: sessionId,
          preference_option_id: optionId
        }));

        const { error: insertError } = await supabase
          .from("user_preferences")
          .insert(preferencesToInsert);

        if (insertError) {
          console.error("Error inserting preferences:", insertError);
          toast.error("Kunde inte spara preferenser");
          return;
        }
      }

      toast.success("Preferenser sparade!");
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Ett fel uppstod vid sparandet");
    }
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
          <h1 className="text-2xl font-bold">{categoryName}</h1>
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
                    <p className="font-medium">{option.title}</p>
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