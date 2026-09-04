import { useState, useEffect, useMemo } from 'react';
import type { 
  ItineraryPlan, ViewBlockType, AIErrorInfo, SavedSession, DayPlan, PackingCategory 
} from './types/itinerary';
import { generateItineraryPlan, refineItineraryPlan, type GenerateOptions, getFallbackPlan } from './services/aiService';
import { getSavedSessions, saveSession, deleteSession } from './utils/sessionStore';
import { exportPlanAsJSON, exportPlanAsMarkdown } from './utils/exportUtils';

import { Header } from './components/Header';
import { TripInputForm } from './components/TripInputForm';
import { RefinementBar } from './components/RefinementBar';
import { ErrorAlert } from './components/ErrorAlert';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { SessionDrawer } from './components/SessionDrawer';

import { TimelineBlock } from './components/blocks/TimelineBlock';
import { BudgetBlock } from './components/blocks/BudgetBlock';
import { ChecklistBlock } from './components/blocks/ChecklistBlock';
import { HighlightsBlock } from './components/blocks/HighlightsBlock';

import { MapPin, Calendar, ArrowLeft } from 'lucide-react';

export default function App() {
  const [plan, setPlan] = useState<ItineraryPlan | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [error, setError] = useState<AIErrorInfo | null>(null);
  const [activeViewBlock, setActiveViewBlock] = useState<ViewBlockType>('all');
  const [isMockMode, setIsMockMode] = useState<boolean>(false);

  // Saved Sessions Drawer State
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Load saved sessions on mount
  useEffect(() => {
    setSavedSessions(getSavedSessions());
  }, []);

  // Calculate live sum of all stops cost across days
  const actualCalculatedTotalCost = useMemo(() => {
    if (!plan) return 0;
    let sum = 0;
    plan.days.forEach((day) => {
      day.stops.forEach((stop) => {
        if (stop.estimatedCost && typeof stop.estimatedCost === 'number') {
          sum += stop.estimatedCost;
        }
      });
    });
    return sum;
  }, [plan]);

  // Handle new plan generation
  const handleGenerate = async (options: GenerateOptions) => {
    setIsLoading(true);
    setError(null);
    setOriginalPrompt(options.prompt);

    try {
      const res = await generateItineraryPlan(options);
      setPlan(res.plan);
      setIsMockMode(res.isMock);

      // Auto-save session
      saveSession(res.plan, options.prompt);
      setSavedSessions(getSavedSessions());
      setActiveViewBlock('all');
    } catch (err: any) {
      if (err.type !== 'CANCELLED') {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle refinement prompt loop
  const handleRefine = async (instruction: string) => {
    if (!plan) return;
    setIsRefining(true);
    setError(null);

    try {
      const res = await refineItineraryPlan(plan, instruction);
      setPlan(res.plan);
      setIsMockMode(res.isMock);

      saveSession(res.plan, originalPrompt);
      setSavedSessions(getSavedSessions());
    } catch (err: any) {
      if (err.type !== 'CANCELLED') {
        setError(err);
      }
    } finally {
      setIsRefining(false);
    }
  };

  // Update days when stops reordered/edited/deleted
  const handleUpdateDays = (updatedDays: DayPlan[]) => {
    if (!plan) return;
    const updatedPlan: ItineraryPlan = { ...plan, days: updatedDays };
    setPlan(updatedPlan);
    saveSession(updatedPlan, originalPrompt);
    setSavedSessions(getSavedSessions());
  };

  // Update packing list categories
  const handleUpdateCategories = (updatedCategories: PackingCategory[]) => {
    if (!plan) return;
    const updatedPlan: ItineraryPlan = { ...plan, packingChecklist: updatedCategories };
    setPlan(updatedPlan);
    saveSession(updatedPlan, originalPrompt);
    setSavedSessions(getSavedSessions());
  };

  // Fallback trigger if model fails
  const handleUseOfflineDemo = () => {
    const demo = getFallbackPlan(originalPrompt || 'Paris');
    setPlan(demo);
    setIsMockMode(true);
    setError(null);
    saveSession(demo, originalPrompt || 'Paris Demo');
    setSavedSessions(getSavedSessions());
  };

  // Session drawer actions
  const handleSelectSession = (session: SavedSession) => {
    setPlan(session.plan);
    setOriginalPrompt(session.originalPrompt);
    setError(null);
    setActiveViewBlock('all');
  };

  const handleDeleteSession = (id: string) => {
    const updated = deleteSession(id);
    setSavedSessions(updated);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col bg-gradient-glow font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* App Header */}
      <Header
        activeViewBlock={activeViewBlock}
        onSelectViewBlock={setActiveViewBlock}
        hasPlan={!!plan}
        onNewPlan={() => {
          setPlan(null);
          setError(null);
        }}
        onOpenSavedSessions={() => setIsDrawerOpen(true)}
        savedCount={savedSessions.length}
        onExportJSON={() => plan && exportPlanAsJSON(plan)}
        onExportMarkdown={() => plan && exportPlanAsMarkdown(plan)}
        isMock={isMockMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 space-y-8">
        
        {/* Error State Banner */}
        {error && (
          <ErrorAlert
            error={error}
            onRetry={() => originalPrompt && handleGenerate({ prompt: originalPrompt })}
            onUseFallback={handleUseOfflineDemo}
          />
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Input Form State (when no plan loaded or new plan requested) */}
        {!plan && !isLoading && (
          <div className="py-6 sm:py-12">
            <TripInputForm onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
        )}

        {/* Interactive Workspace (When Plan Generated) */}
        {plan && !isLoading && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Trip Plan Header Banner */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                      {plan.travelerStyle || 'Custom Trip'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Pace: <strong className="text-slate-200 capitalize">{plan.pace}</strong>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {plan.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 flex items-center space-x-2 pt-0.5">
                    <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>{plan.destination}</span>
                    <span className="text-slate-600">•</span>
                    <Calendar className="h-4 w-4 text-pink-400 shrink-0" />
                    <span>{plan.durationDays} Days</span>
                  </p>
                </div>

                <button
                  onClick={() => setPlan(null)}
                  className="self-start sm:self-center flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 transition-all"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Change Prompt</span>
                </button>

              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "{plan.summary}"
              </p>
            </div>

            {/* Refinement Prompt Loop Bar */}
            <RefinementBar onRefine={handleRefine} isRefining={isRefining} />

            {/* Interactive Data Block Displays */}
            <div className="space-y-8">
              
              {/* Timeline Block */}
              {(activeViewBlock === 'all' || activeViewBlock === 'timeline') && (
                <TimelineBlock
                  days={plan.days}
                  currencySymbol={plan.budget.currencySymbol || '$'}
                  onUpdateDays={handleUpdateDays}
                />
              )}

              {/* Budget Chart Block */}
              {(activeViewBlock === 'all' || activeViewBlock === 'budget') && (
                <BudgetBlock
                  budget={plan.budget}
                  actualCalculatedTotal={actualCalculatedTotalCost}
                />
              )}

              {/* Packing Checklist Block */}
              {(activeViewBlock === 'all' || activeViewBlock === 'checklist') && (
                <ChecklistBlock
                  categories={plan.packingChecklist}
                  onUpdateCategories={handleUpdateCategories}
                />
              )}

              {/* Highlights & Insights Block */}
              {(activeViewBlock === 'all' || activeViewBlock === 'highlights') && (
                <HighlightsBlock highlights={plan.highlights} />
              )}

            </div>

          </div>
        )}

      </main>

      {/* Saved Sessions Drawer */}
      <SessionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sessions={savedSessions}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/60 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          OdysseyAI Studio — Built for AI Frontend Internship Assignment • Zero-Crash Resilience System
        </p>
      </footer>

    </div>
  );
}
