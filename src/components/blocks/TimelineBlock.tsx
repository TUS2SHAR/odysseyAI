import React, { useState } from 'react';
import { 
  Calendar, CheckCircle2, Circle, ArrowUp, ArrowDown, Trash2, 
  Plus, MapPin, Clock, Utensils, Compass, 
  Sparkles, Camera, Coffee, Car, ShoppingBag, Moon
} from 'lucide-react';
import type { DayPlan, ItineraryStop, StopCategory } from '../../types/itinerary';

interface TimelineBlockProps {
  days: DayPlan[];
  currencySymbol: string;
  onUpdateDays: (updatedDays: DayPlan[]) => void;
}

const CATEGORY_COLORS: Record<StopCategory, { bg: string; text: string; border: string }> = {
  food: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  sightseeing: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  activity: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  culture: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  relax: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
  transport: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
  shopping: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  nightlife: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
};

const getCategoryIcon = (category: StopCategory) => {
  switch (category) {
    case 'food': return <Utensils className="h-3.5 w-3.5" />;
    case 'sightseeing': return <Camera className="h-3.5 w-3.5" />;
    case 'culture': return <Compass className="h-3.5 w-3.5" />;
    case 'relax': return <Coffee className="h-3.5 w-3.5" />;
    case 'transport': return <Car className="h-3.5 w-3.5" />;
    case 'shopping': return <ShoppingBag className="h-3.5 w-3.5" />;
    case 'nightlife': return <Moon className="h-3.5 w-3.5" />;
    default: return <Sparkles className="h-3.5 w-3.5" />;
  }
};

