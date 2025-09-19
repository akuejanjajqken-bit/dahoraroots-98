import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
  };
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state: authState } = useAuth();

  const fetchCart = async () => {
    if (!authState.isAuthenticated || !authState.user) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('cart')
        .select(`
          id,
          user_id,
          product_id,
          quantity,
          created_at,
          products:product_id (
            id,
            name,
            price,
            image_url
          )
        `)
        .eq('user_id', authState.user.id);

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to match our interface
      const transformedItems = (data || []).map(item => ({
        ...item,
        product: item.products ? {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          image_url: item.products.image_url,
        } : undefined,
        products: undefined, // Remove the nested products field
      }));

      setCartItems(transformedItems);
    } catch (err: any) {
      console.error('Error fetching cart:', err);
      setError(err.message || 'Erro ao carregar carrinho');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!authState.isAuthenticated || !authState.user) {
      toast.error('Faça login para adicionar itens ao carrinho');
      return { error: 'Usuário não autenticado' };
    }

    try {
      // Check if item already exists in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', authState.user.id)
        .eq('product_id', productId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingItem) {
        // Update existing item
        const { error: updateError } = await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Add new item
        const { error: insertError } = await supabase
          .from('cart')
          .insert({
            user_id: authState.user.id,
            product_id: productId,
            quantity,
          });

        if (insertError) {
          throw insertError;
        }
      }

      toast.success('Item adicionado ao carrinho');
      await fetchCart(); // Refresh cart
      return {};
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      const errorMessage = err.message || 'Erro ao adicionar item ao carrinho';
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!authState.isAuthenticated) {
      return { error: 'Usuário não autenticado' };
    }

    try {
      const { error: deleteError } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', authState.user!.id);

      if (deleteError) {
        throw deleteError;
      }

      toast.success('Item removido do carrinho');
      await fetchCart(); // Refresh cart
      return {};
    } catch (err: any) {
      console.error('Error removing from cart:', err);
      const errorMessage = err.message || 'Erro ao remover item do carrinho';
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  };

  const updateCartItem = async (cartItemId: string, newQuantity: number) => {
    if (!authState.isAuthenticated) {
      return { error: 'Usuário não autenticado' };
    }

    try {
      if (newQuantity <= 0) {
        return await removeFromCart(cartItemId);
      }

      const { error: updateError } = await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId)
        .eq('user_id', authState.user!.id);

      if (updateError) {
        throw updateError;
      }

      await fetchCart(); // Refresh cart
      return {};
    } catch (err: any) {
      console.error('Error updating cart item:', err);
      const errorMessage = err.message || 'Erro ao atualizar item do carrinho';
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  };

  const clearCart = async () => {
    if (!authState.isAuthenticated) {
      return { error: 'Usuário não autenticado' };
    }

    try {
      const { error: deleteError } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', authState.user!.id);

      if (deleteError) {
        throw deleteError;
      }

      setCartItems([]);
      toast.success('Carrinho limpo');
      return {};
    } catch (err: any) {
      console.error('Error clearing cart:', err);
      const errorMessage = err.message || 'Erro ao limpar carrinho';
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    fetchCart();
  }, [authState.isAuthenticated, authState.user]);

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    cartItems,
    isLoading,
    error,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    refetch: fetchCart,
  };
}