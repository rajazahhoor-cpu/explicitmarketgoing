## SUPABASE MIGRATION GUIDE - USER WALLET ADDRESSES

### ⚡ QUICK START

1. **Open Supabase Dashboard** → Your Database → SQL Editor
2. **Copy and paste** the SQL code below
3. **Click "Run"**
4. **Done!** Your wallet address system is ready

---

## 📝 FULL SQL MIGRATION

```sql
-- Step 1: Create the user_wallet_addresses table
CREATE TABLE IF NOT EXISTS public.user_wallet_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  address VARCHAR NOT NULL,
  label VARCHAR,
  type VARCHAR NOT NULL CHECK (type IN ('DEPOSIT', 'PURCHASE')),
  currency VARCHAR DEFAULT 'USD',
  network VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraint - delete wallets when user is deleted
  CONSTRAINT fk_user_wallet_user_id 
    FOREIGN KEY (user_id) 
    REFERENCES user_profiles(id) 
    ON DELETE CASCADE,
  
  -- Prevent duplicate addresses for same user and type
  CONSTRAINT unique_user_wallet_type 
    UNIQUE(user_id, address, type)
);

-- Step 2: Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_wallet_user_id 
  ON public.user_wallet_addresses(user_id);

CREATE INDEX IF NOT EXISTS idx_user_wallet_type 
  ON public.user_wallet_addresses(type);

CREATE INDEX IF NOT EXISTS idx_user_wallet_active 
  ON public.user_wallet_addresses(is_active);

CREATE INDEX IF NOT EXISTS idx_user_wallet_user_type 
  ON public.user_wallet_addresses(user_id, type);

-- Step 3: Enable RLS (Row Level Security) - Optional but recommended
ALTER TABLE public.user_wallet_addresses ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS Policies
-- Allow users to view their own wallets
CREATE POLICY "Users can view own wallets"
  ON public.user_wallet_addresses
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow admin (postgres) to manage wallets
CREATE POLICY "Admin can manage all wallets"
  ON public.user_wallet_addresses
  FOR ALL
  USING (auth.role() = 'authenticated');
```

---

## ✅ VERIFICATION STEPS

After running the SQL:

1. **Check Table Exists**:
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_name = 'user_wallet_addresses';
   ```
   Should return 1 row.

2. **Check Columns**:
   ```sql
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'user_wallet_addresses';
   ```
   Should show: id, user_id, address, label, type, currency, network, is_active, created_at, updated_at

3. **Check Indexes**:
   ```sql
   SELECT indexname FROM pg_indexes 
   WHERE tablename = 'user_wallet_addresses';
   ```
   Should show 4 indexes created above.

4. **Test Insert**:
   ```sql
   -- Replace 'your-user-uuid' with an actual user_id from user_profiles
   INSERT INTO user_wallet_addresses 
   (user_id, address, label, type, currency, network)
   VALUES 
   ('your-user-uuid', '0x123abc...', 'Test Wallet', 'DEPOSIT', 'USDT', 'ERC20');
   
   SELECT * FROM user_wallet_addresses;
   ```
   Should insert without errors and return 1 row.

---

## 🗺️ STEP-BY-STEP IN SUPABASE UI

### Method 1: Using SQL Editor (Recommended)

1. Go to **Supabase Dashboard**
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the SQL code from above
5. Paste it into the editor
6. Click **Run** (blue play button)
7. Wait for "Query executed successfully"
8. Check **Table Editor** to see the new table

### Method 2: Using Table Editor

If you prefer the UI (takes longer):

1. Go to **Table Editor** (left sidebar)
2. Click **Create a new table**
3. Name it: `user_wallet_addresses`
4. Add columns manually:
   - `id` (UUID, Enable this as Primary Key)
   - `user_id` (UUID)
   - `address` (Text)
   - `label` (Text, Allow NULL)
   - `type` (Text)
   - `currency` (Text)
   - `network` (Text, Allow NULL)
   - `is_active` (Boolean, Default: true)
   - `created_at` (Timestamp, Auto set)
   - `updated_at` (Timestamp, Auto set)
5. Add Foreign Key: user_id → user_profiles.id (ON DELETE CASCADE)
6. Add Unique Constraint: (user_id, address, type)
7. Add Indexes (see SQL above)

---

## 🚨 TROUBLESHOOTING

**Error: "relation 'user_profiles' does not exist"**
- Make sure `user_profiles` table exists first
- Run this to check:
  ```sql
  SELECT * FROM information_schema.tables 
  WHERE table_name = 'user_profiles';
  ```

**Error: "column 'id' must be the primary key"**
- Remove any existing id column before running the SQL
- The SQL creates id as PRIMARY KEY automatically

**Error: "permission denied"**
- Make sure you're logged in with admin/postgres role
- Not a regular user account

**Wallets not persisting after app restart**
- Make sure the code is calling the async functions properly
- Check browser console for errors
- Verify data is in Supabase table using SQL Editor

**Can't see the table in UI**
- Refresh the Supabase page (Cmd+R / Ctrl+R)
- The table might not load immediately

---

## 📋 DEFAULT DATA (Optional)

If you want to pre-populate with example wallets:

```sql
-- Example: Add test wallets for a user
-- Replace 'user-uuid-here' with actual user IDs

