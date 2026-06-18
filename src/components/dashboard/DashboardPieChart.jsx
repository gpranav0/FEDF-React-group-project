import { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#06b6d4', '#6366f1'];

export default function DashboardPieChart() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const chartData = useMemo(() => {
    let expenses = [];
    try { expenses = JSON.parse(localStorage.getItem('fintrack_expenses') || '[]'); } catch (e) { console.error(e); }

    const catTotals = {};
    expenses.forEach(e => {
      catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
    });

    return Object.entries(catTotals)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col min-h-[340px]">
        <div className="skeleton h-6 w-1/2 mb-2" />
        <div className="skeleton h-4 w-1/3 mb-8" />
        <div className="flex-1 flex items-center justify-center">
          <div className="skeleton w-48 h-48 rounded-full" />
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col items-center justify-center min-h-[340px]">
        <p className="text-sm text-slate-400">No expense data yet</p>
      </div>
    );
  }

  const total = chartData.reduce((s, d) => s + d.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0];
      const pct = ((d.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white px-3 py-2 rounded-xl shadow-lg border border-slate-100 text-xs">
          <p className="font-semibold text-slate-700">{d.name}</p>
          <p className="text-slate-500">${d.value.toLocaleString()} ({pct}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 card-hover">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">Expense Breakdown</h3>
        <p className="text-sm text-slate-500">Spending by category</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
        {chartData.slice(0, 6).map((item, idx) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
            <span className="text-slate-600 truncate">{item.name}</span>
            <span className="text-slate-400 ml-auto font-medium">{((item.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
