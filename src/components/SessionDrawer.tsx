import React from 'react';
import { X, Bookmark, Trash2, Calendar, MapPin, ArrowRight } from 'lucide-react';
import type { SavedSession } from '../types/itinerary';

interface SessionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SavedSession[];
  onSelectSession: (session: SavedSession) => void;
  onDeleteSession: (id: string) => void;
}

export const SessionDrawer: React.FC<SessionDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onDeleteSession,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Bookmark className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Saved Trip Workspaces</h2>
                <p className="text-xs text-slate-400">Manage and reload past AI itineraries</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Session List */}
          {sessions.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Bookmark className="h-8 w-8 text-slate-700 mx-auto" />
              <p className="text-sm font-semibold text-slate-400">No Saved Sessions Yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Generate a trip and it will automatically save to your local session workspace.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="glass-card glass-card-hover rounded-xl p-4 border border-slate-800 space-y-2 relative group"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {session.title}
                      </h4>
                      <p className="text-[11px] text-indigo-400 flex items-center space-x-1 font-medium">
                        <MapPin className="h-3 w-3" />
                        <span>{session.destination}</span>
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                    </span>

                    <button
                      onClick={() => {
                        onSelectSession(session);
                        onClose();
                      }}
                      className="flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      <span>Load Trip</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          Persisted in LocalStorage
        </div>

      </div>
    </div>
  );
};
