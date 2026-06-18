import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, DollarSign, PieChart } from 'lucide-react';

export default function DashboardAnalyticsSummary() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    let expenses = [];
    let budgets = [];
    let settings = {};
    try { expenses = JSON.parse(localStorage.getItem('fintrack_expenses') || '[]'); } catch (e) {}
    try { budgets = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]'); } catch (e) {}
    try { settings = JSON.parse(localStorage.getItem('fintrack_settings') || '{}'); } catch (e) {}

    const currencySymbol = settings?.preferences?.currency?.match(/\((.*?)\)/)?.[1] || '$';

    // 1. Highest spending category
    const catTotals = {};
    expenses.forEach(e => {
      catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
    });
    const highestCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

    // 2. Average monthly spending
    const months = new Set(expenses.map(e => new Date(e.date).getMonth() + '-' + new Date(e.date).getFullYear())).size;
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const avgSpending = months > 0 ? totalExpenses / months : 0;

    // 3. Budget utilization
    const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
    const utilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

    // 4. Best saving month (mocked based on lowest expense month for now)
    const monthTotals = {};
    expenses.forEach(e => {
      const key = new Date(e.date).toLocaleString('default', { month: 'short' });
      monthTotals[key] = (monthTotals[key] || 0) + e.amount;
    });
    const bestMonth = Object.entries(monthTotals).sort((a, b) => a[1] - b[1])[0]; // Lowest expenses

    return {
      highestCategory: highestCat ? highestCat[0] : 'N/A',
      highestCategoryAmount: highestCat ? highestCat[1] : 0,
      avgSpending,
      utilization,
      bestMonth: bestMonth ? bestMonth[0] : 'N/A',
      currencySymbol
    };
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-24 w-full" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Highest Category',
      value: stats.highestCategory,
      subtext: `${stats.currencySymbol}${stats.highestCategoryAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} spent`,
      icon: TrendingDown,
      color: 'text-rose-500',
      bg: 'bg-rose-50'
    },
    {
      title: 'Best Saving Month',
      value: stats.bestMonth,
      subtext: 'Lowest overall expenses',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Average Spending',
      value: `${stats.currencySymbol}${stats.avgSpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      subtext: 'Per month average',
      icon: DollarSign,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      title: 'Budget Utilization',
      value: `${stats.utilization.toFixed(1)}%`,
      subtext: 'Of total allocated budget',
      icon: PieChart,
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60 shadow-sm flex items-start gap-4 hover:bg-slate-50 transition-colors"
        >
          <div className={`p-2.5 rounded-lg ${card.bg} ${card.color} shrink-0`}>
            <card.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-0.5">{card.title}</p>
            <p className="text-lg font-bold text-slate-900 leading-tight">{card.value}</p>
            <p className="text-[10px] text-slate-400 mt-1">{card.subtext}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
