# Hackade - The Gamified Hackathon Platform

A gamified hackathon platform built with Next.js, Firebase, and Framer Motion. Supports full user journeys for hackers, project founders, organizers, and mentors.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Backend:** Firebase (Auth, Firestore)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Effects:** react-confetti

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+
- Firebase project with Firestore and Google Auth enabled

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd hackade-platform

# Install dependencies
npm install

# Set up Firebase environment variables
cp .env.example .env.local
# Fill in your Firebase config values

# Start the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Personas & Journeys

### Hacker (Primary User)
Browse quests, swipe on projects, match with teams, build, and submit.

**Flow:** `/quests` → `/quests/[id]` → `/quests/[id]/match` → `/teams/[id]` → `/teams/[id]/war-room` → `/teams/[id]/build` → `/teams/[id]/submit`

### Project Founder
Create a project and get notified when hackers match with it.

**Flow:** `/quests/[id]/create-project` → notification bell → `/teams/[id]`

### Organizer
Manage quests, monitor teams, review submissions, and manage user roles.

**Flow:** `/organizer` → `/organizer/quests` → `/organizer/teams` → `/organizer/submissions` → `/organizer/users`

### Mentor
Receive escalation requests from teams and provide help.

**Flow:** `/mentor` (help request queue with claim/resolve)

## Routes

```
/                                → Redirect based on auth state
/login                           → Google sign-in
/demo                            → Demo mode (DemoController)

/quests                          → Quest list (choose a sponsor track)
/quests/[questId]                → Quest detail (description, CTAs)
/quests/[questId]/match          → Swipe matching (Tinder-style)
/quests/[questId]/create-project → Create a project idea

/teams                           → My teams list
/teams/[teamId]                  → Team hub (smart routing by phase)
/teams/[teamId]/war-room         → Tool provisioning dashboard
/teams/[teamId]/build            → Build phase (Panic Button + Vibe Coding)
/teams/[teamId]/submit           → Deploy, record pitch, generate submission

/organizer                       → Organizer dashboard (stats)
/organizer/quests                → Quest CRUD management
/organizer/quests/new            → Create quest form
/organizer/quests/[id]/edit      → Edit quest form
/organizer/teams                 → All teams monitoring
/organizer/submissions           → Submission review & judging
/organizer/users                 → User role management

/mentor                          → Mentor help request queue
```

## Project Structure

```
src/
  app/
    layout.tsx                    # Global layout, fonts, dark theme
    page.tsx                      # Entry point - redirects based on auth
    login/page.tsx                # Google OAuth sign-in
    demo/page.tsx                 # Demo mode (standalone)
    (app)/
      layout.tsx                  # Authenticated layout (AuthGuard + TopNav)
      quests/
        page.tsx                  # Quest list
        [questId]/
          page.tsx                # Quest detail
          match/page.tsx          # Swipe matching
          create-project/page.tsx # Create project form
      teams/
        page.tsx                  # My teams list
        [teamId]/
          page.tsx                # Team hub (smart phase routing)
          war-room/page.tsx       # Provisioning dashboard
          build/page.tsx          # Build phase (SafetyNet)
          submit/page.tsx         # Deploy & submit flow
      organizer/
        layout.tsx                # Organizer sidebar + role guard
        page.tsx                  # Dashboard with stats
        quests/page.tsx           # Quest management
        quests/new/page.tsx       # Create quest
        quests/[questId]/edit/    # Edit quest
        teams/page.tsx            # All teams view
        submissions/page.tsx      # Review & judging
        users/page.tsx            # Role management
      mentor/
        page.tsx                  # Help request queue
  middleware.ts                   # Server-side auth & role-based route protection
  lib/
    types.ts                      # Domain models (UserProfile, Quest, Team, Submission, etc.)
    mock-data.ts                  # Seed/fallback data
    firebase/
      client.ts                   # Firebase client SDK init
      admin.ts                    # Firebase Admin SDK init
      auth.ts                     # Auth helpers (signInWithGoogle, signOut)
      collections.ts              # Typed Firestore collection references
      seed.ts                     # Firestore seeding utility
    hooks/
      use-auth.ts                 # Auth context provider + cookie sync
      use-quests.ts               # Quest data (real-time Firestore)
      use-matching.ts             # Swipe matching + team creation + notifications
      use-team.ts                 # Team data + role claiming
      use-provisioning.ts         # War room provisioning state
      use-notifications.ts        # Real-time notification listener
      use-quest-admin.ts          # Quest CRUD for organizers
  components/
    auth/
      AuthGuard.tsx               # Client-side auth redirect
      UserMenu.tsx                # User avatar dropdown
    nav/
      TopNav.tsx                  # Navigation bar (+ notification bell, organizer link)
    forms/
      CreateProjectForm.tsx       # Project creation form
    ui/                           # Reusable UI components
      GlowCard.tsx                # Glassmorphism card with glow border
      ArcadeButton.tsx            # Styled button with glow/pulse variants
      Modal.tsx                   # Animated modal
      Terminal.tsx                # Terminal emulator
      TypingEffect.tsx            # Typing animation
      ProgressChecklist.tsx       # Animated checklist
    demo/
      DemoController.tsx          # Demo-mode state machine (scenes 1-5)
    scenes/
      Scene1/                     # Quest map, swipe cards, match reveal
      Scene2/                     # Character select
      Scene3/                     # War room
      Scene4/SafetyNet.tsx        # Panic button + vibe coding
      Scene5/DeployFlow.tsx       # Deploy + pitch + submission
```

