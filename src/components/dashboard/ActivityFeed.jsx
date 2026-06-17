import { useMemo } from 'react';
import { Receipt, PieChart, Target, DollarSign, Clock, TrendingUp } from 'lucide-react';

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActivityFeed() {
  const activities = useMemo(() => {
    const items = [];

    // Load expenses
    try {
      const raw = localStorage.getItem('fintrack_expenses');
      if (raw) {
        const expenses = JSON.parse(raw);
        expenses.forEach(exp => {
          items.push({
            id: `exp-${exp.id}`,
            type: 'expense',
            icon: Receipt,
            color: 'text-red-500',
            bg: 'bg-red-50',
            title: `Expense added`,
            description: `${exp.title} — $${exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            category: exp.category,
            date: exp.date,
            sortDate: new Date(exp.date),
          });
        });
      }
    } catch {}

    // Load budgets
    try {
      const raw = localStorage.getItem('fintrack_budgets');
      if (raw) {
        const budgets = JSON.parse(raw);
        budgets.forEach((b, i) => {
          items.push({
            id: `bud-${i}`,
            type: 'budget',
            icon: PieChart,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            title: 'Budget created',
            description: `${b.category} — $${b.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} limit`,
            date: new Date().toISOString(),
            sortDate: new Date(Date.now() - i * 86400000),
          });
        });
      }
    } catch {}

    // Load goals
    try {
      const raw = localStorage.getItem('fintrack_goals');
      if (raw) {
        const goals = JSON.parse(raw);
        goals.forEach(g => {
          const progress = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount * 100).toFixed(0) : 0;
          items.push({
            id: `goal-${g.id}`,
            type: 'goal',
            icon: Target,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
            title: g.currentAmount >= g.targetAmount ? 'Goal completed! 🎉' : 'Goal updated',
            description: `${g.name} — ${progress}% complete`,
            date: g.targetDate,
            sortDate: new Date(g.targetDate),
          });
        });
      }
    } catch {}

    // Sort by most recent first
    items.sort((a, b) => b.sortDate - a.sortDate);
    return items.slice(0, 6);
  }, []);

  if (activities.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="p-3 bg-slate-50 rounded-full mb-3">
            <Clock className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-sm text-slate-500">No activity yet</p>
          <p className="text-xs text-slate-400 mt-1">Your recent actions will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full card-hover">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
          {activities.length} items
        </span>
      </div>
      <div className="space-y-1">
        {activities.map((activity, i) => (
          <div
            key={activity.id}
            className={`flex items-start gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-default animate-fade-in animate-stagger-${Math.min(i + 1, 6)}`}
          >
            <div className={`p-2 rounded-lg ${activity.bg} ${activity.color} flex-shrink-0 mt-0.5`}>
              <activity.icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800">{activity.title}</p>
              <p className="text-xs text-slate-500 truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">
              {timeAgo(activity.date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
