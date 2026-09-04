import React, { useState } from 'react';
import { Sliders, Sparkles, Send } from 'lucide-react';

interface RefinementBarProps {
  onRefine: (instruction: string) => void;
  isRefining: boolean;
}

const REFINEMENT_CHIPS = [
  '🍷 Add romantic dinner on Day 1',
  '💰 Lower total budget & suggest cheaper stops',
  '👨‍👩‍👧 Make day 2 kid-friendly',
  '☕ Add authentic coffee shop stops',
];

export const RefinementBar: React.FC<RefinementBarProps> = ({ onRefine, isRefining }) => {
  const [instruction, setInstruction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isRefining) return;
    onRefine(instruction.trim());
    setInstruction('');
  };

  const handleChipClick = (chipText: string) => {
    onRefine(chipText);
  };

  return (
    <div className="w-full glass-card rounded-2xl p-4 border border-indigo-500/30 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Refinement Prompt Loop
            </h3>
            <p className="text-[11px] text-slate-400">
              Modify your existing trip instead of starting over from scratch.
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/20">
          Smart AI Diff Mode
        </span>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          disabled={isRefining}
          placeholder="e.g., 'Add a sunset rooftop cocktail spot on Day 2' or 'Make day 1 budget friendly'..."
          className="flex-1 rounded-xl glass-input px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={isRefining || !instruction.trim()}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs text-white transition-all flex items-center space-x-1.5 ${
            isRefining || !instruction.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-accent shadow-md hover:scale-105 active:scale-95'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{isRefining ? 'Refining Plan...' : 'Refine Trip'}</span>
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>

      {/* Preset refinement chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[10px] text-slate-500 font-medium mr-1">Quick Edits:</span>
        {REFINEMENT_CHIPS.map((chip, i) => (
          <button
            key={i}
            type="button"
            disabled={isRefining}
            onClick={() => handleChipClick(chip)}
            className="text-[11px] rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 transition-all"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};
