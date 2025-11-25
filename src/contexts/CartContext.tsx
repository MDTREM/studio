'use client';

import { CartItem } from '@/lib/definitions';
import { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
        // Check if a similar item already exists
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
            existingItem.totalPrice += item.totalPrice;
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

  const updateQuantity = (itemId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              // Recalculate price if necessary. This assumes a simple price * quantity logic.
              // A more complex pricing model would need the original price per unit.
              totalPrice: (item.totalPrice / item.quantity) * quantity,
            }
          : item
      )
    );
  };
  
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);


  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount }}>
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
