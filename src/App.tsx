import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import EmptyState from './components/EmptyState';
import BudgetPlanner from './components/BudgetPlanner';
import Analytics from './components/Analytics';
import { useExpenses } from './useExpenses';
import { Expense } from './types';

export default function App() {
  const { expenses, addExpense, updateExpense, deleteExpense, updateBudget, summary, isLoaded } = useExpenses();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'add' | 'budgets' | 'analytics'>('dashboard');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleAddExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    addExpense(data);
    setActiveTab('dashboard');
  };

  const handleUpdateExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
      setEditingExpense(null);
      setActiveTab('expenses');
    }
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setActiveTab('expenses');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading your finances...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        expenses.length > 0 ? (
          <Dashboard summary={summary} />
        ) : (
          <EmptyState onAdd={() => setActiveTab('add')} />
        )
      )}

      {activeTab === 'expenses' && (
        expenses.length > 0 ? (
          <ExpenseList 
            expenses={expenses} 
            onDelete={deleteExpense} 
            onEdit={handleEditClick} 
          />
        ) : (
          <EmptyState onAdd={() => setActiveTab('add')} />
        )
      )}

      {activeTab === 'budgets' && (
        <BudgetPlanner 
          budgetStatus={summary.budgetStatus} 
          onUpdateBudget={updateBudget} 
        />
      )}

      {activeTab === 'analytics' && (
        <Analytics 
          analytics={summary.analytics} 
          monthlyTotal={summary.monthlyTotal} 
        />
      )}

      {activeTab === 'add' && (
        <ExpenseForm 
          onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense} 
          onCancel={editingExpense ? handleCancelEdit : () => setActiveTab('dashboard')}
          initialData={editingExpense || undefined}
        />
      )}
    </Layout>
  );
}
