import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";

const Preferences = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [openSubcategories, setOpenSubcategories] = useState<Record<string, boolean>>({});

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

      // Hämta preferenser för vald kategori, sorterade efter underkategori och titel
      const { data } = await supabase
        .from("preference_options")
        .select("*")
        .eq("category_id", categoryId)
        .order("subcategory")
        .order("title");
      
      setOptions(data || []);

      // Sätt alla underkategorier som öppna som standard
      if (data) {
        const subcategories = [...new Set(data.map(opt => opt.subcategory || 'Allmänt'))];
        const initialOpenSubcategories = subcategories.reduce((acc, subcategory) => {
          acc[subcategory] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setOpenSubcategories(initialOpenSubcategories);
      }

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
          {(() => {
            // Gruppera optionerna efter underkategori
            const optionsBySubcategory = options.reduce((acc, option) => {
              const subcategory = option.subcategory || 'Allmänt';
              if (!acc[subcategory]) {
                acc[subcategory] = [];
              }
              acc[subcategory].push(option);
              return acc;
            }, {} as Record<string, any[]>);

            return Object.entries(optionsBySubcategory).map(([subcategory, subcategoryOptions]: [string, any[]]) => (
              <Card key={subcategory} className="shadow-soft">
                <Collapsible
                  open={openSubcategories[subcategory]}
                  onOpenChange={(isOpen) => 
                    setOpenSubcategories(prev => ({ ...prev, [subcategory]: isOpen }))
                  }
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p>{subcategory}</p>
                            <p className="text-sm text-muted-foreground font-normal">
                              {subcategoryOptions.length} {subcategoryOptions.length === 1 ? 'alternativ' : 'alternativ'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {subcategoryOptions.filter(opt => selectedOptions.has(opt.id)).length}
                          </div>
                          {openSubcategories[subcategory] ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      {subcategoryOptions.map((option) => (
                        <div key={option.id} className="p-3 rounded-lg bg-muted/20 border border-border">
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
                        </div>
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ));
          })()}
        </div>

        <GradientButton onClick={savePreferences} className="w-full">
          Spara preferenser
        </GradientButton>
      </div>
    </div>
  );
};

export default Preferences;