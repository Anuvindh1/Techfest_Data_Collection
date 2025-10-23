# How to Add Your Tantra 2025 Logo

Follow these steps to add your custom PNG logo to the registration page.

## Option 1: Add Logo via Replit (Recommended)

1. **Upload your logo:**
   - In Replit file explorer (left sidebar)
   - Navigate to `client/public/` folder
   - Click the three dots (...) → "Upload file"
   - Upload your `tantra-2025.png` file

2. **Update the registration page:**
   - Open `client/src/pages/registration.tsx`
   - Find the logo container section (around line 79)
   - Replace the placeholder div with an image:

```tsx
{/* Logo Container */}
<div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/50">
  <img 
    src="/tantra-2025.png" 
    alt="Tantra 2025 Logo" 
    className="w-full h-full object-cover"
  />
</div>
```

## Option 2: Use an Optimized Image Import (Better Performance)

1. **Upload your logo:**
   - Upload to `client/public/tantra-2025.png`

2. **For better performance, move it to src/assets:**
   - Create folder: `client/src/assets/`
   - Move your logo there: `client/src/assets/tantra-2025.png`

3. **Update the component:**

```tsx
// Add this import at the top of registration.tsx
import tantraLogo from "@/assets/tantra-2025.png";

// Then in the JSX (around line 79):
{/* Logo Container */}
<div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/50">
  <img 
    src={tantraLogo} 
    alt="Tantra 2025 Logo" 
    className="w-full h-full object-cover"
  />
</div>
```

## Current Placeholder

Right now, there's a placeholder that shows "TANTRA 2025" text. Once you add your actual logo using either method above, it will be replaced.

## Logo Specifications

For best results, your logo should be:
- **Format**: PNG with transparent background
- **Size**: 400x400 pixels or larger (square)
- **File size**: Keep under 500KB for fast loading
- **Quality**: High resolution for crisp display

## Testing

After adding the logo:
1. Save the file
2. The app will auto-reload
3. Visit the registration page
4. You should see your logo in a circular frame at the top

## Styling Tips

The logo container has these styles by default:
- Circular border with primary color glow
- Responsive sizing (smaller on mobile, larger on desktop)
- Shadow effect for depth

You can adjust the container size by changing:
- `w-32 h-32 md:w-40 md:h-40` (current: 128px mobile, 160px desktop)
- To make larger: `w-40 h-40 md:w-48 md:h-48`
- To make smaller: `w-24 h-24 md:w-32 md:h-32`

## Troubleshooting

### Logo not showing:
- Check file path is correct
- Verify file is uploaded to `client/public/` or `client/src/assets/`
- Check browser console for 404 errors
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Logo looks stretched:
- Use `object-cover` class (already included)
- Ensure your source image is square
- Or change to `object-contain` to fit without cropping

### Logo appears pixelated:
- Upload a higher resolution image
- Recommended: at least 800x800 pixels for retina displays
