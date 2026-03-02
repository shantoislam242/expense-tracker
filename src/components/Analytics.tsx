import React from 'react';
import { AnalyticsData, Category } from '../types';
import { formatCurrency } from '../utils';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';
import { TrendingUp, Activity, Calendar, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface AnalyticsProps {
  analytics: AnalyticsData;
  monthlyTotal: number;
}

export default function Analytics({ analytics, monthlyTotal }: AnalyticsProps) {
  const prevMonthTotal = analytics.categoryComparison.reduce((sum, c) => sum + c.previousMonth, 0);
  const diffPercent = prevMonthTotal > 0 
    ? ((monthlyTotal - prevMonthTotal) / prevMonthTotal) * 100 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">Advanced Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400">Deep dive into your spending patterns and future projections.</p>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Daily Average" 
          value={formatCurrency(analytics.averages.daily)} 
          subtitle="Based on total history"
          icon={<Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          color="bg-blue-50 dark:bg-blue-950/30"
        />
        <MetricCard 
          title="Monthly Average" 
          value={formatCurrency(analytics.averages.monthly)} 
          subtitle="Projected monthly run rate"
          icon={<Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          color="bg-indigo-50 dark:bg-indigo-950/30"
        />
        <MetricCard 
          title="Next Month Forecast" 
          value={formatCurrency(analytics.forecast.nextMonth)} 
          subtitle="Based on recent trends"
          icon={<Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          color="bg-amber-50 dark:bg-amber-950/30"
        />
      </div>

      {/* Daily Trend Chart */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Daily Spending Trend</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Last 14 days of activity</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Live Trend</span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  padding: '12px',
                  backgroundColor: '#1e293b',
                  color: '#fff'
                }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [formatCurrency(value), 'Spent']}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#4f46e5" 
                strokeWidth={3} 
                dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Comparison */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Month-over-Month Comparison</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.categoryComparison} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                <Bar dataKey="previousMonth" name="Last Month" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="currentMonth" name="This Month" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors duration-300">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Smart Insights</h3>
          <div className="space-y-6 flex-1">
            <InsightItem 
              icon={diffPercent > 0 ? <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" /> : <ArrowDownRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              title="Spending Velocity"
              description={diffPercent > 0 
                ? `Your spending is up ${Math.abs(Math.round(diffPercent))}% compared to last month. Consider reviewing your "Other" category.`
                : `Great job! You've spent ${Math.abs(Math.round(diffPercent))}% less than last month so far.`
              }
            />
            <InsightItem 
              icon={<TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
              title="Projected Savings"
              description={`If you maintain your current daily average of ${formatCurrency(analytics.averages.daily)}, you'll finish the month at ${formatCurrency(analytics.averages.daily * 30)}.`}
            />
            <div className="p-6 bg-indigo-600 dark:bg-indigo-900 rounded-2xl text-white mt-auto transition-colors duration-300">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Optimization Tip
              </h4>
              <p className="text-sm text-indigo-100 dark:text-indigo-200 leading-relaxed">
                Your highest spending occurs on weekends. Setting a "Weekend Budget" could help reduce overall monthly expenses by up to 15%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, color }: { title: string, value: string, subtitle: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-2xl ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{value}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>
    </div>
  );
}

function InsightItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">{title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
