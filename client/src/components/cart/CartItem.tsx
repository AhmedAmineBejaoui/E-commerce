import { useState } from "react";
import { CartItemWithProduct } from "@shared/schema";
import { useCartContext } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Link } from "wouter";

interface CartItemProps {
  item: CartItemWithProduct;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCartContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const product = item.product;
  const price = product.discountPrice || product.price;
  const subtotal = price * item.quantity;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > product.stock) return;
    
    setIsUpdating(true);
    
    updateQuantity({
      id: item.id,
      quantity: newQuantity
    });
    
    // Small delay to avoid UI flicker
    setTimeout(() => {
      setIsUpdating(false);
    }, 300);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-gray-200">
      {/* Product Image */}
      <div className="sm:w-24 sm:h-24 h-32 w-full mb-4 sm:mb-0">
        <Link href={`/product/${product.slug}`}>
          <a>
            <img 
              src={product.imageUrl || ''} 
              alt={product.name} 
              className="w-full h-full object-cover rounded-md"
            />
          </a>
        </Link>
      </div>
      
      {/* Product Details */}
      <div className="flex-1 px-4">
        <Link href={`/product/${product.slug}`}>
          <a className="text-lg font-medium text-gray-800 hover:text-primary">
            {product.name}
          </a>
        </Link>
        <p className="text-gray-500 text-sm mb-2">{product.description?.substring(0, 60)}...</p>
        
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span className="inline-flex items-center">
            Prix unitaire: <span className="font-medium text-primary ml-1">{price.toFixed(2)} €</span>
          </span>
          {product.discountPrice && (
            <span className="inline-flex items-center text-gray-400 line-through">
              {product.price.toFixed(2)} €
            </span>
          )}
          
          {product.stock <= 5 && (
            <span className="text-orange-500 text-xs ml-2">
              Plus que {product.stock} en stock!
            </span>
          )}
        </div>
      </div>
      
      {/* Quantity and Actions */}
      <div className="flex sm:flex-col items-center justify-between mt-4 sm:mt-0 sm:items-end gap-4">
        <div className="flex items-center border border-gray-300 rounded">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-none"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1 || isUpdating}
          >
            <MinusIcon className="h-3 w-3" />
          </Button>
          <span className="w-10 text-center text-sm">{item.quantity}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-none"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= product.stock || isUpdating}
          >
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="font-medium text-primary">
            {subtotal.toFixed(2)} €
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleRemove}
          >
            <Trash2Icon className="h-4 w-4 mr-1" />
            <span className="text-xs">Supprimer</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
