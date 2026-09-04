import type { StudySessionPlan, AIErrorInfo } from '../types/schema';
import { parseAndValidateStudyPlan } from '../utils/jsonParser';
import { QUANTUM_PHYSICS_DEMO, REACT_FIBER_DEMO } from './mockData';

let activeAbortController: AbortController | null = null;
let activeRequestId = 0;

export interface GenerateStudyOptions {
  prompt: string;
  useFallbackIfNoKey?: boolean;
}

/**
 * Sends a request to generate a structured study module.
 * Protects against race conditions with monotonic request counters & AbortController.
 */
export async function generateStudyPlan(
  options: GenerateStudyOptions
): Promise<{ plan: StudySessionPlan; requestId: number; isMock: boolean }> {
  // Cancel any prior in-flight request
  if (activeAbortController) {
    activeAbortController.abort('New prompt request initiated by user');
  }

  activeAbortController = new AbortController();
  const requestId = ++activeRequestId;

  try {
    const response = await fetch('/api/generate-study-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: activeAbortController.signal,
      body: JSON.stringify({ prompt: options.prompt }),
    });

    // Verify this request wasn't superseded while waiting for network response
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

      if (serverErr.type === 'INVALID_KEY' && options.useFallbackIfNoKey) {
        console.warn('No server API key detected. Loading smart offline demo study module.');
        const demoPlan = getFallbackStudyPlan(options.prompt);
        return { plan: demoPlan, requestId, isMock: true };
      }

      throw serverErr;
    }

    // Parse and validate with Zod (including correctIndex < options.length check)
    const plan = parseAndValidateStudyPlan(data.rawText);
    return { plan, requestId, isMock: false };

  } catch (err: any) {
    if (err.name === 'AbortError' || err.message === 'STALE_REQUEST_CANCELLED') {
      console.log('Cancelled stale request #', requestId);
      throw { type: 'CANCELLED', message: 'Request superseded by newer prompt.', canRetry: false };
    }

    if (err.type && err.message) {
      if (err.type === 'NETWORK_ERROR' && options.useFallbackIfNoKey) {
        const demoPlan = getFallbackStudyPlan(options.prompt);
        return { plan: demoPlan, requestId, isMock: true };
      }
      throw err;
    }

    throw {
      type: 'NETWORK_ERROR',
      message: err.message || 'Failed to reach AI service proxy server.',
      canRetry: true,
      suggestedAction: 'Ensure backend server is running on port 3001.',
    } as AIErrorInfo;
  }
}

/**
 * Selects fallback offline demo study plan based on prompt keywords
 */
export function getFallbackStudyPlan(prompt: string): StudySessionPlan {
  const lower = prompt.toLowerCase();
  if (lower.includes('react') || lower.includes('fiber') || lower.includes('javascript') || lower.includes('code')) {
    return { ...REACT_FIBER_DEMO, id: 'study_' + Date.now() };
  }
  return { ...QUANTUM_PHYSICS_DEMO, id: 'study_' + Date.now() };
}
