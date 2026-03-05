# CareFlow — AI Bed Management Assistant

## Overview

CareFlow is a demo-ready prototype of an AI-powered hospital bed management assistant for Bed Coordinators and Charge Nurses. Built for Qualified Health's case interview presentation.

## Architecture

- **Frontend**: React (TypeScript) with Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js server (Node.js/TypeScript)
- **AI Integration**: Anthropic Claude API (proxied through server route `/api/chat`)
- **No database** — all data is hardcoded synthetic state in memory
- **No auth** — login is cosmetic only

## Project Structure

```
client/src/
  lib/
    data.ts          # All synthetic hospital data (TC1, TC2 scenarios)
    queryClient.ts   # TanStack Query setup
  context/
    AppContext.tsx   # Global React state (scenario, persona, card states, demo mode)
  components/
    app-sidebar.tsx  # Dark navy sidebar with nav items
    TopBar.tsx       # Top bar with persona switcher, time, occupancy badge
    DemoOverlay.tsx  # Demo mode guided walkthrough + scenario selection modal
  pages/
    LoginPage.tsx    # Cosmetic login screen
    HomePage.tsx     # AI briefing + stats bar + action queue
    DischargePage.tsx # Discharge likelihood table
    BedBoardPage.tsx  # Bed status grid by floor
    ChatPage.tsx      # Live AI chat (hits real Claude API)
server/
  routes.ts         # POST /api/chat - Claude API proxy
```

## Key Features

### Scenarios
- **TC1 "The 2am Crunch"** (2:15am): 94% occupancy, 6 ED boarders, housekeeping dispatch workflow
- **TC2 "The Morning Surge"** (7:45am): 89% occupancy, physician sign-off bottleneck, surgical admit staging

### Personas
- **Bed Coordinator**: Hospital-wide view, full stats, 3 action cards
- **Charge Nurse — 3 South**: Floor-scoped view, nurse-specific cards with Confirm/Flag Blocker
- **Charge Nurse — 4 North**: Floor-scoped view, nurse-specific cards with Confirm/Flag Blocker

### Interactive Feedback Loop
- TC1: Nurse confirms Mrs. Garcia discharge → Coordinator Card 2 updates automatically
- TC1: Coordinator marks Card 1 Done → Bed board tiles 401/403 animate (housekeeping en route)
- TC2: Nurse flags Room 412 blocker → Coordinator Card 1 updates with alternative recommendation

### Demo Mode
- 6-step guided walkthrough for each scenario
- Floating callout card with context + action prompts
- Target element highlighting with pulsing teal ring
- Progress banner at top

### AI Chat
- Live Anthropic Claude API calls (requires `ANTHROPIC_API_KEY` in Replit Secrets)
- System prompt includes full scenario data for context-aware responses
- TC2: pre-filled with "If 412 doesn't clear by 10:30, what are my options for the surgical admit?"
- Typing indicator + graceful error handling

## Design System

- **Background**: Deep navy `#0a0f1e` (sidebar/header), off-white `#f8fafc` (main content)
- **Accent**: Teal `#00d4c8` for CTAs, AI content borders, active states
- **Typography**: Open Sans (system fallback)
- **Status colors**: Red (critical/urgent), Amber (elevated/soon), Green (good/informational)
- Forced dark sidebar regardless of system theme

## Running

The "Start application" workflow runs `npm run dev` which starts Express + Vite on port 5000.

## Environment Variables Required

- `ANTHROPIC_API_KEY` — Required for live AI chat functionality. Add to Replit Secrets.
