import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function MonthlyTrendChart({ budgets, expenses }) {
  const data = useMemo(() => {
    const months = [...new Set([...budgets.map(b => b.month), ...expenses.map(e => e.date.substring(0, 7))])].sort();
    
    return months.map(month => {
      const budgetForMonth = budgets.filter(b => b.month === month).reduce((sum, b) => sum + b.limit, 0);
      const spentForMonth = expenses.filter(e => e.date.startsWith(month)).reduce((sum, e) => sum + e.amount, 0);
      
      return {
        month,
        Budget: budgetForMonth,
        Spent: spentForMonth
      };
    });
  }, [budgets, expenses]);

  if (data.length === 0) return <div className="flex items-center justify-center h-full text-sm text-slate-500">No trend data available</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
        <Tooltip 
          formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Area type="monotone" dataKey="Budget" stroke="#4f46e5" fillOpacity={1} fill="url(#colorBudget)" strokeWidth={2} />
        <Area type="monotone" dataKey="Spent" stroke="#f43f5e" fillOpacity={1} fill="url(#colorSpent)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
