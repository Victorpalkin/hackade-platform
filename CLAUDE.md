# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (use to verify no type/build errors)
npm run lint     # Run ESLint (eslint.config.mjs, flat config)
npm start        # Start production server (after build)
```

There are no tests configured in this project.

## Architecture

Next.js 16 App Router application with Firebase backend (Auth + Firestore). Tailwind CSS v4 for styling, Framer Motion for animations.

**Path alias:** `@/*` maps to `./src/*`

### Route Groups

- `src/app/(app)/` — Authenticated routes, wrapped by `AuthGuard` + `TopNav` via its layout
- `src/app/login/` — Google OAuth sign-in
- `src/app/demo/` — Standalone demo mode (no auth required)
- `src/app/api/` — API routes (seed, auth check)

### Data Layer

All Firestore access goes through custom hooks in `src/lib/hooks/`. These use real-time `onSnapshot` listeners and return reactive state. No server components fetch data — it's all client-side.

- `use-auth.ts` — Auth context provider, syncs Firebase auth state to cookies (`firebaseAuthToken`, `userRole`)
- `use-quests.ts` — Quest listing with real-time Firestore
- `use-matching.ts` — Swipe matching logic + team creation + notification creation
- `use-founder-matching.ts` — Founder-side matching flow
- `use-team.ts` — Team data + member role claiming
- `use-provisioning.ts` — War room provisioning state machine
- `use-notifications.ts` — Real-time notification listener
- `use-quest-admin.ts` — Quest CRUD for organizers

### Firebase Setup

- `src/lib/firebase/client.ts` — Client SDK init (uses `NEXT_PUBLIC_FIREBASE_*` env vars)
- `src/lib/firebase/admin.ts` — Admin SDK init (uses `FIREBASE_SERVICE_ACCOUNT_KEY` locally, ADC on Cloud Run)
- `src/lib/firebase/collections.ts` — Typed Firestore collection references with converters
- `src/lib/firebase/auth.ts` — `signInWithGoogle()` and `signOut()` helpers

### Auth & Middleware

`src/middleware.ts` runs on Edge for all non-static routes:
- Checks `__session` or `firebaseAuthToken` cookies for auth
- Role-based blocking via `userRole` cookie (set client-side by `use-auth.ts`)
- `/organizer/*` requires `organizer` role; `/mentor/*` requires `mentor` or `organizer`

### Domain Model

Defined in `src/lib/types.ts`. Key entity: `Project` is the unified model (formerly separate projects + teams) — it contains team members, phase tracking (`forming` → `provisioning` → `building` → `submitted`), and provisioning status.

Firestore collections: `users`, `quests`, `projects`, `swipes`, `submissions`, `notifications`, `helpRequests`, `judgments`

### Component Organization

- `src/components/ui/` — Reusable UI primitives (GlowCard, ArcadeButton, Modal, Terminal, TypingEffect, ProgressChecklist)
- `src/components/scenes/` — Demo mode scenes (Scene1-5), each in its own directory
- `src/components/forms/` — Form components (QuestForm shared between create/edit, CreateProjectForm)
- `src/components/auth/` — AuthGuard, UserMenu
- `src/components/nav/` — TopNav with notification bell

## Deployment

Deployed to Cloud Run on GCP (`hackade-platform-nonprod`, `us-central1`). Uses a Dockerfile for containerized builds. Firestore rules are in `firestore.rules`, indexes in `firestore.indexes.json` — deploy with `firebase deploy --only firestore`.
