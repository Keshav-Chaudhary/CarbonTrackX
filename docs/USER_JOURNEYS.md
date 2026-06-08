# Core User Journeys

This document outlines the formalized user experience flows within CarbonTrackX. These journeys define the expected inputs, triggered services, and analytical events.

## Journey 1: New User Onboarding & Baseline Generation

**Goal:** Establish the user's initial carbon footprint without forcing them through a tedious 50-question form.

1. **Step 1:** User accesses the web app. (Event: `page_view`)
2. **Step 2:** User clicks "Get Started" and authenticates via Google Sign-In. (Service: *Firebase Auth*, Event: `user_signup`)
3. **Step 3:** User is redirected to `/onboarding`.
4. **Step 4:** The AI Carbon Coach asks 3 conversational questions (e.g., "How do you usually get to work?", "What best describes your diet?").
5. **Step 5:** User responds. (Service: *Vertex AI* parses inputs into structured data).
6. **Step 6:** The `DecisionEngine` calculates the baseline footprint. (Service: *Firestore* saves baseline, Event: `baseline_established`).
7. **Step 7:** User is routed to `/dashboard`.

## Journey 2: Frictionless Activity Tracking

**Goal:** Log daily activities simply, replacing complex drop-downs with natural language.

1. **Step 1:** User visits `/track`.
2. **Step 2:** User types: "I drove 15 miles in my SUV today."
3. **Step 3:** The app sends the string to the API. (Service: *Cloud Run / Express*).
4. **Step 4:** The `AI Firewall` scans the input for prompt injection. (Passes).
5. **Step 5:** Vertex AI extracts intent: `{ activity: "driving", distance: 15, unit: "miles", vehicle: "SUV" }`.
6. **Step 6:** The `DecisionEngine` references the Real Carbon Data Source (`transport-emissions.json`) and calculates `12.4 kg CO2`.
7. **Step 7:** Data is batched and saved. (Service: *Pub/Sub -> BigQuery & Firestore*, Event: `activity_logged`).
8. **Step 8:** UI updates optimistically.

## Journey 3: AI-Driven Reduction Coaching

**Goal:** Receive personalized, actionable advice to reduce emissions.

1. **Step 1:** User navigates to `/coach`.
2. **Step 2:** User clicks "Analyze my week".
3. **Step 3:** API aggregates the past 7 days of activities.
4. **Step 4:** The data is fed into the Gemini context window along with the `assistant-prompt-v1.txt`. (Service: *Gemini API*).
5. **Step 5:** Gemini streams back a personalized insight: "You've done great with recycling, but driving accounts for 80% of your footprint this week. Replacing 2 drives with biking could save X kg CO2."
6. **Step 6:** The UI parses the response and presents a 1-Click Action Button: "Commit to 2 bike rides next week."
7. **Step 7:** User clicks the button. (Service: *Firestore* updates goals, Event: `goal_committed`).

## Journey 4: Offline Resilience

**Goal:** Never lose user data due to connectivity drops.

1. **Step 1:** User loses internet connection. (Event: `offline_mode_activated`).
2. **Step 2:** `connectivity.ts` intercepts the API call for an activity log.
3. **Step 3:** Request is serialized and stored in `IndexedDB`.
4. **Step 4:** UI shows a polite `AccessibleAlert`: "You're offline. Changes are saved locally."
5. **Step 5:** Connection restores. `connectivity.ts` flushes the queue to the API. (Event: `offline_queue_flushed`).
