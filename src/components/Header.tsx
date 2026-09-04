import React from 'react';
import { Compass, Bookmark, Download, Sparkles, Plus, FileCode } from 'lucide-react';
import type { ViewBlockType } from '../types/itinerary';

interface HeaderProps {
  activeViewBlock: ViewBlockType;
  onSelectViewBlock: (block: ViewBlockType) => void;
  hasPlan: boolean;
  onNewPlan: () => void;
  onOpenSavedSessions: () => void;
  savedCount: number;
  onExportJSON: () => void;
  onExportMarkdown: () => void;
  isMock: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeViewBlock,
  onSelectViewBlock,
  hasPlan,
  onNewPlan,
  onOpenSavedSessions,
  savedCount,
  onExportJSON,
  onExportMarkdown,
  isMock,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewPlan}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent shadow-lg shadow-indigo-500/20">
            <Compass className="h-6 w-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-xl font-black tracking-tight text-transparent">
                Odyssey<span className="text-indigo-400">AI</span>
              </span>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                v2.5
              </span>
              {isMock && (
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/20">
                  Offline Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Structured AI Travel & Experience Studio
            </p>
          </div>
        </div>

        {/* View Block Tabs (if plan exists) */}
        {hasPlan && (
          <nav className="hidden md:flex items-center space-x-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
            <button
              onClick={() => onSelectViewBlock('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeViewBlock === 'all'
                  ? 'bg-gradient-accent text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              All Blocks
            </button>
            <button
              onClick={() => onSelectViewBlock('timeline')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeViewBlock === 'timeline'
                  ? 'bg-gradient-accent text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              🗓 Timeline
            </button>
            <button
              onClick={() => onSelectViewBlock('budget')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeViewBlock === 'budget'
                  ? 'bg-gradient-accent text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              💰 Budget
            </button>
            <button
              onClick={() => onSelectViewBlock('checklist')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeViewBlock === 'checklist'
                  ? 'bg-gradient-accent text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              🎒 Packing
            </button>
            <button
              onClick={() => onSelectViewBlock('highlights')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeViewBlock === 'highlights'
                  ? 'bg-gradient-accent text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              🌟 Insights
            </button>
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {hasPlan && (
            <>
              <button
                onClick={onNewPlan}
                className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:border-slate-600"
              >
                <Plus className="h-4 w-4 text-indigo-400" />
                <span className="hidden sm:inline">New Plan</span>
              </button>

              <div className="relative group">
                <button
                  className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800"
                >
                  <Download className="h-4 w-4 text-slate-400" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <div className="absolute right-0 top-full mt-1 hidden w-44 rounded-xl border border-slate-800 bg-slate-900/95 p-1 shadow-2xl backdrop-blur-xl group-hover:block z-50">
                  <button
                    onClick={onExportJSON}
                    className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Download JSON</span>
                  </button>
                  <button
                    onClick={onExportMarkdown}
                    className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                    <span>Download Markdown</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Saved Sessions Button */}
          <button
            onClick={onOpenSavedSessions}
            className="relative flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:bg-slate-800"
          >
            <Bookmark className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500/20 px-1 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                {savedCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
