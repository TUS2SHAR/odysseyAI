import React from 'react';
import { Brain, Bookmark, Plus, Radio, Sparkles } from 'lucide-react';

interface HeaderProps {
  hasPlan: boolean;
  onNewSession: () => void;
  onOpenSavedSessions: () => void;
  savedCount: number;
  isMock: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  hasPlan,
  onNewSession,
  onOpenSavedSessions,
  savedCount,
  isMock,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-[#06080f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewSession}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 shadow-lg shadow-sky-500/20">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-white via-slate-200 to-sky-300 bg-clip-text text-xl font-black tracking-tight text-transparent">
                Study<span className="text-sky-400">Sphere</span> AI
              </span>
              <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-400 border border-sky-500/20">
                Linear HUD
              </span>
              {isMock && (
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/20">
                  Offline Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Interactive 3D Study Engine & Quiz Mastery Platform
            </p>
          </div>
        </div>

        {/* Telemetry Live Badge */}
        <div className="hidden lg:flex items-center space-x-3 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800 text-xs select-none">
          <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>WebGL 3D Core</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Zod Contract: <strong className="text-sky-300 font-mono">Validated</strong>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {hasPlan && (
            <button
              onClick={onNewSession}
              className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:border-slate-600"
            >
              <Plus className="h-4 w-4 text-sky-400" />
              <span className="hidden sm:inline">New Notes</span>
            </button>
          )}

          {/* Saved Sessions Button */}
          <button
            onClick={onOpenSavedSessions}
            className="relative flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:bg-slate-800"
          >
            <Bookmark className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Saved Modules</span>
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
