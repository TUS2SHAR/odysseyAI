import { z } from 'zod';

// Category types
export type StopCategory = 'food' | 'sightseeing' | 'activity' | 'culture' | 'relax' | 'transport' | 'shopping' | 'nightlife';

// Individual Stop Schema
export const ItineraryStopSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  time: z.string().default('Flex'),
  activity: z.string(),
  description: z.string(),
  location: z.string().optional().default(''),
  estimatedCost: z.number().default(0),
  category: z.enum(['food', 'sightseeing', 'activity', 'culture', 'relax', 'transport', 'shopping', 'nightlife']).catch('activity'),
  completed: z.boolean().default(false),
  notes: z.string().optional(),
});

export type ItineraryStop = z.infer<typeof ItineraryStopSchema>;

// Day Plan Schema
export const DayPlanSchema = z.object({
  dayNumber: z.number(),
  theme: z.string().default('Day Exploration'),
  date: z.string().optional(),
  stops: z.array(ItineraryStopSchema).default([]),
});

export type DayPlan = z.infer<typeof DayPlanSchema>;

// Budget Breakdown Schema
export const BudgetCategorySchema = z.object({
  category: z.string(),
  amount: z.number(),
  percentage: z.number().optional(),
  color: z.string().optional().default('#6366f1'),
});

export type BudgetCategory = z.infer<typeof BudgetCategorySchema>;

export const BudgetBreakdownSchema = z.object({
  currency: z.string().default('USD'),
  currencySymbol: z.string().default('$'),
  totalEstimated: z.number(),
  categories: z.array(BudgetCategorySchema).default([]),
  budgetTip: z.string().optional().default('Keep cash handy for small vendors.'),
});

export type BudgetBreakdown = z.infer<typeof BudgetBreakdownSchema>;

// Packing Item & Category Schema
export const PackingItemSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  text: z.string(),
  checked: z.boolean().default(false),
  essential: z.boolean().optional().default(false),
});

export type PackingItem = z.infer<typeof PackingItemSchema>;

export const PackingCategorySchema = z.object({
  category: z.string(),
  items: z.array(PackingItemSchema).default([]),
});

export type PackingCategory = z.infer<typeof PackingCategorySchema>;

// Highlights & Tips Schema
export const HighlightCardSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  title: z.string(),
  category: z.enum(['food', 'culture', 'tip', 'photo', 'weather']).catch('tip'),
  description: z.string(),
  tag: z.string().optional().default('Local Insight'),
});

export type HighlightCard = z.infer<typeof HighlightCardSchema>;

// Full Structured AI Response Plan Schema
export const ItineraryPlanSchema = z.object({
  id: z.string().default(() => 'plan_' + Date.now()),
  title: z.string().default('Your Custom Odyssey Itinerary'),
  destination: z.string(),
  summary: z.string().default('A curated travel plan tailored to your preferences.'),
  durationDays: z.number().default(3),
  pace: z.enum(['relaxed', 'balanced', 'fast-paced']).catch('balanced'),
  travelerStyle: z.string().optional().default('General Traveler'),
  days: z.array(DayPlanSchema).default([]),
  budget: BudgetBreakdownSchema,
  packingChecklist: z.array(PackingCategorySchema).default([]),
  highlights: z.array(HighlightCardSchema).default([]),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export type ItineraryPlan = z.infer<typeof ItineraryPlanSchema>;

// Active View Block Modes for Stretch Feature
export type ViewBlockType = 'all' | 'timeline' | 'budget' | 'checklist' | 'highlights';

// Saved Session Schema
export interface SavedSession {
  id: string;
  title: string;
  destination: string;
  createdAt: string;
  plan: ItineraryPlan;
  originalPrompt: string;
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
