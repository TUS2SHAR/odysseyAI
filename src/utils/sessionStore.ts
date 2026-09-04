import type { StudySessionPlan, SavedStudySession } from '../types/schema';

const STORAGE_KEY = 'odyssey_study_sessions_v2';

export function getSavedSessions(): SavedStudySession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved study sessions:', err);
    return [];
  }
}

export function saveSession(plan: StudySessionPlan, originalNotes: string): SavedStudySession {
  const sessions = getSavedSessions();
  const existingIndex = sessions.findIndex(s => s.id === plan.id);

  const sessionData: SavedStudySession = {
    id: plan.id,
    topic: plan.topic,
    createdAt: new Date().toISOString(),
    plan,
    originalNotes,
  };

  if (existingIndex >= 0) {
    sessions[existingIndex] = sessionData;
  } else {
    sessions.unshift(sessionData);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return sessionData;
}

export function deleteSession(id: string): SavedStudySession[] {
  const sessions = getSavedSessions().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return sessions;
}
