export type Category = 
  | 'Food' 
  | 'Transportation' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Rent' 
  | 'Utilities' 
  | 'Services' 
  | 'Clothing' 
  | 'Personal Care' 
  | 'Other';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: Category;
  description: string;
  createdAt: string;
}

export interface Budget {
  category: Category;
  limit: number;
}

export interface BudgetStatus extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
}

export interface AnalyticsData {
  dailyTrend: { date: string; amount: number }[];
  categoryComparison: { category: Category; currentMonth: number; previousMonth: number }[];
  averages: {
    daily: number;
    monthly: number;
  };
  forecast: {
    nextMonth: number;
  };
}

export interface ExpenseSummary {
  total: number;
  monthlyTotal: number;
  topCategory: Category | 'None';
  categoryBreakdown: { category: Category; amount: number }[];
  budgetStatus: BudgetStatus[];
  analytics: AnalyticsData;
}
