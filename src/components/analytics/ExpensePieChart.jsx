import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-slate-300">${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
    );
  }
  return null;
};

export default function ExpensePieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Expense Distribution</h3>
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">No expense data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Expense Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            iconType="circle" 
            iconSize={8}
            wrapperStyle={{ fontSize: '13px', color: '#64748b' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