## Domain Model

### Core Types (`src/lib/types.ts`)

| Type | Description |
|------|-------------|
| `UserProfile` | User with role: `hacker`, `organizer`, or `mentor` |
| `Quest` | Sponsor track with title, description, difficulty, tags, prize |
| `ProjectCard` | Project idea created by a founder |
| `Team` | Team with members, phase tracking (`forming` → `provisioning` → `building` → `submitted`) |
| `Submission` | Persisted submission with teamId, URLs, timestamps |
| `Notification` | Match/join notifications for founders |
| `HelpRequest` | Mentor escalation requests from teams |
| `Judgment` | Organizer scores for submissions |

### Firestore Collections

`users`, `quests`, `projects`, `swipes`, `teams`, `submissions`, `notifications`, `helpRequests`, `judgments`

## Security

### Middleware (`src/middleware.ts`)
- Verifies Firebase auth token cookie on all `/(app)/*` routes
- Redirects unauthenticated users to `/login`
- Blocks non-organizers from `/organizer/*` routes (403)
- Blocks non-mentors from `/mentor/*` routes (403)

### Firestore Rules (`firestore.rules`)
- Users: own profile read/write, organizers can read all + update roles
- Quests: authenticated read, organizer-only write
- Projects: authenticated read/create, owner-only update/delete
- Swipes: authenticated create, own swipes read-only
- Teams: member read/update, organizer read-all, authenticated create
- Submissions: authenticated create/read
- Notifications: own read/update, authenticated create
- Help requests: authenticated create, mentor/organizer read/update
- Judgments: organizer-only create/read

## Team Phase Lifecycle

```
forming → provisioning → building → submitted
   │           │             │           │
   │           │             │           └─ Submit page / summary
   │           │             └─ Build phase (SafetyNet)
   │           └─ War Room (tool provisioning)
   └─ Character Select (role claiming)
```

Returning users are automatically routed to the correct phase when visiting `/teams/[teamId]`.

## Demo Mode

The `/demo` route provides a standalone walkthrough of all 5 scenes, controlled by keyboard and on-screen buttons. This is separate from the authenticated app routes.

| Control | Action |
|---|---|
| **Right Arrow** key | Advance to next scene/phase |
| **Scene dots** (bottom-right) | Jump to any scene (1-5) |
| **UI buttons** | Natural progression |

## Architecture Notes

- **Hook-based data layer** — All data access goes through custom hooks. Backed by Firestore with mock data fallback.
- **Real-time updates** — Firestore `onSnapshot` listeners provide live data across teams, notifications, and provisioning.
- **Phase-based routing** — Teams track their phase in Firestore. The team page auto-routes to the correct step.
- **Notification system** — Match events create notifications for project founders, visible via the bell icon in the nav bar.
- **Role-based access** — Organizer and mentor routes are protected at both middleware and UI levels.
- **Typed domain models** — `lib/types.ts` defines all interfaces that map directly to Firestore documents.
- **Reusable UI components** — `GlowCard`, `ArcadeButton`, `Modal`, `Terminal` are generic and composable.

