import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Eye, EyeOff, Sparkles, Terminal } from 'lucide-react';
import type { AIErrorInfo } from '../types/itinerary';

interface ErrorAlertProps {
  error: AIErrorInfo;
  onRetry: () => void;
  onUseFallback: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry, onUseFallback }) => {
  const [showRaw, setShowRaw] = useState(false);

  const getErrorBadgeColor = (type: string) => {
    switch (type) {
      case 'MALFORMED_JSON':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'SCHEMA_MISMATCH':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'INVALID_KEY':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'TIMEOUT':
      case 'RATE_LIMIT':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-card rounded-2xl p-5 border border-rose-500/30 shadow-2xl space-y-4">
      
      {/* Error Header */}
      <div className="flex items-start space-x-3">
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0 mt-0.5">
          <AlertTriangle className="h-6 w-6" />
        </div>
        
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <h3 className="text-base font-bold text-white">AI Model Response Error</h3>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getErrorBadgeColor(error.type)}`}>
              {error.type}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {error.message}
          </p>

          {error.suggestedAction && (
            <p className="text-xs text-slate-400 italic">
              💡 Suggestion: {error.suggestedAction}
            </p>
          )}
        </div>
      </div>

      {/* Raw Response Inspector Peek (if available) */}
      {error.rawResponse && (
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setShowRaw(!showRaw)}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
            <span>{showRaw ? 'Hide Raw Model Output' : 'Inspect Raw Model Output'}</span>
            {showRaw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>

          {showRaw && (
            <pre className="max-h-48 overflow-y-auto rounded-xl bg-slate-950 p-3 text-[11px] font-mono text-slate-400 border border-slate-800 leading-tight select-all">
              {error.rawResponse}
            </pre>
          )}
        </div>
      )}

      {/* Recovery Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {error.canRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all shadow-md"
          >
            <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
            <span>Retry AI Request</span>
          </button>
        )}

        <button
          onClick={onUseFallback}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-accent text-xs font-semibold text-white transition-all shadow-lg hover:scale-105"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Load Offline Demo Workspace</span>
        </button>
      </div>

    </div>
  );
};
