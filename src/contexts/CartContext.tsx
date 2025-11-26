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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
        // Check if a similar item already exists (based on product, format, and finishing)
        const existingItemIndex = prevItems.findIndex(
            i => i.product.id === item.product.id && 
                 i.selectedFormat === item.selectedFormat && 
                 i.selectedFinishing === item.selectedFinishing
        );

        if (existingItemIndex > -1) {
            // Update quantity of existing item
            const updatedItems = [...prevItems];
            const existingItem = updatedItems[existingItemIndex];
            existingItem.quantity += item.quantity;
            existingItem.totalPrice += item.totalPrice; // Simply add the new total price
            return updatedItems;
        } else {
            // Add new item
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
            // Re-implement the same pricing logic from the product page
            const { basePrice, variations } = item.product;
            const baseQuantity = variations.quantities[0] || 1;
            
            // Avoid division by zero
            const safeBaseQuantity = baseQuantity > 0 ? baseQuantity : 1;
            
            // Calculate a discount factor that increases with quantity
            const discountFactor = Math.log10(newQuantity / safeBaseQuantity + 1) / 2;
            
            // Calculate price per unit with discount, ensuring it doesn't go below a certain threshold
            const pricePerUnit = (basePrice / safeBaseQuantity) * (1 - Math.min(discountFactor, 0.75)); // Cap discount at 75%

            const newTotalPrice = pricePerUnit * newQuantity;

            return { ...item, quantity: newQuantity, totalPrice: newTotalPrice };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };


  const clearCart = () => {
    setCartItems([]);
  };
  
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

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
