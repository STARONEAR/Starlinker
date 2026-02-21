-- =====================================================
-- STARLINKER PLATFORM - INITIAL SCHEMA
-- =====================================================
-- This migration creates all tables, enums, indexes, RLS policies,
-- and triggers needed for the Starlinker MVP.
-- 
-- Execute this in Supabase SQL Editor or via CLI:
-- supabase db push
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('guest', 'user', 'seller', 'technician', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE product_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'refurbished');
CREATE TYPE delivery_status AS ENUM ('pending', 'confirmed', 'picked_up', 'in_transit', 'delivered', 'failed');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- =====================================================
-- TABLES
-- =====================================================

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  location TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.users IS 'Extended user profiles linked to Supabase Auth';

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.services IS 'Available installation and home services';

-- Technicians table
CREATE TABLE public.technicians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  services TEXT[] NOT NULL DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

COMMENT ON TABLE public.technicians IS 'Technician profiles with service capabilities';

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  location TEXT NOT NULL,
  address_details TEXT,
  estimated_price DECIMAL(10,2) NOT NULL,
  final_price DECIMAL(10,2),
  is_express BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.bookings IS 'Service booking requests and assignments';

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  condition product_condition NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 1,
  location TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.products IS 'Marketplace products (new and used)';

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.orders IS 'Product purchase orders';

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.order_items IS 'Individual items within orders';

-- Chats table
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(buyer_id, seller_id, product_id)
);

COMMENT ON TABLE public.chats IS 'Chat conversations between buyers and sellers';

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.messages IS 'Individual messages within chats';

-- Deliveries table
CREATE TABLE public.deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status delivery_status NOT NULL DEFAULT 'pending',
  provider TEXT NOT NULL DEFAULT 'manual',
  external_id TEXT,
  tracking_url TEXT,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  rider_name TEXT,
  rider_phone TEXT,
  estimated_pickup TIMESTAMPTZ,
  actual_pickup TIMESTAMPTZ,
  estimated_delivery TIMESTAMPTZ,
  actual_delivery TIMESTAMPTZ,
  proof_url TEXT,
  notes TEXT,
  provider_metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(order_id)
);

COMMENT ON TABLE public.deliveries IS 'Delivery tracking for orders (manual and API-ready)';

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('booking', 'order', 'product', 'technician')),
  target_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.reviews IS 'Reviews for bookings, orders, products, and technicians';

-- AI Conversations table
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.ai_conversations IS 'AI assistant conversation history and context';

-- =====================================================
-- INDEXES
-- =====================================================

-- Users
CREATE INDEX idx_users_role ON public.users(role);

-- Services
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_services_active ON public.services(is_active);

-- Technicians
CREATE INDEX idx_technicians_user_id ON public.technicians(user_id);
CREATE INDEX idx_technicians_available ON public.technicians(is_available);

-- Bookings
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX idx_bookings_technician_id ON public.bookings(technician_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_date ON public.bookings(scheduled_date);

-- Products
CREATE INDEX idx_products_seller_id ON public.products(seller_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_condition ON public.products(condition);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);

-- Orders
CREATE INDEX idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Order Items
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX idx_order_items_seller_id ON public.order_items(seller_id);

-- Chats
CREATE INDEX idx_chats_buyer_id ON public.chats(buyer_id);
CREATE INDEX idx_chats_seller_id ON public.chats(seller_id);
CREATE INDEX idx_chats_product_id ON public.chats(product_id);
CREATE INDEX idx_chats_last_message_at ON public.chats(last_message_at DESC);

-- Messages
CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_unread ON public.messages(chat_id, is_read) WHERE is_read = false;

-- Deliveries
CREATE INDEX idx_deliveries_order_id ON public.deliveries(order_id);
CREATE INDEX idx_deliveries_status ON public.deliveries(status);

-- Reviews
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_target ON public.reviews(target_type, target_id);

-- AI Conversations
CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_updated_at ON public.ai_conversations(updated_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Services policies (public read, admin write)
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Technicians policies
CREATE POLICY "Anyone can view verified technicians" ON public.technicians
  FOR SELECT USING (is_verified = true);

CREATE POLICY "Technicians can update their own profile" ON public.technicians
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage technicians" ON public.technicians
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Technicians can view their assigned bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.technicians WHERE id = technician_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Products policies
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Sellers can create products" ON public.products
  FOR INSERT WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can update their own products" ON public.products
  FOR UPDATE USING (seller_id = auth.uid());

CREATE POLICY "Sellers can delete their own products" ON public.products
  FOR DELETE USING (seller_id = auth.uid());

CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Orders policies
CREATE POLICY "Buyers can view their own orders" ON public.orders
  FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Sellers can view orders with their products" ON public.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.order_items WHERE order_id = orders.id AND seller_id = auth.uid())
  );

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can update their own orders" ON public.orders
  FOR UPDATE USING (buyer_id = auth.uid());

CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND buyer_id = auth.uid())
    OR seller_id = auth.uid()
  );

