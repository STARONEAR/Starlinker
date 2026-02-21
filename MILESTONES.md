# STARLINKER MILESTONES

## Overview

This document outlines the phased development plan for Starlinker, designed for a solo builder with realistic timelines and clear success criteria.

---

## MILESTONE 0: Foundation (Week 1)

### Goal
Establish project infrastructure, database schema, and core authentication.

### Features Included
- Next.js project scaffold with App Router
- Supabase project setup and configuration
- Complete database schema with RLS policies
- Authentication system (email/password)
- Material UI theme (dark premium)
- TailwindCSS configuration with glass effects
- Environment configuration
- Type generation from Supabase

### Deliverables
- `/app` folder structure complete
- `/lib/supabase` client setup
- `/styles/theme.ts` with M3 design tokens
- `supabase/migrations/001_initial_schema.sql`
- `.env.local.example` with all required variables
- Basic layout with providers

### Success Criteria
- ✅ Project builds without errors on Vercel
- ✅ Supabase SQL executes cleanly
- ✅ User can sign up and log in
- ✅ Dark theme renders correctly
- ✅ TypeScript strict mode passes
- ✅ Mobile viewport renders properly

### Dependencies
- Supabase account created
- Vercel account ready
- Domain/subdomain configured (optional)

### Risk Notes
- Supabase free tier limits (monitor usage)
- Material UI v6 compatibility issues (use stable version)

### Time Estimate
5-7 days

---

## MILESTONE 1: Core UI & Navigation (Week 2)

### Goal
Build the main navigation structure and reusable UI components.

### Features Included
- Bottom navigation (Home, Services, Shop, AI, Orders, Profile)
- Top bar with logo and user menu
- Floating AI bubble (UI only, no logic)
- Glass card components
- Button variants (primary, secondary, ghost)
- Input components with validation states
- Badge components (status, condition)
- Empty states with placeholders
- Loading skeletons
- Guest vs authenticated views

### Deliverables
- `/components/layout/BottomNav.tsx`
- `/components/layout/TopBar.tsx`
- `/components/layout/FloatingAI.tsx`
- `/components/ui/GlassCard.tsx`
- `/components/ui/Button.tsx`
- `/components/ui/Input.tsx`
- `/components/ui/Badge.tsx`
- `/app/(main)/layout.tsx` with navigation
- `/app/(auth)/layout.tsx` for auth pages

### Success Criteria
- ✅ Navigation works on mobile and desktop
- ✅ Active tab highlights correctly
- ✅ Glass effects render with blur
- ✅ Components are accessible (ARIA labels)
- ✅ Guest users see sign-up prompts
- ✅ Authenticated users see profile menu

### Dependencies
- Milestone 0 complete
- Icon library installed (Lucide)

### Risk Notes
- Bottom nav may conflict with browser UI on iOS (test thoroughly)
- Glass effects may perform poorly on low-end devices

### Time Estimate
4-5 days

---

## MILESTONE 2: Services Module (Week 3)

### Goal
Implement complete service booking flow from discovery to confirmation.

### Features Included
- Services listing page with categories
- Service detail page with pricing
- Booking form (date, time, location)
- Price estimation logic
- Express vs standard booking options
- Booking confirmation page
- User bookings list
- Booking status badges

### Deliverables
- `/app/(main)/services/page.tsx`
- `/app/(main)/services/[id]/page.tsx`
- `/app/(main)/services/[id]/book/page.tsx`
- `/components/services/ServiceCard.tsx`
- `/components/services/BookingForm.tsx`
- `/lib/utils/pricing.ts`
- Database: services, bookings tables populated

### Success Criteria
- ✅ User can browse services by category
- ✅ Service details show accurate pricing
- ✅ Booking form validates all inputs
- ✅ Location can be entered manually
- ✅ Booking creates database record
- ✅ User sees booking in orders list
- ✅ Email confirmation sent (basic)

### Dependencies
- Milestone 1 complete
- Email service configured (Mailgun)

### Risk Notes
- Calendar/date picker UX on mobile
- Location input without maps API (Phase 1)

