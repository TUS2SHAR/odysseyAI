import React from 'react';
import { Loader2, CheckCircle2, Radio, Sparkles } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Telemetry Progress Header */}
      <div className="glass-card rounded-2xl p-5 border border-sky-500/30 text-center space-y-3 shadow-2xl">
        <div className="flex justify-center">
          <div className="relative flex items-center justify-center h-12 w-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Sparkles className="h-3 w-3 text-purple-400 absolute top-1 right-1 animate-pulse" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-white">Synthesizing Educational Module...</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Parsing structured JSON, generating 3D flashcards, and constructing quiz questions with out-of-bounds index protection.
        </p>

        {/* Telemetry Step Indicator */}
        <div className="flex justify-center items-center space-x-6 text-xs text-slate-400 pt-2">
          <span className="flex items-center space-x-1 text-sky-400 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Notes Analysis</span>
          </span>
          <span className="flex items-center space-x-1 text-sky-400 font-semibold animate-pulse">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Zod Validation</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-600">
            <span>3D Engine Render</span>
          </span>
        </div>
      </div>

      {/* Placeholder Skeletons */}
      <div className="space-y-4">
        <div className="glass-card rounded-2xl p-6 h-64 bg-slate-900/60 border border-slate-800 animate-pulse flex items-center justify-center">
          <div className="h-8 w-64 bg-slate-800 rounded-xl" />
        </div>
      </div>

    </div>
  );
};
