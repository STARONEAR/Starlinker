# STARLINKER PLATFORM BLUEPRINT

## PRODUCT VISION

Starlinker is a dark premium AI-first marketplace that bridges the gap between home service installation and product commerce. It empowers users to seamlessly book technicians, purchase new/used products, negotiate with sellers, and track deliveries—all within a futuristic, mobile-first interface powered by intelligent assistance.

**Core Value Propositions:**
- Unified platform for services + products
- AI-guided discovery and troubleshooting
- Real-time communication between all parties
- Transparent delivery tracking
- Premium dark aesthetic that builds trust

**Target Users:**
- Homeowners needing installation services
- Buyers seeking new/used products (including vehicles)
- Sellers and technicians offering services
- Admins managing the ecosystem

---

## USER FLOWS

### 1. Guest Browse Flow
```
Landing → Browse Services/Products → View Details → Sign Up Prompt → Register → Complete Action
```

### 2. Service Booking Flow
```
Home → Services Tab → Select Service → Choose Date/Time → Add Location → 
Price Estimate → Express/Standard → Confirm → Technician Assigned → 
Track Status → Service Complete → Review
```

### 3. Product Purchase Flow (New/Used)
```
Shop Tab → Filter (New/Used) → Product Card → View Details → 
Chat with Seller (optional) → Add to Cart / Buy Now → 
Request Delivery → Seller Confirms → Track Delivery → 
Proof of Delivery → Review
```

### 4. Live Chat Flow
```
Product/Service Detail → Chat Button → Realtime Chat → 
Exchange Messages/Images → Share Phone (optional) → 
Proceed to Order
```

### 5. AI Assistant Flow
```
Floating Bubble (any page) → Ask Question → 
AI Responds (with context memory) → Suggest Service/Product → 
Navigate to Recommendation → Complete Action
```

### 6. Delivery Request Flow
```
Order Placed → Buyer Requests Delivery → Seller Confirms Ready → 
Manual Rider Assignment → Both See Timeline → 
Rider Picks Up → In Transit → Proof Upload → Delivered
```

---

## ARCHITECTURE OVERVIEW

### Technology Stack

**Frontend:**
- Next.js 14+ (App Router, TypeScript)
- React Server Components (default)
- Material UI v6 (Material 3 design)
- TailwindCSS (layout, glass effects)
- Lucide/Phosphor icons

**Backend:**
- Supabase Postgres (database)
- Supabase Auth (authentication)
- Supabase Realtime (chat, tracking)
- Supabase Storage (images, attachments)
- Supabase Edge Functions (AI orchestration, webhooks)

**External Services:**
- Mailgun (email notifications)
- AI Provider (abstracted, configurable)

**Deployment:**
- Vercel (frontend + serverless)
- Supabase Cloud (backend)

### Architecture Principles

1. **Mobile-First:** All UI designed for mobile, scales up
2. **Server-First:** Use RSC by default, client components only when needed
3. **Type-Safe:** Strict TypeScript, generated Supabase types
4. **Realtime-Ready:** Leverage Supabase subscriptions for live updates
5. **Modular:** Feature-based folder structure
6. **Secure:** RLS policies, role-based access
7. **Scalable:** Designed for future API integrations

---

## FOLDER STRUCTURE

