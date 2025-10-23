# Design Guidelines: Vimal Jyothi Tech Fest Registration & Spin-to-Win

## Design Approach

**Reference-Based Approach**: Drawing inspiration from gaming interfaces, event platforms, and lottery/prize wheel experiences. Creating an energetic, youth-oriented design that captures tech fest excitement while maintaining functional clarity.

**Core Principles**: Playful energy, instant gratification, mobile-first interaction, celebratory moments

---

## Color Palette

### Primary Colors (Dark Mode Default)
- **Primary Brand**: 280 70% 60% (Vibrant purple - tech fest energy)
- **Secondary**: 190 80% 50% (Electric cyan - digital excitement)
- **Background**: 280 15% 8% (Deep purple-black)
- **Surface**: 280 10% 12% (Elevated purple-dark)

### Accent & State Colors
- **Success/Winner**: 142 70% 55% (Energetic green)
- **Neutral/Better Luck**: 45 85% 60% (Warm amber)
- **Text Primary**: 0 0% 95%
- **Text Secondary**: 280 5% 70%

### Gradient Treatments
- Hero gradient: Radial from 280 80% 20% to background
- Wheel glow: Conic gradient rotating through primary and secondary
- Button shine: Linear overlay 0 0% 100% at 10% opacity

---

## Typography

**Font Stack**: 
- Primary: 'Space Grotesk' (Google Fonts) - Modern, tech-forward
- Accent/Display: 'Orbitron' (Google Fonts) - Futuristic for event names
- Body: 'Inter' (Google Fonts) - Clean readability

**Scale**:
- Hero Title: text-6xl font-bold (Orbitron)
- Section Headings: text-4xl font-bold (Space Grotesk)
- Wheel Event Names: text-xl font-semibold (Orbitron)
- Body/Form: text-base (Inter)
- Small/Meta: text-sm

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 3, 4, 6, 8, 12, 16, 20
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-20
- Element gaps: gap-4 to gap-6

**Container Strategy**:
- Max width: max-w-2xl for forms, max-w-4xl for wheel
- Mobile-first: Full width with px-4, expand at md: breakpoint

---

## Page 1: Registration Landing

### Hero Section (60vh minimum)
- Animated gradient background with subtle particle effects
- Centered layout with generous vertical spacing
- College logo at top (h-16)
- Event title: "Vimal Jyothi Tech Fest 2025" (text-6xl, Orbitron, gradient text effect)
- Date badge: "October 24, 2025" (pill-shaped, glowing border)
- Tagline: "Register & Spin to Win Free Event Passes!" (text-xl)

### Registration Form (Centered Card)
- Glass-morphic card: backdrop-blur-xl, border with gradient, shadow-2xl
- Width: max-w-md, padding: p-8
- Floating label inputs with smooth transitions
- Phone input with WhatsApp icon prefix (green)
- Glowing focus states matching primary color
- Prominent CTA button: Full-width, gradient background (primary to secondary), shadow-lg, hover lift effect
- Input validation with inline error states (red-500)

### Trust Indicators
- Participant counter at bottom: "Join XXX students already registered"
- Small event preview icons carousel below form

---

## Page 2: Spin the Wheel

### Wheel Interface (Centered, Full Focus)
- Hero element: Circular wheel (400px mobile, 600px desktop)
- 10 equal segments: 5 events (each different vibrant color) + 5 "Better Luck Next Time" (neutral gray)
- Each segment with:
  - Radial gradient fill
  - White border separators (2px)
  - Event name/icon in Orbitron font
  - Subtle inner glow
- Center button: 3D raised appearance, "SPIN" text, pulsing animation
- Pointer/indicator: Arrow shape at top, drop shadow, fixed position

### Wheel Mechanics Visual Feedback
- Spin animation: Smooth easing (cubic-bezier), 4-6 second duration
- Deceleration effect: Ease-out to landing segment
- Confetti explosion for winners (canvas-based particles)
- Glow pulse on winning segment
- Sound-optional toggle (muted by default)

### Result Display (Modal Overlay)
- Full-screen overlay: backdrop-blur-lg, 280 50% 10% at 80% opacity
- Result card: Large centered modal (max-w-lg)

**Winner State**:
- Gradient border animation
- Trophy/star icon (text-6xl)
- "Congratulations!" headline
- Event name in highlighted pill
- "You've won a free pass to [Event Name]!" message
- Share button (WhatsApp pre-filled message)
- Continue browsing CTA

**Better Luck State**:
- Warm amber border
- Supportive icon
- "Better Luck Next Time!" message
- Encouragement text: "Thanks for participating!"
- Explore other events CTA

---

## Component Library

### Buttons
- Primary: Gradient bg, white text, rounded-lg, px-6 py-3, font-semibold, shadow-lg, hover:scale-105 transform
- Secondary: Outline with gradient border, transparent bg, hover:bg-white/10
- Icon buttons: Square, rounded-full, p-3

### Input Fields
- Background: Surface color with 10% opacity border
- Border: 1px, rounded-lg
- Focus: Primary color ring, increased border opacity
- Padding: px-4 py-3
- Label: Absolute positioned, transition on focus to top-left

### Cards
- Glass effect: backdrop-blur-md, bg-surface/30
- Border: 1px gradient (primary/secondary)
- Rounded: rounded-2xl
- Shadow: shadow-xl with colored shadow (primary at 20%)

---

## Animations & Interactions

**Use Sparingly but Impactfully**:
- Wheel spin: Core interaction, smooth physics
- Winner confetti: Burst effect (1.5 seconds)
- Button hover: Subtle scale (1.05) with 200ms transition
- Form validation: Shake animation on error
- Page transitions: Fade (300ms)

**Loading States**:
- Spinner: Circular gradient rotation
- Shimmer effect for async data loads

---

## Images

**Hero Background** (Registration Page):
- Abstract tech/circuit board pattern with purple/cyan color overlay
- Low opacity (20-30%) to maintain text readability
- Subtle parallax scroll effect

**Event Icons** (Wheel Segments):
- Font Awesome icons for event categories
- Mono-color white at 90% opacity
- Size: text-3xl to text-4xl

No large photographic hero images - maintain digital/tech aesthetic throughout.

---

## Mobile Optimization

- Stack all elements vertically
- Wheel scales to 90vw (max 400px)
- Touch-optimized tap targets (min 44px)
- Bottom-fixed spin button on wheel page
- Form inputs with mobile keyboard optimization (type="tel" for phone)