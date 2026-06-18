import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: 'var(--chart-tooltip-bg)', borderColor: 'var(--chart-tooltip-border)', color: 'var(--chart-tooltip-text)' }}>
        <p className="font-semibold mb-1">{label}</p>
        <p style={{ color: 'var(--chart-text)' }}>${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
    );
  }
  return null;
};

export default function MonthlyExpenseChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-full">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Monthly Expenses</h3>
        <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-sm">No monthly data available</div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl h-full card-hover hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Monthly Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
            tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-glass-bg)' }} />
          <Bar dataKey="expenses" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
