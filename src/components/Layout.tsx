import React from 'react';
import { Wallet, LayoutDashboard, List, PlusCircle, Target, BarChart2, Sun, Moon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../useTheme';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'expenses' | 'add' | 'budgets' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'expenses' | 'add' | 'budgets' | 'analytics') => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:block transition-colors duration-300">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Expense Tracker</h1>
          </div>
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-2 p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-5 h-5" />
                <span className="text-xs font-medium md:hidden lg:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-5 h-5" />
                <span className="text-xs font-medium md:hidden lg:inline">Light</span>
              </>
            )}
          </button>
        </div>

        <nav className="space-y-2">
          <NavItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          />
          <NavItem 
            icon={<List className="w-5 h-5" />} 
            label="Expenses" 
            active={activeTab === 'expenses'} 
            onClick={() => setActiveTab('expenses')}
          />
          <NavItem 
            icon={<BarChart2 className="w-5 h-5" />} 
            label="Analytics" 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')}
          />
          <NavItem 
            icon={<Target className="w-5 h-5" />} 
            label="Budgets" 
            active={activeTab === 'budgets'} 
            onClick={() => setActiveTab('budgets')}
          />
          <NavItem 
            icon={<PlusCircle className="w-5 h-5" />} 
            label="Add Expense" 
            active={activeTab === 'add'} 
            onClick={() => setActiveTab('add')}
          />
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 transition-colors duration-300">
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Pro Tip</p>
            <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-snug">
              Export your data to CSV for detailed spreadsheet analysis.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-4 border-b border-slate-200 dark:border-slate-800 md:hidden transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">Expense Tracker</span>
        </div>
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-2 p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-5 h-5" />
              <span className="text-xs font-medium">Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-5 h-5" />
              <span className="text-xs font-medium">Light</span>
            </>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto min-h-screen">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-around bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3 md:hidden transition-colors duration-300">
        <MobileNavItem 
          icon={<LayoutDashboard className="w-6 h-6" />} 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
        />
        <MobileNavItem 
          icon={<List className="w-6 h-6" />} 
          active={activeTab === 'expenses'} 
          onClick={() => setActiveTab('expenses')}
        />
        <MobileNavItem 
          icon={<BarChart2 className="w-6 h-6" />} 
          active={activeTab === 'analytics'} 
          onClick={() => setActiveTab('analytics')}
        />
        <MobileNavItem 
          icon={<Target className="w-6 h-6" />} 
          active={activeTab === 'budgets'} 
          onClick={() => setActiveTab('budgets')}
        />
        <MobileNavItem 
          icon={<PlusCircle className="w-6 h-6" />} 
          active={activeTab === 'add'} 
          onClick={() => setActiveTab('add')}
        />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group",
        active 
          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium" 
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
      )}
    >
      <span className={cn(
        "transition-colors",
        active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
      )}>
        {icon}
      </span>
      {label}
    </button>
  );
}

function MobileNavItem({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-xl transition-all duration-200",
        active ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50" : "text-slate-400 dark:text-slate-500"
      )}
    >
      {icon}
    </button>
  );
}
