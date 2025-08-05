import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Logo/Icon */}
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-card">
            <span className="text-4xl">💕</span>
          </div>
          
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Together
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              En trygg plats för par att utforska gemensamma intressen och preferenser
            </p>
          </div>

          {/* Description */}
          <div className="bg-card/60 backdrop-blur-sm rounded-lg p-6 shadow-soft border border-border/50">
            <p className="text-sm text-muted-foreground">
              Upptäck vad ni båda vill utan obekväma samtal. Välj era preferenser privat och se endast det ni båda markerat.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <GradientButton 
              onClick={() => navigate("/login")}
              className="w-full text-base py-6"
            >
              Börja din resa
            </GradientButton>
            
            <p className="text-xs text-muted-foreground">
              Skapa ett konto eller logga in för att komma igång
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-muted-foreground/70">
          Säker • Privat • Krypterad
        </p>
      </div>
    </div>
  );
};

export default Index;