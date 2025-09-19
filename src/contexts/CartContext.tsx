import React, { createContext, useContext, ReactNode } from 'react';
import { useCart as useSupabaseCart } from '@/hooks/useCart';

// Export the Product type for compatibility
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating?: number;
  reviews?: number;
  badge?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

// Adapter to transform Supabase cart data to our interface
const transformCartData = (supabaseCart: ReturnType<typeof useSupabaseCart>) => {
  const items: CartItem[] = supabaseCart.cartItems.map(item => ({
    id: item.product_id,
    name: item.product?.name || '',
    price: item.product?.price || 0,
    image: item.product?.image_url || '',
    category: '',
    description: '',
    quantity: item.quantity,
  }));

  return {
    state: {
      items,
      total: supabaseCart.cartTotal,
      itemCount: supabaseCart.cartCount,
      isOpen: false, // This will be managed separately
    },
    addItem: (product: Product) => supabaseCart.addToCart(product.id, 1),
    removeItem: (id: string) => {
      const cartItem = supabaseCart.cartItems.find(item => item.product_id === id);
      if (cartItem) {
        supabaseCart.removeFromCart(cartItem.id);
      }
    },
    updateQuantity: (id: string, quantity: number) => {
      const cartItem = supabaseCart.cartItems.find(item => item.product_id === id);
      if (cartItem) {
        supabaseCart.updateCartItem(cartItem.id, quantity);
      }
    },
    clearCart: () => supabaseCart.clearCart(),
    toggleCart: () => {}, // This will be managed by the cart sidebar component
    isLoading: supabaseCart.isLoading,
    error: supabaseCart.error,
  };
};

const CartContext = createContext<ReturnType<typeof transformCartData> | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const supabaseCart = useSupabaseCart();
  const cartData = transformCartData(supabaseCart);

  return (
    <CartContext.Provider value={cartData}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}