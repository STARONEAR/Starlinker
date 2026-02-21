# STARLINKER - QUICK START

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies (1 min)
```bash
npm install
```

### 2. Set Up Environment (1 min)
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
- Get from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

### 3. Set Up Database (2 min)
1. Go to Supabase SQL Editor
2. Copy & paste `supabase/migrations/001_initial_schema.sql`
3. Run it
4. Copy & paste `supabase/migrations/002_storage_config.sql`
5. Run it

### 4. Generate Types (30 sec)
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT > types/database.ts
```

### 5. Start Development (30 sec)
```bash
npm run dev
```

Open http://localhost:3000

---

## 📋 Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run linter
npm run type-check       # Check TypeScript

# Supabase
npx supabase gen types typescript --project-id YOUR_PROJECT > types/database.ts
```

---

## 📁 Key Files

- `app/(main)/page.tsx` - Homepage
- `components/layout/BottomNav.tsx` - Navigation
- `lib/supabase/client.ts` - Database client
- `styles/theme.ts` - Design system
- `types/database.ts` - Type definitions

---

## 🎨 Design Tokens

```tsx
// Colors
className="bg-background-primary"     // #0B0F14
className="text-primary-main"         // #3B82F6
className="text-secondary-main"       // #8B5CF6

// Effects
className="glass"                     // Glass card
className="glass-hover"               // Hoverable glass
className="neon-glow"                 // Blue glow

// Components
import { GlassCard } from '@/components/ui/GlassCard'
```

---

## 🔗 Important Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Next.js Docs**: https://nextjs.org/docs
- **Material UI**: https://mui.com/material-ui/

---

## 📖 Documentation

- `BLUEPRINT.md` - Architecture & design
- `MILESTONES.md` - Development roadmap  
- `SETUP.md` - Detailed setup guide
- `PROJECT_STATUS.md` - Current status
- `supabase/README.md` - Database docs

---

## ✅ Checklist

Before starting development:
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Types generated
- [ ] Dev server running
- [ ] Homepage loads at localhost:3000

---

## 🆘 Troubleshooting

**Build fails?**
```bash
npm run type-check
```

**Supabase connection error?**
- Check `.env.local` credentials
- Verify Supabase project is active

**Types error?**
- Regenerate types from Supabase

**Glass effect not showing?**
- Check Tailwind is configured
- Verify `globals.css` is imported

---

## 🎯 Next Steps

1. ✅ Complete setup above
2. 📖 Read `MILESTONES.md`
3. 🎨 Review `BLUEPRINT.md`
4. 💻 Start Milestone 1

---

**Ready to build? Let's go! 🚀**