```
starlinker/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── layout.tsx              # Bottom nav wrapper
│   │   ├── page.tsx                # Home
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── book/page.tsx
│   │   ├── shop/
│   │   │   ├── page.tsx            # New/Used tabs
│   │   │   └── [id]/page.tsx
│   │   ├── ai/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── services/page.tsx
│   │   ├── products/page.tsx
│   │   ├── bookings/page.tsx
│   │   ├── deliveries/page.tsx
│   │   ├── chats/page.tsx
│   │   └── ai-logs/page.tsx
│   ├── api/
│   │   ├── ai/route.ts             # AI proxy endpoint
│   │   ├── webhooks/
│   │   │   └── supabase/route.ts
│   │   └── email/route.ts
│   ├── layout.tsx                  # Root layout
│   └── providers.tsx
├── components/
│   ├── ui/                         # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── GlassCard.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── BottomNav.tsx
│   │   ├── TopBar.tsx
│   │   └── FloatingAI.tsx
│   ├── services/
│   │   ├── ServiceCard.tsx
│   │   ├── BookingForm.tsx
│   │   └── TechnicianCard.tsx
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ConditionBadge.tsx
│   │   └── CartButton.tsx
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   └── AttachmentPreview.tsx
│   ├── ai/
│   │   ├── AIChat.tsx
│   │   ├── AIBubble.tsx
│   │   └── SuggestionChip.tsx
│   ├── delivery/
│   │   ├── DeliveryTimeline.tsx
│   │   ├── RiderInfo.tsx
│   │   └── ProofUpload.tsx
│   └── orders/
│       ├── OrderCard.tsx
│       ├── OrderTimeline.tsx
│       └── StatusBadge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client
│   │   ├── middleware.ts
│   │   └── types.ts                # Generated types
│   ├── ai/
│   │   ├── client.ts               # AI abstraction layer
│   │   ├── tools.ts                # Tool definitions
│   │   └── memory.ts               # Context management
│   ├── email/
│   │   ├── client.ts               # Mailgun abstraction
│   │   └── templates.ts
│   ├── utils/
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   └── hooks/
│       ├── useAuth.ts
│       ├── useRealtime.ts
│       ├── useChat.ts
│       └── useAI.ts
├── styles/
│   ├── globals.css
│   └── theme.ts                    # MUI theme config
├── types/
│   ├── database.ts
│   ├── api.ts
│   └── index.ts
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   ├── functions/
│   │   ├── ai-orchestrator/
│   │   └── email-sender/
│   └── config.toml
├── public/
│   ├── images/
│   │   ├── hero/                   # Homepage hero backgrounds
│   │   ├── services/               # Service category thumbnails
│   │   ├── products/               # Product gallery
│   │   ├── avatars/                # User/technician photos
│   │   └── illustrations/          # AI empty states, delivery
│   └── icons/
├── .env.local.example
├── .env.production.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## DATA MODEL DIAGRAM

```
┌─────────────────┐
│   auth.users    │ (Supabase managed)
└────────┬────────┘
         │
         │ extends
         ▼
┌─────────────────┐
│  public.users   │
├─────────────────┤
│ id (FK)         │
│ role            │──────┐
│ full_name       │      │
│ phone           │      │
│ avatar_url      │      │
│ created_at      │      │
└─────────────────┘      │
         │               │
         │               │
    ┌────┴────┬──────────┴─────┬──────────────┬──────────────┐
    │         │                │              │              │
    ▼         ▼                ▼              ▼              ▼
┌─────────┐ ┌──────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐
│services │ │technicians│  │products │  │ bookings │  │  orders  │
├─────────┤ ├──────────┤  ├─────────┤  ├──────────┤  ├──────────┤
│ id      │ │ id       │  │ id      │  │ id       │  │ id       │
│ name    │ │ user_id  │  │ seller  │  │ user_id  │  │ buyer_id │
│ category│ │ services │  │ title   │  │ service  │  │ status   │
│ price   │ │ rating   │  │ price   │  │ tech_id  │  │ total    │
│ duration│ │ verified │  │ condition│ │ status   │  │ created  │
│ active  │ └──────────┘  │ stock   │  │ date     │  └────┬─────┘
└─────────┘               │ location│  │ location │       │
                          │ images  │  │ price    │       │
                          └────┬────┘  └──────────┘       │
                               │                          │
                               │                          ▼
                               │                   ┌──────────────┐
                               │                   │ order_items  │
                               │                   ├──────────────┤
                               │                   │ id           │
                               │                   │ order_id     │
                               │                   │ product_id   │
                               │                   │ quantity     │
                               │                   │ price        │
                               │                   └──────────────┘
                               │
                               ▼
                          ┌─────────┐
                          │  chats  │
                          ├─────────┤
                          │ id      │
                          │ buyer   │
                          │ seller  │
                          │ product │
                          │ created │
                          └────┬────┘
                               │
                               ▼
                          ┌──────────┐
                          │ messages │
                          ├──────────┤
                          │ id       │
                          │ chat_id  │
                          │ sender   │
                          │ content  │
                          │ read_at  │
                          │ created  │
                          └──────────┘