### Time Estimate
6-7 days

---

## MILESTONE 3: Marketplace Module (Week 4)

### Goal
Build product listing, detail pages, and basic cart functionality.

### Features Included
- Shop page with New/Used tabs
- Product grid with filters
- Product detail page
- Condition badges (new, like new, used, refurbished)
- Stock indicators
- Image gallery with zoom
- Seller profile preview
- Add to cart functionality
- Cart page with checkout
- Order creation

### Deliverables
- `/app/(main)/shop/page.tsx`
- `/app/(main)/shop/[id]/page.tsx`
- `/components/shop/ProductCard.tsx`
- `/components/shop/ProductGrid.tsx`
- `/components/shop/ConditionBadge.tsx`
- `/components/shop/CartButton.tsx`
- `/app/(main)/cart/page.tsx`
- Database: products, orders, order_items populated

### Success Criteria
- ✅ Products display with correct condition
- ✅ Filters work (new/used, category, location)
- ✅ User can add items to cart
- ✅ Cart persists across sessions
- ✅ Checkout creates order record
- ✅ Seller location visible on product
- ✅ Stock quantity updates on purchase

### Dependencies
- Milestone 1 complete
- Supabase Storage configured for images

### Risk Notes
- Image upload size limits
- Cart state management (use Supabase or local storage)

### Time Estimate
7-8 days

---

## MILESTONE 4: Live Chat System (Week 5)

### Goal
Implement real-time buyer-seller messaging with Supabase Realtime.

### Features Included
- Chat initiation from product page
- Real-time message delivery
- Message list with sender/receiver styling
- Message input with send button
- Read receipts
- Image attachment support
- Chat list page showing all conversations
- Unread message indicators
- Phone number exchange option

### Deliverables
- `/app/(main)/chats/page.tsx`
- `/app/(main)/chats/[id]/page.tsx`
- `/components/chat/ChatWindow.tsx`
- `/components/chat/MessageList.tsx`
- `/components/chat/MessageInput.tsx`
- `/components/chat/AttachmentPreview.tsx`
- `/lib/hooks/useChat.ts`
- `/lib/hooks/useRealtime.ts`
- Database: chats, messages tables active

### Success Criteria
- ✅ Messages appear instantly for both parties
- ✅ Chat works without page refresh
- ✅ Images can be sent and viewed
- ✅ Read status updates in real-time
- ✅ Chat list shows latest message preview
- ✅ Unread count displays correctly
- ✅ Users can share phone numbers

### Dependencies
- Milestone 3 complete
- Supabase Realtime enabled

### Risk Notes
- Realtime connection stability
- Message pagination for long conversations
- Attachment storage costs

### Time Estimate
6-7 days

---

## MILESTONE 5: Delivery System (Week 6)

### Goal
Implement manual delivery workflow with tracking for both parties.

### Features Included
- Delivery request button (buyer)
- Delivery confirmation (seller)
- Manual rider assignment form
- Delivery timeline component
- Status updates (pending, confirmed, picked up, in transit, delivered)
- Proof of delivery upload
- Delivery details page
- Real-time status updates

### Deliverables
- `/components/delivery/DeliveryTimeline.tsx`
- `/components/delivery/RiderInfo.tsx`
- `/components/delivery/ProofUpload.tsx`
- `/app/(main)/orders/[id]/delivery/page.tsx`
- Database: deliveries table active
- Realtime subscription for delivery updates

### Success Criteria
- ✅ Buyer can request delivery from order
- ✅ Seller receives notification and can confirm
- ✅ Rider info can be manually entered
- ✅ Both parties see same timeline
- ✅ Status updates in real-time
- ✅ Proof image uploads successfully
- ✅ Delivery marks order as complete

### Dependencies
- Milestone 3 complete (orders exist)
- Supabase Storage for proof images

### Risk Notes
- Manual process prone to human error
- No automated rider dispatch (Phase 1 limitation)

### Time Estimate
5-6 days

---

## MILESTONE 6: Orders & Tracking (Week 7)

### Goal
Unified order management for bookings and purchases with real-time tracking.

