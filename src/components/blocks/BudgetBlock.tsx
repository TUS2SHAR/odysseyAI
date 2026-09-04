import React, { useState } from 'react';
import { Wallet, PieChart, Info } from 'lucide-react';
import type { BudgetBreakdown } from '../../types/itinerary';

interface BudgetBlockProps {
  budget: BudgetBreakdown;
  actualCalculatedTotal: number;
}

const CURRENCIES = [
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
];

export const BudgetBlock: React.FC<BudgetBlockProps> = ({ budget, actualCalculatedTotal }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(budget.currencySymbol || '$');

  const totalToDisplay = actualCalculatedTotal > 0 ? actualCalculatedTotal : budget.totalEstimated;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Budget & Expense Breakdown Block</span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive financial allocation chart & category cost meters.
            </p>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 pl-1">Currency:</span>
          {CURRENCIES.map((curr) => (
            <button
              key={curr.code}
              onClick={() => setSelectedCurrency(curr.symbol)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                selectedCurrency === curr.symbol
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {curr.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Main Budget Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Total Estimated Box */}
        <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Total Estimated Expense
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">
              {selectedCurrency}{totalToDisplay.toLocaleString()}
            </span>
            {actualCalculatedTotal > 0 && actualCalculatedTotal !== budget.totalEstimated && (
              <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Calculated from Stops
              </span>
            )}
          </div>
        </div>

        {/* Budget Tip Box */}
        {budget.budgetTip && (
          <div className="rounded-xl bg-indigo-500/10 p-4 border border-indigo-500/20 space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400 flex items-center space-x-1">
              <Info className="h-3.5 w-3.5" />
              <span>Smart Money Tip</span>
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              "{budget.budgetTip}"
            </p>
          </div>
        )}

      </div>

      {/* Category Progress Bar Chart */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-300">
          <span className="flex items-center space-x-1.5">
            <PieChart className="h-4 w-4 text-amber-400" />
            <span>Category Spending Distribution</span>
          </span>
          <span className="text-slate-500 text-[10px] font-normal">Interactive Chart Block</span>
        </div>

        {/* Visual Multi-Color Bar */}
        <div className="h-3.5 w-full rounded-full bg-slate-900 overflow-hidden flex p-0.5 border border-slate-800">
          {budget.categories.map((cat, idx) => {
            const pct = cat.percentage || Math.round((cat.amount / (budget.totalEstimated || 1)) * 100);
            return (
              <div
                key={idx}
                style={{
                  width: `${pct}%`,
                  backgroundColor: cat.color || '#6366f1',
                }}
                className="h-full rounded-sm transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                title={`${cat.category}: ${selectedCurrency}${cat.amount} (${pct}%)`}
              />
            );
          })}
        </div>

        {/* Category Legend List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {budget.categories.map((cat, idx) => {
            const pct = cat.percentage || Math.round((cat.amount / (budget.totalEstimated || 1)) * 100);

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800"
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color || '#6366f1' }}
                  />
                  <span className="text-xs font-semibold text-slate-200">{cat.category}</span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-white">
                    {selectedCurrency}{cat.amount}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium ml-1.5">
                    ({pct}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
