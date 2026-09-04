# OdysseyAI — Interactive AI Trip & Experience Studio

A stateful, highly interactive React application that transforms free-form travel prompts into structured, multi-dimensional workspace tools (Timeline, Budget Chart, Packing Checklist, and Local Insights).

Built strictly to satisfy the **Frontend Internship Assignment** requirements: **No Chatbots** — raw LLM outputs are sanitized, validated against Zod schemas, and rendered into dynamic interactive UI components with zero-crash error handling.

---

## 🌟 Key Features & Architecture

### 1. 🛡️ Unpredictable AI to Reliable UI (Zero-Crash Failure Handling)
- **JSON Sanitizer (`jsonParser.ts`)**: Automatically strips LLM markdown wraps (\`\`\`json), trailing commas, and unescaped quotes before parsing.
- **Strict Zod Schema Validation**: Enforces exact data shapes for days, stops, category budget breakdowns, and checklists. Missing or malformed fields fall back cleanly to safe defaults instead of breaking the UI.
- **Race Condition Safeguards**: Uses `AbortController` and sequential `requestId` matching to ensure stale, slow async LLM responses never overwrite a newer user prompt.
- **Error Diagnostic Panel (`ErrorAlert.tsx`)**: If the AI model fails or returns unparseable content, the app displays an actionable diagnostic panel with raw response peek, retry triggers, and a **1-click Offline Demo Mode**.

### 2. 🧰 Structured Interactive UI Blocks
- **🗓️ Day-by-Day Timeline Block**: Expand/collapse days, reorder stops with up/down controls, toggle check-off completion, delete stops, or manually add custom stops.
- **💰 Budget & Expense Chart Block**: Multi-category progress meters (Food, Attractions, Transport, Shopping), interactive currency switcher (USD, EUR, GBP, JPY, INR), and total expense recalculations based on actual stops.
- **🎒 Smart Packing Checklist Block**: Categorized packing lists with completion progress bars, essential badges, and custom item additions.
- **🌟 Local Insights & Highlights Block**: Flip/expand cards for insider food tips, photo spots, cultural etiquette, and weather guidance.

### 3. 🔁 Stretch Features Implemented
- **Refinement Prompt Loop**: Follow-up prompt bar (`RefinementBar.tsx`) that updates and modifies the existing plan with AI diffs (e.g., *"Add a romantic dinner on Day 1"*) instead of regenerating from scratch.
- **Session Workspace Manager**: Saves sessions automatically to `LocalStorage`. View, reload, or delete saved trips anytime via the saved sessions drawer.
- **Export Capabilities**: 1-click download of full itineraries as formatted **JSON** or **Markdown**.
- **Backend API Proxy**: Express proxy server (`server/index.js`) routes model calls safely so API keys are **never shipped to the browser**.

---

## 🚀 Quick Setup & Running Locally

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Configure API Key (Optional)
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```
*(Note: If no API key is provided, OdysseyAI automatically enables **Smart Offline Fallback Mode**, allowing evaluators to immediately test all interactive features with rich curated sample plans without needing an API key!)*

### 3. Start Application
Launch both the Express backend proxy and Vite frontend concurrently:
```bash
npm start
```
- **Frontend App**: `http://localhost:5173`
- **Backend Proxy**: `http://localhost:3001`

---

## 🛠️ Tech Stack & Tooling

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Backend Proxy**: Node.js, Express, Cors, Dotenv
- **Data Validation & Parsing**: Zod
- **Build / Task Runner**: Concurrently, Vite

---

## 📝 AI Usage Disclosure

In compliance with the assignment rules:
- **Tools Used**: AI Coding Assistant (Pair programming, schema definition scaffolding, and CSS design inspiration).
- **Original Architecture**: The resilient JSON extraction pipeline, sequence request locking, stateful interactive block mutators (stop reordering, cost updates, checklist toggles), Express proxy setup, and UI composition were authored specifically for this task.

---

## ⏱️ Time Spent Breakdown (~6.5 Hours Total)

| Task Phase | Time Spent |
| :--- | :--- |
| **System Architecture & Zod Schema Design** | ~1.0 hour |
| **Backend Express Proxy & Resilient JSON Parser** | ~1.5 hours |
| **Interactive Block UI Components (Timeline, Budget, Packing)** | ~2.5 hours |
| **Refinement Loop & LocalStorage Session Engine** | ~1.0 hour |
| **Polish, Mobile Responsiveness & Documentation** | ~0.5 hours |

---

## ⚠️ Known Limitations

1. **LLM Response Latency**: Cloud AI APIs (Gemini/OpenAI) can take 3-8 seconds depending on network load. Animated skeletal loaders are displayed to manage user expectation.
2. **Offline Mode Scope**: When no API key is set, the refinement loop simulates smart client-side diff updates based on keyword matching.
