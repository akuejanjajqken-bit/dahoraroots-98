import { supabase } from '@/lib/supabase'

export const orderService = {
  async create(userId: string, cartItems: any[], total: number) {
    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) return { error }

    // Clear cart after order
    await supabase.from('cart').delete().eq('user_id', userId)

    return { data: order, error: null }
  },

  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  },

  async updateStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    return { data, error }
  }
}