import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function GoalComparisonChart({ goals }) {
  const data = useMemo(() => {
    return goals.map(g => ({
      name: g.name,
      Target: g.target,
      Saved: g.saved
    }));
  }, [goals]);

  if (data.length === 0) return <div className="flex items-center justify-center h-full text-sm text-slate-500">No goals to compare</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
        <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={100} />
        <Tooltip 
          formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          cursor={{fill: '#f1f5f9'}}
        />
        <Legend />
        <Bar dataKey="Target" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={12} />
        <Bar dataKey="Saved" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
      </BarChart>
    </ResponsiveContainer>
  );
}
