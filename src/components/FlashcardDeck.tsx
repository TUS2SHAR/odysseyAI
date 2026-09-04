import React, { useState, useEffect } from 'react';
import { Layers, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';
import type { Flashcard } from '../types/schema';

interface FlashcardDeckProps {
  cards: Flashcard[];
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  const currentCard = cards[currentIndex] || cards[0];

  // Keyboard navigation listener (Space/Enter to flip, Left/Right arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
  };

  if (!cards || cards.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-5">
      
      {/* Deck Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Interactive 3D Flashcard Deck</span>
            </h2>
            <p className="text-xs text-slate-400">
              Space / Enter to flip • Left / Right Arrow keys to navigate
            </p>
          </div>
        </div>

        {/* Progress Metrics & Controls */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-slate-300 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
            Card <strong className="text-sky-400">{currentIndex + 1}</strong> / {cards.length}
          </span>

          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
            {masteredIds.size} Mastered
          </span>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset Deck Progress"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3D Flip Card Scene Container */}
      <div className="perspective-1000 w-full min-h-[260px] sm:min-h-[300px] flex items-center justify-center">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full max-w-xl h-64 sm:h-72 rounded-2xl cursor-pointer transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card Front (Question) */}
          <div className="absolute inset-0 backface-hidden rounded-2xl glass-card border border-sky-500/30 p-6 flex flex-col justify-between shadow-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90">
            <div className="flex items-center justify-between text-xs text-sky-400 font-bold uppercase tracking-wider">
              <span className="flex items-center space-x-1.5">
                <HelpCircle className="h-4 w-4" />
                <span>Question side</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Click or Press Space to Flip</span>
            </div>

            <div className="text-center px-4 my-auto">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                {currentCard.question}
              </h3>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
              <span>Card ID: {currentCard.id}</span>
              <span className="text-sky-400 font-medium">Click to reveal answer 🔄</span>
            </div>
          </div>

          {/* Card Back (Answer) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl glass-card border border-indigo-500/40 p-6 flex flex-col justify-between shadow-2xl bg-gradient-to-br from-indigo-950/40 to-slate-950/90">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-bold uppercase tracking-wider">
              <span className="flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>Answer Key</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Click to Flip Back</span>
            </div>

            <div className="text-center px-4 my-auto">
              <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                {currentCard.answer}
              </p>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
              <span>Confidence Rating</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMastered(currentCard.id);
                }}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  masteredIds.has(currentCard.id)
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:text-emerald-400'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{masteredIds.has(currentCard.id) ? 'Mastered' : 'Mark as Mastered'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={handlePrev}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous (Left Arrow)</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-xs font-bold text-white shadow-lg transition-all"
        >
          <span>Next Card (Right Arrow)</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
