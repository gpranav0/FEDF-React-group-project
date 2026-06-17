import { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SavingsProgressCard from '../components/dashboard/SavingsProgressCard';
import FinancialHealthScore from '../components/dashboard/FinancialHealthScore';
import QuickActions from '../components/dashboard/QuickActions';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import InsightsPanel from '../components/dashboard/InsightsPanel';
import DashboardHero from '../components/dashboard/DashboardHero';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MOCK_MONTHLY_INCOME = 8250;

export default function Dashboard() {
  // Load expenses for the mini chart
  const monthlyChartData = useMemo(() => {
    let expenses = [];
    try {
      const raw = localStorage.getItem('fintrack_expenses');
      if (raw) expenses = JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }

    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: MONTH_NAMES[d.getMonth()],
        monthIdx: d.getMonth(),
        year: d.getFullYear(),
        Income: MOCK_MONTHLY_INCOME,
        Expenses: 0,
      });
    }

    expenses.forEach(exp => {
      const date = new Date(exp.date);
      const entry = months.find(m => m.monthIdx === date.getMonth() && m.year === date.getFullYear());
      if (entry) entry.Expenses += exp.amount;
    });

    // Round for cleanliness
    months.forEach(m => m.Expenses = Math.round(m.Expenses * 100) / 100);
    return months;
  }, []);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in animate-stagger-1">
          <StatCard 
            title="Total Income" 
            amount={stats.income}
            icon={TrendingUp} 
            trend="up" 
            trendValue="12.5%" 
            iconBg="bg-emerald-50" 
            iconColor="text-emerald-500" 
          />
        </div>
        <div className="animate-fade-in animate-stagger-2">
          <StatCard 
            title="Total Expenses" 
            amount={stats.expenses}
            icon={TrendingDown} 
            trend="down" 
            trendValue="4.2%" 
            iconBg="bg-red-50" 
            iconColor="text-red-500" 
          />
        </div>
        <div className="animate-fade-in animate-stagger-3">
          <StatCard 
            title="Current Balance" 
            amount={stats.balance}
            icon={Wallet} 
            trend="up" 
            trendValue="8.1%" 
            iconBg="bg-blue-50" 
            iconColor="text-blue-500" 
          />
        </div>
        <div className="animate-fade-in animate-stagger-4">
          <StatCard 
            title="Total Savings" 
            amount={stats.savings}
            icon={PiggyBank} 
            trend="up" 
            trendValue="2.4%" 
            iconBg="bg-purple-50" 
            iconColor="text-purple-500" 
          />
        </div>
      </div>

      {/* Section 4: Financial Health + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FinancialHealthScore />
        </div>
        <div className="lg:col-span-2">
          <InsightsPanel />
        </div>
      </div>

      {/* Section 5: Transactions + Savings Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div>
          <SavingsProgressCard />
        </div>
      </div>

      {/* Section 6: Monthly Chart + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 card-hover animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Monthly Overview</h3>
                <p className="text-sm text-slate-500">Income vs Expenses — Last 6 Months</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-500 font-medium">Income</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-slate-500 font-medium">Expenses</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyChartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                />
                <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expenses" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
