import React, { useState } from 'react';
import { Sparkles, MapPin, Calendar, Wallet, Zap, ArrowRight, Globe as GlobeIcon } from 'lucide-react';
import type { GenerateOptions } from '../services/aiService';
import { Globe3D } from './Globe3D';

interface TripInputFormProps {
  onGenerate: (options: GenerateOptions) => void;
  isLoading: boolean;
}

const PRESET_PROMPTS = [
  {
    title: '🇫🇷 Paris Art & Seine Cruise',
    prompt: 'Plan a romantic 3-day Paris trip focused on impressionist museums, Montmartre cafes, and a Seine sunset cruise.',
    duration: 3,
    budget: 'Moderate (€100-200/day)',
    pace: 'balanced',
  },
  {
    title: '🇯🇵 Tokyo Street Food & Anime',
    prompt: 'Create a 4-day Tokyo itinerary exploring Asakusa temples, Shibuya Sky, street food in Harajuku, and Akihabara gadgets.',
    duration: 4,
    budget: 'Moderate (¥15,000/day)',
    pace: 'fast-paced',
  },
  {
    title: '🇮🇹 Amalfi Coast Relaxed Escapes',
    prompt: 'A 3-day relaxed coastal retreat in Amalfi Coast with cliffside limoncello tasting, boat tour to Capri, and seaside dining.',
    duration: 3,
    budget: 'Luxury (€250+/day)',
    pace: 'relaxed',
  },
];

export const TripInputForm: React.FC<TripInputFormProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [durationDays, setDurationDays] = useState<number>(3);
  const [budgetLevel, setBudgetLevel] = useState<string>('Moderate');
  const [pace, setPace] = useState<'relaxed' | 'balanced' | 'fast-paced'>('balanced');
  const [useFallbackIfNoKey, setUseFallbackIfNoKey] = useState<boolean>(true);
  const [show3DGlobe, setShow3DGlobe] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    onGenerate({
      prompt: prompt.trim(),
      durationDays,
      budgetLevel,
      pace,
      useFallbackIfNoKey,
    });
  };

  const handleApplyPreset = (preset: typeof PRESET_PROMPTS[0]) => {
    setPrompt(preset.prompt);
    setDurationDays(preset.duration);
    setBudgetLevel(preset.budget);
    setPace(preset.pace as any);
  };

  const handleGlobeSelectPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Hero Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          <span>Generative AI 3D Interactive Tool Studio</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Turn your travel ideas into an <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Interactive AI Workspace
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Describe any trip in natural language or interact with our 3D Holographic World Globe. Our AI outputs structured JSON rendered into interactive timeline blocks, budget charts, and packing checklists.
        </p>
      </div>

      {/* 3D Holographic Globe Feature Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
            <GlobeIcon className="h-4 w-4" />
            <span>Interactive 3D Holographic Mission Control Globe</span>
          </span>

          <button
            type="button"
            onClick={() => setShow3DGlobe(!show3DGlobe)}
            className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
          >
            {show3DGlobe ? 'Minimize 3D Globe' : 'Show 3D Globe'}
          </button>
        </div>

        {show3DGlobe && <Globe3D onSelectPrompt={handleGlobeSelectPrompt} />}
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-4 sm:p-6 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        {/* Free-form Textarea */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
            <span className="flex items-center space-x-1.5">
              <MapPin className="h-4 w-4 text-indigo-400" />
              <span>Describe Your Trip (Free-Form Prompt)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-normal">Natural Language Input</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. 3 days in Barcelona for a couple who love tapas, Gaudi architecture, Gothic Quarter strolls, and beach sunset drinks..."
            className="w-full h-32 rounded-xl glass-input p-4 text-sm text-slate-100 placeholder-slate-500 resize-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Quick Customization Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          
          {/* Duration Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              <span>Duration</span>
            </label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full rounded-lg glass-input px-3 py-2 text-xs font-medium text-slate-200"
            >
              <option value={2} className="bg-slate-900">2 Days (Weekend Express)</option>
              <option value={3} className="bg-slate-900">3 Days (Classic Getaway)</option>
              <option value={4} className="bg-slate-900">4 Days (Deep Exploration)</option>
              <option value={5} className="bg-slate-900">5 Days (Grand Tour)</option>
            </select>
          </div>

          {/* Budget Level */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
              <Wallet className="h-3.5 w-3.5 text-indigo-400" />
              <span>Budget Preference</span>
            </label>
            <select
              value={budgetLevel}
              onChange={(e) => setBudgetLevel(e.target.value)}
              className="w-full rounded-lg glass-input px-3 py-2 text-xs font-medium text-slate-200"
            >
              <option value="Budget" className="bg-slate-900">Backpacker / Budget</option>
              <option value="Moderate" className="bg-slate-900">Moderate / Balanced</option>
              <option value="Luxury" className="bg-slate-900">High-End / Luxury</option>
            </select>
          </div>

          {/* Travel Pace */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
              <Zap className="h-3.5 w-3.5 text-indigo-400" />
              <span>Itinerary Pace</span>
            </label>
            <select
              value={pace}
              onChange={(e) => setPace(e.target.value as any)}
              className="w-full rounded-lg glass-input px-3 py-2 text-xs font-medium text-slate-200"
            >
              <option value="relaxed" className="bg-slate-900">Relaxed & Leisurely</option>
              <option value="balanced" className="bg-slate-900">Balanced Highlights</option>
              <option value="fast-paced" className="bg-slate-900">Action Packed</option>
            </select>
          </div>

        </div>

        {/* Smart Offline Mode Toggle */}
        <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-800/80">
          <label className="flex items-center space-x-2 text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useFallbackIfNoKey}
              onChange={(e) => setUseFallbackIfNoKey(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span>Allow offline fallback demo data if server has no API key</span>
          </label>

          <span className="text-[11px] text-indigo-400 font-medium hidden sm:inline">
            Zod Schema Validated
          </span>
        </div>

        {/* Generate Action Button */}
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-white transition-all flex items-center justify-center space-x-2 ${
            isLoading || !prompt.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-accent shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{isLoading ? 'Generating Interactive Plan...' : 'Generate Structured Travel Workspace'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>

      </form>

      {/* Preset Prompts Section */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center sm:text-left">
          Or try a sample trip prompt:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="glass-card glass-card-hover rounded-xl p-3 text-left space-y-1.5 border border-slate-800"
            >
              <div className="text-xs font-bold text-slate-200">{preset.title}</div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                "{preset.prompt}"
              </p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
