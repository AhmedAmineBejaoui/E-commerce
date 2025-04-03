import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from                    "../../components/ui/form";
import { Input } from     "../../components/ui/input";
import { Checkbox } from  "../../components/ui/checkbox";
import { useAuth } from   "../../hooks/use-auth";
import { Loader2 } from "lucide-react";

// Checkout form schema
const checkoutSchema = z.object({
  firstName: z.string().min(1, { message: "Le prénom est requis" }),
  lastName: z.string().min(1, { message: "Le nom est requis" }),
  address: z.string().min(1, { message: "L'adresse est requise" }),
  city: z.string().min(1, { message: "La ville est requise" }),
  postalCode: z.string().min(1, { message: "Le code postal est requis" }),
  phone: z.string().min(1, { message: "Le numéro de téléphone est requis" }),
  email: z.string().email({ message: "Email invalide" }),
  saveInfo: z.boolean().optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions générales" }),
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormValues) => void;
  isSubmitting: boolean;
}

export default function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const { user } = useAuth();
  const [showBillingAddress, setShowBillingAddress] = useState(false);

  // Initialize form with user data if available
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      address: user?.address || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
      phone: user?.phone || "",
      email: user?.email || "",
      saveInfo: true,
      termsAccepted: true,
    },
  });

  const handleFormSubmit = (values: CheckoutFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Informations personnelles</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="+33 1 23 45 67 89" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Adresse de livraison</h2>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="123 rue Example" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Paris" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input placeholder="75000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="different-billing" 
              checked={showBillingAddress}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') {
                  setShowBillingAddress(checked);
                }
              }}
            />
            <label
              htmlFor="different-billing"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Utiliser une adresse de facturation différente
            </label>
          </div>

          {showBillingAddress && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h3 className="text-md font-medium mb-4">Adresse de facturation</h3>
              <div className="grid grid-cols-1 gap-4">
                <Input placeholder="Adresse de facturation" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input placeholder="Ville" />
                  <Input placeholder="Code postal" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-4">Méthode de paiement</h2>
          <div className="bg-orange-50 border border-orange-200 rounded-md p-4 flex items-center mb-4">
            <svg className="h-8 w-8 text-orange-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <h3 className="font-medium">Paiement à la livraison</h3>
              <p className="text-sm text-gray-500">Payez en espèces à la réception de votre commande</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="saveInfo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Sauvegarder ces informations pour une prochaine commande
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    J'accepte les <a href="#" className="text-primary hover:underline">conditions générales</a> et la <a href="#" className="text-primary hover:underline">politique de confidentialité</a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement de la commande...
            </>
          ) : (
            "Confirmer la commande"
          )}
        </Button>
      </form>
    </Form>
  );
}