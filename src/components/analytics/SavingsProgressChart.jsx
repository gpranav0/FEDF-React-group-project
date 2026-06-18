import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="glass-panel px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: 'var(--chart-tooltip-bg)', borderColor: 'var(--chart-tooltip-border)', color: 'var(--chart-tooltip-text)' }}>
        <p className="font-semibold mb-1">{d.name}</p>
        <p style={{ color: 'var(--chart-text)' }}>Progress: {d.percentage.toFixed(1)}%</p>
        <p style={{ color: 'var(--chart-text)' }}>${d.current.toLocaleString()} / ${d.target.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function SavingsProgressChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-full">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Savings Goals Progress</h3>
        <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-sm">No savings goals available</div>
      </div>
    );
  }

  const chartData = data.map(goal => ({
    name: goal.name,
    percentage: Math.min((goal.currentAmount / goal.targetAmount) * 100, 100),
    current: goal.currentAmount,
    target: goal.targetAmount
  }));

  return (
    <div className="glass-panel p-6 rounded-2xl h-full card-hover hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Savings Goals Progress</h3>
      <ResponsiveContainer width="100%" height={Math.max(chartData.length * 50 + 40, 200)}>
        <BarChart data={chartData} layout="vertical" barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" horizontal={false} />
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }} 
            tickFormatter={(val) => `${val}%`}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--chart-text)', fontSize: 13 }} 
            width={120}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-glass-bg)' }} />
          <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
