import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color }} className="flex justify-between gap-4">
            <span>{entry.name}:</span>
            <span className="font-medium">${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function IncomeExpenseChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Income vs Expenses</h3>
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">No data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            iconType="circle" 
            iconSize={8}
            wrapperStyle={{ fontSize: '13px', color: '#64748b' }}
          />
          <Line 
            type="monotone" 
            dataKey="income" 
            name="Income" 
            stroke="#10b981" 
            strokeWidth={2.5} 
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            name="Expenses" 
            stroke="#ef4444" 
            strokeWidth={2.5} 
            dot={{ fill: '#ef4444', r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
