# Firebase Realtime Database Setup Guide

This guide will help you set up Firebase Realtime Database for your Vimal Jyothi Tech Fest Spin Wheel application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `vimal-jyothi-techfest` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

## Step 2: Set Up Realtime Database

1. In your Firebase project, click on "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location (select closest to India, e.g., `asia-southeast1`)
4. Start in **Test mode** for now (we'll secure it later)
5. Click "Enable"

## Step 3: Configure Database Rules

After creating the database, set up security rules:

1. Go to the "Rules" tab in Realtime Database
2. Replace the rules with the following:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**⚠️ IMPORTANT**: These rules allow anyone to read/write. For production:
- Implement authentication
- Restrict write access
- Set up proper security rules

## Step 4: Get Your Database URL

1. In the Realtime Database page, look at the top
2. You'll see a URL like: `https://your-project-name-default-rtdb.firebaseio.com/`
3. Copy this entire URL (including `https://`)

## Step 5: Add Database URL to Replit

### In Replit:

1. Click on the **Secrets** tool (🔒 icon in the left sidebar)
2. Click "New Secret"
3. Enter:
   - **Key**: `FIREBASE_DATABASE_URL`
   - **Value**: Your Firebase Database URL (e.g., `https://vimal-jyothi-techfest-default-rtdb.firebaseio.com`)
4. Click "Add Secret"

## Step 6: Restart Your Application

After adding the secret:

1. The workflow should automatically restart
2. Look for the success message in logs: `✅ Firebase Realtime Database connected successfully!`
3. If you still see the in-memory storage warning, manually restart the workflow

## Step 7: Verify It's Working

1. Register a student on your website
2. Spin the wheel
3. Go to Firebase Console → Realtime Database → Data tab
4. You should see two nodes:
   - `events` - Contains all the events with winner counts
   - `participants` - Contains all registered students and their spin results

## Production Security (Important!)

Before deploying to production, secure your database:

### Better Security Rules Example:

```json
{
  "rules": {
    "participants": {
      ".read": true,
      "$participantId": {
        ".write": "!data.exists()"
      }
    },
    "events": {
      ".read": true,
      ".write": false
    }
  }
}
```

This ensures:
- Anyone can read data
- Participants can only be created once (no modifications)
- Events are read-only from the client

## Troubleshooting

### Issue: Still seeing "in-memory storage" warning

**Solution:**
- Verify the secret name is exactly `FIREBASE_DATABASE_URL`
- Ensure the URL includes `https://` and ends with your database domain
- Restart the workflow
- Check logs for specific error messages

### Issue: "Firebase connection failed"

**Solution:**
- Verify database rules allow read/write access
- Check that the database URL is correct
- Ensure the database is in "Realtime Database" (not Firestore)

### Issue: Data not persisting

**Solution:**
- Check Firebase Console → Realtime Database → Data
- Verify rules are set correctly
- Check server logs for error messages

## Data Structure

Your Firebase database will have this structure:

```
{
  "participants": {
    "uuid-1234": {
      "id": "uuid-1234",
      "name": "John Doe",
      "phone": "+919876543210",
      "spinResult": "Coding Challenge",
      "timestamp": 1729756800000
    }
  },
  "events": {
    "event-1": {
      "id": "event-1",
      "name": "Coding Challenge",
      "maxWinners": 5,
      "currentWinners": 2,
      "color": "#8B5CF6"
    }
  }
}
```

## Cost Considerations

Firebase Realtime Database offers:
- **Free tier**: 1GB storage, 10GB/month download
- For a tech fest with ~1000 participants, you'll stay well within free limits

## Need Help?

If you encounter issues:
1. Check the Firebase Console for any error messages
2. Review your server logs in Replit
3. Verify all steps above are completed correctly
