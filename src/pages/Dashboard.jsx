import { Wallet, TrendingUp, TrendingDown, PiggyBank, BarChart3, Plus, Target } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SavingsProgressCard from '../components/dashboard/SavingsProgressCard';

export default function Dashboard() {
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const hour = currentDate.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-8 pb-8">
      {/* Section 1: Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{greeting}, John 👋</h1>
          <p className="text-slate-500 mt-1">Here's your financial overview for today.</p>
        </div>
        <div className="text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm inline-flex items-center gap-2">
          <span>{dateString}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm">
          <Plus className="w-4 h-4" /> Add Expense
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm">
          <Plus className="w-4 h-4" /> Create Budget
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm">
          <Target className="w-4 h-4" /> Add Savings Goal
        </button>
      </div>

      {/* Section 2: Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Income" 
          amount="$8,250.00" 
          icon={TrendingUp} 
          trend="up" 
          trendValue="12.5%" 
          iconBg="bg-emerald-50" 
          iconColor="text-emerald-500" 
        />
        <StatCard 
          title="Total Expenses" 
          amount="$3,420.50" 
          icon={TrendingDown} 
          trend="down" 
          trendValue="4.2%" 
          iconBg="bg-red-50" 
          iconColor="text-red-500" 
        />
        <StatCard 
          title="Current Balance" 
          amount="$24,500.80" 
          icon={Wallet} 
          trend="up" 
          trendValue="8.1%" 
          iconBg="bg-blue-50" 
          iconColor="text-blue-500" 
        />
        <StatCard 
          title="Total Savings" 
          amount="$14,800.00" 
          icon={PiggyBank} 
          trend="up" 
          trendValue="2.4%" 
          iconBg="bg-purple-50" 
          iconColor="text-purple-500" 
        />
      </div>

      {/* Section 3: Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div>
          <SavingsProgressCard />
        </div>
      </div>

      {/* Section 4: Monthly Financial Overview */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Monthly Financial Overview</h3>
            <p className="text-sm text-slate-500">June 2026</p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Income</p>
              <p className="font-bold text-emerald-600 text-lg">$8,250</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Expenses</p>
              <p className="font-bold text-red-600 text-lg">$3,420</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Savings Rate</p>
              <p className="font-bold text-primary text-lg">58%</p>
            </div>
          </div>
        </div>
        
        {/* Chart Placeholder */}
        <div className="h-72 w-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50/50 group cursor-pointer hover:bg-slate-50 transition-colors">
          <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-600 font-medium">Interactive Chart Area</p>
          <p className="text-sm text-slate-400 mt-1">Chart implementation goes here</p>
        </div>
      </div>
    </div>
  );
}
