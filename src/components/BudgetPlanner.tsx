import React, { useState } from 'react';
import { Category, BudgetStatus } from '../types';
import { formatCurrency } from '../utils';
import { Target, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface BudgetPlannerProps {
  budgetStatus: BudgetStatus[];
  onUpdateBudget: (category: Category, limit: number) => void;
}

export default function BudgetPlanner({ budgetStatus, onUpdateBudget }: BudgetPlannerProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [tempLimit, setTempLimit] = useState('');

  const handleEdit = (status: BudgetStatus) => {
    setEditingCategory(status.category);
    setTempLimit(status.limit.toString());
  };

  const handleSave = () => {
    if (editingCategory) {
      const limit = parseFloat(tempLimit);
      if (!isNaN(limit) && limit >= 0) {
        onUpdateBudget(editingCategory, limit);
        setEditingCategory(null);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">Budget Planning</h2>
        <p className="text-slate-500 dark:text-slate-400">Set monthly spending limits for each category to stay on track.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgetStatus.map((status) => (
          <div key={status.category} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${getCategoryBg(status.category)}`}>
                  <Target className={`w-5 h-5 ${getCategoryText(status.category)}`} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{status.category}</h3>
              </div>
              
              {editingCategory === status.category ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm">$</span>
                    <input
                      type="number"
                      value={tempLimit}
                      onChange={(e) => setTempLimit(e.target.value)}
                      className="w-24 pl-6 pr-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-slate-100"
                      autoFocus
                    />
                  </div>
                  <button 
                    onClick={handleSave}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleEdit(status)}
                  className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  {status.limit > 0 ? 'Edit Limit' : 'Set Limit'}
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Spent this month</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(status.spent)}
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500 ml-1">
                      / {status.limit > 0 ? formatCurrency(status.limit) : 'No limit'}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  {status.limit > 0 && (
                    <p className={`text-sm font-bold ${status.percentage > 100 ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      {Math.round(status.percentage)}%
                    </p>
                  )}
                </div>
              </div>

              {status.limit > 0 && (
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(status.percentage)}`}
                    style={{ width: `${Math.min(100, status.percentage)}%` }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                {status.limit > 0 ? (
                  status.percentage > 100 ? (
                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-bold">Over budget by {formatCurrency(status.spent - status.limit)}</span>
                    </div>
                  ) : status.percentage > 85 ? (
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <Info className="w-4 h-4" />
                      <span className="text-xs font-bold">Nearing limit</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-bold">{formatCurrency(status.remaining)} remaining</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                    <Info className="w-4 h-4" />
                    <span className="text-xs font-medium">Set a limit to track progress</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getCategoryBg(category: Category): string {
  switch (category) {
    case 'Food': return 'bg-emerald-50';
    case 'Transportation': return 'bg-blue-50';
    case 'Entertainment': return 'bg-purple-50';
    case 'Shopping': return 'bg-amber-50';
    case 'Rent': return 'bg-rose-50';
    case 'Utilities': return 'bg-cyan-50';
    case 'Services': return 'bg-indigo-50';
    case 'Clothing': return 'bg-orange-50';
    case 'Personal Care': return 'bg-pink-50';
    default: return 'bg-slate-50';
  }
}

function getCategoryText(category: Category): string {
  switch (category) {
    case 'Food': return 'text-emerald-600';
    case 'Transportation': return 'text-blue-600';
    case 'Entertainment': return 'text-purple-600';
    case 'Shopping': return 'text-amber-600';
    case 'Rent': return 'text-rose-600';
    case 'Utilities': return 'text-cyan-600';
    case 'Services': return 'text-indigo-600';
    case 'Clothing': return 'text-orange-600';
    case 'Personal Care': return 'text-pink-600';
    default: return 'text-slate-600';
  }
}

function getProgressColor(percentage: number): string {
  if (percentage > 100) return 'bg-red-500';
  if (percentage > 85) return 'bg-amber-500';
  return 'bg-indigo-600';
}
