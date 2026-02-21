# DATABASE SETUP TROUBLESHOOTING

## ✅ FIXED: Storage Policy Error

The error you encountered has been fixed in `002_storage_config.sql`.

**Error**: `relation "public.users" does not exist`

**Cause**: Storage policies were trying to reference `public.users` table with complex joins that caused issues during creation.

**Solution**: Simplified storage policies to use basic authentication checks instead of table lookups.

---

## 📋 Correct Setup Order

Follow these steps **in order**:

### Step 1: Run Main Schema (001_initial_schema.sql)

1. Go to Supabase Dashboard → SQL Editor
2. Copy the **entire** contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and click **Run**
4. Wait for "Success" message

**This creates**:
- All enums
- All tables (users, services, products, etc.)
- All indexes
- All RLS policies
- All triggers
- Sample services data

### Step 2: Run Storage Config (002_storage_config.sql)

1. Still in SQL Editor
2. Copy the **entire** contents of `supabase/migrations/002_storage_config.sql`
3. Paste and click **Run**
4. Wait for "Success" message

**This creates**:
- 5 storage buckets
- Storage access policies

---

## ✅ Verification Checklist

After running both migrations, verify:

### Check Tables Created
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- ai_conversations
- bookings
- chats
- deliveries
- messages
- order_items
- orders
- products
- reviews
- services
- technicians
- users

### Check Storage Buckets
Go to: Storage → Buckets

You should see:
- avatars (public)
- products (public)
- services (public)
- chat-attachments (private)
- delivery-proofs (private)

### Check Sample Data
```sql
SELECT * FROM public.services;
```

Should return 5 sample services.

---

## 🔧 Common Issues & Solutions

### Issue 1: "Extension does not exist"
**Error**: `extension "uuid-ossp" does not exist`

**Solution**: Extensions should auto-create, but if not:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Issue 2: "Type already exists"
**Error**: `type "user_role" already exists`

**Solution**: You've already run the migration. Either:
- Skip to step 2 (storage config)
- Or drop and recreate (⚠️ deletes all data):
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### Issue 3: "Publication does not exist"
**Error**: `publication "supabase_realtime" does not exist`

**Solution**: This is normal for new projects. The publication is created automatically. If error persists, create it:
```sql
CREATE PUBLICATION supabase_realtime;
```

Then re-run the realtime section:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deliveries;
```

### Issue 4: Storage bucket already exists
**Error**: `duplicate key value violates unique constraint`

**Solution**: Buckets already created. This is fine, continue.

---

## 🧪 Test Your Setup

### Test 1: Create a Test User
```sql
-- This will be done via Supabase Auth UI
-- Just verify the trigger works by signing up
```

### Test 2: Check RLS Policies
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Should show multiple policies per table.

### Test 3: Insert Test Service
```sql
INSERT INTO public.services (name, category, base_price) 
VALUES ('Test Service', 'Test', 1000.00);
```

Should succeed (if you're admin) or fail with RLS error (if not admin) - both are correct!

---

## 📝 After Successful Setup

### 1. Generate TypeScript Types

**Option A: Using Project ID**
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > types/database.ts
```

**Option B: Using Supabase CLI**
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase gen types typescript --local > types/database.ts
```

### 2. Update .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Get these from: Supabase Dashboard → Settings → API

### 3. Test Connection

Create a test file:
```typescript
// test-connection.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function test() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
  
  console.log('Services:', data)
  console.log('Error:', error)
}

test()
```

Run: `npx tsx test-connection.ts`

---

## 🆘 Still Having Issues?

### Check Supabase Logs
Dashboard → Logs → Select log type

### Verify Project Status
Dashboard → Settings → General
- Ensure project is not paused
- Check database status

### Reset Database (⚠️ Nuclear Option)
If all else fails:

1. Dashboard → Settings → Database
2. Scroll to "Reset Database Password"
3. Or create a new project and start fresh

---

## ✅ Success Indicators

You're ready to proceed when:
- ✅ Both SQL files run without errors
- ✅ 12 tables exist in public schema
- ✅ 5 storage buckets created
- ✅ Sample services data visible
- ✅ TypeScript types generated
- ✅ Connection test succeeds

---

## 📞 Next Steps

Once database is set up:
1. ✅ Install npm dependencies
2. ✅ Configure environment variables
3. ✅ Generate types
4. ✅ Run `npm run dev`
5. ✅ Start building features!

---

**Status**: Database setup should now work correctly with the fixed SQL files.
