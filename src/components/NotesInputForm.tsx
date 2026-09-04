import React, { useState } from 'react';
import { Sparkles, BookOpen, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import type { GenerateStudyOptions } from '../services/api';

interface NotesInputFormProps {
  onGenerate: (options: GenerateStudyOptions) => void;
  isLoading: boolean;
}

const SAMPLE_NOTES = [
  {
    title: '⚛️ Quantum Mechanics',
    notes: 'Wave-particle duality, Heisenberg Uncertainty Principle (Δx · Δp ≥ ħ/2), Schrödinger wave equation, and quantum superposition.',
  },
  {
    title: '⚡ React Fiber Engine',
    notes: 'React Fiber reconciliation algorithm, double buffering strategy (current vs workInProgress tree), render phase vs commit phase interruptibility.',
  },
  {
    title: '🧬 Cell Biology & ATP',
    notes: 'Mitochondria cellular respiration, ATP synthase, glycolysis in cytoplasm, Krebs cycle in mitochondrial matrix, and electron transport chain.',
  },
];

export const NotesInputForm: React.FC<NotesInputFormProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [useFallbackIfNoKey, setUseFallbackIfNoKey] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate({ prompt: prompt.trim(), useFallbackIfNoKey });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Hero Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-300 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
          <span>Interactive 3D AI Study Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Transform Raw Notes into an <br />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Interactive Flashcard & Quiz Workspace
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Paste study notes, lecture transcripts, or topics. Our AI outputs validated structured JSON rendered into interactive 3D flip flashcards and targeted quiz re-testing engines.
        </p>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 sm:p-6 space-y-5 border border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />

        {/* Free-form Textarea */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
            <span className="flex items-center space-x-1.5">
              <BookOpen className="h-4 w-4 text-sky-400" />
              <span>Source Study Notes / Text Input</span>
            </span>
            <span className="text-[10px] text-slate-500 font-normal">Natural Language Input</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder="Paste your lecture notes, textbook summary, or study topic here..."
            className="w-full h-36 rounded-xl glass-input p-4 text-sm text-slate-100 placeholder-slate-500 resize-none focus:ring-2 focus:ring-sky-500/50"
          />
        </div>

        {/* Smart Offline Mode Toggle */}
        <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-800/80">
          <label className="flex items-center space-x-2 text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useFallbackIfNoKey}
              onChange={(e) => setUseFallbackIfNoKey(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-sky-600 focus:ring-sky-500 h-4 w-4"
            />
            <span>Allow offline fallback demo study module if server has no API key</span>
          </label>

          <span className="text-[11px] text-sky-400 font-medium hidden sm:inline flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Zod .refine() Safe</span>
          </span>
        </div>

        {/* Generate Action Button */}
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-white transition-all flex items-center justify-center space-x-2 ${
            isLoading || !prompt.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{isLoading ? 'Synthesizing Study Module...' : 'Generate Flashcards & Interactive Quiz'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>

      </form>

      {/* Quick Sample Notes Section */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center sm:text-left">
          Or try sample study notes:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_NOTES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(sample.notes)}
              className="glass-card glass-card-hover rounded-xl p-3 text-left space-y-1.5 border border-slate-800"
            >
              <div className="text-xs font-bold text-slate-200">{sample.title}</div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                "{sample.notes}"
              </p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
