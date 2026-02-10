# Task Plan: Frontend Onboarding Implementation

## Goal
Implement a friction-less, two-step onboarding flow for new teachers using React Native, NativeWind, and our existing Backend API.

## Architecture & Flow
1.  **Start Screen (`app/(public)/index.tsx`):** Entry point. Choice between "Log In" and "Get Started".
2.  **Step 1: Registration (`app/(public)/register.tsx`):**
    * Collects core user data (Name, Email, Password, Address, etc.).
    * **API:** Calls `POST /register`.
    * **Outcome:** On success, receives JWT, saves to SecureStore, and auto-logins.
    * **Navigation:** Moves to Step 2 (which is inside the Auth protection).
3.  **Step 2: Instruments (`app/(auth)/onboarding/instruments.tsx`):**
    * **Context:** User is now authenticated.
    * **UI:** Grid of instruments + "Add Other" option.
    * **API:** Calls `PATCH /profile` with `{ instruments: string[] }`.
    * **Outcome:** Redirects to Dashboard.

## Definition of Done (DoD)

### Phase 1: Structure & Components
- [ ] **Navigation:** Set up `_layout` files to handle the transition from Public -> Auth stack smoothly.
- [ ] **Component:** Create `OnboardingProgressBar`.
    -   Props: `step` (1 or 2), `total` (2).
    -   Visual: Green bar (`bg-brand-green`) filling 50% or 100%.
- [ ] **Component:** Create `InstrumentCard`.
    -   State: Selected (Blue border/bg) vs Unselected (White bg).
    -   Content: Icon + Label.

### Phase 2: Step 1 (Register)
- [ ] **UI:** Replicate design `2.1_create_account.png`.
- [ ] **Form:** Inputs for Name, Email, Password, Address, Zip, City, BirthYear.
- [ ] **Validation:** Use `zod` to validate all fields (especially email format and password length).
- [ ] **Logic:**
    -   Submit form to `POST /register`.
    -   Handle 409 Conflict (Email exists) with a user-friendly error.
    -   Save `access_token` to SecureStore.
    -   Update global Auth State (Zustand) to trigger navigation to Step 2.

### Phase 3: Step 2 (Instruments)
- [ ] **UI:** Replicate design `3.1_choose_instruments.png`.
- [ ] **Grid:** Display predefined instruments (Piano, Guitar, Violin, Drums, Winds, etc.).
- [ ] **Interaction:** Multi-select support. Clicking toggles selection state.
- [ ] **"Other" Logic:**
    -   Button to "Add other instrument".
    -   When clicked, reveals a text input field.
    -   Input value is added to the selected array.
- [ ] **Logic:**
    -   "Continue" button calls `PATCH /profile` with the array of strings.
    -   On success, navigate to `(tabs)/index`.

## UI/UX Requirements
-   **Progress:** Step 1 shows "1 / 2" (50% bar). Step 2 shows "2 / 2" (100% bar).
-   **Feedback:** Loading spinners on API calls.
-   **Styling:** Follow `docs/style_guide.md` (Brand Orange for primary actions, Brand Green for progress).