import { ItineraryPlanSchema, type ItineraryPlan, type AIErrorInfo } from '../types/itinerary';

/**
 * Extracts and cleans raw JSON text from an LLM response string.
 * Handles common LLM syntax flaws like markdown backticks, trailing commas,
 * leading/trailing explanations, or missing closing brackets.
 */
export function extractJSONFromResponse(text: string): string {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty or invalid response received from AI model.');
  }

  let cleaned = text.trim();

  // 1. Remove markdown code blocks if present
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = cleaned.match(codeBlockRegex);
  if (match && match[1]) {
    cleaned = match[1].trim();
  }

  // 2. Find first '{' and last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  } else {
    throw new Error('No valid JSON object boundaries `{}` found in model output.');
  }

  // 3. Fix common JSON syntax errors from LLMs (trailing commas)
  cleaned = cleaned.replace(/,\s*([\}\]])/g, '$1');

  return cleaned;
}

/**
 * Parses raw LLM output into a strongly-typed ItineraryPlan with Zod validation.
 * Throws structured AIErrorInfo on failure.
 */
export function parseAndValidateItinerary(rawText: string): ItineraryPlan {
  let jsonString: string;
  
  try {
    jsonString = extractJSONFromResponse(rawText);
  } catch (err: any) {
    const error: AIErrorInfo = {
      type: 'MALFORMED_JSON',
      message: err.message || 'Failed to locate valid JSON structure in response.',
      rawResponse: rawText,
      canRetry: true,
      suggestedAction: 'Try re-submitting with a more explicit prompt or clear location.',
    };
    throw error;
  }

  let parsedData: unknown;
  try {
    parsedData = JSON.parse(jsonString);
  } catch (err: any) {
    const error: AIErrorInfo = {
      type: 'MALFORMED_JSON',
      message: `JSON Syntax Error: ${err.message}`,
      rawResponse: rawText,
      canRetry: true,
      suggestedAction: 'The AI generated invalid JSON syntax. Retrying usually fixes this.',
    };
    throw error;
  }

  // Validate with Zod
  const validationResult = ItineraryPlanSchema.safeParse(parsedData);
  if (!validationResult.success) {
    const issues = validationResult.error.issues
      .map(i => `${i.path.join('.')}: ${i.message}`)
      .join('; ');

    const error: AIErrorInfo = {
      type: 'SCHEMA_MISMATCH',
      message: `Structured output validation failed: ${issues}`,
      rawResponse: jsonString,
      canRetry: true,
      suggestedAction: 'The model omitted required fields or formatted properties incorrectly.',
    };
    throw error;
  }

  return validationResult.data;
}
