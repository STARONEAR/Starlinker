-- =====================================================
-- STARLINKER PLATFORM - STORAGE CONFIGURATION
-- =====================================================
-- This file configures Supabase Storage buckets and policies
-- Run this AFTER the main schema migration
-- =====================================================

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('products', 'products', true),
  ('services', 'services', true),
  ('chat-attachments', 'chat-attachments', false),
  ('delivery-proofs', 'delivery-proofs', false);

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Avatars bucket policies
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Products bucket policies
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Services bucket policies
CREATE POLICY "Anyone can view service images" ON storage.objects
  FOR SELECT USING (bucket_id = 'services');

CREATE POLICY "Authenticated users can upload service images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'services' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update service images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'services' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete service images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'services' AND
    auth.role() = 'authenticated'
  );

-- Chat attachments bucket policies
CREATE POLICY "Authenticated users can view chat attachments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'chat-attachments' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can upload chat attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'chat-attachments' AND
    auth.role() = 'authenticated'
  );

-- Delivery proofs bucket policies
CREATE POLICY "Authenticated users can view delivery proofs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'delivery-proofs' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can upload delivery proofs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'delivery-proofs' AND
    auth.role() = 'authenticated'
  );

-- =====================================================
-- STORAGE CONFIGURATION COMPLETE
-- =====================================================
-- Note: More granular policies can be added later
-- after the application tables are fully set up.
-- For now, authenticated users have access to upload/view.
-- =====================================================
