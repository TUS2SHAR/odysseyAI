import { StudySessionPlanSchema, type StudySessionPlan, type AIErrorInfo } from '../types/schema';

/**
 * Extracts raw JSON text from LLM response.
 * Strips markdown wrappers (```json ... ```), removes trailing commas,
 * and locates bracket spans ({...}).
 */
export function extractJSON(text: string): string {
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

  // 3. Fix common trailing commas before brackets
  cleaned = cleaned.replace(/,\s*([\}\]])/g, '$1');

  return cleaned;
}

/**
 * Parses and validates raw AI model response using Zod.
 * Throws structured AIErrorInfo on failure.
 */
export function parseAndValidateStudyPlan(rawText: string): StudySessionPlan {
  let jsonString: string;

  try {
    jsonString = extractJSON(rawText);
  } catch (err: any) {
    const error: AIErrorInfo = {
      type: 'MALFORMED_JSON',
      message: err.message || 'Failed to locate valid JSON structure in response.',
      rawResponse: rawText,
      canRetry: true,
      suggestedAction: 'Try re-submitting your notes or using a sample topic.',
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
      suggestedAction: 'The AI generated invalid syntax. Retrying usually resolves this.',
    };
    throw error;
  }

  // Zod schema validation (including .refine() check)
  const validationResult = StudySessionPlanSchema.safeParse(parsedData);
  if (!validationResult.success) {
    const issues = validationResult.error.issues
      .map(i => `${i.path.join('.')}: ${i.message}`)
      .join('; ');

    const error: AIErrorInfo = {
      type: 'SCHEMA_MISMATCH',
      message: `Zod validation error: ${issues}`,
      rawResponse: jsonString,
      canRetry: true,
      suggestedAction: 'The model omitted required fields or correctIndex was out of bounds.',
    };
    throw error;
  }

  return validationResult.data;
}
