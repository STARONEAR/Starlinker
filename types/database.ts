// TODO: Generate types from Supabase
// Run: supabase gen types typescript --project-id your-project-ref > types/database.ts

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          role: 'guest' | 'user' | 'seller' | 'technician' | 'admin'
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          location: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          base_price: number
          duration_minutes: number | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          service_id: string
          technician_id: string | null
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_date: string
          scheduled_time: string
          location: string
          address_details: string | null
          estimated_price: number
          final_price: number | null
          is_express: boolean
          notes: string | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      products: {
        Row: {
          id: string
          seller_id: string
          title: string
          description: string | null
          category: string
          condition: 'new' | 'like_new' | 'good' | 'fair' | 'refurbished'
          price: number
          stock_quantity: number
          location: string
          images: string[]
          is_active: boolean
          views: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      orders: {
        Row: {
          id: string
          buyer_id: string
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          subtotal: number
          delivery_fee: number
          total: number
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
    }
  }
}
