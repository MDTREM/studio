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
        // Verifica se um item semelhante já existe (baseado no produto, formato e acabamento)
        const existingItemIndex = prevItems.findIndex(
            i => i.product.id === item.product.id && 
                 i.selectedFormat === item.selectedFormat && 
                 i.selectedFinishing === item.selectedFinishing
        );

        if (existingItemIndex > -1) {
            // Atualiza a quantidade do item existente
            const updatedItems = [...prevItems];
            const existingItem = updatedItems[existingItemIndex];
            existingItem.quantity += item.quantity;
            existingItem.totalPrice += item.totalPrice; // Simplesmente adiciona o novo preço total
            return updatedItems;
        } else {
            // Adiciona novo item
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
            // Reimplementa a mesma lógica de precificação da página do produto para consistência.
            const { basePrice, variations } = item.product;
            if (!basePrice || !variations || !variations.quantities || variations.quantities.length === 0) {
              // Se não houver dados de preço, não é possível calcular. Mantenha o item como está.
              return { ...item, quantity: newQuantity };
            }
            
            const baseQuantity = variations.quantities[0] || 1;
            const safeBaseQuantity = baseQuantity > 0 ? baseQuantity : 1;
            
            // Fator de desconto que aumenta com a quantidade
            const discountFactor = Math.log10(newQuantity / safeBaseQuantity + 1) / 2;
            
            // Preço por unidade com desconto, com um teto para o desconto
            const pricePerUnit = (basePrice / safeBaseQuantity) * (1 - Math.min(discountFactor, 0.75));

            const newTotalPrice = pricePerUnit * newQuantity;

            return { ...item, quantity: newQuantity, totalPrice: newTotalPrice };
        }
        return item;
      }).filter(item => item.quantity > 0) // Remove o item se a quantidade for 0
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
