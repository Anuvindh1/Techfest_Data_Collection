# Vimal Jyothi Tech Fest 2025 - Spin to Win

## Project Overview
A registration and spin-the-wheel web application for Vimal Jyothi Engineering College's tech fest on October 24, 2025. Students register with their name and WhatsApp number, then spin a wheel for a chance to win free event passes.

## Key Features
- **Registration Form**: Collects student name and WhatsApp phone number with validation
- **Interactive Spinning Wheel**: 
  - 6 event segments with unique colors
  - 6 "Better Luck Next Time" segments (neutral gray)
  - Smooth animation with realistic physics
  - Each event limited to 5 winners maximum
- **PostgreSQL Database**: Persistent storage for participant data and winner tracking
- **Result Modal**: Displays win/loss with celebratory animations and WhatsApp sharing
- **Concurrent Support**: Built to handle multiple simultaneous users without conflicts
- **Mobile-First Design**: Responsive layout optimized for all devices

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Drizzle ORM
- **Database**: PostgreSQL (Replit built-in database)
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
├── storage.ts                # Storage abstraction layer
├── storage-postgres.ts       # PostgreSQL implementation
└── storage-memory.ts         # In-memory fallback

shared/
└── schema.ts                 # Shared data models, validation, and Drizzle schema
```

## API Endpoints
- `POST /api/register` - Register a new participant
- `GET /api/participant/:id` - Get participant details
- `GET /api/events` - Get all events with winner counts
- `POST /api/spin/:id` - Spin the wheel for a participant

## Database Schema (PostgreSQL with Drizzle ORM)
```sql
-- participants table
CREATE TABLE participants (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  spin_result VARCHAR,
  timestamp BIGINT NOT NULL
);

-- events table
CREATE TABLE events (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  max_winners INTEGER NOT NULL,
  current_winners INTEGER NOT NULL DEFAULT 0,
  color VARCHAR NOT NULL
);
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

## Database Setup
The application uses **Replit's built-in PostgreSQL database**, which is automatically configured via the `DATABASE_URL` environment variable.

**Features:**
- Automatic connection management
- Persistent storage across server restarts
- Built-in support for rollbacks
- Secure by default (no exposed credentials)

**Schema Management:**
- Run `npm run db:push` to sync schema changes to the database
- Schema is defined using Drizzle ORM in `shared/schema.ts`
- Automatic fallback to in-memory storage if database is unavailable

## Deployment
Configured for Replit deployment with:
- PostgreSQL database (automatically provisioned)
- Express server on port 5000
- Production build optimization
- Concurrent request handling
- WebSocket support for database connections

## Recent Changes
- **Database Migration**: Migrated from Firebase to PostgreSQL for better security and persistence
- **Spinning Wheel Fix**: Fixed text alignment and rotation in wheel segments
- **PostgreSQL Integration**: Using Drizzle ORM with Replit's built-in database
- **Security Improvements**: Removed Firebase dependencies and open security rules
- Beautiful animated UI with gradient backgrounds
- Canvas-based spinning wheel with physics simulation
- Result modal with confetti animation for winners
- WhatsApp sharing functionality
