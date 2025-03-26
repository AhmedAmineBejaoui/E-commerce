import { useState } from "react";
import { useCartContext } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export default function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { cartItems, cartTotal, isPending } = useCartContext();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Calculate total items quantity
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Apply promo code
  const handleApplyPromoCode = () => {
    if (!promoCode) return;
    
    setIsApplyingPromo(true);
    
    // Simulate API call
    setTimeout(() => {
      if (promoCode.toUpperCase() === "SOUND15") {
        setDiscount(cartTotal * 0.15);
        setPromoApplied(true);
      } else {
        setDiscount(0);
        setPromoApplied(false);
      }
      setIsApplyingPromo(false);
    }, 1000);
  };

  // Calculate final amount
  const finalAmount = cartTotal - discount;
  
  // Free shipping threshold
  const freeShippingThreshold = 50;
  const shippingFee = finalAmount >= freeShippingThreshold ? 0 : 4.99;
  
  // Determine if cart is empty
  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Sous-total ({totalQuantity} article{totalQuantity > 1 ? 's' : ''})</span>
          <span>{cartTotal.toFixed(2)} €</span>
        </div>
        
        {promoApplied && (
          <div className="flex justify-between text-green-600">
            <span>Réduction (SOUND15)</span>
            <span>-{discount.toFixed(2)} €</span>
          </div>
        )}
        
        <div className="flex justify-between text-gray-600">
          <span>Frais de livraison</span>
          <span>{shippingFee === 0 ? "Gratuit" : `${shippingFee.toFixed(2)} €`}</span>
        </div>
        
        {finalAmount < freeShippingThreshold && (
          <div className="text-sm text-orange-500">
            Ajoutez {(freeShippingThreshold - finalAmount).toFixed(2)} € d'articles pour bénéficier de la livraison gratuite !
          </div>
        )}
        
        <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{(finalAmount + shippingFee).toFixed(2)} €</span>
        </div>
      </div>
      
      {/* Promo Code */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Code promo"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={isApplyingPromo || promoApplied}
            className="flex-1"
          />
          <Button 
            variant="outline" 
            onClick={handleApplyPromoCode}
            disabled={isApplyingPromo || promoApplied || !promoCode}
          >
            {isApplyingPromo ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : promoApplied ? (
              "Appliqué"
            ) : (
              "Appliquer"
            )}
          </Button>
        </div>
        {promoApplied && (
          <p className="text-green-600 text-sm mt-1">
            Code promo appliqué avec succès !
          </p>
        )}
        <div className="text-xs text-gray-500 mt-2">
          Essayez le code "SOUND15" pour obtenir 15% de réduction sur votre commande.
        </div>
      </div>
      
      {/* Actions */}
      {showCheckoutButton && (
        <div className="space-y-3">
          <Button 
            className="w-full"
            disabled={isCartEmpty || isPending}
            asChild
          >
            <Link href="/checkout">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Procéder au paiement"
              )}
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">
              Continuer vos achats
            </Link>
          </Button>
        </div>
      )}
      
      {/* Payment methods */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 mb-2">Méthode de paiement:</p>
        <div className="flex items-center space-x-2 bg-orange-50 border border-orange-200 rounded-md p-3">
          <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div>
            <p className="font-medium text-gray-800">Paiement à la livraison</p>
            <p className="text-xs text-gray-500">Payez en espèces à la réception de votre commande</p>
          </div>
        </div>
      </div>
    </div>
  );
}
