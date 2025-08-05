import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  sort_order?: number;
  is_visible: boolean;
}

interface PreferenceOption {
  id: string;
  title: string;
  description?: string;
  category_id?: string;
  subcategory?: string;
  is_visible: boolean;
}

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCategoryDialog, setNewCategoryDialog] = useState(false);
  const [newPreferenceDialog, setNewPreferenceDialog] = useState(false);

  // Forms
  const categoryForm = useForm({
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      sort_order: 0,
      is_visible: true
    }
  });

  const preferenceForm = useForm({
    defaultValues: {
      title: "",
      description: "",
      category_id: "",
      subcategory: "",
      is_visible: true
    }
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    }
  });

  // Fetch preferences
  const { data: preferences = [], isLoading: preferencesLoading } = useQuery({
    queryKey: ["admin-preferences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("preference_options")
        .select("*")
        .order("title", { ascending: true });
      
      if (error) throw error;
      return data as PreferenceOption[];
    }
  });

  // Toggle category visibility
  const toggleCategoryVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase
        .from("categories")
        .update({ is_visible })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: "Kategori uppdaterad" });
    },
    onError: () => {
      toast({ title: "Fel vid uppdatering", variant: "destructive" });
    }
  });

  // Toggle preference visibility
  const togglePreferenceVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase
        .from("preference_options")
        .update({ is_visible })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-preferences"] });
      toast({ title: "Preferens uppdaterad" });
    },
    onError: () => {
      toast({ title: "Fel vid uppdatering", variant: "destructive" });
    }
  });

  // Create category
  const createCategory = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("categories")
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setNewCategoryDialog(false);
      categoryForm.reset();
      toast({ title: "Kategori skapad" });
    },
    onError: () => {
      toast({ title: "Fel vid skapande", variant: "destructive" });
    }
  });

  // Create preference
  const createPreference = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("preference_options")
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-preferences"] });
      setNewPreferenceDialog(false);
      preferenceForm.reset();
      toast({ title: "Preferens skapad" });
    },
    onError: () => {
      toast({ title: "Fel vid skapande", variant: "destructive" });
    }
  });

  // Group preferences by category and subcategory
  const groupedPreferences = preferences.reduce((acc, pref) => {
    const categoryName = categories.find(c => c.id === pref.category_id)?.name || "Okategoriserad";
    const subcategory = pref.subcategory || "Allmänt";
    
    if (!acc[categoryName]) acc[categoryName] = {};
    if (!acc[categoryName][subcategory]) acc[categoryName][subcategory] = [];
    
    acc[categoryName][subcategory].push(pref);
    return acc;
  }, {} as Record<string, Record<string, PreferenceOption[]>>);

  if (categoriesLoading || preferencesLoading) {
    return <div className="p-6">Laddar...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Hantera kategorier, subkategorier och preferenser</p>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories">Kategorier</TabsTrigger>
          <TabsTrigger value="preferences">Preferenser</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Kategorier</h2>
            <Dialog open={newCategoryDialog} onOpenChange={setNewCategoryDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ny kategori
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Skapa ny kategori</DialogTitle>
                </DialogHeader>
                <Form {...categoryForm}>
                  <form onSubmit={categoryForm.handleSubmit((data) => createCategory.mutate(data))} className="space-y-4">
                    <FormField
                      control={categoryForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Namn</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={categoryForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beskrivning</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={categoryForm.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ikon</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="t.ex. Heart, Activity" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={categoryForm.control}
                      name="sort_order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sorteringsordning</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" onChange={(e) => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={createCategory.isPending}>
                      {createCategory.isPending ? "Skapar..." : "Skapa"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={category.is_visible ? "default" : "secondary"}>
                      {category.is_visible ? "Synlig" : "Dold"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCategoryVisibility.mutate({
                        id: category.id,
                        is_visible: !category.is_visible
                      })}
                    >
                      {category.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{category.description}</p>
                  {category.icon && <p className="text-sm">Ikon: {category.icon}</p>}
                  <p className="text-sm">Ordning: {category.sort_order}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Preferenser</h2>
            <Dialog open={newPreferenceDialog} onOpenChange={setNewPreferenceDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ny preferens
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Skapa ny preferens</DialogTitle>
                </DialogHeader>
                <Form {...preferenceForm}>
                  <form onSubmit={preferenceForm.handleSubmit((data) => createPreference.mutate(data))} className="space-y-4">
                    <FormField
                      control={preferenceForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titel</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={preferenceForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beskrivning</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={preferenceForm.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategori</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Välj kategori" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={preferenceForm.control}
                      name="subcategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subkategori</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Valfritt" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={createPreference.isPending}>
                      {createPreference.isPending ? "Skapar..." : "Skapa"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedPreferences).map(([categoryName, subcategories]) => (
              <Card key={categoryName}>
                <CardHeader>
                  <CardTitle>{categoryName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(subcategories).map(([subcategoryName, prefs]) => (
                    <div key={subcategoryName}>
                      <h4 className="font-medium mb-2">{subcategoryName}</h4>
                      <div className="grid gap-2">
                        {prefs.map((pref) => (
                          <div key={pref.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex-1">
                              <p className="font-medium">{pref.title}</p>
                              {pref.description && (
                                <p className="text-sm text-muted-foreground">{pref.description}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={pref.is_visible ? "default" : "secondary"}>
                                {pref.is_visible ? "Synlig" : "Dold"}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePreferenceVisibility.mutate({
                                  id: pref.id,
                                  is_visible: !pref.is_visible
                                })}
                              >
                                {pref.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}