# StudySphere AI — Interactive 3D Educational Workspace & Quiz Engine

A production-grade, highly resilient React application designed to transform free-form study notes into an interactive educational dashboard featuring a **High-Performance 3D Holographic Globe**, 3D **Flashcard Deck**, and an **Interactive Quiz Engine**.

Built strictly to satisfy the **Frontend Internship Assignment Specifications** with Stripe & Linear inspired telemetry UI, zero-crash error handling, and Zod `.refine()` safety checks.

---

## 🌟 Key Architecture & Specifications Satisfied

### 1. 🎨 Visual & Design Standards (Stripe & Linear Inspired)
- **Dark Cyber-Minimalist Canvas**: `#06080F` to `#0B0F19` background.
- **Glassmorphic Slate Cards**: `bg-slate-900/60 backdrop-blur-md border border-slate-800/80`.
- **Telemetry Accents**: Ice cyan (`#38BDF8`), Electric blue (`#00F5FF`), and laser violet (`#A855F7`).
- **Layered Architecture**:
  - `z-0`: Three.js WebGL 3D Holographic Globe with atmospheric Fresnel rim glow and curved bezier data splines.
  - `z-10`: Interactive workspace (source notes input, flashcard deck, quiz engine).
  - `z-20`: Telemetry HUD, metric cards, and session drawers.

### 2. 🛡️ Defensive AI Output & Edge-Case Handling
- **Resilient JSON Extractor (`jsonParser.ts`)**: Strips markdown backtick wrappers (\`\`\`json), clears trailing commas, and isolates bracket spans (`{...}`).
- **Strict Zod Schema with `.refine()` Check (`schema.ts`)**:
  - Validates `topic`, `flashcards`, and `quiz` arrays.
  - Enforces `correctIndex < options.length` to eliminate out-of-bounds array crashes.
- **Race Condition & Stale Response Guard (`api.ts`)**: Combines `AbortController` with monotonic `requestId` counters to immediately abort superseded network calls.
- **Fallback Inspector (`FallbackInspector.tsx`)**: Renders human-readable validation error messages, a single-click **Retry** button, a collapsible raw output inspection drawer, and a 1-click **Offline Demo Mode**.

### 3. 🧰 Interactive UI Components
- **📚 3D Flashcard Deck**:
  - 3D card-flip animation via CSS 3D transforms (`rotateY(180deg)`).
  - **Keyboard UX**: `Space` or `Enter` to flip card, `ArrowLeft` for previous card, `ArrowRight` for next card.
  - Mastery progress tracking counter and reset toggle.
- **⚡ Interactive Quiz Engine**:
  - 4-option single choice buttons with instant visual feedback (emerald green for correct, rose red for incorrect).
  - Detailed explanation callout boxes upon answer selection.
  - **Targeted Re-test Workflow**: **"Re-test Missed Questions Only"** button isolates wrong answers into a targeted re-test round until 100% mastery is achieved.

### 4. 🔒 Backend Proxy Security
- Express proxy server (`server/index.js`) running on port 3001 bound to `0.0.0.0` for Render deployment readiness. Private API keys are never shipped to the browser.

---

## 🚀 Quick Setup & Local Execution

### 1. Installation
```bash
npm install
```

### 2. Set API Key (Optional)
Create `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```
*(If no API key is set, StudySphere AI runs in Smart Offline Fallback Mode for immediate evaluator testing!)*

### 3. Launch App
```bash
npm start
```
- **App Link**: `http://localhost:3001`

---

## ⏱️ Time Spent Breakdown (~6.5 Hours)

| Phase | Time |
| :--- | :--- |
| **Zod Schema & .refine() Safety Contract** | ~1.0h |
| **Express Proxy & Resilient JSON Extractor** | ~1.5h |
| **3D Flashcard Deck & Quiz Engine Componentry** | ~2.5h |
| **Targeted Re-test Engine & Session Store** | ~1.0h |
| **WebGL 3D Globe & Render Deployment Setup** | ~0.5h |
