import { useState, useEffect } from 'react';
import type { StudySessionPlan, AIErrorInfo, SavedStudySession } from './types/schema';
import { generateStudyPlan, type GenerateStudyOptions, getFallbackStudyPlan } from './services/api';
import { getSavedSessions, saveSession, deleteSession } from './utils/sessionStore';

import { Header } from './components/Header';
import { NotesInputForm } from './components/NotesInputForm';
import { FlashcardDeck } from './components/FlashcardDeck';
import { QuizEngine } from './components/QuizEngine';
import { FallbackInspector } from './components/FallbackInspector';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { SessionDrawer } from './components/SessionDrawer';
import { Globe3D } from './components/Globe3D';

import { ArrowLeft, BookOpen, Layers, HelpCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [plan, setPlan] = useState<StudySessionPlan | null>(null);
  const [originalNotes, setOriginalNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AIErrorInfo | null>(null);
  const [isMockMode, setIsMockMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'flashcards' | 'quiz'>('all');

  // Saved Sessions Drawer State
  const [savedSessions, setSavedSessions] = useState<SavedStudySession[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Load saved sessions on mount
  useEffect(() => {
    setSavedSessions(getSavedSessions());
  }, []);

  // Handle study module generation
  const handleGenerate = async (options: GenerateStudyOptions) => {
    setIsLoading(true);
    setError(null);
    setOriginalNotes(options.prompt);

    try {
      const res = await generateStudyPlan(options);
      setPlan(res.plan);
      setIsMockMode(res.isMock);

      saveSession(res.plan, options.prompt);
      setSavedSessions(getSavedSessions());
      setActiveTab('all');
    } catch (err: any) {
      if (err.type !== 'CANCELLED') {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback trigger if model fails
  const handleUseOfflineDemo = () => {
    const demo = getFallbackStudyPlan(originalNotes || 'Quantum Physics');
    setPlan(demo);
    setIsMockMode(true);
    setError(null);
    saveSession(demo, originalNotes || 'Quantum Physics');
    setSavedSessions(getSavedSessions());
  };

  // Session drawer actions
  const handleSelectSession = (session: SavedStudySession) => {
    setPlan(session.plan);
    setOriginalNotes(session.originalNotes);
    setError(null);
    setActiveTab('all');
  };

  const handleDeleteSession = (id: string) => {
    const updated = deleteSession(id);
    setSavedSessions(updated);
  };

  return (
    <div className="relative min-h-screen bg-[#06080f] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white overflow-x-hidden">
      
      {/* App Header (Z-Index 30) */}
      <Header
        hasPlan={!!plan}
        onNewSession={() => {
          setPlan(null);
          setError(null);
        }}
        onOpenSavedSessions={() => setIsDrawerOpen(true)}
        savedCount={savedSessions.length}
        isMock={isMockMode}
      />

      {/* Main Content Workspace (Z-Index 10) */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 space-y-8">
        
        {/* Error Fallback Inspector Banner */}
        {error && (
          <FallbackInspector
            error={error}
            onRetry={() => originalNotes && handleGenerate({ prompt: originalNotes })}
            onUseFallback={handleUseOfflineDemo}
          />
        )}

        {/* Telemetry Loading Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Input Form & 3D Holographic Globe Hero */}
        {!plan && !isLoading && (
          <div className="py-4 space-y-6">
            <NotesInputForm onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
        )}

        {/* Interactive Workspace (When Plan Generated) */}
        {plan && !isLoading && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Topic Header Banner */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                      Study Module
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {plan.flashcards.length} Cards • {plan.quiz.length} Quiz Questions
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {plan.topic}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 flex items-center space-x-2 pt-0.5">
                    <BookOpen className="h-4 w-4 text-sky-400 shrink-0" />
                    <span>{plan.summary}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-center">
                  <button
                    onClick={() => setPlan(null)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 transition-all"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Change Notes</span>
                  </button>
                </div>

              </div>

              {/* View Tab Switcher Pills */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'all'
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All Components
                </button>
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                    activeTab === 'flashcards'
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>3D Flashcards ({plan.flashcards.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                    activeTab === 'quiz'
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Quiz Engine ({plan.quiz.length})</span>
                </button>
              </div>

            </div>

            {/* 3D Holographic Globe Component */}
            <Globe3D onSelectPrompt={(p) => setOriginalNotes(p)} />

            {/* Interactive Components Workspace */}
            <div className="space-y-8">
              
              {/* 3D Flashcard Deck */}
              {(activeTab === 'all' || activeTab === 'flashcards') && (
                <FlashcardDeck cards={plan.flashcards} />
              )}

              {/* Interactive Quiz Engine */}
              {(activeTab === 'all' || activeTab === 'quiz') && (
                <QuizEngine quiz={plan.quiz} />
              )}

            </div>

          </div>
        )}

      </main>

      {/* Saved Sessions Drawer (Z-Index 50) */}
      <SessionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sessions={savedSessions}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800/60 bg-[#06080f]/90 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          StudySphere AI — Production Grade Educational Workspace • Zod .refine() Validated Engine
        </p>
      </footer>

    </div>
  );
}