## Deployment Guide

This guide covers deploying Hackade Platform to a clean GCP project with Cloud Run.

### Prerequisites

- Node.js 20+, npm or pnpm
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) (`gcloud`)
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)
- Docker (for building the Cloud Run container image)

### Step 1: Create GCP Project & Enable APIs

```bash
# Create a new GCP project (or use an existing one)
gcloud projects create <project-id> --name="Hackade Platform"
gcloud config set project <project-id>

# Enable billing (required for Cloud Run)
# Visit https://console.cloud.google.com/billing and link a billing account

# Enable required APIs
gcloud services enable firestore.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### Step 2: Set Up Firebase

```bash
# Add Firebase to your GCP project
firebase projects:addfirebase <project-id>

# Log in to Firebase CLI
firebase login

# Create Firestore database
firebase firestore:databases:create --location=us-central1 --project=<project-id>
```

Then in the [Firebase Console](https://console.firebase.google.com):

1. Go to **Authentication** > **Sign-in method** > Enable **Google** provider
2. Go to **Authentication** > **Settings** > **Authorized domains** > Add your Cloud Run domain (after deploying)
3. Go to **Project Settings** > **General** > **Your apps** > Add a **Web app** to get your Firebase config values

### Step 3: Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with values from Firebase Console > Project Settings > Web App:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

For **local development**, also set `FIREBASE_SERVICE_ACCOUNT_KEY` to a service account key JSON (create one in Firebase Console > Project Settings > Service accounts > Generate new private key). On **Cloud Run**, this is not needed -- Application Default Credentials are used automatically.

### Step 4: Deploy Firestore Rules & Indexes

```bash
firebase use <project-id>
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

This deploys `firestore.rules` and the composite indexes defined in `firestore.indexes.json`.

### Step 5: Seed Initial Data (Optional)

For development, seed sample quests by running the app locally and hitting the seed endpoint:

```bash
npm run dev
# In another terminal:
curl http://localhost:3000/api/seed
```

This is a dev-only route. Alternatively, create quest documents directly in the [Firestore Console](https://console.firebase.google.com/project/_/firestore).

### Step 6: Promote First Organizer

1. Sign in to the app once as a regular user (this creates your hacker profile in Firestore)
2. In the [Firestore Console](https://console.firebase.google.com/project/_/firestore), find your user document in the `users` collection
3. Edit the `role` field from `"hacker"` to `"organizer"`

You can also use the Firebase Admin SDK or Cloud Shell:

```bash
# From Cloud Shell or a local script with admin credentials
node -e "
const admin = require('firebase-admin');
admin.initializeApp();
admin.firestore().collection('users').doc('<your-uid>').update({ role: 'organizer' });
"
```

### Step 7: Build & Deploy to Cloud Run

```bash
# Create an Artifact Registry repository
gcloud artifacts repositories create hackade --repository-format=docker --location=us-central1

# Build the Docker image
docker build -t hackade-platform .

# Tag and push to Artifact Registry
docker tag hackade-platform us-central1-docker.pkg.dev/<project-id>/hackade/hackade-platform:latest
docker push us-central1-docker.pkg.dev/<project-id>/hackade/hackade-platform:latest

# Deploy to Cloud Run
gcloud run deploy hackade-platform \
  --image us-central1-docker.pkg.dev/<project-id>/hackade/hackade-platform:latest \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_API_KEY=...,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...,NEXT_PUBLIC_FIREBASE_PROJECT_ID=...,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...,NEXT_PUBLIC_FIREBASE_APP_ID=..."
```

After deploying, copy the Cloud Run service URL and add it as an **authorized domain** in Firebase Console > Authentication > Settings > Authorized domains.

### Step 8: Verify

1. Visit the Cloud Run service URL
2. Sign in with Google
3. Browse `/quests` to confirm Firestore connectivity
4. After promoting your user to organizer (Step 6), visit `/organizer` to confirm the dashboard loads
