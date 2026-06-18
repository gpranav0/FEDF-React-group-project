import React, { useMemo } from 'react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';

export function CategoryRadarChart({ data }) {
  const radarData = useMemo(() => {
    return data.slice(0, 6);
  }, [data]);

  if (radarData.length === 0) return <div className="flex items-center justify-center h-full text-sm text-slate-500">No category data</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
        <Radar name="Spent" dataKey="amount" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.5} />
        <Tooltip 
          formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
