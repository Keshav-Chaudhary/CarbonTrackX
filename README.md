# CarbonTrackX — Intelligent Carbon Footprint Tracker & Analytics Engine

CarbonTrackX is a high-performance, responsive, local-first web application designed to track, analyze, and lower individual carbon footprints. Powered by an equation-based emissions calculation library and complemented by a grounded AI Intelligence Center, CarbonTrackX enables users to catalog their daily footprint and embark on a quantifiable carbon reduction journey.

The application is styled from the ground up using a modern, dark-first Bento Box layout with semi-transparent card borders and custom styling with a consistent design language across every page — featuring smooth staggered entrance animations (`rise` + `fade-in`), hover glow effects, rounded bento cards, and a responsive CSS grid layout.

<div align="center">
  <img src="./public/Demo_gif.gif" alt="CarbonTrackX App Demo" width="800" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
  
  <br><br>
  
  <h3>🔥 Try CarbonTrackX Live!</h3>
  <a href="https://app.supademo.com/demo/cmq6ope4m4xg5qm6uoh67y6xi?preview=true&step=1" target="_blank">
    <img src="https://img.shields.io/badge/Launch%20Interactive%20Demo-10b981?style=for-the-badge&logo=youtube&logoColor=white" alt="Interactive Demo" />
  </a>
  <p><em>Click the button above to explore the interactive walkthrough.</em></p>
</div>

---

## AI Evaluation Scores
<img width="1230" height="443" alt="image" src="https://github.com/user-attachments/assets/d45de00d-962a-47e6-b2bc-e5bbf7c55e20" />

We are proud to share that CarbonTrackX achieves a perfect **100/100** score in the AI evaluation suite across all engineering Except Code Quality parameters:

