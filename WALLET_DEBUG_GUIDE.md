## 🔍 WALLET SYSTEM DEBUG GUIDE

### 📊 CONSOLE LOGS - WHAT THEY MEAN

When you add a wallet, watch for these logs in **Browser Console** (F12 → Console):

#### ✅ SUCCESS FLOW (What should happen):

```
🟢 [WALLET] handleAddWallet clicked
🟢 [WALLET] Form data: {userId: "abc-123", address: "0xTest...", ...}
✅ [WALLET] All validations passed, proceeding...
🟢 [WALLET] ADD MODE - calling addWallet with: {...}
🟢 [STORE-ADDWALLET] Function called with: {...}
🟡 [STORE-ADDWALLET] Building insert payload...
🟡 [STORE-ADDWALLET] Insert payload: {...}
🟡 [STORE-ADDWALLET] Calling Supabase insert...
🟡 [STORE-ADDWALLET] Supabase response:
  - Data: {id: "wallet-uuid", user_id: "user-uuid", address: "0xTest...", ...}
  - Error: null
✅ [STORE-ADDWALLET] Supabase insert successful, wallet id: wallet-uuid
🟡 [STORE-ADDWALLET] Converting Supabase data to local format...
🟡 [STORE-ADDWALLET] New wallet object: {...}
🟡 [STORE-ADDWALLET] Updating local wallets state...
🟡 [STORE-ADDWALLET] Previous wallets count: 0
🟡 [STORE-ADDWALLET] Updated wallets count: 1
✅ [STORE-ADDWALLET] Wallet successfully added: 0xTest...
✅ [WALLET] addWallet returned: {success: true, walletId: "wallet-uuid"}
✅ [WALLET] Form reset complete
```

Then alert: **✅ Wallet added successfully**

---

#### 🔴 FAILURE FLOW (Things that might go wrong):

**1. Missing Form Field:**
```
🔴 [WALLET] Missing userId!
```
→ **Fix**: Select a user from the dropdown

---

**2. User ID Issue:**
```
🟡 [STORE-ADDWALLET] Calling Supabase insert...
🟡 [STORE-ADDWALLET] Supabase response:
  - Error: {code: "PGRST116", message: "Could not find the relationship..."}
```
→ **Fix**: The userId might be invalid or malformed

---

**3. Table Doesn't Exist:**
```
🟡 [STORE-ADDWALLET] Calling Supabase insert...
🟡 [STORE-ADDWALLET] Supabase response:
  - Error: {code: "42P01", message: "relation \"user_wallet_addresses\" does not exist"}
```
→ **Fix**: Run the SQL migration from WALLET_MIGRATION_GUIDE.md in Supabase

---

**4. RLS Policy Blocking Insert:**
```
🟡 [STORE-ADDWALLET] Calling Supabase insert...
🟡 [STORE-ADDWALLET] Supabase response:
  - Error: {code: "42501", message: "new row violates row level security policy"}
```
→ **Fix**: Enable RLS policies or disable RLS temporarily

---

**5. Data Returns but State Not Updating:**
```
✅ [STORE-ADDWALLET] Supabase insert successful...
🟡 [STORE-ADDWALLET] Updating local wallets state...
🟡 [STORE-ADDWALLET] Previous wallets count: 0
🟡 [STORE-ADDWALLET] Updated wallets count: 0  ← PROBLEM HERE
```
→ **Fix**: State update not working (React issue)

---

### 🎯 WHERE TO LOOK FOR DATA

#### In Database:
1. Open **Supabase Dashboard**
2. Go to **SQL Editor**
3. Run:
```sql
SELECT * FROM user_wallet_addresses ORDER BY created_at DESC;
```

#### In App State (Browser):
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Type and run:
```javascript
// Check wallets in store
store.getState().wallets

// Check all users with wallets
store.getState().allUsers.map(u => ({
  email: u.email,
  walletCount: u.wallets?.length || 0
}))
```

---

### 🔧 HOW TO DEBUG

**Step 1:** Try adding a wallet  
**Step 2:** Open Browser Console (F12)  
**Step 3:** Look for the logs above  
**Step 4:** Match your logs to the flows above  
**Step 5:** Follow the fix suggestion

---

### 📋 COMMON ISSUES & FIXES

| Symptom | Cause | Fix |
|---------|-------|-----|
| No logs appear at all | Function not being called | Check form validation - make sure all fields filled |
| "Missing userId" | No user selected | Select user from dropdown |
| "Missing address" | Address field empty | Fill in the wallet address |
| "Supabase response: Error" | Table doesn't exist | Run SQL migration |
| Data inserted but not in wallet list | State not updating | Check React state updates |
| Data visible in DB but not UI | Page not reloaded | Refresh page or logout/login |
| Works once, then fails | Duplicate address error | Try different address |

---

### 💾 HOW TO CHECK DATABASE

**Method 1 - Supabase UI:**
1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Run:
```sql
SELECT COUNT(*) as total_wallets FROM user_wallet_addresses;
SELECT * FROM user_wallet_addresses LIMIT 5;
```

**Method 2 - Check specific user:**
```sql
-- Replace 'user-uuid' with actual user ID
SELECT w.*, u.email 
FROM user_wallet_addresses w
JOIN user_profiles u ON w.user_id = u.id
WHERE w.user_id = 'user-uuid-here'
ORDER BY w.created_at DESC;
```

---

### 🧪 TEST CHECKLIST

- [ ] 1. Fill in all form fields (user, address, label, currency, type)
- [ ] 2. Open Browser Console (F12 → Console)
- [ ] 3. Click "Add Wallet"
- [ ] 4. See green checkmarks in console
- [ ] 5. See "Wallet added successfully" alert
- [ ] 6. Check wallet appears in the list below form
- [ ] 7. Go to Supabase → SQL Editor
- [ ] 8. Run: `SELECT * FROM user_wallet_addresses;`
- [ ] 9. Verify your wallet is there with correct user_id
- [ ] 10. Logout completely and login again
- [ ] 11. Verify wallet still shows in list (persistence test)

---

### 🚨 IF NOTHING WORKS

1. **Check table exists:**
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_name = 'user_wallet_addresses';
   ```
   - If 0 rows: Run SQL migration

2. **Check user_id is correct:**
   ```sql
   SELECT id, email FROM user_profiles LIMIT 5;
   ```
   - Copy an actual UUID and try with that

3. **Disable RLS temporarily** (for testing):
   ```sql
   ALTER TABLE user_wallet_addresses DISABLE ROW LEVEL SECURITY;
   ```

4. **Check Supabase logs:**
   - Go to Supabase Dashboard
   - Click "Logs" in sidebar
   - Look for errors from your attempt

5. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Clear "All time"
   - Refresh page

---

### 📞 SUPPORT

If you see:
- 🟢 green logs → Everything working on app side
- 🔴 red logs → Found the problem, check the error message
- 🟡 yellow logs → In progress, check the next log

The logs will guide you to the exact issue! 💡
