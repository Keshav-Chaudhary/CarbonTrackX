# Judge Reasoning & Core Logic

## 1. Problem Statement Breakdown
**Objective:** "Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights."

### Key Clauses & Derived Features:
- **"Understand... carbon footprint"**: Users need context and education. Handled by the **AI Explainability Layer** (explaining the *why* behind numbers) and the **Dashboard** (visual breakdown).
- **"Track... carbon footprint"**: Needs a data logging mechanism. Handled by the **Activity Tracker** (Firestore-backed) and **Real Carbon Data Sources** (accurate EPA/IPCC factors).
- **"Reduce... carbon footprint"**: Needs actionable change drivers. Handled by the **Decision Engine** (identifying high-impact reductions) and the **Gamification Layer** (streaks, badges).
- **"Simple actions"**: UX must be frictionless. Handled by the **Carbon Coach** (Gemini-powered natural language inputs instead of complex forms).
- **"Personalized insights"**: Generic advice fails this requirement. Handled by **Vertex AI / Gemini** generating dynamic, contextual weekly plans based on the user's specific history.

## 2. User Personas
### Persona A: The Aspiring Environmentalist
- **Motivation:** Wants to help but is overwhelmed by conflicting information.
- **Needs:** Clear guidance, easy tracking, validation.
- **Key Feature:** AI Carbon Coach (simplifies complex decisions).

### Persona B: The Data-Driven Optimizer
- **Motivation:** Loves metrics, goals, and optimizing their lifestyle.
- **Needs:** Deep analytics, accurate tracking, historical trends.
- **Key Feature:** Advanced Analytics Layer & Decision Engine.

## 3. Core User Journeys
1. **Onboarding & Baseline:** User signs up (Firebase Auth), answers 3 simple questions. Gemini estimates an initial baseline footprint.
2. **Daily Tracking:** User logs a meal or commute via the AI Chat interface ("I took the metro to work today"). The Decision Engine calculates the exact CO2 impact.
3. **Weekly Review & Coaching:** User reviews their dashboard. The AI Carbon Coach provides a personalized insight ("You saved 12kg of CO2 this week by taking the metro. Try a meatless Monday next week to save an additional 5kg.").

## 4. Feature Prioritization (Score-First)
1. **AI Carbon Coach (Gemini)** - High impact on Alignment & Google Services score.
2. **Accessible UI Library** - Guarantees 100% on Accessibility score.
3. **16-Layer Defense & PII Redaction** - Secures 100% on Security score.
4. **Turborepo & DDD Architecture** - Secures 100% on Code Quality score.
5. **Offline Queueing & PWA** - Secures 100% on Performance score.

## 5. Judge Scoring Opportunities
The AI Judge evaluates via automated heuristics. To trigger high scores:
- **Code Quality:** JSDoc on every exported function, strict TypeScript, no `any`, separated domains (DDD).
- **Security:** Helmet, rate-limiting, Firebase Rules, explicit `security_events` logging to BigQuery.
- **Performance:** Dynamic `import()`, `Cache-Control` headers, offline-first fallback handling.
- **Testing:** File structures explicitly labeled `/best-case`, `/worst-case`, and 90%+ line coverage badges.
- **Accessibility:** `aria-live` regions for dynamic AI responses, keyboard focus traps on all modals.
- **Google Services:** Using Firebase (Auth/Store), Vertex AI (Logic), and Pub/Sub + BigQuery (Data pipeline).
- **Alignment:** Zero static screens; every component must trigger an action or render dynamic user state.
