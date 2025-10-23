# Vimal Jyothi Tech Fest 2025 - Spin to Win

## Project Overview
A registration and spin-the-wheel web application for Vimal Jyothi Engineering College's tech fest on October 24, 2025. Students register with their name and WhatsApp number, then spin a wheel for a chance to win free event passes.

## Key Features
- **Registration Form**: Collects student name and WhatsApp phone number with validation
- **Interactive Spinning Wheel**: 
  - 5 event segments with unique colors
  - 5 "Better Luck Next Time" segments (neutral gray)
  - Smooth animation with realistic physics
  - Each event limited to 5 winners maximum
- **Firebase Integration**: Real-time database for storing participant data and tracking winners
- **Result Modal**: Displays win/loss with celebratory animations and WhatsApp sharing
- **Concurrent Support**: Built to handle multiple simultaneous users without conflicts
- **Mobile-First Design**: Responsive layout optimized for all devices

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Firebase Realtime Database
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Shadcn/UI

## Project Structure
```
client/src/
├── pages/
│   ├── registration.tsx     # Landing page with registration form
│   └── spin-wheel.tsx        # Wheel spinning page
├── components/
│   ├── spin-wheel.tsx        # Canvas-based wheel component
│   └── result-modal.tsx      # Win/loss result display
└── App.tsx                   # Main app with routing

server/
├── routes.ts                 # API endpoints
└── firebase.ts               # Firebase configuration

shared/
└── schema.ts                 # Shared data models and validation
```

## API Endpoints
- `POST /api/register` - Register a new participant
- `GET /api/participant/:id` - Get participant details
- `GET /api/events` - Get all events with winner counts
- `POST /api/spin/:id` - Spin the wheel for a participant

## Database Schema (Firebase Realtime Database)
```
participants/
  {participantId}/
    - id: string
    - name: string
    - phone: string
    - spinResult: string | null
    - timestamp: number

events/
  {eventId}/
    - id: string
    - name: string
    - maxWinners: 5
    - currentWinners: number
    - color: string
```

## Design System
- **Primary Color**: Purple (#8B5CF6) - tech fest energy
- **Secondary Color**: Cyan (#06B6D4) - digital excitement
- **Success Color**: Green (#10B981) - winner indication
- **Neutral Color**: Amber (#F59E0B) - better luck indication
- **Fonts**: 
  - Display: Orbitron (futuristic headings)
  - Body: Space Grotesk (modern UI)
  - Text: Inter (readability)

## Key Constraints
- Each event can have maximum 5 winners
- Once all 5 slots are filled for an event, it becomes "Better Luck Next Time"
- Participants can only spin once per registration
- Phone number must be valid WhatsApp format

## Firebase Setup Instructions
**IMPORTANT**: You need to configure Firebase Realtime Database security rules to allow read/write access.

In your Firebase Console:
1. Go to Realtime Database
2. Click on "Rules" tab
3. Set the rules to (for development):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

For production, you should secure these rules properly. Example:
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

## Deployment
Configured for Render deployment with:
- Environment variables for Firebase credentials (already set up)
- Express server on port 5000
- Production build optimization
- Concurrent request handling

## Recent Changes
- Initial setup with complete frontend and backend structure
- Firebase Realtime Database integration
- Beautiful animated UI with gradient backgrounds
- Canvas-based spinning wheel with physics simulation
- Result modal with confetti animation for winners
- WhatsApp sharing functionality
