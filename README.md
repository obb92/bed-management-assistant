# Bed Management Assistant Prototype

An AI-powered bed management assistant for hospital **Bed Coordinators** and **Charge Nurses**. CareFlow monitors a synthetic hospital state and generates prioritized, plain-English action recommendations — telling staff exactly what to do and why, without requiring a dashboard analyst in the loop.

> **This is a demo/portfolio prototype**, not a production application. All patient data is synthetic. The only live AI component is the chat interface.

---

## What It Does

Hospitals lose revenue and efficiency when ED patients board while inpatient beds sit dirty, discharges are delayed, and coordinators manually relay information to nurses by phone. CareFlow replaces that loop with:

- **AI Situation Briefing** — a plain-English hospital state summary on login, not a table of scores
- **Prioritized Action Queue** — 3–5 curated action cards per shift, deliberately capped to prevent alert fatigue
- **Discharge Likelihood List** — patients ranked by discharge probability with the specific blocker surfaced for each
- **Bed Status Board** — floor-by-floor color-coded grid with AI-flagged beds likely to clear within 2 hours
- **AI Chat** — free-form questions answered in real-time context using the current hospital state

### Two Personas, One AI

| | Bed Coordinator | Charge Nurse |
|---|---|---|
| Scope | Hospital-wide | Her floor only |
| Primary job | Assign beds, route patients, escalate bottlenecks | Initiate discharges, confirm or flag, arrange transport |
| Feedback role | Receives nurse updates, reroutes decisions | Confirms or flags, feeding coordinator's queue |

The core interaction is a **real-time feedback loop**: when a Charge Nurse confirms or flags an action, the Coordinator's view updates instantly — no phone call required.

---

## Demo Scenarios

Two pre-loaded synthetic hospital states are included:

### 🌙 TC1 — "The 2am Crunch" (Reactive AI)
- 2:15am, 94% occupancy, 6 ED boarders (3 waiting over 4 hours)
- AI identifies one near-discharge (Room 310, Mrs. Garcia) as the fastest path to clearing 2 ED placements
- Demonstrates: multi-signal synthesis, coordinator↔nurse handoff, real-time feedback loop

### ☀️ TC2 — "The Morning Surge" (Predictive AI)
- 7:45am, 8 elective surgical admits arriving in 90 minutes
- AI projects a 3-bed shortfall by 11am before it happens; detects physician sign-off as a systemic bottleneck across 3 floors
- Demonstrates: forward-looking prediction, pattern detection, live AI chat reasoning

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| AI | Anthropic Claude API |
| Backend | Express (Node.js) — serves API routes and proxies AI calls |
| State | React `useState` / `useReducer` — no external state library |
| Routing | None — single page, `activePage` state |
| Database | None |
| Auth | Cosmetic only — login proceeds directly to app |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
git clone https://github.com/obb92/bed-management-assistant.git
cd bed-management-assistant
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

> The API key is only used for the **AI Chat** screen. All other content (briefings, action cards, discharge lists) is hardcoded synthetic data and renders instantly without an API call.

### Run Locally

```bash
npm run dev
```

Navigate to `http://localhost:5173`.

---

## Project Structure

```
src/
├── App.jsx              # Root component, global state, navigation
├── data/
│   ├── tc1.js           # Synthetic hospital state — "The 2am Crunch"
│   └── tc2.js           # Synthetic hospital state — "The Morning Surge"
├── components/
│   ├── Login.jsx
│   ├── Sidebar.jsx
│   ├── TopBar.jsx
│   ├── Home.jsx          # AI Briefing + Stats Bar + Action Queue
│   ├── Discharges.jsx    # Discharge Likelihood List
│   ├── Beds.jsx          # Bed Status Board
│   ├── Chat.jsx          # AI Chat (live Claude API)
│   └── DemoMode.jsx      # Guided overlay + call-out popovers
server/
├── index.ts             # Express server — API routes, AI proxy
```

---

## Demo Mode

A built-in guided overlay walks a presenter through each scenario step by step. Activate it via the **Demo Mode** button in the sidebar or on the login screen.

Each step surfaces a floating call-out with:
- Context (what's happening in the hospital and why it matters)
- An explicit action prompt (what to click or type)
- Back / Next / Skip navigation

Demo mode narrates the live app — it does not fake or mock any interactions. Actions taken during the demo (confirming a discharge, flagging a blocker) update the UI exactly as they would in normal use.

---

## Global State Shape

```javascript
{
  activePage: "home" | "discharges" | "beds" | "chat",
  activePersona: "coordinator" | "nurse",
  activeFloor: "3 South" | "4 North",
  activeScenario: "TC1" | "TC2",
  demoMode: false,
  demoStep: 1,
  actionCardStates: { /* per-card status objects for TC1 and TC2 */ },
  flagText: "",
  chatHistory: [],
}
```

**State reset rules:**
- Switching scenario resets `actionCardStates`, `flagText`, `chatHistory`
- Switching persona does **not** reset state
- Switching scenario does **not** reset `activePersona`

---

## AI Chat — System Prompt

The chat passes a dynamically constructed system prompt with every message, including the full synthetic hospital state as JSON context. The model is instructed to reference actual room numbers, patient names, and timing — never give a generic answer.

For TC2, the chat input is pre-populated with a suggested prompt to reduce live typing risk during demos:

> *"If 412 doesn't clear by 10:30, what are my options for the surgical admit?"*

---

## Feedback Loop Logic

The most important interaction in the app. Implemented entirely in React state — no API call required.

**TC1:** When the 3 South Charge Nurse confirms transport for Mrs. Garcia → Coordinator's Card 2 updates automatically. Bed board Room 310 transitions blue → green → red.

**TC2:** When the 4 North Charge Nurse flags a physician consult blocker on Room 412 → Coordinator's Card 1 updates with the delay and an alternative room recommendation (Room 418, 3 North).

---

## Known Issues / Open Items

| # | Issue | Status |
|---|---|---|
| 1 | Demo overlay anchor targeting (pulsing ring on specific elements) may need manual tuning | Open |
| 2 | TC2 chat pre-fill should reset when switching to TC1 | Open |
| 3 | Bed board tile animation (amber→pulsing) should persist across page navigation | Open |

---

## Important Notes

- **Do not commit your API key.** The `.env` file is in `.gitignore`.
- The AI chat is the **only** component that makes live API calls. All other content is hardcoded and renders without network access.
- If the Claude API call fails, the chat displays: *"Unable to reach AI — check your API key."* The app will not crash.
- This prototype was built as a portfolio project demonstrating AI-assisted clinical workflow design. It is not intended for production use, real patient data, or clinical decision-making.

---

## License

MIT — open for review, learning, and portfolio reference. Not licensed for clinical deployment.
