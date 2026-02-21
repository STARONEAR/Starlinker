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
          user_id: string
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          delivery_address: string
          delivery_city: string
          delivery_state: string
          delivery_zip: string
          delivery_phone: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_at_time: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      deliveries: {
        Row: {
          id: string
          order_id: string
          status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'failed'
          current_location: string | null
          estimated_delivery: string | null
          delivered_at: string | null
          proof_of_delivery_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['deliveries']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['deliveries']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          order_id: string
          reviewer_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          message: string
          response: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ai_conversations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ai_conversations']['Insert']>
      }
      chats: {
        Row: {
          id: string
          buyer_id: string
          seller_id: string
          product_id: string | null
          last_message: string | null
          last_message_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['chats']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['chats']['Insert']>
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          content: string
          attachment_url: string | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
    }
    Enums: {
      delivery_status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'failed'
    }
  }
}