### Features Included
- Orders list page (all types)
- Order detail page with timeline
- Status badges (pending, confirmed, in progress, completed, cancelled)
- Technician assignment display (for bookings)
- Payment status indicators
- Order filtering (bookings, purchases, all)
- Cancel order functionality
- Order history

### Deliverables
- `/app/(main)/orders/page.tsx`
- `/app/(main)/orders/[id]/page.tsx`
- `/components/orders/OrderCard.tsx`
- `/components/orders/OrderTimeline.tsx`
- `/components/orders/StatusBadge.tsx`
- Realtime subscriptions for order updates

### Success Criteria
- ✅ All orders display in unified list
- ✅ Order details show complete information
- ✅ Timeline reflects current status
- ✅ Status updates appear in real-time
- ✅ User can cancel pending orders
- ✅ Technician info visible for bookings
- ✅ Delivery info visible for purchases

### Dependencies
- Milestone 2 (bookings) and 3 (orders) complete
- Milestone 5 (delivery) complete

### Risk Notes
- Complex state management for different order types
- Realtime subscription management

### Time Estimate
5-6 days

---

## MILESTONE 7: AI Assistant (Week 8-9)

### Goal
Implement AI-powered assistant with context memory and tool calling.

### Features Included
- AI chat interface (dedicated page)
- Floating AI bubble (functional)
- Context memory storage
- Service recommendation tool
- Product finder tool
- Price estimation tool
- FAQ responses
- Conversation history
- AI provider abstraction layer
- Rate limiting

### Deliverables
- `/app/(main)/ai/page.tsx`
- `/components/ai/AIChat.tsx`
- `/components/ai/AIBubble.tsx`
- `/components/ai/SuggestionChip.tsx`
- `/lib/ai/client.ts`
- `/lib/ai/tools.ts`
- `/lib/ai/memory.ts`
- `/app/api/ai/route.ts`
- Database: ai_conversations table active

### Success Criteria
- ✅ AI responds to user queries
- ✅ Context persists across sessions
- ✅ AI can recommend services
- ✅ AI can find products
- ✅ AI can estimate prices
- ✅ Floating bubble accessible globally
- ✅ Rate limiting prevents abuse
- ✅ Provider can be switched via env var

### Dependencies
- All previous milestones (AI needs access to data)
- AI provider API key configured

### Risk Notes
- AI API costs (implement token budgets)
- Response latency (use streaming)
- Tool calling reliability

### Time Estimate
8-10 days

---

## MILESTONE 8: Admin Dashboard (Week 10)

### Goal
Build functional admin interface for platform management.

### Features Included
- Admin authentication check
- Dashboard overview (stats)
- Service management (CRUD)
- Product management (CRUD)
- Booking oversight (view, assign technicians)
- Delivery management (view, update status)
- Chat moderation (view all chats)
- AI logs viewer
- Basic revenue analytics
- User management

### Deliverables
- `/app/admin/layout.tsx`
- `/app/admin/dashboard/page.tsx`
- `/app/admin/services/page.tsx`
- `/app/admin/products/page.tsx`
- `/app/admin/bookings/page.tsx`
- `/app/admin/deliveries/page.tsx`
- `/app/admin/chats/page.tsx`
- `/app/admin/ai-logs/page.tsx`
- Admin role enforcement in RLS

### Success Criteria
- ✅ Only admin role can access
- ✅ Dashboard shows key metrics
- ✅ Admin can create/edit services
- ✅ Admin can manage products
- ✅ Admin can assign technicians
- ✅ Admin can view all chats
- ✅ Admin can see AI conversation logs
- ✅ Basic analytics display correctly

### Dependencies
- All previous milestones complete
- Admin user created in database

### Risk Notes
- Admin UI can be simple (not customer-facing)
- Analytics queries may be slow (add indexes)

### Time Estimate
6-7 days

---

## MILESTONE 9: Profile & Reviews (Week 11)

### Goal
User profile management and review system.

### Features Included
- User profile page
- Profile editing (name, phone, avatar)
- Avatar upload
- Order history
- Booking history
- Review submission (for completed orders/bookings)
- Review display on products/services
- Rating aggregation
- Seller/technician profiles

