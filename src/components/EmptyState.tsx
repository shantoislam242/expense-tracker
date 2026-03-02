import { PlusCircle } from 'lucide-react';

export default function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-6 transition-colors duration-300">
        <PlusCircle className="w-12 h-12 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No expenses yet</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-xs mb-8">
        Start tracking your spending by adding your first expense. It only takes a few seconds.
      </p>
      <button
        onClick={onAdd}
        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
      >
        Add Your First Expense
      </button>
    </div>
  );
}
