import React, { useState } from 'react';
import { Briefcase, CheckSquare, Square, Plus } from 'lucide-react';
import type { PackingCategory, PackingItem } from '../../types/itinerary';

interface ChecklistBlockProps {
  categories: PackingCategory[];
  onUpdateCategories: (updated: PackingCategory[]) => void;
}

export const ChecklistBlock: React.FC<ChecklistBlockProps> = ({
  categories,
  onUpdateCategories,
}) => {
  const [addingToCat, setAddingToCat] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState('');

  // Calculate overall metrics
  let totalItems = 0;
  let checkedItems = 0;

  categories.forEach((cat) => {
    cat.items.forEach((item) => {
      totalItems++;
      if (item.checked) checkedItems++;
    });
  });

  const completionPercentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  // Toggle item check
  const toggleItem = (categoryName: string, itemId: string) => {
    const updated = JSON.parse(JSON.stringify(categories)) as PackingCategory[];
    const catObj = updated.find((c) => c.category === categoryName);
    if (!catObj) return;

    const itemObj = catObj.items.find((i) => i.id === itemId);
    if (itemObj) {
      itemObj.checked = !itemObj.checked;
      onUpdateCategories(updated);
    }
  };

  // Add new item
  const handleAddItem = (categoryName: string) => {
    if (!newItemText.trim()) return;

    const updated = JSON.parse(JSON.stringify(categories)) as PackingCategory[];
    const catObj = updated.find((c) => c.category === categoryName);
    if (!catObj) return;

    const newItem: PackingItem = {
      id: 'pack_' + Date.now().toString(36),
      text: newItemText.trim(),
      checked: false,
      essential: false,
    };

    catObj.items.push(newItem);
    onUpdateCategories(updated);

    setNewItemText('');
    setAddingToCat(null);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Interactive Smart Packing Checklist</span>
            </h2>
            <p className="text-xs text-slate-400">
              Check off essentials, track progress, and add custom travel items.
            </p>
          </div>
        </div>

        {/* Progress Metric */}
        <div className="flex items-center space-x-3 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-xs font-bold text-white">{checkedItems} / {totalItems} Packed</span>
            <span className="text-[10px] text-pink-400 font-semibold ml-1.5">({completionPercentage}%)</span>
          </div>
          <div className="h-2 w-16 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${completionPercentage}%` }}
              className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((catObj) => (
          <div key={catObj.category} className="rounded-xl bg-slate-900/60 p-4 border border-slate-800 space-y-3">
            
            {/* Category Header */}
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {catObj.category}
              </h3>
              <button
                onClick={() => setAddingToCat(catObj.category)}
                className="text-[11px] text-pink-400 font-semibold hover:text-pink-300 flex items-center space-x-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Add Item Input */}
            {addingToCat === catObj.category && (
              <div className="flex gap-2 animate-fade-in">
                <input
                  type="text"
                  placeholder="New item name..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  className="flex-1 rounded-lg glass-input px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500"
                />
                <button
                  onClick={() => handleAddItem(catObj.category)}
                  className="px-3 py-1.5 rounded-lg bg-pink-500 text-slate-950 font-bold text-xs hover:bg-pink-400"
                >
                  Add
                </button>
              </div>
            )}

            {/* Item List */}
            <div className="space-y-1.5">
              {catObj.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(catObj.category, item.id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                    item.checked
                      ? 'bg-slate-950/40 text-slate-500 line-through'
                      : 'hover:bg-slate-800/50 text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {item.checked ? (
                      <CheckSquare className="h-4 w-4 text-pink-400 shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-500 shrink-0" />
                    )}
                    <span className="text-xs font-medium">{item.text}</span>
                  </div>

                  {item.essential && (
                    <span className="text-[9px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded">
                      Essential
                    </span>
                  )}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
