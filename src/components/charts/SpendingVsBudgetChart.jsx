import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function SpendingVsBudgetChart({ budgets, expenses }) {
  const data = useMemo(() => {
    return budgets.map(b => {
      const spent = expenses
        .filter(exp => exp.date.startsWith(b.month) && exp.category === b.category)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return {
        name: b.category,
        Budget: b.limit,
        Spent: spent
      };
    });
  }, [budgets, expenses]);

  if (data.length === 0) return <div className="flex items-center justify-center h-full text-sm text-slate-500">No data available</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
        <Tooltip 
          formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          cursor={{fill: '#f1f5f9'}}
        />
        <Legend />
        <Bar dataKey="Budget" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Spent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