export const TimelineBlock: React.FC<TimelineBlockProps> = ({
  days,
  currencySymbol,
  onUpdateDays,
}) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [addingToDay, setAddingToDay] = useState<number | null>(null);

  // New Stop Form State
  const [newActivity, setNewActivity] = useState('');
  const [newTime, setNewTime] = useState('02:00 PM');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<StopCategory>('activity');
  const [newCost, setNewCost] = useState<number>(15);

  // Reorder stop
  const moveStop = (dayNum: number, index: number, direction: 'up' | 'down') => {
    const updated = JSON.parse(JSON.stringify(days)) as DayPlan[];
    const dayObj = updated.find(d => d.dayNumber === dayNum);
    if (!dayObj) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= dayObj.stops.length) return;

    const temp = dayObj.stops[index];
    dayObj.stops[index] = dayObj.stops[targetIdx];
    dayObj.stops[targetIdx] = temp;

    onUpdateDays(updated);
  };

  // Toggle completed
  const toggleStopCompleted = (dayNum: number, stopId: string) => {
    const updated = JSON.parse(JSON.stringify(days)) as DayPlan[];
    const dayObj = updated.find(d => d.dayNumber === dayNum);
    if (!dayObj) return;

    const stopObj = dayObj.stops.find(s => s.id === stopId);
    if (stopObj) {
      stopObj.completed = !stopObj.completed;
      onUpdateDays(updated);
    }
  };

  // Delete stop
  const deleteStop = (dayNum: number, stopId: string) => {
    const updated = JSON.parse(JSON.stringify(days)) as DayPlan[];
    const dayObj = updated.find(d => d.dayNumber === dayNum);
    if (!dayObj) return;

    dayObj.stops = dayObj.stops.filter(s => s.id !== stopId);
    onUpdateDays(updated);
  };

  // Add custom stop
  const handleAddStopSubmit = (dayNum: number) => {
    if (!newActivity.trim()) return;

    const updated = JSON.parse(JSON.stringify(days)) as DayPlan[];
    const dayObj = updated.find(d => d.dayNumber === dayNum);
    if (!dayObj) return;

    const newStop: ItineraryStop = {
      id: 'custom_' + Date.now().toString(36),
      time: newTime || 'Flex',
      activity: newActivity.trim(),
      description: newDesc.trim() || 'Custom user added stop.',
      location: 'City Center Hub',
      category: newCategory,
      estimatedCost: Number(newCost) || 0,
      completed: false,
    };

    dayObj.stops.push(newStop);
    onUpdateDays(updated);

    // Reset Form
    setNewActivity('');
    setNewDesc('');
    setAddingToDay(null);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-6">
      
      {/* Header & Day Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Interactive Day-by-Day Timeline</span>
            </h2>
            <p className="text-xs text-slate-400">
              Reorder stops, check off completed activities, edit costs, or add custom stops.
            </p>
          </div>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {days.map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDay(day.dayNumber)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeDay === day.dayNumber
                  ? 'bg-gradient-accent text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Day {day.dayNumber} ({day.stops.length} stops)
            </button>
          ))}
        </div>
      </div>

      {/* Active Day Content */}
      {days
        .filter((d) => d.dayNumber === activeDay)
        .map((day) => (
          <div key={day.dayNumber} className="space-y-4">
            
            {/* Day Theme Banner */}
            <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-3 border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
                  Day {day.dayNumber} Focus
                </span>
                <h3 className="text-sm font-bold text-white">{day.theme}</h3>
              </div>

              <button
                onClick={() => setAddingToDay(day.dayNumber)}
                className="flex items-center space-x-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Stop</span>
              </button>
            </div>

            {/* Custom Add Stop Form Drawer */}
            {addingToDay === day.dayNumber && (
              <div className="rounded-xl bg-slate-950 p-4 border border-indigo-500/40 space-y-3 animate-fade-in">
                <div className="flex justify-between items-center text-xs font-bold text-indigo-300">
                  <span>Add New Stop to Day {day.dayNumber}</span>
                  <button onClick={() => setAddingToDay(null)} className="text-slate-500 hover:text-white">✕</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <input
                    type="text"
                    placeholder="Activity Name (e.g. Visit Louvre Museum)"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    className="rounded-lg glass-input px-3 py-2 text-slate-100 placeholder-slate-500 col-span-1 sm:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Time (e.g. 03:00 PM)"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="rounded-lg glass-input px-3 py-2 text-slate-100 placeholder-slate-500"
                  />
                  <input
                    type="number"
                    placeholder="Estimated Cost"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="rounded-lg glass-input px-3 py-2 text-slate-100 placeholder-slate-500"
                  />
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as StopCategory)}
                    className="rounded-lg glass-input px-3 py-2 text-slate-200"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food">Food & Dining</option>
                    <option value="culture">Culture & Art</option>
                    <option value="relax">Relaxation</option>
                    <option value="shopping">Shopping</option>
                    <option value="nightlife">Nightlife</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Description / Notes"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="rounded-lg glass-input px-3 py-2 text-slate-100 placeholder-slate-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    onClick={() => setAddingToDay(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddStopSubmit(day.dayNumber)}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-accent text-white shadow-md hover:scale-105"
                  >
                    Save Custom Stop
                  </button>
                </div>
              </div>
            )}

            {/* Timeline Stops List */}
            {day.stops.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No stops added for this day yet. Click "Add Stop" above.
              </div>
            ) : (
              <div className="relative space-y-3 pl-4 sm:pl-6 border-l-2 border-slate-800">
                {day.stops.map((stop, index) => {
                  const catStyle = CATEGORY_COLORS[stop.category] || CATEGORY_COLORS.activity;

                  return (
                    <div
                      key={stop.id}
                      className={`group relative rounded-xl p-4 transition-all border ${
                        stop.completed
                          ? 'bg-slate-950/40 border-slate-900 opacity-60'
                          : 'glass-card glass-card-hover border-slate-800'
                      }`}
                    >
                      {/* Timeline node dot */}
                      <div className="absolute -left-[23px] sm:-left-[31px] top-5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 border border-indigo-500/50 text-indigo-400">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        
                        {/* Stop details */}
                        <div className="space-y-1.5 flex-1">
                          
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            
                            {/* Complete Toggle */}
                            <button
                              onClick={() => toggleStopCompleted(day.dayNumber, stop.id)}
                              className="text-slate-400 hover:text-indigo-400 transition-colors"
                            >
                              {stop.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Circle className="h-4 w-4" />
                              )}
                            </button>

                            {/* Category Badge */}
                            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                              {getCategoryIcon(stop.category)}
                              <span>{stop.category}</span>
                            </span>

                            {/* Time Pill */}
                            <span className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                              <Clock className="h-3 w-3 text-indigo-400" />
                              <span>{stop.time}</span>
                            </span>

                            {/* Cost Pill */}
                            {stop.estimatedCost > 0 && (
                              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                {currencySymbol}{stop.estimatedCost}
                              </span>
                            )}

                          </div>

                          {/* Activity Title */}
                          <h4 className={`text-sm font-bold text-white ${stop.completed ? 'line-through text-slate-400' : ''}`}>
                            {stop.activity}
                          </h4>

                          {/* Description */}
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {stop.description}
                          </p>

                          {/* Location & Notes */}
                          {(stop.location || stop.notes) && (
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 pt-1">
                              {stop.location && (
                                <span className="flex items-center space-x-1 text-slate-400">
                                  <MapPin className="h-3 w-3 text-indigo-400" />
                                  <span>{stop.location}</span>
                                </span>
                              )}
                              {stop.notes && (
                                <span className="text-amber-400/90 italic">
                                  💡 {stop.notes}
                                </span>
                              )}
                            </div>
                          )}

                        </div>

                        {/* Interactive Reorder & Action Controls */}
                        <div className="flex items-center space-x-1 self-end sm:self-start bg-slate-900/90 p-1 rounded-lg border border-slate-800 shrink-0">
                          <button
                            disabled={index === 0}
                            onClick={() => moveStop(day.dayNumber, index, 'up')}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                            title="Move Stop Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            disabled={index === day.stops.length - 1}
                            onClick={() => moveStop(day.dayNumber, index, 'down')}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                            title="Move Stop Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteStop(day.dayNumber, stop.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete Stop"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        ))}

    </div>
  );
};
