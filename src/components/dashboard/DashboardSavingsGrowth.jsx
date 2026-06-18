import { useMemo, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DashboardSavingsGrowth() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const chartData = useMemo(() => {
    let goals = [];
    try { goals = JSON.parse(localStorage.getItem('fintrack_goals') || '[]'); } catch (e) {}

    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

    const now = new Date();
    const months = [];
    
    // Simulate savings growth over last 6 months (mock data scaled to current savings)
    // Assume 15% growth per month to create a nice curve ending at totalSaved
    let current = totalSaved;
    
    for (let i = 0; i <= 5; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.unshift({
        month: MONTH_NAMES[d.getMonth()],
        Savings: Math.round(current)
      });
      // Reverse engineer previous months
      current = current * 0.85; // 15% less previous month
    }

    return months;
  }, []);

  if (isLoading) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-full flex flex-col min-h-[340px]">
        <div className="skeleton h-6 w-1/3 mb-2" />
        <div className="skeleton h-4 w-1/2 mb-8" />
        <div className="skeleton flex-1 w-full" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: 'var(--chart-tooltip-bg)', borderColor: 'var(--chart-tooltip-border)' }}>
          <p className="font-semibold" style={{ color: 'var(--chart-tooltip-text)' }}>{label}</p>
          <p className="text-purple-600 font-bold">${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl card-hover h-full flex flex-col min-h-[340px]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Savings Growth</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Cumulative savings progress over time</p>
      </div>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-text)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--chart-text)' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--chart-grid)', strokeWidth: 2 }} />
            <Area 
              type="monotone" 
              dataKey="Savings" 
              stroke="#a855f7" 
              strokeWidth={3} 
              fill="url(#savingsGradient)" 
              dot={{ r: 4, fill: '#a855f7', stroke: 'var(--color-glass-bg)', strokeWidth: 2 }} 
              activeDot={{ r: 6 }} 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
