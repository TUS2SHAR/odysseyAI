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
app.use(express.json({ limit: '1mb' }));

// System instructions for strict JSON generation of Flashcards and Quizzes
const SYSTEM_PROMPT = `
You are a World-Class Lead Educator and Curriculum Architect AI.
Your task is to take free-form study notes, summaries, or topics, and convert them into a structured JSON Study Module.

CRITICAL INSTRUCTIONS:
1. Output ONLY a raw JSON object. Do NOT wrap it in markdown (\`\`\`json). Do NOT add pre/post chatter.
2. Structure requirement:
{
  "topic": "Concise & Descriptive Module Title",
  "summary": "2-sentence overview of core study concepts",
  "flashcards": [
    {
      "id": "fc_1",
      "question": "Clear, testing question",
      "answer": "Comprehensive answer with key facts"
    }
  ],
  "quiz": [
    {
      "id": "qz_1",
      "question": "Multiple choice quiz question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0, (integer 0, 1, 2, or 3 corresponding to correct option)
      "explanation": "Detailed explanation of why this answer is correct"
    }
  ]
}
3. Rules:
- Provide at least 3-5 flashcards.
- Provide at least 3-5 quiz questions.
- Every quiz item MUST have exactly 4 options.
- correctIndex MUST be an integer between 0 and 3 (less than options.length).
`;

// Call Gemini / OpenAI REST API
async function callAIModel(apiKey, promptText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${SYSTEM_PROMPT}\n\nSTUDY NOTES / INPUT:\n${promptText}` }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error('AI provider returned empty response content.');
  }

  return textOutput;
}

// POST endpoint for generating study session
app.post('/api/generate-study-plan', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'MALFORMED_JSON',
          message: 'Please provide non-empty study notes or a topic.',
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
          suggestedAction: 'Add GEMINI_API_KEY to your server .env or click "Load Offline Demo Study Module".',
        },
      });
    }

    const rawText = await callAIModel(apiKey, prompt);
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

// Serve compiled static Vite frontend bundle in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Express 5 compatible catch-all middleware fallback
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

// Bind to 0.0.0.0 host for Render container compatibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Study Assistant Server running on port ${PORT} bound to 0.0.0.0`);
});