INSERT INTO user_wallet_addresses 
(user_id, address, label, type, currency, network, is_active)
VALUES 
  -- User 1 - DEPOSIT wallets
  ('550e8400-e29b-41d4-a716-446655440000', '0x123abcdef...', 'Main Deposit - USDT ERC20', 'DEPOSIT', 'USDT', 'ERC20', true),
  ('550e8400-e29b-41d4-a716-446655440000', 'TK5g8f...', 'Backup - USDT TRC20', 'DEPOSIT', 'USDT', 'TRC20', true),
  
  -- User 1 - PURCHASE wallet
  ('550e8400-e29b-41d4-a716-446655440000', 'BC1qar0..', 'Bitcoin Payments', 'PURCHASE', 'BTC', 'Bitcoin', true),
  
  -- User 2 - DEPOSIT wallet
  ('660e8400-e29b-41d4-a716-446655440001', '0x456xyz...', 'Main Deposit', 'DEPOSIT', 'USDT', 'ERC20', true);
```

---

## 🔄 ROLLBACK (If Needed)

If something goes wrong, you can drop the table:

```sql
DROP TABLE IF NOT EXISTS public.user_wallet_addresses CASCADE;
```

Then re-run the creation SQL above.

---

## 📊 USEFUL QUERIES

**View all wallets**:
```sql
SELECT * FROM user_wallet_addresses ORDER BY created_at DESC;
```

**View wallets for specific user**:
```sql
SELECT * FROM user_wallet_addresses 
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC;
```

**View only DEPOSIT wallets**:
```sql
SELECT * FROM user_wallet_addresses 
WHERE type = 'DEPOSIT'
ORDER BY created_at DESC;
```

**Count wallets per user**:
```sql
SELECT user_id, COUNT(*) as wallet_count 
FROM user_wallet_addresses 
GROUP BY user_id;
```

**Find users with no wallets**:
```sql
SELECT id, email FROM user_profiles 
WHERE id NOT IN (SELECT DISTINCT user_id FROM user_wallet_addresses);
```

**Check table size**:
```sql
SELECT 
  pg_size_pretty(pg_total_relation_size('user_wallet_addresses')) as table_size;
```

---

## ✨ AFTER MIGRATION

Once the table is created:

1. ✅ Admin can add wallet addresses in the Wallet tab
2. ✅ Wallets appear in user list when admins load users
3. ✅ Admin can edit any wallet address
4. ✅ Admin can delete wallets
5. ✅ Data persists across device logins
6. ✅ Hitting refresh/logout/login → data still there

---

## 🆘 SUPPORT

If you encounter issues:

1. Check **Supabase Dashboard** → **Logs** for errors
2. Verify the SQL ran without errors
3. Check browser console (F12) for app errors
4. Make sure Supabase client is connected
5. Test the insert query manually in SQL Editor
