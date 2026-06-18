import React, { useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function CashFlowComposedChart({ expenses, activeMonth }) {
  const data = useMemo(() => {
    if (!activeMonth) return [];
    const [year, month] = activeMonth.split('-');
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      Expense: 0,
      Cumulative: 0
    }));

    const monthExpenses = expenses.filter(e => e.date.startsWith(activeMonth));
    monthExpenses.forEach(e => {
      const day = parseInt(e.date.split('-')[2]);
      if (day >= 1 && day <= daysInMonth) {
        dailyData[day - 1].Expense += e.amount;
      }
    });

    let cumulative = 0;
    dailyData.forEach(d => {
      cumulative += d.Expense;
      d.Cumulative = cumulative;
    });

    return dailyData;
  }, [expenses, activeMonth]);

  if (data.length === 0) return <div className="flex items-center justify-center h-full text-sm text-slate-500">No cash flow data</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
        <Tooltip 
          formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="Expense" barSize={10} fill="#f43f5e" radius={[2, 2, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="Cumulative" stroke="#4f46e5" strokeWidth={3} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
