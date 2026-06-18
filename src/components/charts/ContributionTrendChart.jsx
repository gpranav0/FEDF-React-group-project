import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function ContributionTrendChart({ goals }) {
  const data = useMemo(() => {
    const allHistory = [];
    goals.forEach(g => {
      if (g.history) {
        g.history.forEach(h => {
          allHistory.push({ date: new Date(h.date), amount: h.amount });
        });
      }
    });

    const monthlyMap = {};
    allHistory.forEach(h => {
      const month = h.date.toISOString().slice(0, 7);
      monthlyMap[month] = (monthlyMap[month] || 0) + h.amount;
    });

    const sortedMonths = Object.keys(monthlyMap).sort();
    const result = [];
    let cumulative = 0;
    
    sortedMonths.forEach(month => {
      cumulative += monthlyMap[month];
      result.push({ month, TotalSaved: cumulative, Contribution: monthlyMap[month] });
    });

    return result;
  }, [goals]);

  if (data.length === 0) return <div className="flex items-center justify-center h-full text-sm text-slate-500">No contribution history</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
        <Tooltip 
          formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Line type="monotone" dataKey="TotalSaved" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
