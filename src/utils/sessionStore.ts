import type { ItineraryPlan, SavedSession } from '../types/itinerary';

const STORAGE_KEY = 'odyssey_ai_sessions_v1';

export function getSavedSessions(): SavedSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved sessions:', err);
    return [];
  }
}

export function saveSession(plan: ItineraryPlan, originalPrompt: string): SavedSession {
  const sessions = getSavedSessions();
  const existingIndex = sessions.findIndex(s => s.id === plan.id);

  const sessionData: SavedSession = {
    id: plan.id,
    title: plan.title,
    destination: plan.destination,
    createdAt: new Date().toISOString(),
    plan,
    originalPrompt,
  };

  if (existingIndex >= 0) {
    sessions[existingIndex] = sessionData;
  } else {
    sessions.unshift(sessionData);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return sessionData;
}

export function deleteSession(id: string): SavedSession[] {
  const sessions = getSavedSessions().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return sessions;
}
