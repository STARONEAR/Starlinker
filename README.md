# Starlinker Platform

AI-First Service Marketplace built with Next.js, Supabase, and Material UI.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React Server Components
- **UI**: Material UI v5 (Material 3 design), TailwindCSS
- **Backend**: Supabase (Auth, Postgres, Realtime, Storage)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Starlinker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials.

4. Set up Supabase:
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/` via Supabase SQL Editor
   - Generate TypeScript types:
   ```bash
   npx supabase gen types typescript --project-id your-project-ref > types/database.ts
   ```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
starlinker/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (main)/            # Main app pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── [features]/       # Feature-specific components
├── lib/                   # Utilities and configurations
│   ├── supabase/         # Supabase clients
│   ├── ai/               # AI integration
│   ├── email/            # Email service
│   └── utils/            # Helper functions
├── styles/               # Global styles and theme
├── types/                # TypeScript types
└── public/               # Static assets
```

## Features

- 🏠 Service booking (Internet, CCTV, TV mount, etc.)
- 🛒 Marketplace (new and used products)
- 💬 Real-time chat between buyers and sellers
- 🤖 AI assistant for recommendations
- 📦 Delivery tracking
- 👤 User profiles and reviews
- 🔐 Secure authentication with RLS

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

The project is optimized for Vercel deployment with:
- Server-side rendering
- Edge functions support
- Automatic image optimization

## Environment Variables

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_PROVIDER_API_KEY=
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
```

See `.env.local.example` for complete list.

## Database

Database schema is in `supabase/migrations/`.

To update types after schema changes:
```bash
npx supabase gen types typescript --project-id your-project-ref > types/database.ts
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - All rights reserved

## Support

For issues and questions, contact the development team.
