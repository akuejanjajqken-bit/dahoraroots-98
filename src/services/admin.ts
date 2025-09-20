import { supabase } from '@/lib/supabase'

export interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalProducts: number
  totalRevenue: number
}

export const adminService = {
  async getStats(): Promise<{ data: AdminStats | null; error: any }> {
    try {
      // Get total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      if (usersError) throw usersError

      // Get total orders count
      const { count: totalOrders, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      if (ordersError) throw ordersError

      // Get total products count
      const { count: totalProducts, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (productsError) throw productsError

      // Get total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('orders')
        .select('total')
        .not('total', 'is', null)

      if (revenueError) throw revenueError

      const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

      const stats: AdminStats = {
        totalUsers: totalUsers || 0,
        totalOrders: totalOrders || 0,
        totalProducts: totalProducts || 0,
        totalRevenue
      }

      return { data: stats, error: null }
    } catch (error: any) {
      console.error('Error fetching admin stats:', error)
      return { data: null, error }
    }
  }
}