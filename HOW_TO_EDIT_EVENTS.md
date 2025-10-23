# How to Edit Event Names

You can easily customize the 6 events shown on the spinning wheel by editing the event names in the storage files.

## Where to Edit

There are two files where events are defined (one for in-memory storage, one for Firebase):

### 1. For In-Memory Storage (Development/Testing)
**File:** `server/storage-memory.ts`

### 2. For Firebase Storage (Production)
**File:** `server/storage.ts`

## How to Edit Event Names

### Step 1: Open the file

Open either `server/storage-memory.ts` or `server/storage.ts` (or both to keep them in sync).

### Step 2: Find the events section

Look for the `initializeEvents` function. You'll see 6 events defined like this:

```typescript
const defaultEvents: Event[] = [
  {
    id: "event-1",
    name: "Coding Challenge",    // ← Edit this name
    maxWinners: 5,
    currentWinners: 0,
    color: "#8B5CF6",
  },
  {
    id: "event-2",
    name: "Hackathon",           // ← Edit this name
    maxWinners: 5,
    currentWinners: 0,
    color: "#06B6D4",
  },
  // ... and so on for all 6 events
];
```

### Step 3: Change the event names

Simply change the `name` field for each event to your desired name:

```typescript
{
  id: "event-1",
  name: "AI Workshop",         // ← Changed!
  maxWinners: 5,
  currentWinners: 0,
  color: "#8B5CF6",
},
```

### Step 4: Customize other settings (optional)

You can also customize:

#### Maximum Winners per Event
Change `maxWinners` (currently set to 5 for each event):
```typescript
maxWinners: 10,  // Allow 10 winners instead of 5
```

#### Event Colors
Change the `color` hex code to customize the segment color:
```typescript
color: "#FF6B6B",  // Red color
```

**Available vibrant colors:**
- Purple: `#8B5CF6`
- Cyan: `#06B6D4`
- Green: `#10B981`
- Amber: `#F59E0B`
- Pink: `#EC4899`
- Red: `#EF4444`
- Blue: `#3B82F6`
- Orange: `#F97316`

## Current Events Configuration

Your wheel currently has these 6 events:

1. **Coding Challenge** (Purple) - Max 5 winners
2. **Hackathon** (Cyan) - Max 5 winners
3. **Tech Talk** (Green) - Max 5 winners
4. **Workshop** (Amber) - Max 5 winners
5. **Gaming Arena** (Pink) - Max 5 winners
6. **Robotics** (Red) - Max 5 winners

## Example: Complete Customization

Here's an example of customizing all 6 events for your Vimal Jyothi Tech Fest:

```typescript
const defaultEvents: Event[] = [
  {
    id: "event-1",
    name: "AI & ML Workshop",
    maxWinners: 5,
    currentWinners: 0,
    color: "#8B5CF6",
  },
  {
    id: "event-2",
    name: "24-Hour Hackathon",
    maxWinners: 5,
    currentWinners: 0,
    color: "#06B6D4",
  },
  {
    id: "event-3",
    name: "Robotics Challenge",
    maxWinners: 5,
    currentWinners: 0,
    color: "#10B981",
  },
  {
    id: "event-4",
    name: "Web Dev Bootcamp",
    maxWinners: 5,
    currentWinners: 0,
    color: "#F59E0B",
  },
  {
    id: "event-5",
    name: "Gaming Tournament",
    maxWinners: 5,
    currentWinners: 0,
    color: "#EC4899",
  },
  {
    id: "event-6",
    name: "Tech Quiz",
    maxWinners: 5,
    currentWinners: 0,
    color: "#EF4444",
  },
];
```

## Important Notes

### ⚠️ Don't Change These Fields:
- `id` - Keep as is (event-1, event-2, etc.)
- `currentWinners` - Always start at 0

### ✅ You Can Change:
- `name` - The event name displayed on the wheel
- `maxWinners` - Maximum winners allowed per event
- `color` - The color of the segment on the wheel

## After Making Changes

1. **Save the file**
2. **Restart the application**
   - The workflow will auto-restart
   - Or manually restart if needed

3. **Clear old data (if using Firebase)**
   - Go to Firebase Console
   - Realtime Database → Data
   - Delete the `events` node
   - Restart the app to reinitialize with new names

4. **Test the changes**
   - Open the app
   - You should see your new event names on the wheel

## Best Practices

### Event Naming
- Keep names short (2-4 words max)
- Use clear, descriptive names
- Avoid special characters

### Color Selection
- Use high contrast colors
- Ensure text is readable on colored backgrounds
- Alternate bright and darker colors for visual variety

### Winner Limits
- Set realistic limits based on your event capacity
- Consider your total number of participants
- Remember: 6 events × 5 winners each = 30 total winners maximum

## Troubleshooting

### Changes not appearing?
1. Save the file
2. Wait for auto-restart or manually restart
3. Hard refresh browser (Ctrl+Shift+R)
4. Check server logs for errors

### Wheel looks different?
- Each event name must be unique
- Keep names concise for best display
- Very long names may wrap to multiple lines

### Firebase data not updating?
- Delete the `events` node in Firebase Console
- Restart the server
- New event data will be reinitialized

## Need Help?

If the event names aren't updating:
1. Check that you saved both files
2. Verify no syntax errors (missing commas, quotes)
3. Check server logs for error messages
4. Ensure the app restarted successfully
