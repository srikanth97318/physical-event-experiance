# SmartCrowd – Real-Time Physical Event Experience Platform

SmartCrowd is a hackathon-ready full-stack project that improves the physical event experience for attendees at large-scale venues such as stadiums, festivals, expos, and concerts.

## What this project solves
- **Crowd movement:** live density awareness across venue zones.
- **Waiting times:** estimated queues for food, restrooms, entry gates.
- **Real-time coordination:** staff/admin can broadcast operational alerts.
- **Seamless experience:** attendees can share live location (with consent) and receive suggestions.

## Core features
### Attendee web app
- Live venue map with zones and crowd level
- Real-time location sharing using browser geolocation
- Nearby zone suggestions and safety guidance
- Queue/wait-time visibility
- Live alerts from organizers
- One-click emergency/panic alert

### Organizer/admin dashboard
- Live occupancy overview by zone
- Connected attendee count
- Recent location updates feed
- Broadcast alerts to attendees
- Live map of active positions (privacy-preserving anonymous IDs)

## Tech stack
### Frontend
- React + Vite
- Socket.IO client
- React Leaflet + OpenStreetMap tiles
- Plain CSS (easy to customize)

### Backend
- Node.js + Express
- Socket.IO
- CORS + dotenv
- In-memory state manager (simple, reliable MVP)

## Project structure
```
SmartCrowd/
  backend/
  frontend/
  .gitignore
  README.md
```

## Quick start
### 1) Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs at `http://localhost:5000`

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

> Allow browser location permissions for real-time tracking.

## Demo users
There is no authentication in this MVP to keep judging friction low. Every client gets an anonymous socket ID. You can add auth later.

## How real-time location tracking works
1. Browser requests geolocation permission.
2. Frontend starts `navigator.geolocation.watchPosition(...)`.
3. Position updates are emitted through Socket.IO.
4. Backend stores the latest attendee location in memory.
5. Backend maps the location to a venue zone using geofencing (simple polygon point-in-zone approximation with rectangles in this MVP).
6. Server broadcasts occupancy and map updates to all clients.

## Privacy notes
- Real-time location is **opt-in** and only active while the page is open.
- The MVP stores anonymous attendee IDs only.
- Location is held in server memory and is not persisted.
- For production, add consent flows, retention policies, and encrypted transport end-to-end.

## Environment variables
### Backend `.env`
```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000
```

## Recommended next upgrades
- Authentication and role-based access (attendee/admin/staff)
- Persistent DB (PostgreSQL + Prisma)
- Push notifications / SMS alerts
- Indoor maps with BLE/WiFi triangulation
- AI prediction for crowd surges
- Camera/IoT integrations
- Emergency evacuation optimizer

## Scripts
### Backend
- `npm run dev` – start with nodemon
- `npm start` – production start

### Frontend
- `npm run dev` – Vite dev server
- `npm run build` – production build
- `npm run preview` – preview build

## Production deployment suggestion
- Frontend: Vercel / Netlify
- Backend: Render / Railway / Fly.io
- DB: Neon / Supabase Postgres

## License
MIT
# physical-event-experiance
# physical-event-experiance