### Deliverables
- `/app/(main)/profile/page.tsx`
- `/app/(main)/profile/edit/page.tsx`
- `/components/profile/AvatarUpload.tsx`
- `/components/reviews/ReviewForm.tsx`
- `/components/reviews/ReviewCard.tsx`
- Database: reviews table active

### Success Criteria
- ✅ User can update profile info
- ✅ Avatar uploads and displays
- ✅ User can submit reviews
- ✅ Reviews display on products/services
- ✅ Average rating calculates correctly
- ✅ Only completed orders can be reviewed
- ✅ One review per order/booking

### Dependencies
- Milestone 6 complete (orders)
- Supabase Storage for avatars

### Risk Notes
- Review spam prevention
- Image moderation (manual for Phase 1)

### Time Estimate
5-6 days

---

## MILESTONE 10: Polish & Production (Week 12)

### Goal
Final optimizations, testing, and production deployment.

### Features Included
- Email notification templates (all triggers)
- Error boundaries and fallbacks
- Loading states optimization
- Image optimization (WebP, lazy loading)
- SEO meta tags
- Performance audit (Lighthouse)
- Mobile testing (iOS/Android)
- Security audit (RLS policies)
- Production environment setup
- Documentation (README, API docs)

### Deliverables
- `/lib/email/templates.ts` (all templates)
- Error boundaries in layouts
- Optimized images in `/public`
- Meta tags in all pages
- Production `.env` configured
- `README.md` with setup instructions
- Lighthouse score >90

### Success Criteria
- ✅ All email notifications work
- ✅ No console errors in production
- ✅ Lighthouse performance >90
- ✅ Mobile UI tested on real devices
- ✅ All RLS policies verified
- ✅ Production deployment successful
- ✅ Documentation complete

### Dependencies
- All previous milestones complete
- Production Supabase project ready
- Production domain configured

### Risk Notes
- Email deliverability (test thoroughly)
- Performance on low-end devices
- Production secrets management

### Time Estimate
5-7 days

---

## PHASE 2: Enhancements (Post-MVP)

### Features to Add Later
- Google Maps integration for location
- Payment gateway integration (Stripe/Paystack)
- Push notifications (web/mobile)
- Voice chat in messaging
- Advanced search with filters
- Wishlist functionality
- Referral system
- Multi-language support
- Dark/light theme toggle
- Technician availability calendar
- Automated courier API integration
- Advanced analytics dashboard
- Mobile app (React Native)

### Time Estimate
8-12 weeks (prioritize based on user feedback)

---

## PHASE 3: Scale & Optimize (Future)

### Features for Growth
- Microservices architecture
- CDN for static assets
- Redis caching layer
- Elasticsearch for search
- Video chat support
- AI voice assistant
- Blockchain payment options
- Franchise/multi-location support
- White-label solution
- API for third-party integrations

### Time Estimate
6+ months

---

## SUMMARY

**Total MVP Timeline:** 12 weeks (3 months)

**Critical Path:**
M0 → M1 → M2 (Services) → M3 (Shop) → M4 (Chat) → M5 (Delivery) → M6 (Orders) → M7 (AI) → M8 (Admin) → M9 (Profile) → M10 (Polish)

**Parallel Work Opportunities:**
- M2 and M3 can partially overlap (both need M1)
- M8 (Admin) can be built alongside M7 (AI)
- M9 (Profile) can be built alongside M8 (Admin)

**Resource Requirements:**
- 1 full-stack developer (solo builder)
- Supabase free tier (upgrade if needed)
- Vercel hobby tier (upgrade for production)
- AI API credits ($50-100/month estimated)
- Mailgun free tier (100 emails/day)

**Risk Mitigation:**
- Build in order, don't skip milestones
- Test on real mobile devices weekly
- Monitor Supabase usage daily
- Keep AI costs under control with rate limits
- Have rollback plan for each deployment

---

**Milestone Plan Status:** ✅ COMPLETE
**Next Step:** STEP 3 - Generate Database SQL
