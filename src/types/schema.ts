import { z } from 'zod';

// Flashcard Schema
export const FlashcardSchema = z.object({
  id: z.string().default(() => 'fc_' + Math.random().toString(36).substring(2, 9)),
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

export type Flashcard = z.infer<typeof FlashcardSchema>;

// Quiz Question Schema with .refine() out-of-bounds safety check
export const QuizQuestionSchema = z
  .object({
    id: z.string().default(() => 'qz_' + Math.random().toString(36).substring(2, 9)),
    question: z.string().min(1, 'Quiz question is required'),
    options: z.array(z.string()).length(4, 'Must provide exactly 4 options'),
    correctIndex: z.number().int().min(0, 'correctIndex must be >= 0'),
    explanation: z.string().default('No explanation provided.'),
  })
  .refine((data) => data.correctIndex < data.options.length, {
    message: 'correctIndex is out of bounds for the options array',
    path: ['correctIndex'],
  });

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

// Full Structured AI Response Schema
export const StudySessionPlanSchema = z.object({
  id: z.string().default(() => 'study_' + Date.now()),
  topic: z.string().min(1, 'Topic title is required'),
  summary: z.string().default('AI synthesized study module from notes.'),
  flashcards: z.array(FlashcardSchema).min(1, 'At least 1 flashcard is required'),
  quiz: z.array(QuizQuestionSchema).min(1, 'At least 1 quiz question is required'),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export type StudySessionPlan = z.infer<typeof StudySessionPlanSchema>;

// Saved Session Schema
export interface SavedStudySession {
  id: string;
  topic: string;
  createdAt: string;
  plan: StudySessionPlan;
  originalNotes: string;
}

// Error state types
export type AIErrorType = 
  | 'MALFORMED_JSON'
  | 'SCHEMA_MISMATCH'
  | 'TIMEOUT'
  | 'RATE_LIMIT'
  | 'NETWORK_ERROR'
  | 'INVALID_KEY'
  | 'UNKNOWN';

export interface AIErrorInfo {
  type: AIErrorType;
  message: string;
  rawResponse?: string;
  canRetry: boolean;
  suggestedAction?: string;
}
