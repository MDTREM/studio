'use client';

import { CartItem, Product } from '@/lib/definitions';
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'totalPrice'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Lógica de cálculo de preço simplificada para exibição no cliente.
// O cálculo final e seguro é feito no servidor.
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

        if (existingItemIndex > -1) {
            const updatedItems = [...prevItems];
            const existingItem = updatedItems[existingItemIndex];
            const newQuantity = existingItem.quantity + item.quantity;
            existingItem.quantity = newQuantity;
            // O totalPrice será calculado no useMemo abaixo para exibição
            return updatedItems;
        } else {
            return [...prevItems, { ...item, totalPrice: 0 }]; // totalPrice é um placeholder
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

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
        // Calcula o preço para exibição aqui. O servidor fará o cálculo final.
        return total + getClientSidePrice(item.product, item.quantity);
    }, 0);
  }, [cartItems]);

  // Adiciona o totalPrice calculado para exibição aos itens do carrinho
  const cartItemsWithDisplayPrice = useMemo(() => {
      return cartItems.map(item => ({
          ...item,
          totalPrice: getClientSidePrice(item.product, item.quantity)
      }))
  }, [cartItems]);


  return (
    <CartContext.Provider value={{ cartItems: cartItemsWithDisplayPrice, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
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
