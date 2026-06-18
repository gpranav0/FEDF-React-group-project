import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function BudgetUtilizationChart({ percentage }) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  let fillColor = '#10b981'; // green
  if (clampedPercentage >= 90) fillColor = '#ef4444'; // red
  else if (clampedPercentage >= 70) fillColor = '#f59e0b'; // yellow

  const data = [
    { name: 'Used', value: clampedPercentage, fill: fillColor },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl h-full hover:shadow-md transition-shadow flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Budget Utilization</h3>
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <ResponsiveContainer width="100%" height={220}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            startAngle={180}
            endAngle={0}
            barSize={14}
            data={data}
          >
            <RadialBar
              background={{ fill: 'var(--color-glass-bg)' }}
              clockWise
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center" style={{ marginTop: '-10px' }}>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{clampedPercentage.toFixed(0)}%</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">of budget used</p>
        </div>
      </div>
      <div className="flex justify-center gap-6 mt-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Under 70%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span> 70–90%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span> Over 90%
        </span>
      </div>
    </div>
  );
}
