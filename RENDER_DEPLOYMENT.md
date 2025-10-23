# Deploying to Render - Step by Step Guide

This guide will help you deploy your Vimal Jyothi Tech Fest Spin Wheel application to Render for production hosting.

## Prerequisites

Before you start:
- ✅ Firebase Realtime Database is set up (see FIREBASE_SETUP.md)
- ✅ Your code is in a GitHub repository
- ✅ You have a Render account (free tier available)

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

## Step 3: Create a New Web Service

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
   | **Region** | Select closest to India (e.g., Singapore) |
   | **Branch** | `main` |
   | **Root Directory** | Leave empty |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm start` |
   | **Instance Type** | `Free` |

## Step 4: Add Environment Variables

In the "Environment Variables" section, click "Add Environment Variable" and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `FIREBASE_DATABASE_URL` | Your Firebase Database URL (from Firebase setup) |

Example:
```
FIREBASE_DATABASE_URL=https://vimal-jyothi-techfest-default-rtdb.firebaseio.com
```

## Step 5: Deploy

1. Click "Create Web Service"
2. Render will start building your application
3. This takes 5-10 minutes for the first deployment
4. Watch the logs for any errors

## Step 6: Access Your Application

Once deployed:
- Your app will be available at: `https://your-app-name.onrender.com`
- Copy this URL to share with students

## Important Production Considerations

### 1. Free Tier Limitations

Render's free tier:
- ✅ Great for tech fests and small events
- ⚠️ **Spins down after 15 minutes of inactivity**
- ⚠️ First request after inactivity takes 30-60 seconds to wake up
- ✅ 750 hours/month free (enough for a 31-day event)

**Solution for event day:**
- Keep the site active by opening it every 10 minutes
- Or use [UptimeRobot](https://uptimerobot.com/) to ping your site every 5 minutes

### 2. Concurrent Users

The free tier can handle:
- ~10-20 concurrent users comfortably
- For 100+ concurrent users, consider upgrading to Starter plan ($7/month)

### 3. Database Optimization

Your Firebase Realtime Database:
- Handles concurrent writes automatically with transactions
- The atomic increment ensures no duplicate winners
- Can handle hundreds of concurrent users

## Monitoring Your Application

### View Logs

1. Go to your service in Render dashboard
2. Click "Logs" tab
3. Monitor for errors or issues

### Check Database

1. Open Firebase Console
2. Go to Realtime Database → Data
3. See real-time registrations and spin results

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

## Custom Domain (Optional)

To use your college domain (e.g., techfest.vimaljyothi.in):

1. In Render service settings
2. Go to "Custom Domains"
3. Click "Add Custom Domain"
4. Follow instructions to add DNS records
5. Free SSL certificate is automatic

## Troubleshooting

### Build Failed

**Check:**
- Build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**Common fixes:**
```json
// Add to package.json if needed:
"engines": {
  "node": "20.x"
}
```

### Application Not Starting

**Check:**
- Start command is correct: `npm start`
- Port binding is correct (Render provides PORT environment variable)
- Environment variables are set correctly

### Database Connection Issues

**Verify:**
- `FIREBASE_DATABASE_URL` is set in Render environment variables
- Firebase database rules allow access
- URL includes `https://` and complete domain

### Application is Slow

**Free tier limitations:**
- Service spins down after inactivity
- First request after sleep takes 30-60 seconds
- Consider paid tier for better performance

**Solutions:**
- Use UptimeRobot to keep service active
- Upgrade to Starter plan ($7/month) for always-on service

## Alternative: Replit Deployment

You can also deploy directly from Replit:

1. Click "Deploy" button in Replit
2. Configure deployment settings
3. Replit handles everything automatically
4. Similar pricing to Render

## Cost Comparison

| Platform | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| **Render** | 750hrs/month, sleeps after 15min | $7/month, always-on | Multi-user events |
| **Replit** | Limited | $20/month | Development & testing |
| **Firebase Hosting + Cloud Functions** | Generous free tier | Pay-as-you-go | Large scale events |

## Pre-Event Checklist

Before your tech fest on **October 24, 2025**:

- ✅ Application deployed and tested
- ✅ Firebase database rules configured
- ✅ Custom domain set up (if using)
- ✅ UptimeRobot monitoring configured (free tier only)
- ✅ Test registration and spinning from multiple devices
- ✅ Verify event winner limits are working correctly
- ✅ Check database is storing data correctly
- ✅ Test on mobile devices (most students use mobile)

## Support During Event

1. **Monitor dashboard:**
   - Render logs for server errors
   - Firebase Console for data issues

2. **Quick fixes:**
   - If site is slow: Check if service spun down
   - If registrations fail: Check Firebase rules
   - If wheel not spinning: Check browser console

3. **Emergency rollback:**
   - In Render dashboard, go to "Events"
   - Click "Rollback" to previous working deployment

## Success Tips

1. **Test before event:**
   - Do a full test run with friends
   - Try from different devices and browsers
   - Verify Firebase is recording everything

2. **Have a backup:**
   - Keep Replit deployment running as backup
   - Have Firebase Console open during event
   - Download participant data regularly

3. **Event day preparation:**
   - Open the site 1 hour before event
   - Verify everything loads correctly
   - Keep laptop with Firebase Console accessible

Good luck with your tech fest! 🎉
