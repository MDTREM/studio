'use client';

import { CartItem } from '@/lib/definitions';
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Preço linear simples para garantir precisão
const getPriceForQuantity = (product: CartItem['product'], quantity: number): number => {
    if (!product?.basePrice || quantity <= 0) {
        return 0;
    }
    const baseQuantity = product.variations?.quantities?.[0] || 1;
    const pricePerUnit = (product.basePrice / (baseQuantity > 0 ? baseQuantity : 1));
    const totalPrice = pricePerUnit * quantity;
    return totalPrice;
};


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
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
            existingItem.totalPrice = getPriceForQuantity(existingItem.product, newQuantity);
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
            const newTotalPrice = getPriceForQuantity(item.product, newQuantity);
            return { ...item, quantity: newQuantity, totalPrice: newTotalPrice };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };
  
  const cartCount = useMemo(() => cartItems.length, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }, [cartItems]);


  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
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
