import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from             "../components/ui/input";
import { Button } from            "../components/ui/button";
import { Separator } from         "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from           "../hooks/use-auth";
import MainLayout from            "../components/layout/MainLayout";
import { useToast } from          "../hooks/use-toast";
import { apiRequest } from        "../lib/queryClient";
import { Loader2 } from "lucide-react";

// Schéma pour la mise à jour des informations personnelles
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères").nullable().optional(),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères").nullable().optional(),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().nullable().optional(),
});

// Schéma pour la mise à jour de l'adresse
const addressSchema = z.object({
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères").nullable().optional(),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères").nullable().optional(),
  postalCode: z.string().min(5, "Le code postal doit contenir au moins 5 caractères").nullable().optional(),
});

// Schéma pour la mise à jour du mot de passe
const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Le mot de passe actuel doit contenir au moins 6 caractères"),
  newPassword: z.string().min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(6, "La confirmation du mot de passe doit contenir au moins 6 caractères"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
type AddressValues = z.infer<typeof addressSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("personal");

  // Formulaire pour les informations personnelles
  const personalInfoForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  // Formulaire pour l'adresse
  const addressForm = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: user?.address || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
    },
  });

  // Formulaire pour le mot de passe
  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Mutation pour mettre à jour le profil
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<PersonalInfoValues & AddressValues>) => {
      const res = await apiRequest("PATCH", "/api/user", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour de votre profil.",
        variant: "destructive",
      });
    },
  });

  // Mutation pour mettre à jour le mot de passe
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordValues) => {
      const res = await apiRequest("POST", "/api/user/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return await res.json();
    },
    onSuccess: () => {
      passwordForm.reset();
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour de votre mot de passe.",
        variant: "destructive",
      });
    },
  });

  // Gestion de la soumission du formulaire d'informations personnelles
  const onSubmitPersonalInfo = async (data: PersonalInfoValues) => {
    updateProfileMutation.mutate(data);
  };

  // Gestion de la soumission du formulaire d'adresse
  const onSubmitAddress = async (data: AddressValues) => {
    updateProfileMutation.mutate(data);
  };

  // Gestion de la soumission du formulaire de mot de passe
  const onSubmitPassword = async (data: PasswordValues) => {
    updatePasswordMutation.mutate(data);
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon Profil</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="personal">Informations Personnelles</TabsTrigger>
                  <TabsTrigger value="address">Adresse</TabsTrigger>
                  <TabsTrigger value="password">Mot de Passe</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-6">
                {/* Onglet Informations Personnelles */}
                <TabsContent value="personal">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Informations Personnelles</h2>
                      <p className="text-gray-500 text-sm mt-1">Mettez à jour vos informations personnelles</p>
                    </div>
                    
                    <Separator />
                    
                    <Form {...personalInfoForm}>
                      <form onSubmit={personalInfoForm.handleSubmit(onSubmitPersonalInfo)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={personalInfoForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prénom</FormLabel>
                                <FormControl>
                                  <Input placeholder="Votre prénom" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={personalInfoForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                  <Input placeholder="Votre nom" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={personalInfoForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="votre.email@exemple.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={personalInfoForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Téléphone</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre numéro de téléphone" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button 
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement...
                              </>
                            ) : (
                              "Enregistrer les modifications"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </TabsContent>
                
                {/* Onglet Adresse */}
                <TabsContent value="address">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Adresse de Livraison</h2>
                      <p className="text-gray-500 text-sm mt-1">Mettez à jour votre adresse de livraison</p>
                    </div>
                    
                    <Separator />
                    
                    <Form {...addressForm}>
                      <form onSubmit={addressForm.handleSubmit(onSubmitAddress)} className="space-y-4">
                        <FormField
                          control={addressForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adresse</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre adresse" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={addressForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ville</FormLabel>
                                <FormControl>
                                  <Input placeholder="Votre ville" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={addressForm.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Code postal</FormLabel>
                                <FormControl>
                                  <Input placeholder="Votre code postal" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement...
                              </>
                            ) : (
                              "Enregistrer les modifications"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </TabsContent>
                
                {/* Onglet Mot de Passe */}
                <TabsContent value="password">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Changer de Mot de Passe</h2>
                      <p className="text-gray-500 text-sm mt-1">Mettez à jour votre mot de passe</p>
                    </div>
                    
                    <Separator />
                    
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mot de passe actuel</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Votre mot de passe actuel" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nouveau mot de passe</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Votre nouveau mot de passe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirmez votre nouveau mot de passe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button 
                            type="submit"
                            disabled={updatePasswordMutation.isPending}
                          >
                            {updatePasswordMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Modification...
                              </>
                            ) : (
                              "Modifier le mot de passe"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}