┌──────────────┐         ┌──────────────────┐
│  deliveries  │         │ ai_conversations │
├──────────────┤         ├──────────────────┤
│ id           │         │ id               │
│ order_id     │         │ user_id          │
│ status       │         │ messages         │
│ rider_name   │         │ context          │
│ rider_phone  │         │ created_at       │
│ pickup_time  │         │ updated_at       │
│ delivery_time│         └──────────────────┘
│ proof_url    │
└──────────────┘

┌──────────┐
│ reviews  │
├──────────┤
│ id       │
│ user_id  │
│ target   │ (booking/order/product)
│ rating   │
│ comment  │
│ created  │
└──────────┘
```

### Key Relationships

- **users** → bookings (1:N)
- **users** → orders (1:N as buyer)
- **users** → products (1:N as seller)
- **technicians** → bookings (1:N)
- **services** → bookings (1:N)
- **products** → order_items (1:N)
- **orders** → order_items (1:N)
- **orders** → deliveries (1:1)
- **chats** → messages (1:N)
- **users** → ai_conversations (1:N)

---

## REALTIME STRATEGY

### Supabase Realtime Channels

**1. Chat Messages**
```typescript
// Subscribe to new messages in a chat
supabase
  .channel(`chat:${chatId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `chat_id=eq.${chatId}`
  }, handleNewMessage)
  .subscribe()
```

**2. Order Status Updates**
```typescript
// Buyer and seller both subscribe
supabase
  .channel(`order:${orderId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders',
    filter: `id=eq.${orderId}`
  }, handleOrderUpdate)
  .subscribe()
```

**3. Delivery Tracking**
```typescript
// Real-time delivery status
supabase
  .channel(`delivery:${deliveryId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'deliveries',
    filter: `id=eq.${deliveryId}`
  }, handleDeliveryUpdate)
  .subscribe()
```

**4. Booking Status**
```typescript
// Technician assignment and status changes
supabase
  .channel(`booking:${bookingId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'bookings',
    filter: `id=eq.${bookingId}`
  }, handleBookingUpdate)
  .subscribe()
```

### Performance Considerations

- Use presence for online/offline status (Phase 2)
- Implement message pagination (load last 50, fetch more on scroll)
- Unsubscribe from channels when components unmount
- Use broadcast for typing indicators (Phase 2)
- Debounce read receipts to reduce DB writes

---

## AI ORCHESTRATION PLAN

### Architecture

```
User Input → Next.js API Route → Supabase Edge Function → AI Provider → Response
                                        ↓
                                  Context Retrieval
                                  (ai_conversations table)
```

### AI Capabilities

**1. Service Recommendation**
- Input: User describes problem
- Output: Suggested service + estimated price
- Tools: Query services table, calculate based on location

**2. Product Finder**
- Input: User describes need
- Output: Matching products (new/used)
- Tools: Search products table, filter by condition/location

**3. Troubleshooting**
- Input: Technical issue description
- Output: Step-by-step guidance or service recommendation
- Tools: Knowledge base lookup, escalate to booking

**4. FAQ Automation**
- Input: Common questions
- Output: Instant answers
- Tools: Static knowledge base

### Context Memory Strategy

```typescript
// Store conversation in Supabase
interface AIConversation {
  id: string
  user_id: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  context: {
    last_service_viewed?: string
    last_product_viewed?: string
    location?: string
    preferences?: Record<string, any>
  }
  created_at: string
  updated_at: string
}
```

### Tool-Calling Architecture

```typescript
// Define tools for AI
const tools = [
  {
    name: 'search_services',
    description: 'Search available services by category or keyword',
    parameters: { category: 'string', location: 'string' }
  },
  {
    name: 'search_products',
    description: 'Find products by query, condition, and location',
    parameters: { query: 'string', condition: 'new|used', location: 'string' }
  },
  {
    name: 'get_price_estimate',
    description: 'Calculate service price based on location and service type',
    parameters: { service_id: 'string', location: 'string' }
  },
  {
    name: 'create_booking',
    description: 'Initiate a service booking',
    parameters: { service_id: 'string', date: 'string', location: 'string' }
  }
]
```

### Provider Abstraction

```typescript
// lib/ai/client.ts
interface AIProvider {
  chat(messages: Message[], tools?: Tool[]): Promise<AIResponse>
  stream(messages: Message[], tools?: Tool[]): AsyncIterator<AIChunk>
}