CREATE POLICY "Users can create order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND buyer_id = auth.uid())
  );

CREATE POLICY "Admins can manage all order items" ON public.order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Chats policies
CREATE POLICY "Users can view their own chats" ON public.chats
  FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Users can create chats" ON public.chats
  FOR INSERT WITH CHECK (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Users can update their own chats" ON public.chats
  FOR UPDATE USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Admins can view all chats" ON public.chats
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Messages policies
CREATE POLICY "Users can view messages in their chats" ON public.messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chats WHERE id = chat_id AND (buyer_id = auth.uid() OR seller_id = auth.uid()))
  );

CREATE POLICY "Users can send messages in their chats" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.chats WHERE id = chat_id AND (buyer_id = auth.uid() OR seller_id = auth.uid()))
  );

CREATE POLICY "Users can update their own messages" ON public.messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.chats WHERE id = chat_id AND (buyer_id = auth.uid() OR seller_id = auth.uid()))
  );

CREATE POLICY "Admins can view all messages" ON public.messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Deliveries policies
CREATE POLICY "Users can view deliveries for their orders" ON public.deliveries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND buyer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.orders o JOIN public.order_items oi ON o.id = oi.order_id WHERE o.id = order_id AND oi.seller_id = auth.uid())
  );

CREATE POLICY "Users can create deliveries for their orders" ON public.deliveries
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND buyer_id = auth.uid())
  );

CREATE POLICY "Sellers can update deliveries for their orders" ON public.deliveries
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.orders o JOIN public.order_items oi ON o.id = oi.order_id WHERE o.id = order_id AND oi.seller_id = auth.uid())
  );

CREATE POLICY "Admins can manage all deliveries" ON public.deliveries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (user_id = auth.uid());

-- AI Conversations policies
CREATE POLICY "Users can view their own conversations" ON public.ai_conversations
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create conversations" ON public.ai_conversations
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can update their own conversations" ON public.ai_conversations
  FOR UPDATE USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Admins can view all conversations" ON public.ai_conversations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON public.technicians
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON public.deliveries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update chat last_message
CREATE OR REPLACE FUNCTION update_chat_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chats
  SET 
    last_message = NEW.content,
    last_message_at = NEW.created_at
  WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chat_on_new_message AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_chat_last_message();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update product stock on order
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_on_order AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION update_product_stock();

-- =====================================================
-- REALTIME CONFIGURATION
-- =====================================================

-- Enable realtime for chat and tracking tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deliveries;

-- =====================================================
-- SEED DATA (Optional - for development)
-- =====================================================

-- Insert sample services
INSERT INTO public.services (name, description, category, base_price, duration_minutes, is_active) VALUES
  ('Internet Installation', 'Professional fiber and broadband installation', 'Internet', 5000.00, 120, true),
  ('CCTV Installation', 'Security camera setup and configuration', 'Security', 15000.00, 180, true),
  ('TV Wall Mount', 'Professional TV mounting service', 'Electronics', 3000.00, 60, true),
  ('Appliance Installation', 'Installation of home appliances', 'Appliances', 4000.00, 90, true),
  ('Smart Home Setup', 'IoT device installation and configuration', 'Smart Home', 8000.00, 150, true);

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
-- Next steps:
-- 1. Run this migration in Supabase
-- 2. Generate TypeScript types: supabase gen types typescript
-- 3. Configure Storage buckets for images
-- 4. Set up Edge Functions for AI and email
-- =====================================================
