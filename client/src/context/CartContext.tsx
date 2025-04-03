import React, { createContext, useContext, ReactNode } from 'react';
import { CartItemWithProduct } from 'shared/src/schema.ts';
import { useCartData } from '../hooks/use-cart-data';

interface CartContextType {
  cartItems: CartItemWithProduct[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (data: { productId: number; quantity: number }) => void;
  updateQuantity: (data: { id: number; quantity: number }) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  isPending: boolean;
}

const defaultCartContext: CartContextType = {
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  isLoading: false,
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  isPending: false
};

const CartContext = createContext<CartContextType>(defaultCartContext);

export function CartProvider({ children }: { children: ReactNode }) {
  const cartData = useCartData();
  
  return (
    <CartContext.Provider value={cartData}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