// Support multiple providers
const providers = {
  openai: OpenAIProvider,
  anthropic: AnthropicProvider,
  bedrock: BedrockProvider
}

// Configure via env
const ai = providers[process.env.AI_PROVIDER || 'openai']
```

---

## DELIVERY SYSTEM DESIGN

### Phase 1: Manual Workflow

**Database Schema:**
```sql
deliveries (
  id,
  order_id,
  status: 'pending' | 'confirmed' | 'picked_up' | 'in_transit' | 'delivered',
  rider_name,
  rider_phone,
  pickup_address,
  delivery_address,
  pickup_time,
  estimated_delivery,
  actual_delivery,
  proof_of_delivery_url,
  notes,
  created_at,
  updated_at
)
```

**Workflow:**
1. Buyer requests delivery (creates delivery record)
2. Seller confirms readiness (updates status to 'confirmed')
3. Admin/Seller manually assigns rider (updates rider info)
4. Rider picks up (status → 'picked_up')
5. In transit (status → 'in_transit')
6. Delivered + proof upload (status → 'delivered', proof_url)

**UI Components:**
- DeliveryRequestButton (buyer)
- DeliveryConfirmButton (seller)
- RiderAssignmentForm (seller/admin)
- DeliveryTimeline (both parties)
- ProofUploadForm (rider/seller)

### Phase 2+: API Integration Ready

**Extensible Design:**
```typescript
// lib/delivery/providers.ts
interface DeliveryProvider {
  createDelivery(params: DeliveryParams): Promise<DeliveryResponse>
  trackDelivery(id: string): Promise<TrackingInfo>
  cancelDelivery(id: string): Promise<void>
}

