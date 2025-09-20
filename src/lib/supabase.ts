import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

const supabaseUrl = 'https://xfeuejiphvxeolklfhnx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZXVlamlwaHZ4ZW9sa2xmaG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyOTksImV4cCI6MjA3Mzg4NDI5OX0.f_auwLKPMczj9vUuwBvx8T5VAnZHFOZESlBwwbx3iqQ'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Type definitions matching EXISTING tables
export interface Profile {
  id: string
  user_id: string
  name: string | null
  phone: string | null
  cpf: string | null
  created_at: string
  last_login: string | null
  updated_at: string
}

export interface UserRole {
  user_id: string
  role: 'admin' | 'user'
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock: number | null
  category: string | null
  image_url: string | null
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number | null
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  total: number | null
  status: string | null
  created_at: string
}