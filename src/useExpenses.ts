import { useState, useEffect, useMemo } from 'react';
import { Expense, Category, ExpenseSummary, Budget, BudgetStatus, AnalyticsData } from './types';
import { 
  isSameMonth, 
  parseISO, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  format, 
  isWithinInterval, 
  eachDayOfInterval, 
  isSameDay,
  differenceInDays,
  startOfDay
} from 'date-fns';

const EXPENSES_KEY = 'spendwise_expenses';
const BUDGETS_KEY = 'spendwise_budgets';

const DEFAULT_CATEGORIES: Category[] = [
  'Food', 
  'Transportation', 
  'Entertainment', 
  'Shopping', 
  'Rent', 
  'Utilities', 
  'Services', 
  'Clothing', 
  'Personal Care', 
  'Other'
];

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedExpenses = localStorage.getItem(EXPENSES_KEY);
    const savedBudgets = localStorage.getItem(BUDGETS_KEY);
    
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (e) {
        console.error('Failed to parse expenses', e);
      }
    }

    if (savedBudgets) {
      try {
        setBudgets(JSON.parse(savedBudgets));
      } catch (e) {
        console.error('Failed to parse budgets', e);
      }
    } else {
      // Initialize with zero budgets
      setBudgets(DEFAULT_CATEGORIES.map(cat => ({ category: cat, limit: 0 })));
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
      localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
    }
  }, [expenses, budgets, isLoaded]);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const updateBudget = (category: Category, limit: number) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category === category);
      if (existing) {
        return prev.map(b => b.category === category ? { ...b, limit } : b);
      }
      return [...prev, { category, limit }];
    });
  };

  const summary = useMemo((): ExpenseSummary => {
    const now = new Date();
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));

    const monthlyExpenses = expenses.filter(e => isSameMonth(parseISO(e.date), now));
    const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

    const prevMonthlyExpenses = expenses.filter(e => 
      isWithinInterval(parseISO(e.date), { start: previousMonthStart, end: previousMonthEnd })
    );
    const prevMonthlyTotal = prevMonthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Category Totals
    const categoryTotals: Record<Category, number> = {
      Food: 0, Transportation: 0, Entertainment: 0, Shopping: 0, Rent: 0, Utilities: 0, Services: 0, Clothing: 0, 'Personal Care': 0, Other: 0,
    };
    expenses.forEach(e => { categoryTotals[e.category] += e.amount; });

    const monthlyCategoryTotals: Record<Category, number> = {
      Food: 0, Transportation: 0, Entertainment: 0, Shopping: 0, Rent: 0, Utilities: 0, Services: 0, Clothing: 0, 'Personal Care': 0, Other: 0,
    };
    monthlyExpenses.forEach(e => { monthlyCategoryTotals[e.category] += e.amount; });

    const prevMonthlyCategoryTotals: Record<Category, number> = {
      Food: 0, Transportation: 0, Entertainment: 0, Shopping: 0, Rent: 0, Utilities: 0, Services: 0, Clothing: 0, 'Personal Care': 0, Other: 0,
    };
    prevMonthlyExpenses.forEach(e => { prevMonthlyCategoryTotals[e.category] += e.amount; });

    const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
      category: category as Category,
      amount,
    })).sort((a, b) => b.amount - a.amount);

    const topCategory = categoryBreakdown[0]?.amount > 0 
      ? categoryBreakdown[0].category 
      : 'None';

    // Budget Status
    const budgetStatus: BudgetStatus[] = budgets.map(budget => {
      const spent = monthlyCategoryTotals[budget.category] || 0;
      const remaining = Math.max(0, budget.limit - spent);
      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
      return { ...budget, spent, remaining, percentage };
    });

    // Analytics: Daily Trend (Last 14 days)
    const last14Days = eachDayOfInterval({
      start: startOfDay(subMonths(now, 0.5)), // Roughly 15 days
      end: startOfDay(now)
    });

    const dailyTrend = last14Days.map(day => {
      const dayTotal = expenses
        .filter(e => isSameDay(parseISO(e.date), day))
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        date: format(day, 'MMM dd'),
        amount: dayTotal
      };
    });

    // Analytics: Category Comparison
    const categoryComparison = DEFAULT_CATEGORIES.map(cat => ({
      category: cat,
      currentMonth: monthlyCategoryTotals[cat],
      previousMonth: prevMonthlyCategoryTotals[cat]
    }));

    // Analytics: Averages
    const firstExpenseDate = expenses.length > 0 
      ? parseISO(expenses.reduce((min, e) => e.date < min ? e.date : min, expenses[0].date))
      : now;
    const daysActive = Math.max(1, differenceInDays(now, firstExpenseDate));
    const monthsActive = Math.max(1, Math.ceil(daysActive / 30));

    const averages = {
      daily: total / daysActive,
      monthly: total / monthsActive
    };

    // Analytics: Forecast
    // Simple forecast: average of last 2 months or just current month if new
    const forecast = {
      nextMonth: (monthlyTotal + prevMonthlyTotal) / (prevMonthlyTotal > 0 ? 2 : 1)
    };

    const analytics: AnalyticsData = {
      dailyTrend,
      categoryComparison,
      averages,
      forecast
    };

    return {
      total,
      monthlyTotal,
      topCategory,
      categoryBreakdown,
      budgetStatus,
      analytics
    };
  }, [expenses, budgets]);

  return {
    expenses,
    budgets,
    addExpense,
    updateExpense,
    deleteExpense,
    updateBudget,
    summary,
    isLoaded,
  };
}
