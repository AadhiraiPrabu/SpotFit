# SpotFit — “Target the spot. Train with purpose.”

A full-stack spot-training fitness web application engineered for purposeful muscle conditioning, progressive overload, and intelligent workout planning without unscientific claims.

---

## 1. Core Fitness Principle

> **“You can specifically train a muscle group, but exercise cannot guarantee that fat will be lost only from that particular body area.”**

SpotFit clearly educates users that resistance training stimulates local muscle fiber hypertrophy, endurance, and postural alignment. Fat oxidation occurs systemically across the whole body through overall caloric expenditure rather than from spot reduction.

---

## 2. Key Features

- **Interactive Anatomical Body Map**: Toggle between **Front** and **Back** views to tap specific muscle groups (Abs, Obliques, Chest, Shoulders, Biceps, Triceps, Lats, Traps, Glutes, Quads, Hamstrings, Calves) and instantly view exercises or start targeted workouts.
- **Intelligent Workout Generator**: 6-step guided wizard configuring Spot, Difficulty, Duration (5 to 30 mins), Equipment, Training Style, and Intensity.
- **100+ Exercise Database**: Comprehensive library with step-by-step instructions, primary and secondary muscle targets, equipment requirements, common mistakes, beginner regressions, progressions, and safety notes.
- **Live Guided Workout Trainer**:
  - Fullscreen immersive interface with circular countdown timer.
  - Set-by-set tracker and rep counter.
  - Audio cues (countdown beeps, go cue, rest chime) via Web Audio API.
  - Dedicated REST interval countdown with positive encouragement.
  - Workout completion celebration with confetti, duration, sets, reps, and calories logged.
- **“I Only Have 5 Minutes” Quick Routines**: Instant presets for 5-Min Abs, 5-Min Arms, 5-Min Legs, 5-Min Glutes, 5-Min Full Body, 5-Min Mobility, and 10/15/20/30-minute filters.
- **Custom Workout Builder**: Name, spot selector, exercise search with drag-and-drop reordering, and customizable sets, reps, duration, and rest intervals.
- **Progress Tracking & Analytics**:
  - Streak tracking (current & longest streaks).
  - Body-area focus distribution breakdown.
  - 7-day weekly active consistency chart.
  - Milestone achievement badges.
  - Active recovery / Rest Day logging.
- **SpotFit AI Coach**: Server-side Gemini 3.8 Flash model (`@google/genai`) providing natural language workout design grounded in the application's actual exercise database.
- **Admin Console**: Add, update, and manage exercises and workout templates with role-based controls.
- **Full-Stack Persistence**: Express server with atomic persistent JSON database preserving user accounts, custom workouts, history, streaks, and favorites across restarts.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Canvas Confetti.
- **Backend**: Node.js, Express 4, `tsx` runtime.
- **Database**: Relational JSON data store (`data/spotfit-db.json`) with atomic writes and schema modeling for `Users`, `Exercises`, `Workouts`, `CompletedWorkouts`, `Achievements`, `Favorites`, and `CustomWorkouts`.
- **AI**: Gemini 3.8 Flash (`@google/genai`) with server-side proxy route `/api/ai/coach`.
- **Authentication**: Salted password hashing via `bcryptjs`, bearer session tokens, and instant 1-click Demo & Admin test accounts.

---

## 4. API Endpoints

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Authenticate user
- `GET /api/auth/me` — Retrieve active user session
- `PUT /api/auth/profile` — Update user preferences & goals
- `GET /api/exercises` — List & filter exercises
- `GET /api/exercises/:id` — Get exercise details
- `GET /api/workouts` — List & filter workouts
- `GET /api/workouts/:id` — Get workout details
- `POST /api/workouts/generate` — Generate targeted routine
- `POST /api/workouts/complete` — Log finished workout session
- `GET /api/history` — Get completed workout timeline
- `GET /api/progress` — Get stats, streak, and charts
- `GET /api/favorites` — Get saved workouts & exercises
- `POST /api/favorites/exercise/:id` — Toggle favorite exercise
- `POST /api/favorites/workout/:id` — Toggle favorite workout
- `GET /api/custom-workouts` — List user custom routines
- `POST /api/custom-workouts` — Create custom routine
- `POST /api/ai/coach` — Ask SpotFit AI Coach
- `POST /api/admin/exercises` — Admin create exercise
- `PUT /api/admin/exercises/:id` — Admin edit exercise
- `DELETE /api/admin/exercises/:id` — Admin delete exercise
