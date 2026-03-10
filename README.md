# Hackade - The Gamified Hackathon Platform

A high-fidelity interactive web prototype for Hackade, a gamified hackathon platform. Built for a live 3-minute pitch demo with MVP-ready architecture.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Effects:** react-confetti

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd hackade-platform

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/
    layout.tsx              # Global layout, fonts (Inter + JetBrains Mono), dark theme
    page.tsx                # Entry point - renders DemoController
    globals.css             # Tailwind + glow/glassmorphism/arcade CSS utilities
  lib/
    types.ts                # Domain model interfaces (Quest, TeamMember, etc.)
    mock-data.ts            # Mock data implementing the types
    hooks/
      use-quests.ts         # Quest/campaign data hook
      use-matching.ts       # Swipe matching logic hook
      use-team.ts           # Team formation hook
      use-provisioning.ts   # War room provisioning hook
  components/
    ui/                     # Reusable generic UI components
      GlowCard.tsx          # Glassmorphism card with glow border
      ArcadeButton.tsx      # Styled button with glow/pulse variants
      Modal.tsx             # Animated modal with backdrop
      Terminal.tsx          # Terminal emulator component
      TypingEffect.tsx      # Typing animation text component
      ProgressChecklist.tsx # Animated checklist component
    demo/
      DemoController.tsx    # Demo-mode state machine (scenes 1-5)
    scenes/
      Scene1/
        CampaignMap.tsx     # Dark grid with quest cards
        SwipeCards.tsx       # Framer Motion drag-x card stack
        MatchReveal.tsx     # "IT'S A MATCH!" arcade animation
      Scene2/
        CharacterSelect.tsx # Arcade character selection screen
      Scene3/
        WarRoom.tsx         # Dashboard with provisioning checklist
      Scene4/
        SafetyNet.tsx       # Panic button + Gemini AI modal + vibe coding terminal
      Scene5/
        DeployFlow.tsx      # Deploy spinner + confetti + submission page
```

## Demo Controls

| Control | Action |
|---|---|
| **Right Arrow** key | Force-advance to the next scene/phase |
| **Scene dots** (bottom-right) | Click to jump directly to any scene (1-5) |
| **UI buttons** | Natural progression through the demo flow |

---

## Demo Script (3 Minutes)

Use this script to walk through the prototype during a live pitch. Each scene flows naturally with button clicks, but you can use the right arrow key as a fallback to advance at any time.

---

### Scene 1: The Matchmaker (~60 seconds)

#### Phase 1 - Campaign Map (15s)

> "Welcome to Hackade. When a hacker joins, they don't see a list of projects - they see a quest map. Each sponsor track is a quest with its own prizes and challenges."

- Point out the three quest cards on screen. The **Google Finance AI Agents Quest** is highlighted as the primary CTA.
- Note the dimmed "Mercenary Mode" button at the bottom (a teaser for solo hackers).
- **Click** the Google Finance quest card to advance.

#### Phase 2 - Swipe Cards (20s)

> "Once you pick a quest, it's time to find your team. We use a swipe-based matching system - think Tinder, but for hackathon projects."

- The first card is **"Generic Dashboard Builder"**. Drag it left (or click the thumbs-down button) to pass.
- The second card is **"AI-Powered Tamagotchi"**. Drag it right (or click the thumbs-up button) to like it.
- The match animation triggers automatically.

#### Phase 3 - Match Reveal (15s)

> "It's a match! Alice wants you on her team as a React Wizard. Both sides swiped right. No more awkward Slack DMs begging for teammates."

- Let the animation play out (avatars slide in, sparkle effects).
- **Click** "Join the Team" to continue.

---

### Scene 2: Character Select (~30 seconds)

> "Now you pick your role. This is the character select screen - arcade style. Every team needs an API Whisperer, a Pixel Pusher, and a Demo God."

- **Click** the first slot ("API Whisperer") to claim it as your role. A checkmark appears.
- The remaining two slots auto-fill after a brief delay (Maya and Jordan join).
- Wait for the **"Enter the War Room"** button to glow, then **click** it.

---

### Scene 3: War Room Provisioning (~30 seconds)

> "The moment your team is formed, Hackade provisions everything you need automatically. Watch."

- The sidebar checklist animates through four items:
  1. Google Chat Space & Meet Link
  2. Shared Figma File
  3. GitHub Starter Kit
  4. Sandbox API Keys
- After the checklist completes, tool widgets populate the main area showing Chat, Meet, Figma, GitHub, and API key details.

> "No more wasting the first two hours setting up infrastructure. Your team hits the ground running."

- **Click** "Continue to Build Phase" in the sidebar.

---

### Scene 4: Safety Net & Vibe Coding (~30 seconds)

> "During the build phase, every team has a safety net."

#### Panic Button (15s)

- **Click** the red **"PANIC!"** button.
- A modal opens with Gemini AI analyzing the problem and typing out a response in real time.
- Point out the "Escalate to Human Mentor" button.

> "If AI can't solve it, one click gets you a real human mentor."

- Close the modal (click X or the backdrop).

#### Vibe Coding (15s)

- **Click** "Start Vibe Coding".
- The terminal types out a Gemini scaffold command and generates code.

> "Hackers can describe what they want in plain English and Gemini scaffolds the code. Vibe coding, built right into the platform."

- Wait for the terminal to finish, then **click** "Ship It!" to continue.

---

### Scene 5: Ship It & Pitch It (~30 seconds)

#### Deploy (10s)

- **Click** "Deploy Project".
- A 2-second spinner runs, then confetti explodes across the screen.
- A live URL appears.

> "One click deploy. No wrestling with hosting configs at 3 AM."

#### Record Pitch (10s)

- **Click** "Record Pitch", then **click** "Start Recording".
- A mock recorder overlay appears with a webcam preview.

> "Built-in pitch recording. No switching to Loom, no upload fumbling."

#### Submit (10s)

- The recorder auto-advances. **Click** "Generate Submission".
- AI scans the project and generates a Devpost-style submission page with project details, tracks, and team info.

> "AI generates your entire submission - description, tracks, team credits. One click and you're done. That's Hackade."

---

### Closing

> "Quest selection, team matching, auto-provisioning, AI safety net, one-click deploy, and AI-generated submissions. We turn a chaotic 48-hour hackathon into a streamlined, gamified experience. Hackade."

---

## Architecture Notes

This prototype is designed to be **MVP-ready**:

- **Hook-based data layer** - All data access goes through custom hooks (`useQuests`, `useMatching`, `useTeam`, `useProvisioning`). Currently backed by mock data in `lib/mock-data.ts`. Swap in real API calls at the hook boundary without touching UI components.
- **Typed domain models** - `lib/types.ts` defines all interfaces (`Quest`, `TeamMember`, `ProjectCard`, etc.). These map directly to future database schemas.
- **Reusable UI components** - `GlowCard`, `ArcadeButton`, `Modal`, `Terminal` are generic and composable, not demo-specific.
- **DemoController is an overlay** - The scenes are standalone components that work independently. The demo controller is a presentation convenience. Each scene maps to a future route (`/quests`, `/match`, `/team`, `/war-room`, `/submit`).
