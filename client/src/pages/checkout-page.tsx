import { useState } from "react";
import { useCartContext } from "@/context/CartContext";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ChevronLeft, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCartContext();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Check if cart is empty
  const isCartEmpty = cartItems.length === 0;

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/orders", {
        ...data,
        shippingAddress: data.address,
        userId: user?.id,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setOrderId(`ORD-${data.id}`);
      setOrderCompleted(true);
      clearCart();
      toast({
        title: "Commande confirmée !",
        description: `Votre commande #${data.id} a été placée avec succès.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle checkout form submission
  const handleCheckout = (formData: any) => {
    if (isCartEmpty) {
      toast({
        title: "Panier vide",
        description: "Votre panier est vide. Ajoutez des produits avant de passer commande.",
        variant: "destructive",
      });
      setLocation("/");
      return;
    }

    createOrderMutation.mutate(formData);
  };

  if (isCartEmpty && !orderCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl font-medium mb-2">Votre panier est vide</h2>
          <p className="text-gray-500 mb-4">
            Il semble que vous n'ayez pas encore ajouté d'articles à votre panier.
          </p>
          <Button asChild>
            <Link href="/">
              Commencer mes achats
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (orderCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-medium mb-2">Commande confirmée !</h2>
          <p className="text-gray-500 mb-4">
            Merci pour votre commande. Votre numéro de commande est <span className="font-medium">{orderId}</span>.
          </p>
          <p className="text-gray-500 mb-6">
            Un email de confirmation a été envoyé à <span className="font-medium">{user?.email}</span>.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-left mb-6">
            <h3 className="font-medium text-blue-700 mb-2">Information de livraison</h3>
            <p className="text-sm text-blue-600">
              Votre commande sera livrée dans les 2-3 jours ouvrables. Vous recevrez un appel téléphonique avant la livraison.
            </p>
          </div>
          <Button asChild>
            <Link href="/">
              Continuer mes achats
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/cart">
          <a className="flex items-center text-primary hover:underline">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour au panier
          </a>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">Finaliser la commande</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <Card className="p-6">
            <CheckoutForm
              onSubmit={handleCheckout}
              isSubmitting={createOrderMutation.isPending}
            />
          </Card>
        </div>
        
        <div className="md:w-1/3">
          <OrderSummary />
          
          <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-medium text-blue-700 mb-2">Information de livraison</h3>
            <p className="text-sm text-blue-600">
              Votre commande sera livrée dans les 2-3 jours ouvrables suivant la confirmation de commande. Notre livreur vous contactera par téléphone avant la livraison.
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Questions fréquentes</h3>
            <Separator className="my-2" />
            <div className="space-y-2 text-sm">
              <div>
                <h4 className="font-medium">Comment puis-je suivre ma commande ?</h4>
                <p className="text-gray-500">Vous recevrez un email avec les détails de suivi une fois votre commande expédiée.</p>
              </div>
              <div>
                <h4 className="font-medium">Puis-je modifier ma commande ?</h4>
                <p className="text-gray-500">Contactez notre service client dès que possible pour toute modification.</p>
              </div>
              <div>
                <h4 className="font-medium">Comment fonctionne le paiement à la livraison ?</h4>
                <p className="text-gray-500">Vous payez en espèces ou par carte à la réception de votre commande.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
