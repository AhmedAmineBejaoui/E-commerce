import { useCartContext } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShoppingCart, PackageOpen } from "lucide-react";

export default function CartPage() {
  const { cartItems, clearCart, isPending } = useCartContext();
  
  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Mon Panier</h1>
      <p className="text-gray-500 mb-8">
        {isCartEmpty
          ? "Votre panier est vide."
          : `Vous avez ${cartItems.length} article${cartItems.length > 1 ? "s" : ""} dans votre panier.`}
      </p>

      {isCartEmpty ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
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
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Détails du panier</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => clearCart()}
                  disabled={isPending}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Vider le panier
                </Button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <Link href="/">
                  <a className="text-primary hover:underline inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continuer mes achats
                  </a>
                </Link>
                
                <Link href="/checkout">
                  <a className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 inline-flex items-center">
                    Passer à la caisse
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </Link>
              </div>
            </div>
            
            {/* Recently Viewed */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Vous pourriez aussi aimer</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition">
                    <Link href={`/product/product-${i}`}>
                      <a className="block">
                        <img 
                          src={`https://images.unsplash.com/photo-160${i}086427699-bfffb4793d29?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80`} 
                          alt="Product" 
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2">
                          <h3 className="font-medium text-sm">Produit Suggéré {i}</h3>
                          <p className="text-primary text-sm font-bold">19.99 €</p>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="lg:w-1/3">
            <CartSummary />
            
            {/* Delivery Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <div className="flex items-start">
                <PackageOpen className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Information de livraison</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Votre commande sera livrée dans les 2-3 jours ouvrables suivant la confirmation de commande.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <h3 className="font-medium mb-2">Besoin d'aide?</h3>
                <p className="text-sm text-gray-500">
                  Notre service client est disponible 24/7 pour répondre à vos questions.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Contactez-nous
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
