'use client';

import { CartItem, Product } from '@/lib/definitions';
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface CartContextType {
  cartItems: Omit<CartItem, 'totalPrice'>[];
  addToCart: (item: Omit<CartItem, 'totalPrice'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Omit<CartItem, 'totalPrice'>[]>([]);

  const addToCart = (item: Omit<CartItem, 'totalPrice'>) => {
    setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(
            i => i.product.id === item.product.id && 
                 i.selectedFormat === item.selectedFormat && 
                 i.selectedFinishing === item.selectedFinishing
        );

        if (existingItemIndex > -1) {
            const updatedItems = [...prevItems];
            const existingItem = updatedItems[existingItemIndex];
            const newQuantity = existingItem.quantity + item.quantity;
            existingItem.quantity = newQuantity;
            return updatedItems;
        } else {
            return [...prevItems, item];
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
            return { ...item, quantity: newQuantity };
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
