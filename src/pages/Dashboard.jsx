import { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SavingsProgressCard from '../components/dashboard/SavingsProgressCard';
import FinancialHealthScore from '../components/dashboard/FinancialHealthScore';
import QuickActions from '../components/dashboard/QuickActions';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import InsightsPanel from '../components/dashboard/InsightsPanel';
import DashboardHero from '../components/dashboard/DashboardHero';

import DashboardPieChart from '../components/dashboard/DashboardPieChart';
import DashboardSpendingTrend from '../components/dashboard/DashboardSpendingTrend';
import DashboardIncomeExpenseChart from '../components/dashboard/DashboardIncomeExpenseChart';
import DashboardSavingsGrowth from '../components/dashboard/DashboardSavingsGrowth';
import DashboardAnalyticsSummary from '../components/dashboard/DashboardAnalyticsSummary';

const MOCK_MONTHLY_INCOME = 8250;

export default function Dashboard() {
  // Load dynamic stats from localStorage
  const stats = useMemo(() => {
    let expenses = [];
    let goals = [];
    let settings = {};
    try { expenses = JSON.parse(localStorage.getItem('fintrack_expenses') || '[]'); } catch (e) { console.error(e); }
    try { goals = JSON.parse(localStorage.getItem('fintrack_goals') || '[]'); } catch (e) { console.error(e); }
    try { settings = JSON.parse(localStorage.getItem('fintrack_settings') || '{}'); } catch (e) { console.error(e); }

    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const totalSavings = goals.reduce((s, g) => s + g.currentAmount, 0);
    const balance = MOCK_MONTHLY_INCOME - totalExpenses;
    
    // Generate simple mock sparkline data based on actual totals for visual effect
    const generateSparkline = (base, variance, trend) => {
      const data = [];
      let current = base;
      for (let i = 0; i < 7; i++) {
        data.push({ value: current });
        current += (Math.random() * variance * 2 - variance) + (trend * variance * 0.5);
      }
      return data;
    };

    const incomeSparkline = generateSparkline(100, 10, 1);
    const expenseSparkline = generateSparkline(50, 15, -0.5);
    const balanceSparkline = generateSparkline(75, 5, 1);
    const savingsSparkline = generateSparkline(20, 2, 2);

    // Extract symbol (e.g. "USD ($)" -> "$", "INR (₹)" -> "₹")
    const prefCurrency = settings?.preferences?.currency || 'USD ($)';
    const currencySymbol = prefCurrency.match(/\((.*?)\)/)?.[1] || '$';

    return {
      currencySymbol,
      rawBalance: balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      rawSavings: totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      income: `${currencySymbol}${MOCK_MONTHLY_INCOME.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      expenses: `${currencySymbol}${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      balance: `${currencySymbol}${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      savings: `${currencySymbol}${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sparklines: {
        income: incomeSparkline,
        expenses: expenseSparkline,
        balance: balanceSparkline,
        savings: savingsSparkline
      }
    };
  }, []);

  return (
    <div className="space-y-6 pb-8">
      {/* Section 1: Hero Banner */}
      <DashboardHero 
        balance={stats.rawBalance} 
        savings={stats.rawSavings} 
        currencySymbol={stats.currencySymbol} 
      />

      {/* Section 2: Quick Actions */}
      <QuickActions />

      {/* Section 3: Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-1">
        <div className="animate-fade-in animate-stagger-1">
          <StatCard 
            title="Total Income" 
            amount={stats.income}
            icon={TrendingUp} 
            trend="up" 
            trendValue="12.5%" 
            iconBg="bg-emerald-500 text-white" 
            iconColor="" 
            insight="Consistent with last month"
            sparklineData={stats.sparklines.income}
            sparklineColor="#10b981"
          />
        </div>
        <div className="animate-fade-in animate-stagger-2">
          <StatCard 
            title="Total Expenses" 
            amount={stats.expenses}
            icon={TrendingDown} 
            trend="down" 
            trendValue="4.2%" 
            iconBg="bg-red-500 text-white" 
            iconColor="" 
            insight="Below budget threshold"
            sparklineData={stats.sparklines.expenses}
            sparklineColor="#ef4444"
          />
        </div>
        <div className="animate-fade-in animate-stagger-3">
          <StatCard 
            title="Current Balance" 
            amount={stats.balance}
            icon={Wallet} 
            trend="up" 
            trendValue="8.1%" 
            iconBg="bg-blue-600 text-white" 
            iconColor="" 
            insight="Healthy cash flow"
            sparklineData={stats.sparklines.balance}
            sparklineColor="#2563eb"
          />
        </div>
        <div className="animate-fade-in animate-stagger-4">
          <StatCard 
            title="Total Savings" 
            amount={stats.savings}
            icon={PiggyBank} 
            trend="up" 
            trendValue="2.4%" 
            iconBg="bg-purple-500 text-white" 
            iconColor="" 
            insight="On track for goals"
            sparklineData={stats.sparklines.savings}
            sparklineColor="#a855f7"
          />
        </div>
      </div>

      {/* SECTION: Dedicated Financial Analytics */}
      <div className="pt-6 mt-8 animate-fade-in">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Financial Analytics</h2>
          <p className="text-sm text-slate-500">Comprehensive breakdown of your financial health</p>
        </div>
        
        <div className="space-y-6">
          <DashboardAnalyticsSummary />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DashboardPieChart />
            </div>
            <div className="lg:col-span-2">
              <DashboardIncomeExpenseChart />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardSpendingTrend />
            <DashboardSavingsGrowth />
          </div>
        </div>
      </div>

      {/* Section 4: Financial Health & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 mt-4">
        <div className="lg:col-span-1">
          <FinancialHealthScore />
        </div>
        <div className="lg:col-span-2">
          <InsightsPanel />
        </div>
      </div>

      {/* Section 5: Activity & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityTimeline />
        </div>
        <div>
          <SavingsProgressCard />
        </div>
      </div>

      {/* Section 6: Recent Transactions Table */}
      <div className="grid grid-cols-1 gap-6">
        <RecentTransactions />
      </div>
    </div>
  );
}
