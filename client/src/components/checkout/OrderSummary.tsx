import { useCartContext } from "@/context/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function OrderSummary() {
  const { cartItems, cartTotal } = useCartContext();
  
  const shippingFee = cartTotal >= 50 ? 0 : 4.99;
  const totalAmount = cartTotal + shippingFee;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé de la commande</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex py-2">
              <div className="h-16 w-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                <img
                  src={item.product.imageUrl || ''}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-sm">{item.product.name}</h3>
                  <span className="text-sm font-medium">
                    {((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs mt-1">
                  <span>
                    {(item.product.discountPrice || item.product.price).toFixed(2)} € × {item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        
        <Separator className="my-4" />
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>Sous-total</span>
            <span>{cartTotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Frais de livraison</span>
            <span>{shippingFee === 0 ? "Gratuit" : `${shippingFee.toFixed(2)} €`}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{totalAmount.toFixed(2)} €</span>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p className="flex items-center">
            <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Livraison estimée: 2-3 jours ouvrables
          </p>
          <p className="flex items-center mt-1">
            <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Paiement à la livraison
          </p>
          <p className="flex items-center mt-1">
            <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Politique de retour de 30 jours
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
