You are a senior full-stack architect and product engineer.

Your task is to design and implement the **Starlinker Platform**, a dark premium AI-first service marketplace built with:

* Next.js (App Router, TypeScript)
* Supabase (Auth, Postgres, Realtime, Storage, Edge Functions)
* Material UI (Google Material 3 style)
* TailwindCSS (for layout and glass effects)
* Mailgun (or compatible cheap email provider)
* Deployment target: Vercel (must be build-safe)

Do NOT generate any Vercel configuration.

The system must be mobile-first, production-minded, and scalable.

---

# PRODUCT CONTEXT

Starlinker is a hybrid platform where users can:

* Book home installation services (internet, CCTV, TV wall mount, appliances)
* Buy new and used products
* Chat live with sellers or technicians
* Use an AI assistant for help and recommendations
* Arrange and track delivery
* View history and personalized insights

Users may browse as guests but must sign up to complete purchases or bookings.

Seller and buyer must be able to chat and optionally exchange phone numbers.

---

# DESIGN REQUIREMENTS

UI Direction (STRICT):

* AI-First Futuristic
* Dark Premium Tech
* Glass surfaces
* Neon accent highlights
* NO emoji anywhere in UI
* Use sophisticated icon libraries only:

  * Material Symbols Rounded
  * Lucide
  * Phosphor

Typography:

* Material 3 scale
* Font: Inter or Plus Jakarta Sans

Color foundation:

* Background: #0B0F14
* Surface: dark glass with blur
* Primary accent: electric blue or violet
* Secondary accent: subtle neon green
* Text: high-contrast accessible

Material UI (M3) must handle components.
Tailwind may be used for layout, spacing, and glass effects.

---

# REQUIRED IMAGE PLACEMENTS

Mark clearly in the code where images are required:

1. Homepage hero background
2. Service category thumbnails
3. Product gallery
4. Technician profile photos
5. Customer avatars
6. AI empty states
7. Optional delivery illustration

Use placeholders but label them clearly.

---

# CORE FEATURE SET

## Services

* Multi-service booking
* Smart calendar scheduling
* Location capture
* Instant price estimate
* Express booking option
* Technician assignment
* Realtime status tracking

## Marketplace

* Separate New vs Used tabs
* Product condition badges
* Stock indicator
* Add to cart / Buy now
* Seller profile preview
* Quick chat from product
* Car sales included
* All product must have location of seller.

## AI Assistant

Must support:

* Service recommendation
* Troubleshooting
* Product finder
* FAQ automation
* Context memory (store in Supabase)
* Tool-calling ready architecture

AI UI must include:

* Floating global chat bubble
* Dedicated AI tab
* Inline smart suggestions

Do NOT hardcode a single model provider.

---

## Live Chat System

Must support:

* Buyer ↔ Seller messaging
* Realtime via Supabase
* Message read status
* Attachment support (images)
* Voice chat placeholder (phase 2 ready)

Users may:

* negotiate
* exchange phone numbers
* proceed to order

---

## Delivery System (IMPORTANT)

Implement flexible delivery model.

Phase 1 (MVP):

* Manual courier workflow
* Buyer can request delivery
* Seller confirms readiness
* Both parties see shared delivery timeline
* Rider info manually entered
* Proof of delivery image upload

Design database to support future courier API integrations.

Potential future providers (do not integrate yet, just design extensible):

* GIG Logistics
* Kwik
* Sendbox
* Uber Connect

---

## Orders and Tracking

Both buyer and seller must see:

* Order status timeline
* Delivery progress
* Technician assignment (for services)
* Payment status

Realtime updates required.

---

## Authentication

Using Supabase Auth.

Roles:

* guest
* user
* seller/technician
* admin

Guests can browse and chat.
Registered users unlock purchases and history.

---

## Email Notifications

Use Mailgun-compatible abstraction.

Required triggers:

* Welcome
* Booking confirmation
* Order confirmation
* Technician assigned
* Delivery updates

Do NOT hardcode secrets.

---

## Admin Dashboard

Must include:

* Service management
* Product management
* Booking oversight
* Delivery management
* Chat moderation
* AI logs viewer
* Revenue analytics (basic)

Admin UI can be simple but functional.

---

# DATABASE REQUIREMENTS

You MUST generate complete Supabase SQL for:

Core tables (minimum):

* users (extend auth.users safely)
* services
* technicians
* bookings
* products
* orders
* order_items
* chats
* messages
* deliveries
* reviews
* ai_conversations

Include:

* proper indexes
* foreign keys
* RLS policies
* helpful comments
* realtime compatibility where needed

All SQL must be production-safe.

---

# NAVIGATION MODEL

Bottom navigation (mobile first):

* Home
* Services
* Shop
* AI Assistant
* Orders
* Profile

Floating AI bubble must be globally available.

---

# PROJECT EXECUTION PLAN (MANDATORY ORDER)

You must work in this exact sequence.

---

## STEP 1 — Generate BLUEPRINT.MD

This must include:

* product vision
* user flows
* architecture overview
* folder structure
* data model diagram (text form)
* realtime strategy
* AI orchestration plan
* delivery system design
* security considerations
* performance strategy

Do NOT write application code yet.

Wait for internal confirmation step (simulate).

---

## STEP 2 — Generate MILESTONES

Create a detailed milestone plan from MVP to Phase 3.

Each milestone must include:

* goal
* features included
* success criteria
* dependencies
* risk notes

Milestones must be realistic for a solo builder.

---

## STEP 3 — DATABASE & SQL

Generate all Supabase SQL needed.

Must include:

* tables
* enums where useful
* RLS policies
* indexes
* triggers where helpful

SQL must be executable in Supabase.

---

## STEP 4 — PROJECT SCAFFOLD

Create the Next.js project structure using App Router.

Include:

* proper folder layout
* providers setup
* Supabase client setup
* Material UI theme (dark premium)
* Tailwind config (if used)
* environment variable examples
* reusable components foundation

Must build successfully on Vercel.

---

## STEP 5 — FEATURE IMPLEMENTATION BY MILESTONE

Implement features milestone by milestone.

For each milestone:

* build UI
* build server logic
* wire database
* ensure type safety
* ensure mobile responsiveness

Do NOT jump ahead.

---

# ENGINEERING RULES

You must:

* Use TypeScript strictly
* Use server components where appropriate
* Avoid unnecessary client components
* Optimize for mobile performance
* Keep bundle size reasonable
* Use accessible color contrast
* Avoid over-animation
* Keep code modular and clean

---

# OUTPUT FORMAT RULES

* Use clear section headers
* Use production-quality code
* No pseudo-code unless explicitly noted
* No emojis anywhere in UI code
* Mark all TODOs clearly
* Prefer scalable patterns over hacks

---

# SUCCESS DEFINITION

The project is successful when:

* It builds on Vercel without errors
* Supabase SQL runs cleanly
* Auth works
* Booking works
* Product purchase flow works
* Chat works realtime
* AI assistant UI is functional
* Delivery tracking visible to both parties
* Admin can manage core entities

---

Begin with **STEP 1: Generate BLUEPRINT.MD**.
