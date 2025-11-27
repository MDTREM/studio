'use client';

import { CartItem, Product } from '@/lib/definitions';
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// A lógica de cálculo de preço para exibição foi movida para cá.
const getClientSidePrice = (product: Product, quantity: number): number => {
    if (!product?.basePrice || quantity <= 0) {
        return 0;
    }
    const baseQuantity = product.variations.quantities?.[0] || 1;
    if (baseQuantity <= 0) return 0;

    const pricePerUnit = product.basePrice / baseQuantity;
    return pricePerUnit * quantity;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'totalPrice'>) => {
    setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(
            i => i.product.id === item.product.id && 
                 i.selectedFormat === item.selectedFormat && 
                 i.selectedFinishing === item.selectedFinishing
        );
        
        const price = getClientSidePrice(item.product, item.quantity);

        if (existingItemIndex > -1) {
            const updatedItems = [...prevItems];
            const existingItem = updatedItems[existingItemIndex];
            const newQuantity = existingItem.quantity + item.quantity;
            
            existingItem.quantity = newQuantity;
            existingItem.totalPrice = getClientSidePrice(existingItem.product, newQuantity);
            
            return updatedItems;
        } else {
            return [...prevItems, { ...item, totalPrice: price }];
        }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId && newQuantity > 0) {
            const updatedPrice = getClientSidePrice(item.product, newQuantity);
            return { ...item, quantity: newQuantity, totalPrice: updatedPrice };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };
  
  const cartCount = useMemo(() => cartItems.length, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
