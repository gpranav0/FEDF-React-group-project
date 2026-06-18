import { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MOCK_MONTHLY_INCOME = 8250;

export default function DashboardIncomeExpenseChart() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
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

    months.forEach(m => m.Expenses = Math.round(m.Expenses * 100) / 100);
    return months;
  }, []);

  if (isLoading) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-full flex flex-col min-h-[340px]">
        <div className="skeleton h-6 w-1/3 mb-2" />
        <div className="skeleton h-4 w-1/2 mb-8" />
        <div className="skeleton flex-1 w-full" />
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl card-hover h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Income vs Expenses</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monthly overview — Last 6 Months</p>
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
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyChartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-text)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-text)' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid var(--chart-tooltip-border)', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                backgroundColor: 'var(--chart-tooltip-bg)',
                color: 'var(--chart-tooltip-text)'
              }}
              itemStyle={{ color: 'var(--chart-tooltip-text)' }}
              cursor={{ fill: 'var(--color-glass-bg)' }}
              formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
            />
            <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Expenses" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
