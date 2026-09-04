import React from 'react';
import { Sparkles, Utensils, Camera, Compass, CloudSun } from 'lucide-react';
import type { HighlightCard } from '../../types/itinerary';

interface HighlightsBlockProps {
  highlights: HighlightCard[];
}

const getHighlightIcon = (category: string) => {
  switch (category) {
    case 'food': return <Utensils className="h-4 w-4 text-amber-400" />;
    case 'photo': return <Camera className="h-4 w-4 text-pink-400" />;
    case 'culture': return <Compass className="h-4 w-4 text-purple-400" />;
    case 'weather': return <CloudSun className="h-4 w-4 text-sky-400" />;
    default: return <Sparkles className="h-4 w-4 text-indigo-400" />;
  }
};

export const HighlightsBlock: React.FC<HighlightsBlockProps> = ({ highlights }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-5">
      
      {/* Header */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Local Insights & Travel Highlights</h2>
          <p className="text-xs text-slate-400">
            Curated insider recommendations, food tips, photo spots, and cultural etiquette.
          </p>
        </div>
      </div>

      {/* Grid of Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {highlights.map((card) => (
          <div
            key={card.id}
            className="glass-card glass-card-hover rounded-xl p-4 border border-slate-800 space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  {getHighlightIcon(card.category)}
                </div>
                <h3 className="text-xs font-bold text-white">{card.title}</h3>
              </div>

              <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                {card.tag}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {card.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
