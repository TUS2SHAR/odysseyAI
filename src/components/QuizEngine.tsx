import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, Info, RefreshCw, Sparkles } from 'lucide-react';
import type { QuizQuestion } from '../types/schema';

interface QuizEngineProps {
  quiz: QuizQuestion[];
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ quiz }) => {
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(quiz);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isRetestingMissed, setIsRetestingMissed] = useState(false);

  // Handle selecting an option
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Calculate results
  let answeredCount = 0;
  let correctCount = 0;
  const missedQuestions: QuizQuestion[] = [];

  activeQuestions.forEach((q) => {
    const selected = userAnswers[q.id];
    if (selected !== undefined) {
      answeredCount++;
      if (selected === q.correctIndex) {
        correctCount++;
      } else {
        missedQuestions.push(q);
      }
    }
  });

  const percentage = answeredCount > 0 ? Math.round((correctCount / activeQuestions.length) * 100) : 0;

  // Reset complete quiz
  const handleResetQuiz = () => {
    setActiveQuestions(quiz);
    setUserAnswers({});
    setIsRetestingMissed(false);
  };

  // Targeted Workflow: Re-test Missed Questions Only
  const handleRetestMissed = () => {
    if (missedQuestions.length === 0) return;
    setActiveQuestions(missedQuestions);
    setUserAnswers({});
    setIsRetestingMissed(true);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-6">
      
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Interactive Quiz Engine</span>
              {isRetestingMissed && (
                <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Targeted Re-test Round
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Select your answer for instant visual feedback and explanation callouts.
            </p>
          </div>
        </div>

        {/* Live Score Summary */}
        <div className="flex items-center space-x-3 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-xs font-bold text-white">
              Score: {correctCount} / {activeQuestions.length}
            </span>
            <span className="text-[10px] text-purple-400 font-semibold ml-1.5">
              ({percentage}%)
            </span>
          </div>

          <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Quiz Questions List */}
      <div className="space-y-6">
        {activeQuestions.map((q, qIndex) => {
          const selectedIndex = userAnswers[q.id];
          const hasAnswered = selectedIndex !== undefined;
          const isCorrect = selectedIndex === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`rounded-2xl p-4 sm:p-5 transition-all border ${
                hasAnswered
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-rose-950/20 border-rose-500/30'
                  : 'glass-card border-slate-800'
              }`}
            >
              {/* Question Title */}
              <div className="flex items-start space-x-3 mb-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-mono font-bold text-sky-400 border border-slate-700">
                  {qIndex + 1}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {q.question}
                </h3>
              </div>

              {/* 4 Options Radio Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((optText, optIdx) => {
                  const isThisSelected = selectedIndex === optIdx;
                  const isThisCorrect = optIdx === q.correctIndex;

                  let optionStyle = 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-sky-500/40 hover:bg-slate-800/60';

                  if (hasAnswered) {
                    if (isThisCorrect) {
                      optionStyle = 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50 font-bold shadow-md';
                    } else if (isThisSelected && !isThisCorrect) {
                      optionStyle = 'bg-rose-500/20 text-rose-200 border-rose-500/50 font-bold';
                    } else {
                      optionStyle = 'bg-slate-950/40 text-slate-500 border-slate-900 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full p-3 rounded-xl text-left text-xs transition-all border flex items-center justify-between ${optionStyle}`}
                    >
                      <span className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-slate-500 uppercase">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{optText}</span>
                      </span>

                      {hasAnswered && isThisCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      )}
                      {hasAnswered && isThisSelected && !isThisCorrect && (
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Callout Box */}
              {hasAnswered && (
                <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 animate-fade-in">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-400">
                    <Info className="h-3.5 w-3.5" />
                    <span>Explanation</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    {q.explanation}
                  </p>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Quiz Completion Footer & Targeted Re-test Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
        
        {/* Re-test Missed Button (only shown if there are wrong answers) */}
        {missedQuestions.length > 0 ? (
          <button
            onClick={handleRetestMissed}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Re-test Missed Questions Only ({missedQuestions.length} remaining)</span>
          </button>
        ) : (
          <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
            <Sparkles className="h-4 w-4" />
            <span>{answeredCount === activeQuestions.length ? '🎉 All questions answered correctly!' : 'Complete the quiz questions above.'}</span>
          </div>
        )}

        <button
          onClick={handleResetQuiz}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-all flex items-center justify-center space-x-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Full Quiz</span>
        </button>

      </div>

    </div>
  );
};