// Future providers
const providers = {
  manual: ManualDeliveryProvider,
  gig: GIGLogisticsProvider,      // Future
  kwik: KwikProvider,              // Future
  sendbox: SendboxProvider,        // Future
  uber: UberConnectProvider        // Future
}
```

**Database Extension:**
```sql
-- Add columns for API integration
ALTER TABLE deliveries ADD COLUMN provider VARCHAR(50) DEFAULT 'manual';
ALTER TABLE deliveries ADD COLUMN external_id VARCHAR(255);
ALTER TABLE deliveries ADD COLUMN tracking_url TEXT;
ALTER TABLE deliveries ADD COLUMN provider_metadata JSONB;
```

---

## SECURITY CONSIDERATIONS

### Row Level Security (RLS)

**Principle:** Users can only access their own data or public data.

**Key Policies:**

1. **Users Table**
   - Users can read their own profile
   - Users can update their own profile
   - Admins can read all profiles

2. **Products Table**
   - Anyone can read active products
   - Sellers can CRUD their own products
   - Admins can CRUD all products

3. **Orders Table**
   - Buyers can read their own orders
   - Sellers can read orders containing their products
   - Both can update specific fields (status, delivery)

4. **Chats/Messages**
   - Only chat participants can read/write messages
   - Admins can read all (moderation)

5. **Bookings**
   - Users can read their own bookings
   - Assigned technicians can read their bookings
   - Admins can read all

6. **AI Conversations**
   - Users can only access their own conversations
   - Admins can read all (for quality/safety)

### Authentication Flow

```
Guest → Browse (limited) → Sign Up Required → Email/Password or OAuth →
Email Verification → Role Assignment (user/seller/technician) → Full Access
```

### API Security

- All API routes validate Supabase JWT
- Rate limiting on AI endpoints
- File upload validation (type, size)
- Input sanitization on all forms
- CORS configuration for production domain

### Environment Variables

```bash
# Never commit these
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # Server-only
AI_PROVIDER_API_KEY=             # Server-only
MAILGUN_API_KEY=                 # Server-only
MAILGUN_DOMAIN=                  # Server-only
```

---

## PERFORMANCE STRATEGY

### Mobile-First Optimization

1. **Bundle Size**
   - Code splitting by route
   - Dynamic imports for heavy components (AI chat, admin)
   - Tree-shake unused MUI components
   - Optimize icon imports (import specific icons only)

2. **Image Optimization**
   - Use Next.js Image component
   - WebP format with fallbacks
   - Lazy loading below fold
   - Responsive srcsets
   - Placeholder blur (base64)

3. **Data Fetching**
   - Server components for initial data
   - Streaming for slow queries
   - Pagination (20 items per page)
   - Infinite scroll for feeds
   - Optimistic updates for interactions

4. **Caching Strategy**
   - Static pages: ISR with 60s revalidation
   - Product listings: ISR with 30s revalidation
   - User-specific: No cache, server component
   - API routes: Cache-Control headers

5. **Database Optimization**
   - Indexes on foreign keys
   - Indexes on frequently queried fields (status, created_at)
   - Composite indexes for complex queries
   - Materialized views for analytics (Phase 2)

6. **Realtime Optimization**
   - Subscribe only to active chats/orders
   - Unsubscribe on unmount
   - Debounce rapid updates
   - Use presence sparingly

### Lighthouse Targets

- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

### Monitoring (Phase 2)

- Vercel Analytics
- Supabase Dashboard metrics
- Error tracking (Sentry)
- User session recording (optional)

---

## DESIGN SYSTEM TOKENS

### Colors

```typescript
const colors = {
  background: {
    primary: '#0B0F14',
    secondary: '#151B23',
    tertiary: '#1F2937'
  },
  surface: {
    glass: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    glassHover: 'rgba(255, 255, 255, 0.08)'
  },
  primary: {
    main: '#3B82F6',      // Electric blue
    light: '#60A5FA',
    dark: '#2563EB',
    neon: '#06B6D4'       // Cyan accent
  },
  secondary: {
    main: '#8B5CF6',      // Violet
    light: '#A78BFA',
    dark: '#7C3AED',
    neon: '#10B981'       // Neon green
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    tertiary: '#9CA3AF',
    disabled: '#6B7280'
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  }
}
```

### Typography Scale

```typescript
const typography = {
  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
  h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.3 },
  h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.3 },
  h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
  h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
  h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.4 },
  button: { fontSize: '0.875rem', fontWeight: 600, textTransform: 'none' }
}
```

### Spacing

```typescript
const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  xxl: '3rem'      // 48px
}
```

### Glass Effect

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.glass-hover:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}
```

---

## RISK MITIGATION

### Technical Risks

1. **Realtime Scalability**
   - Risk: Too many concurrent connections
   - Mitigation: Implement connection pooling, unsubscribe aggressively

2. **AI Cost Overrun**
   - Risk: Uncontrolled AI API usage
   - Mitigation: Rate limiting, caching common queries, token budgets

3. **Image Storage Costs**
   - Risk: Unlimited uploads
   - Mitigation: File size limits, compression, CDN caching

4. **Database Performance**
   - Risk: Slow queries at scale
   - Mitigation: Proper indexing, query optimization, pagination

### Product Risks

1. **Low Seller Adoption**
   - Risk: Empty marketplace
   - Mitigation: Admin can seed products, invite sellers, incentives

2. **Chat Abuse**
   - Risk: Spam, inappropriate content
   - Mitigation: Report system, admin moderation, rate limits

3. **Delivery Reliability**
   - Risk: Manual process errors
   - Mitigation: Clear UI, notifications, proof requirements

---

## NEXT STEPS

This blueprint is complete and ready for execution.

**Proceed to STEP 2: Generate MILESTONES**

Once milestones are approved, we will:
1. Generate complete Supabase SQL (STEP 3)
2. Scaffold the Next.js project (STEP 4)
3. Implement features milestone by milestone (STEP 5)

---

**Blueprint Status:** ✅ COMPLETE
**Awaiting:** Internal confirmation to proceed to STEP 2
