# Deploying to Render - Step by Step Guide

This guide will help you deploy your Vimal Jyothi Tech Fest Spin Wheel application to Render for production hosting with PostgreSQL database.

## Prerequisites

Before you start:
- ✅ Your code is in a GitHub repository
- ✅ You have a Render account (free tier available)
- ✅ PostgreSQL database will be created on Render

## Step 1: Prepare Your GitHub Repository

1. **Create a GitHub repository:**
   - Go to [GitHub](https://github.com/new)
   - Create a new repository: `vimal-jyothi-techfest`
   - Make it Public (required for free Render hosting)

2. **Push your code to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/vimal-jyothi-techfest.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Create a Render Account

1. Go to [Render](https://render.com/)
2. Sign up using your GitHub account (recommended)
3. This allows Render to access your repositories

## Step 3: Create a PostgreSQL Database

**IMPORTANT: Create the database FIRST before the web service**

1. **In Render Dashboard:**
   - Click "New +" button
   - Select "PostgreSQL"

2. **Configure the database:**

   | Setting | Value |
   |---------|-------|
   | **Name** | `vimal-jyothi-db` |
   | **Database** | `techfest` |
   | **User** | `techfest_user` (auto-generated) |
   | **Region** | Select closest to India (e.g., Singapore) |
   | **PostgreSQL Version** | Latest (15 or 16) |
   | **Datadog API Key** | Leave empty |
   | **Instance Type** | `Free` |

3. **Click "Create Database"**
   - Wait for database to be provisioned (1-2 minutes)
   - **IMPORTANT:** Copy the "Internal Database URL" - you'll need this for the web service

## Step 4: Create a New Web Service

1. **In Render Dashboard:**
   - Click "New +" button
   - Select "Web Service"

2. **Connect your repository:**
   - Find and select your GitHub repository
   - Click "Connect"

3. **Configure the service:**

   | Setting | Value |
   |---------|-------|
   | **Name** | `vimal-jyothi-techfest` |
   | **Region** | **Same region as database** (e.g., Singapore) |
   | **Branch** | `main` |
   | **Root Directory** | Leave empty |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm start` |
   | **Instance Type** | `Free` |

## Step 5: Add Environment Variables

In the "Environment Variables" section, click "Add Environment Variable" and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | **Paste the Internal Database URL from Step 3** |

Example DATABASE_URL format:
```
postgresql://techfest_user:PASSWORD@dpg-xxxxx.singapore-postgres.render.com/techfest
```

**Where to find the DATABASE_URL:**
1. Go to your PostgreSQL database in Render
2. Click on "Info" tab
3. Copy the **Internal Database URL** (not External)
4. Paste it as the value for `DATABASE_URL` in your web service

## Step 6: Deploy

1. Click "Create Web Service"
2. Render will start building your application
3. This takes 5-10 minutes for the first deployment
4. Watch the logs - you should see "PostgreSQL database connected successfully!"

## Step 7: Access Your Application

Once deployed:
- Your app will be available at: `https://your-app-name.onrender.com`
- The database will initialize with the 6 events automatically
- Copy this URL to share with students

## Accessing Your PostgreSQL Database Data

After deployment, you can access your data in **3 ways**:

### Option 1: Using Render's PSQL Command (Easiest)

1. Go to your PostgreSQL database in Render Dashboard
2. Click "Info" tab
3. Find the **PSQL Command** - it looks like:
   ```bash
   PGPASSWORD=xxxxx psql -h dpg-xxxxx.singapore-postgres.render.com -U techfest_user techfest
   ```
4. Copy and run it in your terminal
5. Now you can run SQL queries:
   ```sql
   -- View all participants
   SELECT * FROM participants;
   
   -- View all events with winner counts
   SELECT * FROM events;
   
   -- View winners only
   SELECT * FROM participants WHERE spin_result IS NOT NULL AND spin_result != 'Better Luck Next Time';
   
   -- Count total registrations
   SELECT COUNT(*) FROM participants;
   
   -- Count winners per event
   SELECT name, current_winners FROM events;
   
   -- Export participant data to CSV (in psql)
   \copy (SELECT name, phone, spin_result, to_timestamp(timestamp/1000) as registered_at FROM participants) TO 'participants.csv' CSV HEADER;
   ```

### Option 2: Using a Database GUI Tool (Most User-Friendly)

**DBeaver (Free, Recommended):**

1. Download from [dbeaver.io](https://dbeaver.io)
2. Install and open DBeaver
3. Click "Database" → "New Database Connection"
4. Select "PostgreSQL"
5. In Render Dashboard, go to your database → "Info" tab
6. Enter the connection details:
   - **Host**: External host from Render (e.g., `dpg-xxxxx.singapore-postgres.render.com`)
   - **Port**: `5432`
   - **Database**: `techfest`
   - **Username**: Your database username
   - **Password**: Your database password
7. Click "Test Connection" → "OK"

Now you can:
- Browse tables visually
- Run queries with a friendly interface
- Export data to Excel, CSV, JSON
- View data in a spreadsheet-like format

**Other GUI Options:**
- TablePlus (Mac/Windows) - tableplus.com
- pgAdmin (Free, Cross-platform) - pgadmin.org
- Postico (Mac only) - eggerapps.at/postico

### Option 3: Export Data Programmatically

Add this endpoint to your app for easy data export (optional):

```javascript
// In server/routes.ts - add this endpoint (only for admin use!)
app.get("/api/admin/export", async (req, res) => {
  try {
    const allParticipants = await storage.getAllParticipants();
    const events = await storage.getEvents();
    
    res.json({
      participants: allParticipants,
      events: events,
      summary: {
        totalParticipants: allParticipants.length,
        totalWinners: allParticipants.filter(p => 
          p.spinResult && p.spinResult !== 'Better Luck Next Time'
        ).length
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Export failed" });
  }
});
```

## Important Production Considerations

### 1. Free Tier Limitations

Render's free tier:
- ✅ Great for tech fests and small events
- ⚠️ **Web service spins down after 15 minutes of inactivity**
- ⚠️ First request after inactivity takes 30-60 seconds to wake up
- ✅ PostgreSQL database: **90 days free, then deleted** (backup your data!)
- ✅ Database stays active, doesn't sleep

**Solution for event day:**
- Keep the site active by opening it every 10 minutes
- Or use [UptimeRobot](https://uptimerobot.com/) to ping your site every 5 minutes

### 2. Database Backup

**CRITICAL:** Free PostgreSQL databases expire after 90 days!

**Before your event (October 24, 2025):**
- Database will work perfectly fine for the event
- **After the event:** Export all data within 90 days

**How to backup:**
1. Use the PSQL command from Render
2. Run:
   ```bash
   pg_dump -h HOST -U USER DATABASE > backup.sql
   ```
3. Or export via DBeaver: Right-click database → "Backup"

### 3. Concurrent Users

The free tier can handle:
- ~10-20 concurrent users comfortably
- For 100+ concurrent users, consider upgrading to Starter plan ($7/month for web service)

### 4. Database Performance

PostgreSQL on Render:
- Handles concurrent writes with proper transactions
- Atomic increment ensures no duplicate winners
- Can handle hundreds of concurrent users
- Much faster than Firebase for this use case

## Monitoring Your Application

### View Application Logs

1. Go to your web service in Render dashboard
2. Click "Logs" tab
3. Look for:
   - "PostgreSQL database connected successfully!" - confirms DB connection
   - API request logs showing registrations and spins

### Check Database

1. Go to your PostgreSQL database in Render
2. Click "Info" tab
3. Use PSQL command or GUI tool to view data

## Updating Your Application

When you make changes:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```

2. **Auto-deployment:**
   - Render automatically detects the push
   - Rebuilds and redeploys your application
   - Takes 5-10 minutes

## Database Schema Updates

If you modify the database schema:

1. Update schema in `shared/schema.ts`
2. Run locally: `npm run db:push`
3. Push to GitHub
4. **IMPORTANT:** After deployment, manually run `npm run db:push` on Render:
   - Go to web service → Shell tab
   - Run: `npm run db:push`

## Troubleshooting

### Build Failed

**Check:**
- Build logs for specific errors
- Ensure all dependencies are in `package.json`

### Database Connection Failed

**Common issues:**
1. Wrong DATABASE_URL (must be **Internal** URL, not External)
2. Web service and database in different regions (must match!)
3. DATABASE_URL not set in environment variables

**Verify:**
- In web service logs, look for "PostgreSQL database connected successfully!"
- If you see "PostgreSQL connection failed", check DATABASE_URL

### Application Not Starting

**Check:**
- Port is correctly set (app uses `process.env.PORT` or 5000)
- Start command is: `npm start`
- Build completed successfully

### Data Not Persisting

**If data disappears after restart:**
- Check you're using PostgreSQL, not in-memory storage
- Logs should show "PostgreSQL database connected successfully!"
- If it says "Using in-memory storage", DATABASE_URL is incorrect

## Pre-Event Checklist

Before your tech fest on **October 24, 2025**:

- ✅ Application deployed and tested on Render
- ✅ PostgreSQL database connected successfully
- ✅ UptimeRobot monitoring configured (keeps site awake)
- ✅ Test registration and spinning from multiple devices
- ✅ **Verify event winner limits (5 per event, 30 total max)**
  - Test: Have multiple people spin simultaneously when an event has 4 winners
  - Expected: Only 1 more person can win that event, others get "Better Luck Next Time"
  - Query to check: `SELECT name, current_winners, max_winners FROM events;`
- ✅ Verify winning probability (about 25% - 5 out of 20 people win)
- ✅ Check database is storing data correctly using PSQL or DBeaver
- ✅ Test on mobile devices (most students use mobile)
- ✅ Have DBeaver or database GUI ready for monitoring
- ✅ Plan to export data after event (before 90-day limit)

## Post-Event Data Export

**Within 90 days after October 24, 2025:**

1. Export all participants data:
   ```sql
   \copy (SELECT * FROM participants) TO 'participants_export.csv' CSV HEADER;
   ```

2. Export events/winners summary:
   ```sql
   \copy (SELECT * FROM events) TO 'events_export.csv' CSV HEADER;
   ```

3. Download backup using DBeaver or pgAdmin

4. Store safely for future reference

## Success Tips

1. **Test before event:**
   - Do a full test run with friends (at least 10 people)
   - Verify 25% winning rate (about 2-3 winners out of 10)
   - Try from different devices and browsers
   - Check data in DBeaver/PSQL

2. **Event day preparation:**
   - Open the site 1 hour before event (wake it up)
   - Set up UptimeRobot to ping every 5 minutes
   - Keep DBeaver open to monitor registrations in real-time
   - Have laptop with database access ready

3. **During event:**
   - Monitor Render logs for any errors
   - Check database periodically to see registrations
   - If site is slow, check if service spun down

Good luck with your tech fest! 🎉
