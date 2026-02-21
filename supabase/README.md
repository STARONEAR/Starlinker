# STARLINKER DATABASE SCHEMA

## Overview

This directory contains all Supabase database migrations for the Starlinker platform.

## Files

- `001_initial_schema.sql` - Core database schema with tables, enums, indexes, RLS policies, and triggers
- `002_storage_config.sql` - Storage bucket configuration and policies

## Setup Instructions

### Option 1: Supabase Dashboard (Recommended for first-time setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `001_initial_schema.sql`
4. Click **Run**
5. Repeat for `002_storage_config.sql`

### Option 2: Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > types/database.ts
```

## Database Schema

### Core Tables

#### users
Extended user profiles linked to Supabase Auth.
- Stores role, profile info, avatar
- Automatically created on auth signup via trigger

#### services
Available installation and home services.
- Categories: Internet, Security, Electronics, Appliances, Smart Home
- Base pricing and duration

#### technicians
Technician profiles with service capabilities.
- Links to users table
- Tracks rating, verification status, availability

#### bookings
Service booking requests and assignments.
- Links users, services, and technicians
- Tracks status, scheduling, pricing, payment

#### products
Marketplace products (new and used).
- Seller listings with condition, stock, location
- Supports multiple images

#### orders
Product purchase orders.
- Links to buyers
- Tracks status, totals, payment

#### order_items
Individual items within orders.
- Links orders to products
- Stores quantity and price snapshot

#### chats
Chat conversations between buyers and sellers.
- Unique per buyer-seller-product combination
- Tracks last message for list view

#### messages
Individual messages within chats.
- Supports text and image attachments
- Read receipts

#### deliveries
Delivery tracking for orders.
- Manual workflow (Phase 1)
- Extensible for API integrations (Phase 2+)
- Tracks rider info, timeline, proof

#### reviews
Reviews for bookings, orders, products, and technicians.
- 1-5 star rating
- Optional comment

#### ai_conversations
AI assistant conversation history and context.
- Stores messages as JSONB
- Context memory for personalization

### Enums

- `user_role`: guest, user, seller, technician, admin
- `booking_status`: pending, confirmed, in_progress, completed, cancelled
- `order_status`: pending, confirmed, processing, shipped, delivered, cancelled
- `product_condition`: new, like_new, good, fair, refurbished
- `delivery_status`: pending, confirmed, picked_up, in_transit, delivered, failed
- `payment_status`: pending, paid, failed, refunded

### Storage Buckets

- `avatars` (public) - User profile pictures
- `products` (public) - Product images
- `services` (public) - Service category images
- `chat-attachments` (private) - Chat image attachments
- `delivery-proofs` (private) - Delivery proof images

## Row Level Security (RLS)

All tables have RLS enabled with policies that enforce:

- Users can only access their own data
- Sellers can manage their own products
- Buyers and sellers can both view shared orders
- Chat participants can view their conversations
- Admins have full access to all data
- Public can view active services and products

## Realtime Configuration

The following tables are enabled for Supabase Realtime:

- `messages` - Live chat
- `chats` - Chat list updates
- `orders` - Order status updates
- `bookings` - Booking status updates
- `deliveries` - Delivery tracking

## Triggers

### Auto-update timestamps
All tables with `updated_at` columns automatically update on modification.

### Auto-create user profile
When a user signs up via Supabase Auth, a profile is automatically created in `public.users`.

### Auto-update chat last message
When a new message is inserted, the parent chat's `last_message` and `last_message_at` are updated.

### Auto-update product stock
When an order item is created, the product's `stock_quantity` is decremented.

## Indexes

Comprehensive indexes are created on:
- Foreign keys
- Frequently queried fields (status, dates, categories)
- Composite indexes for complex queries
- Partial indexes for unread messages

## Type Generation

After running migrations, generate TypeScript types:

```bash
supabase gen types typescript --local > types/database.ts
```

Or for a remote project:

```bash
supabase gen types typescript --project-id your-project-ref > types/database.ts
```

## Seed Data

The schema includes sample services for development:
- Internet Installation
- CCTV Installation
- TV Wall Mount
- Appliance Installation
- Smart Home Setup

## Security Notes

1. **Never expose service role key** - Only use in server-side code
2. **RLS policies are enforced** - Even with service role, respect policies in application logic
3. **Validate all inputs** - RLS doesn't replace input validation
4. **Storage policies** - Files are organized by user/chat/order ID for security
5. **Admin role** - Carefully control who gets admin access

## Monitoring

Monitor these metrics in Supabase Dashboard:
- Database size and growth
- Query performance
- Realtime connections
- Storage usage
- RLS policy performance

## Backup Strategy

Supabase automatically backs up your database. For additional safety:
1. Enable Point-in-Time Recovery (PITR) in production
2. Export schema regularly
3. Test restore procedures

## Migration Best Practices

1. **Never modify existing migrations** - Create new ones
2. **Test locally first** - Use Supabase local development
3. **Backup before production migrations**
4. **Use transactions** - Migrations are wrapped in transactions by default
5. **Document changes** - Add comments to complex migrations

## Troubleshooting

### RLS Policy Issues
If queries fail unexpectedly, check:
```sql
-- View active policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Test policy as specific user
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = 'user-uuid';
```

### Performance Issues
```sql
-- Check slow queries
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;

-- Analyze table
ANALYZE your_table;

-- Check index usage
SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';
```

### Realtime Not Working
1. Check if table is added to publication: `ALTER PUBLICATION supabase_realtime ADD TABLE your_table;`
2. Verify RLS policies allow SELECT
3. Check Supabase Dashboard for realtime connection status

## Next Steps

After database setup:
1. Configure environment variables with Supabase credentials
2. Set up Supabase client in Next.js application
3. Generate and import TypeScript types
4. Test authentication flow
5. Implement first feature (services listing)

## Support

For issues:
- Check Supabase documentation: https://supabase.com/docs
- Review RLS policies in SQL files
- Test queries in Supabase SQL Editor
- Check application logs for detailed errors
