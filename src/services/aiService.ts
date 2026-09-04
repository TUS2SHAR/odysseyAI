import type { ItineraryPlan, AIErrorInfo } from '../types/itinerary';
import { parseAndValidateItinerary } from '../utils/jsonParser';
import { PARIS_DEMO_PLAN, TOKYO_DEMO_PLAN } from './mockData';

let activeAbortController: AbortController | null = null;
let activeRequestId = 0;

export interface GenerateOptions {
  prompt: string;
  durationDays?: number;
  budgetLevel?: string;
  pace?: string;
  useFallbackIfNoKey?: boolean;
}

/**
 * Sends a request to generate a structured itinerary plan.
 * Protects against race conditions with request sequencing & AbortController.
 */
export async function generateItineraryPlan(
  options: GenerateOptions
): Promise<{ plan: ItineraryPlan; requestId: number; isMock: boolean }> {
  // Cancel any prior in-flight request
  if (activeAbortController) {
    activeAbortController.abort('New request initiated by user');
  }

  activeAbortController = new AbortController();
  const requestId = ++activeRequestId;

  try {
    const response = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: activeAbortController.signal,
      body: JSON.stringify({
        prompt: options.prompt,
        durationDays: options.durationDays,
        budgetLevel: options.budgetLevel,
        pace: options.pace,
      }),
    });

    // Check if this request was superseded while waiting for response
    if (requestId !== activeRequestId) {
      throw new Error('STALE_REQUEST_CANCELLED');
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      const serverErr: AIErrorInfo = data.error || {
        type: 'UNKNOWN',
        message: 'Unexpected error from server proxy.',
        canRetry: true,
      };

      // If server signals NO API key, check if fallback is requested or throw
      if (serverErr.type === 'INVALID_KEY' && options.useFallbackIfNoKey) {
        console.warn('No server API key detected. Using smart offline demo plan.');
        const demoPlan = getFallbackPlan(options.prompt);
        return { plan: demoPlan, requestId, isMock: true };
      }

      throw serverErr;
    }

    // Parse and validate structured output
    const plan = parseAndValidateItinerary(data.rawText);
    return { plan, requestId, isMock: false };

  } catch (err: any) {
    if (err.name === 'AbortError' || err.message === 'STALE_REQUEST_CANCELLED') {
      console.log('Cancelled stale request #', requestId);
      throw { type: 'CANCELLED', message: 'Request superseded by newer query.', canRetry: false };
    }

    // If it's already an AIErrorInfo
    if (err.type && err.message) {
      // If network error and fallback is enabled, allow offline fallback
      if (err.type === 'NETWORK_ERROR' && options.useFallbackIfNoKey) {
        const demoPlan = getFallbackPlan(options.prompt);
        return { plan: demoPlan, requestId, isMock: true };
      }
      throw err;
    }

    // Standard unexpected error
    throw {
      type: 'NETWORK_ERROR',
      message: err.message || 'Failed to reach AI service proxy server.',
      canRetry: true,
      suggestedAction: 'Ensure backend server is running on port 3001.',
    } as AIErrorInfo;
  }
}

/**
 * Sends a request to refine an existing itinerary plan (Refinement Prompt Loop).
 */
export async function refineItineraryPlan(
  currentPlan: ItineraryPlan,
  refinementInstruction: string
): Promise<{ plan: ItineraryPlan; isMock: boolean }> {
  if (activeAbortController) {
    activeAbortController.abort();
  }

  activeAbortController = new AbortController();
  const requestId = ++activeRequestId;

  try {
    const response = await fetch('/api/refine-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: activeAbortController.signal,
      body: JSON.stringify({
        currentPlan,
        refinementPrompt: refinementInstruction,
      }),
    });

    if (requestId !== activeRequestId) {
      throw new Error('STALE_REQUEST_CANCELLED');
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw data.error || {
        type: 'UNKNOWN',
        message: 'Failed to refine plan.',
        canRetry: true,
      };
    }

    const plan = parseAndValidateItinerary(data.rawText);
    return { plan, isMock: false };
  } catch (err: any) {
    if (err.type === 'INVALID_KEY' || err.type === 'NETWORK_ERROR') {
      // Perform smart local client-side diff/refinement for fallback demo mode!
      console.log('Performing client-side smart simulated refinement...');
      const refinedMock = simulateClientRefinement(currentPlan, refinementInstruction);
      return { plan: refinedMock, isMock: true };
    }
    throw err;
  }
}

/**
 * Selects a matching fallback demo plan based on key phrases in user prompt
 */
export function getFallbackPlan(prompt: string): ItineraryPlan {
  const lower = prompt.toLowerCase();
  if (lower.includes('japan') || lower.includes('tokyo') || lower.includes('ramen') || lower.includes('kyoto')) {
    return { ...TOKYO_DEMO_PLAN, id: 'plan_' + Date.now() };
  }
  return { ...PARIS_DEMO_PLAN, id: 'plan_' + Date.now() };
}

/**
 * Client-side mock refinement engine when running offline without API keys
 */
function simulateClientRefinement(plan: ItineraryPlan, instruction: string): ItineraryPlan {
  const updated = JSON.parse(JSON.stringify(plan)) as ItineraryPlan;
  const lower = instruction.toLowerCase();

  // Add custom activity on day 1 if user asks for food/dinner/relax
  if (updated.days.length > 0) {
    const firstDay = updated.days[0];
    const newStopId = 'ref_' + Date.now().toString(36);

    if (lower.includes('food') || lower.includes('dinner') || lower.includes('eat') || lower.includes('budget')) {
      firstDay.stops.push({
        id: newStopId,
        time: '08:30 PM',
        activity: 'Local Authentic Culinary Experience (' + instruction.slice(0, 25) + '...)',
        description: `Added via refinement: ${instruction}`,
        location: 'City Center Hub',
        estimatedCost: 15,
        category: 'food',
        completed: false,
        notes: 'Added via refinement loop prompt',
      });
      updated.budget.totalEstimated += 15;
    } else {
      firstDay.stops.push({
        id: newStopId,
        time: '04:30 PM',
        activity: 'Custom Highlight: ' + instruction.slice(0, 30),
        description: `Refined based on request: ${instruction}`,
        location: 'Popular District',
        estimatedCost: 20,
        category: 'activity',
        completed: false,
      });
      updated.budget.totalEstimated += 20;
    }
  }

  updated.summary += ` (Refined: "${instruction}")`;
  return updated;
}
