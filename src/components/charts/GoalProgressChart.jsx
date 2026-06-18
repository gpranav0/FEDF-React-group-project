import React, { useMemo } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';

export function GoalProgressChart({ goals }) {
  const data = useMemo(() => {
    return goals.map((g, i) => {
      const fillColors = ['#4f46e5', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'];
      return {
        name: g.name,
        progress: Number(Math.min(((g.saved / g.target) * 100), 100).toFixed(1)),
        fill: fillColors[i % fillColors.length]
      };
    });
  }, [goals]);

  if (data.length === 0) return <div className="flex items-center justify-center h-full text-sm text-slate-500">No active goals</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart 
        cx="50%" 
        cy="50%" 
        innerRadius="20%" 
        outerRadius="90%" 
        barSize={15} 
        data={data}
      >
        <RadialBar
          minAngle={15}
          background={{ fill: '#f1f5f9' }}
          clockWise
          dataKey="progress"
          cornerRadius={10}
        />
        <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
        <Tooltip 
          formatter={(value) => `${value}%`}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
