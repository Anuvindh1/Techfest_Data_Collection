# How to Reset Winner Counts on Render (For Testing)

## ✅ NEW: Admin Reset Endpoint

I've added a simple API endpoint that lets you reset all winner counts to 0, so you can test the 5-winner limit multiple times!

## Method 1: Using the Reset API Endpoint (Easiest) ⭐

### Using cURL (Terminal/Command Line)

```bash
curl -X POST https://YOUR-APP-NAME.onrender.com/api/admin/reset-winners \
  -H "Content-Type: application/json" \
  -d '{"password":"test123"}'
```

**Replace:**
- `YOUR-APP-NAME` with your actual Render app name
- `test123` with your own password (you can change it in `server/routes.ts` line 152)

### Using Postman or Insomnia

1. **Method:** POST
2. **URL:** `https://YOUR-APP-NAME.onrender.com/api/admin/reset-winners`
3. **Headers:** 
   - Content-Type: `application/json`
4. **Body (JSON):**
   ```json
   {
     "password": "test123"
   }
   ```
5. **Click Send**

### Using Browser Console

1. Open your deployed app in browser
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Paste and run:
   ```javascript
   fetch('/api/admin/reset-winners', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ password: 'test123' })
   })
   .then(r => r.json())
   .then(data => console.log(data));
   ```

**Success Response:**
```json
{
  "message": "✅ Winner counts reset successfully!",
  "tip": "You can now test the 5-winner limit again",
  "events": [
    {"name": "What's In The Box", "currentWinners": 0, "maxWinners": 5},
    {"name": "Guess The Beat", "currentWinners": 0, "maxWinners": 5},
    // ... all 6 events
  ]
}
```

---

## Method 2: Using SQL Query (Direct Database Access)

### Via PSQL Command

1. **Go to your PostgreSQL Database in Render**
2. **Click "Info" tab**
3. **Copy and run the PSQL Command** in your terminal:
   ```bash
   PGPASSWORD=xxxxx psql -h dpg-xxxxx.singapore-postgres.render.com -U techfest_user techfest
   ```
4. **Run reset query:**
   ```sql
   UPDATE events SET current_winners = 0;
   ```
5. **Verify it worked:**
   ```sql
   SELECT name, current_winners, max_winners FROM events;
   ```
6. **Exit:**
   ```sql
   \q
   ```

### Via DBeaver (Visual Interface)

1. **Open DBeaver** and connect to your Render database
2. **Run SQL query:**
   ```sql
   UPDATE events SET current_winners = 0;
   ```
3. **Execute (F5 or Ctrl+Enter)**
4. **Verify in table view**

---

## Method 3: Using Render Shell

1. **Go to your Web Service in Render Dashboard**
2. **Click "Shell" tab**
3. **Wait for shell to connect** (10-20 seconds)
4. **Run:**
   ```bash
   npm run db:push
   ```
   This resets the database schema, setting all winners to 0

---

## Testing the 5-Winner Limit

### Step-by-Step Test Process

1. **Reset winners using Method 1** (API endpoint)

2. **Manually set one event to 4 winners** (via PSQL or DBeaver):
   ```sql
   UPDATE events SET current_winners = 4 WHERE name = 'Balanzo';
   ```

3. **Have 5-10 people spin the wheel simultaneously**

4. **Expected result:**
   - Only 1 more person wins "Balanzo" (making it 5/5)
   - Everyone else gets "Better Luck Next Time"

5. **Verify in database:**
   ```sql
   SELECT name, current_winners, max_winners FROM events WHERE name = 'Balanzo';
   ```
   Should show: `current_winners = 5`

6. **Reset and test again** using the API endpoint!

---

## Security: Change the Reset Password

**IMPORTANT:** Before deploying to production, change the password!

### Steps to Change Password:

1. **Edit `server/routes.ts`** (line 152-155)
2. **Change from:**
   ```typescript
   if (password !== "test123") {
   ```
   **To:**
   ```typescript
   if (password !== "YOUR_SECRET_PASSWORD_HERE") {
   ```
3. **Commit and push to GitHub**
4. **Render will auto-deploy**

**Recommended passwords:**
- Make it at least 12 characters
- Include letters, numbers, and symbols
- Example: `VJ2025TechFest!Reset`

---

## When to Use Each Method

### 🎯 Method 1 (API Endpoint) - Best for:
- ✅ Quick testing during development
- ✅ Resetting between test runs
- ✅ Easy access from anywhere (just need the URL)
- ✅ Can be called from code/scripts

### 🎯 Method 2 (SQL Query) - Best for:
- ✅ When you have database GUI open already
- ✅ More advanced operations (like resetting specific events)
- ✅ When you want to see data immediately

### 🎯 Method 3 (Render Shell) - Best for:
- ✅ Complete database reset
- ✅ When other methods aren't working
- ✅ Running migrations

---

## Quick Reference Commands

### Check Winner Counts
```sql
SELECT name, current_winners, max_winners FROM events ORDER BY current_winners DESC;
```

### Reset All Winners
```sql
UPDATE events SET current_winners = 0;
```

### Reset Specific Event
```sql
UPDATE events SET current_winners = 0 WHERE name = 'Balanzo';
```

### Count Total Winners
```sql
SELECT SUM(current_winners) as total_winners FROM events;
```

### Set Event to Almost Full (for testing)
```sql
UPDATE events SET current_winners = 4 WHERE name = 'What''s In The Box';
```

---

## Troubleshooting

### "Unauthorized" Error
- Check you're using the correct password
- Password is case-sensitive
- Make sure JSON body is properly formatted

### "Failed to reset winners" Error
- Check database connection (look at web service logs)
- Ensure DATABASE_URL is set correctly
- Try Method 2 (SQL query) instead

### Changes Not Reflecting
- Clear browser cache (Ctrl+Shift+R)
- Verify reset actually happened in database
- Check web service logs for errors

---

## Production Notes

### ⚠️ REMOVE Reset Endpoint Before Event Day

For security, you may want to remove or disable the reset endpoint on event day:

**Option 1: Add environment variable check**
```typescript
if (process.env.NODE_ENV === 'production') {
  res.status(404).json({ message: "Not found" });
  return;
}
```

**Option 2: Comment out the endpoint**
Just comment out lines 146-173 in `server/routes.ts`

**Option 3: Keep it but use a strong password**
Change "test123" to a very strong password only you know

---

## Summary

**For testing the 5-winner limit on Render:**

1. ✅ Use the `/api/admin/reset-winners` endpoint (fastest!)
2. ✅ Reset as many times as you need
3. ✅ Test with real people to verify concurrent handling
4. ✅ Change the password before event day
5. ✅ Consider disabling the endpoint for production

**You're all set to test thoroughly before your October 24th event!** 🎉