| Category | Score | Audit Reference |
| :--- | :---: | :--- |
| **Code Quality** | 89/100 | [CODE_QUALITY.md](file:///d:/Side_Projects/001_H2Skill/PromptWars_Challenge3/CODE_QUALITY.md) |
| **Security** | 100/100 | [SECURITY.md](file:///d:/Side_Projects/001_H2Skill/PromptWars_Challenge3/SECURITY.md) |
| **Efficiency** | 100/100 | [EFFICIENCY.md](file:///d:/Side_Projects/001_H2Skill/PromptWars_Challenge3/EFFICIENCY.md) |
| **Testing** | 100/100 | [TESTING.md](file:///d:/Side_Projects/001_H2Skill/PromptWars_Challenge3/TESTING.md) |
| **Accessibility** | 100/100 | [ACCESSIBILITY.md](file:///d:/Side_Projects/001_H2Skill/PromptWars_Challenge3/ACCESSIBILITY.md) |
| **Problem Statement Alignment** | 100/100 | [README.md](file:///d:/Side_Projects/001_H2Skill/PromptWars_Challenge3/README.md) |

---

## Table of Contents

- [Key Features](#key-features)
- [System Architecture & Flow](#system-architecture--flow)
- [Tech Stack & Technical Rationale](#tech-stack--technical-rationale)
- [Project Directory Structure](#project-directory-structure)
- [Local Development Setup](#local-development-setup)
- [AI Assistant & Inference Configuration](#ai-assistant--inference-configuration)
- [Google Cloud Deployment](#google-cloud-deployment)
- [Testing Suite](#testing-suite)
- [Accessibility (a11y) Implementation](#accessibility-a11y-implementation)
- [Security Hardening](#security-hardening)

---

## Key Features

### 1. Bento-Box Dashboard
- **Engine Vitals HUD:** Compact stats strip showing total logged CO₂e, daily average, and daily target at a glance.
- **Emission Trajectory Chart:** Full-width trend chart tracking daily emissions over the past week.
- **Sector Allocation:** SVG-powered breakdown chart mapping footprints to their contributing categories.
- **Dynamic Goal Progress:** Custom linear bar showing daily target consumption with live percentage.
- **Carbon Score:** A 0–100 score benchmarked against global averages, with severity labels.
- **Actionable Advice Panel:** Top 3 AI-generated insights surfaced directly on the dashboard.
- **Staggered Animations:** Every card enters the viewport with a coordinated `rise` animation (opacity + translateY + blur-out) on page load.

### 2. Telemetry Logger
- **Manual Logging:** Inputs for natural units (km driven, kWh used, meals, flight hours).
- **Preset Quick-Logs:** One-click presets for common activities (commute, beef meal, etc.).
- **Advanced Filtering & Search:** Filter by category, impact level, and date range in a HUD interface.
- **Telemetry Management:** Full JSON import/export, dialog-based editing, and bulk deletion support.

### 3. AI Intelligence Center
- **Hero Search Layout:** When the conversation is empty, a centered chat input area sits over CSS-styled background glow accents — transforming into a standard chat layout the moment the first message is sent.
- **Interactive Control Header:** Displays the **Intelligence Center** branding with a status indicator (System Online / Offline) wired directly to the AI connection state.
- **Streaming Responses:** Replies stream token-by-token using Server-Sent Events for a responsive feel.
- **Smart Suggestion Chips:** Contextual prompt chips (Analyze emissions, Suggest reductions, etc.) rendered below the centered chat input area.
- **Activity Logging via Chat:** The AI can log activities directly from conversation using `[LOG_ACTIVITY:{...}]` markers, silently intercepted and hidden from the UI.
- **Clear Context Warning:** Clicking "Clear Context" triggers a confirmation dialog before wiping the conversation, preventing accidental resets.
- **Local Model Support:** Configurable to run against local Ollama inference (e.g., `llama3.2:1b`) for fully offline, private operation.

### 4. Settings Page
- **Appearance:** Pill toggle (Moon ↔ Sun) for switching Dark / Light mode.
- **Daily Emission Target:** Set a personal daily CO₂e budget, view the IPCC sustainable average, and remove the goal with one click.
- **Data Management:** Stats strip (activity count, total CO₂e, storage KB), JSON export, and a "Clear All Data" action with a confirmation dialog.
- **Privacy Panel:** Status pills confirming Local-Only data storage, LLM-only AI inference, and zero analytics tracking.
- **About Panel:** Version number, emission factor source (IPCC AR6), and framework stack info.

### 5. "Commit to Change" Insights Engine
- **Quantified Swaps:** Computes exact daily savings (e.g., *"Carpooling saves ~2.4 kg CO₂e/day"*).
- **Dynamic Target Adjustment:** Committing to an insight permanently lowers the user's daily carbon limit in the global store.

### 6. Sidebar and Floating Navigation
- **Grouped Sidebar:** Desktop sidebar with nav items grouped by `OVERVIEW`, `INTELLIGENCE`, and `SYSTEM` labels, with active states.
- **Animated Pill Theme Toggle:** The sidebar header features a sliding pill toggle using CSS transitions.
- **Updated External Links:** "The Engine" uses a `Zap` icon and "About" uses a `BookOpen` icon, with a `SquareArrowOutUpRight` framed external link indicator.
- **Floating Glassmorphism Header:** The marketing site has a pill-shaped, backdrop-blurred floating navigation bar.

### 7. Marketing Landing Page
- **Full-Bleed Hero:** Large headline with staggered copy entrance, CTA buttons, and a live mock dashboard preview.
- **Bento Feature Grid:** 2×3 responsive feature grid matching the app's exact card styling.
- **Stats Pulse Bar:** Animated scroll-reveal stats strip.
- **Consistent Branding:** All typography, font weights, and button styles exactly match the app's theme (`font-black`, `bg-[var(--accent)]`, glow shadows).

---

## System Architecture & Flow

```text
┌────────────────────────────────────────────────────────┐
│                   CLIENT ENVIRONMENT                   │
│  (Next.js App Router SPA / Zustand State / Browser)    │
│                                                        │
│   ┌───────────────────┐        ┌───────────────────┐   │
│   │   ActivityForm    │        │  ActivityHistory  │   │
│   └─────────┬─────────┘        └─────────▲─────────┘   │
│             │                            │             │
│             ▼                            │             │
│   ┌─────────────────────────────────────┴──────────┐   │
│   │      Zustand Client Store (Zustand/Persist)    │   │
│   │           • Persisted in localStorage          │   │
│   └─────────────────┬────────────────────▲─────────┘   │
│                     │                    │             │
│                     ▼                    │             │
│   ┌─────────────────────────────────────┴──────────┐   │
│   │        Pure Calculation Engines                │   │
│   │        • Emissions Engine (IPCC AR6 factors)   │   │
│   │        • Insights Rules Engine                 │   │
│   └─────────────────┬──────────────────────────────┘   │
│                     │ Chat Request                     │
│                     ▼ (Payload: Logs Context + Prompt) │
└─────────────────────┼──────────────────────────────────┘
                      │
                      │ HTTPS POST
                      ▼
┌────────────────────────────────────────────────────────┐
│                   SERVER ENVIRONMENT                   │
│                (Next.js API Route / Node)              │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │              /api/assistant                    │   │
│   │  • Request Validation via Zod Schemas          │   │
│   │  • Fixed-Window Client Rate-Limiting           │   │
│   │  • Log Sanitization & Context Grounding        │   │
│   └─────────────────┬──────────────────────────────┘   │
│                     │                                  │
│                     ▼ SSE Stream                       │
│   ┌────────────────────────────────────────────────┐   │
│   │         AI Inference Endpoint                  │   │
│   │  • Google Gemini (default, cloud)              │   │
│   │  • Local Ollama (optional, fully private)      │   │
│   │  • Secure API Key resolution (Server-Only)     │   │
│   └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

---

## Tech Stack & Technical Rationale

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server components + API routes + standalone Docker output. |
| **Language** | TypeScript (Strict Mode) | Type-safety across state, Zod schemas, and API contracts. |
| **State** | Zustand + Persist | Lightweight store that auto-syncs telemetry to `localStorage`. |
| **Validation** | Zod | Single schema used on both client forms and server API routes. |
| **Styling** | Tailwind CSS v4 | Token-driven utilities with a CSS-variable design system. |
| **AI Backend** | Google Gemini / Ollama | OpenAI-compatible endpoint supporting cloud or fully local inference. |
| **Containerisation** | Docker (multi-stage) | Minimal ~150 MB standalone image optimised for Cloud Run. |
| **CI/CD** | Google Cloud Build | Auto-build + push + deploy on every `git push` to `main`. |
| **Unit Testing** | Vitest + Testing Library | High-speed JS test execution with browser-like rendering. |
| **E2E Testing** | Playwright + Axe-Core | Full-browser flows + automated WCAG accessibility scanning. |

---

## Project Directory Structure

```text
├── .github/              # CI/CD Workflows (GitHub Actions)
├── .env.example          # Environment variable template (safe to commit)
├── Dockerfile            # Multi-stage production Docker image
├── cloudbuild.yaml       # Google Cloud Build CI/CD pipeline
├── e2e/                  # Playwright E2E and accessibility test scripts
├── public/               # Static assets, fonts, icons
├── src/
│   ├── app/              # Next.js App Router pages & layouts
│   │   ├── (marketing)/  # Landing page, The Engine, About
│   │   ├── api/          # Secure server endpoints (/api/assistant)
│   │   └── (app)/app/    # Dashboard, Log, Insights, Goals, Assistant, Settings
│   ├── components/
│   │   ├── app/          # Page clients (Dashboard, Log, Insights, Goals, Assistant, Settings)
│   │   ├── charts/       # Custom SVG charts and allocation graphs
│   │   ├── marketing/    # MarketingHeader, MarketingFooter
│   │   ├── nav/          # Sidebar, MobileNav, MobileHeader, Logo, nav-config
│   │   ├── theme/        # ThemeProvider (Dark / Light context)
│   │   └── ui/           # Design System primitives (Button, Dialog, Toast, ThemeToggle…)
│   └── lib/
│       ├── ai/           # LLM config, prompt builder, SSE parser
│       ├── emissions/    # Pure equations & IPCC AR6 emission coefficients
│       ├── insights/     # Deterministic insight rules engine
│       ├── security/     # Security headers & XSS sanitizers
│       └── store/        # Zustand store + helpers + persistence
├── playwright.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

## Local Development Setup

### Prerequisites
- **Node.js** v22.0.0 or higher
- **npm** v10 or higher
- **Ollama** (optional, for local AI inference)

### Installation

```bash
# 1. Clone and install
git clone https://github.com/Keshav-Chaudhary/CarbonTrackX.git
cd CarbonTrackX
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your API key (see AI section below)

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

### Development Commands

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile optimised production build
npm run start        # Serve the production build locally
npm run lint         # ESLint audit
npm run typecheck    # TypeScript check (no emit)
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright E2E + accessibility scans
```

---

## AI Assistant & Inference Configuration

The Intelligence Center works with any OpenAI-compatible endpoint. It defaults to **Google Gemini** in production and can be pointed at a local **Ollama** instance for fully private, offline operation.

### Option A — Google Gemini (Recommended for Production)

1. Get a free API key at [aistudio.google.com](https://aistudio.google.com/apikey)
2. Set in `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   ```

### Option B — Local Ollama (Private, Offline)

```bash
# Pull and start a fast local model
ollama run llama3.2:1b
```

Then in `.env.local`:
```env
GEMINI_BASE_URL=http://127.0.0.1:11434/v1
GEMINI_API_KEY=ollama
GEMINI_MODEL=llama3.2:1b
```

> **Note:** If no API key is configured, the Intelligence Center gracefully shows an "Offline" state. All core footprint logging, charts, and insights remain fully functional.

---

## Google Cloud Deployment

CarbonTrackX is fully containerised and ships with a complete Google Cloud Run deployment pipeline. A single `git push` to `main` triggers an automated build and deploy.

### Files Included

| File | Purpose |
|---|---|
| `Dockerfile` | 3-stage build → minimal ~150 MB production image |
| `cloudbuild.yaml` | Cloud Build: build → push to Container Registry → deploy to Cloud Run |
| `.env.example` | Safe environment template for contributors |

### Quick Deploy Steps

1. **Push your code to GitHub**
2. **Create a GCP project** at [console.cloud.google.com](https://console.cloud.google.com)
3. **Enable APIs:**
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
     containerregistry.googleapis.com secretmanager.googleapis.com
   ```
4. **Store your API key in Secret Manager:**
   ```bash
   echo -n "your_gemini_api_key" | gcloud secrets create GEMINI_API_KEY --data-file=-
   ```
5. **Connect your GitHub repo** in Cloud Build → Triggers, pointing to `cloudbuild.yaml`
6. **Push to `main`** — Cloud Build deploys automatically:
   ```bash
   git push origin main
   # ✅ Live at https://carbontrackx-xxxxx-uc.a.run.app
   ```

> Cloud Run scales to **zero instances** when idle — you only pay for actual requests. Free tier covers most personal projects.

---

## Testing Suite

```bash
npm run test            # Vitest unit tests
npm run test:coverage   # Unit tests with coverage report
npm run test:e2e        # Playwright E2E + Axe accessibility scans
```

Coverage areas include:
- Deterministic emissions engine calculations
- Insight rules and threshold evaluations
- AI prompt construction and context grounding
- SSE stream chunk parsing
- API rate-limiter fixed-window logic
- Zod schema validation on client + server
- Component rendering (React Testing Library)
- Full E2E browser flows (Playwright)
- WCAG automated scans (Axe-Core)
- State persistence across page reloads

---

## Accessibility (a11y) Implementation

Built to WCAG 2.1 AA, validated by automated Axe-Core audits:

- **Strict Contrast:** WCAG AA 4.5:1 ratio across all foreground/background combinations
- **Semantic HTML:** One `<h1>` per page, descending `<h2>`/`<h3>` hierarchy
- **ARIA Landmarks:** `<main>`, `<nav>`, `<header>` explicitly defined
- **Keyboard Skip-to-Content:** Hidden anchor bypassing navigation for keyboard users
- **Focus Trapping:** Dialog modals trap focus while open, restored on close
- **Focus Visible:** High-contrast rings on all interactive elements
- **Reduced Motion:** All animations respect `prefers-reduced-motion: reduce`
- **Screen Reader Labels:** All form controls use explicit `<label>` bindings
- **ARIA Live Regions:** Chat transcript uses `aria-live="polite"` for streaming updates
- **Touch Targets:** Minimum 44×44px interactive areas for mobile usability
- **Color-Agnostic Cues:** Statuses use both color and semantic icons (never color alone)

---

## Security Hardening

- **Server-Side Key Protection:** `GEMINI_API_KEY` locked to server environments via `server-only` directive — never exposed in the client bundle
- **Strict CSP:** Content-Security-Policy limits script execution and restricts fetch origins
- **HSTS:** Forces encrypted connections on all routes
- **Cross-Origin Isolation:** COEP + COOP headers mitigate side-channel attacks
- **Feature Permissions Policy:** Disables camera, microphone, and geolocation by default
- **API Rate Limiting:** Fixed-window throttle on `/api/assistant` to block abuse
- **Zod Validation:** Schema-bound validation on both client and server API boundaries
- **HTML Sanitization:** Strips `<script>` tags and encoded payloads (XSS prevention)
- **Payload Size Limits:** Oversized requests dropped at the API boundary (DoS protection)
- **Local-First Architecture:** Telemetry stays in the user's own `localStorage` — no central database
- **Secret Manager Integration:** Production secrets stored in GCP Secret Manager, never in code or env files committed to git
- **No Analytics Tracking:** Zero third-party pixels, ad scripts, or tracking cookies
