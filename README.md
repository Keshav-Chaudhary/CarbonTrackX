# CarbonTrackX — Intelligent Carbon Footprint Tracker & Analytics Engine

CarbonTrackX is a high-performance, ultra-premium web application designed to track, analyze, and lower individual carbon footprints. Powered by a deterministic mathematical calculation core and complemented by a grounded AI narrative assistant, CarbonTrackX enables users to catalog their daily footprint and embark on a quantifiable carbon reduction journey. 

The application has been styled from the ground up using a modern, dark-first "Bento Box" glassmorphism theme that features smooth animations, rich transitions, and responsive grid layouts designed to engage and inform.

---

## Table of Contents

- [Target Vertical & Core Philosophy](#target-vertical--core-philosophy)
- [Key Features](#key-features)
- [System Architecture & Flow](#system-architecture--flow)
- [Tech Stack & Technical Rationale](#tech-stack--technical-rationale)
- [Project Directory Structure](#project-directory-structure)
- [Local Development Setup](#local-development-setup)
- [Testing Suite](#testing-suite)
- [Accessibility (a11y) Implementation](#accessibility-a11y-implementation)
- [Security Hardening](#security-hardening)
- [AI Assistant & Inference Configuration](#ai-assistant--inference-configuration)

---

## Target Vertical & Core Philosophy

CarbonTrackX focuses specifically on the **Everyday Individual**. Rather than modeling high-level corporate statistics, CarbonTrackX targets the individual's direct footprint across four primary domains of modern life: **Transport**, **Home Energy**, **Diet**, and **Shopping**.

### The Intelligence is Deterministic; The AI is a Narrator
To prevent hallucinations and guarantee absolute mathematical consistency:
- **Zero AI in Math:** All emission factors, carbon totals, and potential savings calculations are computed deterministically using standard formulas and officially cited emission factors.
- **Context-Bound AI:** The natural language assistant does not formulate opinions or guess stats. It is injected with a structured facts block representing your actual logs, acting purely as an analytical narrator of your numbers.

---

## Key Features

### 1. Bento-Box Dashboard HUD
- **Dynamic Burn Rate:** Displays daily average emission rates alongside sustainable global targets.
- **Sector Allocation:** Features SVG charts mapping carbon footprints to their contributing categories.
- **Micro-Animations:** Fluid, staggered page entrances and hover states bring the data visualization to life.

### 2. Live Telemetry Logger
- **Manual Logging:** Fast inputs for natural units (e.g., flight hours, kilometers driven, meals eaten, kilowatt-hours).
- **Preset Quick-Logs:** One-click presets for common activities (e.g., typical commute, large file transfers, beef meal).
- **Advanced Filtering & Search:** A complete HUD interface to search, filter by category, impact level, and date ranges.
- **Telemetry Management:** Full JSON Import/Export backing up telemetry data directly to/from your system, and bulk deletion support.

### 3. "Commit to Change" Engine
- **Quantified Swaps:** Instead of generic tips, CarbonTrackX computes exact daily savings (e.g., *"Carpooling will save ~2.4 kg CO₂e per day"*).
- **Dynamic Target Adjustment:** Users can commit to specific insights. The engine binds this selection to the global store, recalculating and permanently lowering the user's daily carbon limit.

### 4. Interactive AI Chat
- **Fact-Grounded Conversation:** Ask the assistant about your worst categories, average emissions, or ways to cut down.
- **Streaming Responses:** Streams responses segment-by-segment using Server-Sent Events (SSE) for a responsive interface.

---

## System Architecture & Flow

The following diagram illustrates how user actions propagate through the Zustand store, the deterministic engines, and the secure server-side LLM inference pipeline:

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
│   ┌──────────────────────────────────────┴─────────┐   │
│   │        Zustand Client Store (Zustand/Persist)  │   │
│   │             • Persisted in localStorage        │   │
│   └─────────────────┬────────────────────▲─────────┘   │
│                     │                    │             │
│                     ▼                    │             │
│   ┌──────────────────────────────────────┴─────────┐   │
│   │        Pure Calculation Engines                │   │
│   │        • Emissions Engine (Citations)          │   │
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
│   │         DigitalOcean Gradient Endpoint         │   │
│   │  • Secure API Key resolution (Server-Only)     │   │
│   │  • Llama-3 LLM Inference Streaming             │   │
│   └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

---

## Tech Stack & Technical Rationale

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Combines rapid client-side rendering with secure, server-side API routing. |
| **Language** | TypeScript (Strict Mode) | Guarantees type-safety across custom state variables, Zod schemas, and APIs. |
| **State** | Zustand + Middleware Persist | Lightweight, external state manager that automatically syncs telemetry logs to `localStorage`. |
| **Validation** | Zod | Single schemas define data validations on both client-side components and server-side routes. |
| **Styling** | Tailwind CSS v4 | Provides a token-driven utility core paired with a flexible inline theme engine. |
| **AI Backend** | DigitalOcean Gradient | OpenAI-compatible endpoint hosting Llama models, optimized for secure SSE output streams. |
| **Unit Testing** | Vitest + Testing Library | High-speed, JS-based test execution mimicking browser rendering without heavy setups. |
| **E2E Testing** | Playwright + Axe-Core | Automates full-browser telemetry simulations while enforcing accessibility policies. |

---

## Project Directory Structure

```text
├── .github/              # CI/CD Workflows (GitHub Actions)
├── e2e/                  # Playwright E2E and accessibility test scripts
├── public/               # Static assets, fonts, icons
├── src/
│   ├── app/              # Next.js App Router Page directories & global layout
│   │   ├── (marketing)/  # Marketing landing page & engine details
│   │   ├── api/          # Secure endpoints (/api/assistant)
│   │   └── app/          # Core dashboard, logging, insights & goals panels
│   ├── components/       # Shared reusable UI & layout pieces
│   │   ├── app/          # Dashboard stats, list HUDs, and form items
│   │   ├── charts/       # Custom SVG charts and allocation graphs
│   │   ├── ui/           # Design System primitives (Buttons, Badges, Modals)
│   │   └── theme/        # Light/Dark Theme management context
│   └── lib/              # Client/Server helper functions & computation logic
│       ├── ai/           # LLM prompt builders and SSE parsing mechanics
│       ├── emissions/    # Pure equations & cited emission coefficients
│       ├── insights/     # Deterministic evaluation rules
│       ├── security/     # Global security headers & sanitizers
│       └── store/        # Zustand store definitions and state persistence
├── playwright.config.ts  # Playwright browser automation options
├── tsconfig.json         # Strict TypeScript compiler options
└── vitest.config.ts      # Component and unit test configuration
```

---

## Local Development Setup

### Prerequisites
- **Node.js:** Version 22.0.0 or higher.
- **npm:** Version 10 or higher.

### Installation & Run

1. Clone the project and install local dependencies:
   ```bash
   npm install
   ```

2. Spin up the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

### Development Commands

```bash
# Compile and output optimized build assets
npm run build

# Start the compiled production build locally
npm run start

# Audit code files for formatting and formatting violations
npm run lint

# Run type checks using the TS compiler without compiling files
npm run typecheck
```

---

## Code Quality & Architecture

To ensure high maintainability and prevent technical debt, the application architecture strictly enforces the following 15 code quality pillars:

1. **Strict TypeScript:** Enforces robust type safety, eliminating entire classes of runtime errors.
2. **ESLint Enforcement:** Strictest configuration rules for clean, standard code formatting and syntax checks.
3. **Zod Schema Validation:** Single source of truth for types across client inputs and server endpoints.
4. **Modular Components:** Highly isolated React UI primitives enabling infinite reusability.
5. **Pure Functions:** Business logic isolated from side effects, allowing deterministic math calculations.
6. **Separation of Concerns:** Clear demarcation between data models, UI layers, and external integrations.
7. **Next.js App Router:** Modern file-system based routing enforcing structured API and page directories.
8. **Semantic Naming:** Self-documenting variable and function names describing exact intentions.
9. **No Magic Numbers:** Global constants are meticulously exported and reused from configuration files.
10. **Clean Directory Tree:** Logical folder hierarchies grouping shared hooks, components, and libraries.
11. **Immutability Practices:** Zustand state operates strictly through immutable state updates.
12. **Commented Logic Flow:** JSDoc annotations explain complex function algorithms and input bounds.
13. **Centralized Configuration:** Tailwind config and PostCSS settings abstracted into root configurations.
14. **Custom Error Handling:** Graceful boundary fallbacks preventing unhandled promise rejections.
15. **DRY Principle:** "Don't Repeat Yourself" enforced across shared Tailwind utility classes and calculations.

---

## Efficiency & Performance

The application is heavily optimized for zero-latency interactions and minimum bandwidth consumption:

1. **Server-Side Rendering (SSR):** Next.js pre-renders HTML for an instantaneous First Contentful Paint (FCP).
2. **Minimal Bundle Size:** Tailwind v4 automatically purges unused CSS, generating only necessary style bytes.
3. **Optimized SVGs:** Iconography loaded via efficient Lucide-react components instead of heavy image requests.
4. **Debounced API Calls:** Rapid search inputs and log submissions are debounced to prevent network flood.
5. **Client-Side Navigation:** Instant routing between pages without full browser refreshes.
6. **Streaming LLM Responses:** Server-Sent Events (SSE) provide sub-second time-to-first-token inference.
7. **Local-First Speed:** Zustand + `localStorage` provides zero-latency state restoration and manipulation.
8. **Image Optimization:** Next.js Image component ensures responsive, auto-compressed imagery delivery.
9. **Memoization:** React `useMemo` and `useCallback` implementations prevent unnecessary component re-renders.
10. **Lazy Loading:** Heavy external libraries and layout segments loaded conditionally.
11. **Edge-Ready API:** `/api/assistant` configured for stateless, rapid serverless or edge deployments.
12. **Font Optimization:** `next/font` removes layout shift (CLS) and external font loading latency.
13. **CSS Hardware Acceleration:** Micro-animations utilize `transform` and `opacity` to offload rendering to the GPU.
14. **Efficient DOM Updates:** React 19's concurrent features manage state batching securely.
15. **Cache-Control Headers:** Static assets strongly cached at the CDN/Browser level.

---

## Testing Suite

CarbonTrackX is tested across three independent levels to verify correctness, visual style stability, and code security:

```bash
# Run Vitest unit & component test specifications
npm run test

# Run Vitest tests with test coverage statistics
npm run test:coverage

# Run Playwright E2E scenarios and automated Axe accessibility scans
npm run test:e2e
```

1. **Unit Tests (Vitest):** Asserts pure calculations in the emissions engine for deterministic outcomes.
2. **Deterministic Insight Checks:** Validates insight rules without requiring external API dependencies.
3. **Prompt Construction Tests:** Ensures AI context blocks are assembled accurately from user telemetry.
4. **SSE Stream Parsing Validation:** Checks chunk decoding logic for incomplete or broken stream responses.
5. **Rate Limiter Logic Checks:** Tests fixed-window thresholds and memory bounds to prevent API abuse.
6. **Component Tests (React Testing Library):** Validates modular UI elements (e.g., inputs, selectors, dials) in complete isolation.
7. **End-to-End Simulation (Playwright):** Drives real browser flows for logging, committing, and managing telemetry data.
8. **Automated Accessibility Scanning (Axe-Core):** Runs continuous structural design standard checks at each stage of the E2E UI flow.
9. **Contrast Ratio Assertions:** Automatically verifies foreground and background combinations against strict WCAG AA 4.5:1 standards.
10. **State Persistence Tests:** Ensures local Zustand storage correctly hydrates and persists data across page reloads.
11. **Form Validation Checks (Zod):** Verifies that malformed inputs are rejected gracefully with helpful UI messages.
12. **Network Resilience Testing:** Validates application behavior and fallback logic under API timeouts or missing environment keys.
13. **Routing and Navigation Assertions:** Confirms Next.js App Router transitions and layout states function flawlessly.
14. **Cross-Browser Compatibility:** Leverages Playwright to ensure the application acts identically across Chromium, WebKit, and Firefox rendering engines.
15. **CI/CD Integration:** Automatically triggers unit and E2E suites on every pull request via GitHub Actions to block breaking changes.

---

## Accessibility (a11y) Implementation

CarbonTrackX was designed with a strict adherence to WCAG 2.1 AA requirements, scoring flawlessly on automated Axe-Core audits across 15 distinct accessibility vectors:

1. **Strict Contrast Standards:** WCAG AA 4.5:1 ratio enforced across all background and foreground combinations.
2. **Semantic Structure:** One `<h1>` per page with properly descending `<h2>` and `<h3>` tags.
3. **ARIA Landmarks:** `<main>`, `<nav>`, and `<header>` roles explicitly defined for screen reader navigation.
4. **Keyboard Skip-to-Content:** Hidden anchor allowing keyboard users to bypass heavy navigation bars.
5. **Screen Reader Support:** Form controls are strictly bound using explicit `<label>` elements.
6. **Descriptive Errors:** `aria-describedby` and `aria-errormessage` dynamically read failed input criteria.
7. **Linear Focus Management:** Tab ordering flows naturally without confusing DOM jumps.
8. **Focus Visible Indication:** `focus-visible` CSS utilities draw high-contrast rings around active elements.
9. **Focus Trapping:** Modal dialogs constrain keyboard traversal to prevent background manipulation.
10. **Reduced Motion Triggers:** Background flows and animations lock down under `prefers-reduced-motion: reduce`.
11. **Custom ARIA Roles:** Complex dropdowns mimic standard `<select>` inputs via interactive `listbox` roles.
12. **Image Alt Text:** All informative SVGs/images feature explicit descriptive alternatives.
13. **Hidden Decorative Elements:** Non-essential background glows utilize `aria-hidden="true"`.
14. **Touch Targets:** Interactive buttons sized to a minimum 44x44px for easy mobile tap interactions.
15. **Color-Agnostic Cues:** System statuses use both color and semantic icons (e.g., Warning Triangle + Amber).

---

## Security Hardening

To safeguard user sessions and API keys, the codebase enforces multiple defense layers:

- **Server-Side Key Protection:** The LLM API key (`DO_INFERENCE_API_KEY`) is strictly locked to backend environments using the `server-only` directive.
- **Environment Variable Splitting:** Strict separation of `NEXT_PUBLIC_` client variables from sensitive server tokens to prevent bundle leakage.
- **Strict Content Security Policy (CSP):** Limits the execution of unauthorized scripts and restricts fetching to trusted external resources.
- **HTTP Strict Transport Security (HSTS):** Enforces secure, encrypted connections across all routes to prevent downgrade attacks.
- **Cross-Origin Isolation:** Employs Cross-Origin-Embedder-Policy (COEP) and Cross-Origin-Opener-Policy (COOP) to mitigate side-channel vulnerabilities.
- **Feature Permissions Policy:** Locks down unnecessary device APIs (like camera, geolocation, and microphone) by default.
- **API Rate Limiting:** Protects the `/api/assistant` route using a robust sliding window algorithm to throttle brute force or volumetric abuse.
- **Zod Input Validation:** Validates schema bounds strictly on both the client interface and server API endpoints.
- **HTML/Script Sanitization:** Actively strips `<script>` tags and encoded payloads to prevent prompt-injection formats and Cross-Site Scripting (XSS).
- **Payload Size Limits:** Drops overly large requests at the Next.js API boundary to protect against Denial of Service (DoS) and buffer overflows.
- **Local-First Architecture:** Keeps private telemetry data constrained entirely to the user's `localStorage`, avoiding central database breaches.
- **CORS Hardening:** Restricts cross-origin resource sharing to trusted origins only, blocking unauthorized external application requests.
- **Dependency Scanning:** Utilizes automated `npm audit` pipelines to block the introduction of known vulnerable packages in the dependency tree.
- **Zero-Trust Client Assumption:** Re-calculates state variables deterministically on the server route instead of trusting client-side math.
- **No Analytics Tracking:** Protects user privacy by ensuring zero third-party telemetry, ad-pixels, or tracking cookies are loaded into the browser.

---

## AI Assistant & Inference Configuration

The chat helper operates optionally. When active, it targets DigitalOcean's Gradient Inference endpoint (offering OpenAI endpoint compatibility).

To enable full chat functionalities locally:

1. Create a local environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Input your inference key:
   ```bash
   DO_INFERENCE_API_KEY="your-gradient-key-here"
   ```

*Note: If no API key is specified, the assistant chat panel gracefully transitions to a demo mode, leaving all core footprint logging, history, charts, and rule calculators fully functional.*
