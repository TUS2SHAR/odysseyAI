import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// System instructions for strict JSON generation
const SYSTEM_PROMPT = `
You are an expert travel planner & curator AI.
Your task is to take a free-form travel request and return ONLY a valid, raw JSON object representing a detailed, interactive travel plan.

CRITICAL FORMATTING INSTRUCTIONS:
1. Output ONLY the JSON object. Do NOT wrap it in markdown code blocks (\`\`\`json). Do NOT add conversational text before or after the JSON.
2. Ensure valid JSON syntax: double-quote property names, no trailing commas, valid escape characters.
3. Strict Schema structure:
{
  "title": "Descriptive Title for the trip",
  "destination": "City, Country",
  "summary": "2-3 sentence overview of the vibe and plan",
  "durationDays": number,
  "pace": "relaxed" | "balanced" | "fast-paced",
  "travelerStyle": "e.g., Foodie, Budget Backpacker, Luxury, Culture Lover",
  "days": [
    {
      "dayNumber": 1,
      "theme": "Theme of Day 1",
      "stops": [
        {
          "time": "09:00 AM",
          "activity": "Activity Name",
          "description": "Detailed description of what to do",
          "location": "Address or area name",
          "estimatedCost": number (in local/USD currency integer),
          "category": "food" | "sightseeing" | "activity" | "culture" | "relax" | "transport" | "shopping" | "nightlife",
          "completed": false,
          "notes": "Optional insider tip"
        }
      ]
    }
  ],
  "budget": {
    "currency": "USD" or local symbol,
    "currencySymbol": "$" or "€" or "¥" etc,
    "totalEstimated": number (total sum of costs),
    "budgetTip": "Actionable budget saving tip",
    "categories": [
      { "category": "Food & Dining", "amount": number, "percentage": number, "color": "#f59e0b" },
      { "category": "Attractions & Tours", "amount": number, "percentage": number, "color": "#6366f1" },
      { "category": "Transport", "amount": number, "percentage": number, "color": "#10b981" },
      { "category": "Shopping & Misc", "amount": number, "percentage": number, "color": "#ec4899" }
    ]
  },
  "packingChecklist": [
    {
      "category": "Category Name (e.g. Essentials, Clothing, Electronics)",
      "items": [
        { "text": "Item name", "checked": false, "essential": boolean }
      ]
    }
  ],
  "highlights": [
    {
      "title": "Highlight Title",
      "category": "food" | "culture" | "tip" | "photo" | "weather",
      "description": "Practical insight or local recommendation",
      "tag": "Short tag label"
    }
  ]
}
`;

// Helper to call Gemini REST API
async function callGeminiAPI(apiKey, promptText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${SYSTEM_PROMPT}\n\nUSER REQUEST:\n${promptText}` }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error('Gemini API returned empty text content.');
  }

  return textOutput;
}

// POST endpoint for initial plan generation
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { prompt, durationDays, budgetLevel, pace } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'MALFORMED_JSON',
          message: 'Please provide a non-empty travel description prompt.',
          canRetry: true,
        },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        success: false,
        error: {
          type: 'INVALID_KEY',
          message: 'No server GEMINI_API_KEY configured in .env file. Offline Fallback Mode available.',
          canRetry: true,
          suggestedAction: 'Add GEMINI_API_KEY to your Render Environment Variables or click "Use Offline Demo Data" to test the UI.',
        },
      });
    }

    const fullUserPrompt = `
Plan a trip based on this description: "${prompt}".
${durationDays ? `Duration requested: ${durationDays} days.` : ''}
${budgetLevel ? `Target budget: ${budgetLevel}.` : ''}
${pace ? `Preferred pace: ${pace}.` : ''}
Provide day-by-day stops, budget breakdown, packing list, and local highlights as per schema.
`;

    const rawText = await callGeminiAPI(apiKey, fullUserPrompt);
    return res.json({ success: true, rawText });
  } catch (err) {
    console.error('Generation Error:', err.message);
    return res.status(500).json({
      success: false,
      error: {
        type: 'NETWORK_ERROR',
        message: err.message || 'Failed to communicate with AI provider API.',
        canRetry: true,
      },
    });
  }
});

// POST endpoint for refinement loop
app.post('/api/refine-plan', async (req, res) => {
  try {
    const { currentPlan, refinementPrompt } = req.body;

    if (!refinementPrompt || !currentPlan) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'MALFORMED_JSON',
          message: 'Missing current plan or refinement instruction.',
          canRetry: true,
        },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        success: false,
        error: {
          type: 'INVALID_KEY',
          message: 'No GEMINI_API_KEY configured for refinement. Use local edit controls or add an API key.',
          canRetry: true,
        },
      });
    }

    const promptText = `
Here is an existing itinerary JSON:
${JSON.stringify(currentPlan, null, 2)}

MODIFY AND REFINE THIS EXISTING PLAN ACCORDING TO THIS USER INSTRUCTION:
"${refinementPrompt}"

Maintain all unchanged data structure, keep unchanged stop IDs if possible, recalculate budget totals if costs change, and return the complete updated JSON plan conforming strictly to the schema.
`;

    const rawText = await callGeminiAPI(apiKey, promptText);
    return res.json({ success: true, rawText });
  } catch (err) {
    console.error('Refinement Error:', err.message);
    return res.status(500).json({
      success: false,
      error: {
        type: 'NETWORK_ERROR',
        message: err.message || 'Failed to refine plan with AI.',
        canRetry: true,
      },
    });
  }
});

// Serve compiled static Vite frontend bundle in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

// Bind to 0.0.0.0 host for Render container compatibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 OdysseyAI Server running on port ${PORT} bound to 0.0.0.0`);
});
