import { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DashboardSpendingTrend() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const chartData = useMemo(() => {
    let expenses = [];
    try { expenses = JSON.parse(localStorage.getItem('fintrack_expenses') || '[]'); } catch (e) { console.error(e); }

    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: MONTH_NAMES[d.getMonth()],
        monthIdx: d.getMonth(),
        year: d.getFullYear(),
        Spending: 0,
      });
    }

    expenses.forEach(exp => {
      const date = new Date(exp.date);
      const entry = months.find(m => m.monthIdx === date.getMonth() && m.year === date.getFullYear());
      if (entry) entry.Spending += exp.amount;
    });

    months.forEach(m => m.Spending = Math.round(m.Spending * 100) / 100);
    return months;
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col min-h-[340px]">
        <div className="skeleton h-6 w-1/3 mb-2" />
        <div className="skeleton h-4 w-1/2 mb-8" />
        <div className="skeleton flex-1 w-full" />
      </div>
    );
  }

  if (chartData.every(d => d.Spending === 0)) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col items-center justify-center min-h-[340px]">
        <p className="text-sm text-slate-400">No spending data yet</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-xl shadow-lg border border-slate-100 text-xs">
          <p className="font-semibold text-slate-700">{label}</p>
          <p className="text-blue-600">${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Spending Trend</h3>
          <p className="text-sm text-slate-500">Monthly spending — Last 6 months</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="Spending" stroke="#3b82f6" strokeWidth={2.5} fill="url(#spendGradient)" dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
