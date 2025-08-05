import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  id: string;
  name: string;
}

const GlobalHeader = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchProfile(user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Utloggad",
        description: "Du har loggats ut framgångsrikt.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Ett fel uppstod",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Don't render if user is not logged in
  if (!user || !profile) {
    return null;
  }

  const userInitials = profile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-10 w-10 rounded-full p-0 border-border/50 bg-card/80 backdrop-blur-sm shadow-soft hover:shadow-card transition-all duration-300"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt={profile.name} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-popover/95 backdrop-blur-sm border-border/50 shadow-card"
        >
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-foreground">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          
          <DropdownMenuSeparator className="bg-border/50" />
          
          <DropdownMenuItem 
            onClick={() => navigate("/profile")}
            className="cursor-pointer hover:bg-muted/50"
          >
            <User className="mr-2 h-4 w-4" />
            Profil
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer hover:bg-muted/50"
          >
            <Settings className="mr-2 h-4 w-4" />
            Dashboard
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-border/50" />
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logga ut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default GlobalHeader;