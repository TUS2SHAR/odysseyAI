import React from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Status Progress Header */}
      <div className="glass-card rounded-2xl p-5 border border-indigo-500/30 text-center space-y-3">
        <div className="flex justify-center">
          <div className="relative flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <Sparkles className="h-3 w-3 text-pink-400 absolute top-1 right-1 animate-pulse" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-white">Synthesizing Travel Intelligence...</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Parsing structured JSON, mapping day-by-day stops, calculating category budgets, and generating packing checklists.
        </p>

        {/* Animated Progress Steps */}
        <div className="flex justify-center items-center space-x-6 text-xs text-slate-400 pt-2">
          <span className="flex items-center space-x-1 text-indigo-400 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Prompt Analysis</span>
          </span>
          <span className="flex items-center space-x-1 text-indigo-400 font-semibold animate-pulse">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Schema Parsing</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-600">
            <span>UI Rendering</span>
          </span>
        </div>
      </div>

      {/* Skeleton Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Timeline Block Skeleton */}
        <div className="md:col-span-2 glass-card rounded-2xl p-5 space-y-4 border border-slate-800">
          <div className="h-6 w-48 bg-slate-800 rounded-lg animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
                </div>
                <div className="h-3 w-full bg-slate-800/60 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Side Widget Skeletons */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-4 space-y-3 border border-slate-800">
            <div className="h-5 w-32 bg-slate-800 rounded animate-pulse" />
            <div className="h-24 w-full bg-slate-800/50 rounded-xl animate-pulse" />
          </div>
          <div className="glass-card rounded-2xl p-4 space-y-3 border border-slate-800">
            <div className="h-5 w-28 bg-slate-800 rounded animate-pulse" />
            <div className="h-20 w-full bg-slate-800/50 rounded-xl animate-pulse" />
          </div>
        </div>

      </div>

    </div>
  );
};
