import { useMemo } from 'react';
import { AlertTriangle, TrendingUp, Lightbulb, PiggyBank, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function SmartInsights() {
  const insights = useMemo(() => {
    let expenses = [];
    let budgets = [];
    let goals = [];
    let settings = {};

    try { expenses = JSON.parse(localStorage.getItem('fintrack_expenses') || '[]'); } catch {}
    try { budgets = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]'); } catch {}
    try { goals = JSON.parse(localStorage.getItem('fintrack_goals') || '[]'); } catch {}
    try { settings = JSON.parse(localStorage.getItem('fintrack_settings') || '{}'); } catch {}

    const monthlyIncome = parseFloat(settings?.preferences?.incomeGoal) || 8250;
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const items = [];

    // 1. Highest spending category
    const catTotals = {};
    expenses.forEach(e => {
      catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
    });
    const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      const [topCat, topAmount] = sorted[0];
      const pct = totalExpenses > 0 ? ((topAmount / totalExpenses) * 100).toFixed(0) : 0;
      items.push({
        icon: TrendingUp,
        title: 'Top Spending Category',
        description: `${topCat} accounts for ${pct}% of your total spending ($${topAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})})`,
        type: pct > 50 ? 'warning' : 'info',
        color: pct > 50 ? 'border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/20' : 'border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/20',
        iconColor: pct > 50 ? 'text-amber-500 bg-amber-100 dark:bg-amber-900/40' : 'text-blue-500 bg-blue-100 dark:bg-blue-900/40',
      });
    }

    // 2. Overspending warnings
    if (budgets.length > 0) {
      const now = new Date();
      const overBudget = [];
      budgets.forEach(b => {
        const spent = expenses
          .filter(e => {
            const d = new Date(e.date);
            return e.category === b.category && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          })
          .reduce((s, e) => s + e.amount, 0);
        if (spent > b.amount) {
          overBudget.push({ category: b.category, overage: spent - b.amount });
        }
      });
      if (overBudget.length > 0) {
        items.push({
          icon: AlertTriangle,
          title: 'Budget Overspend Alert',
          description: `${overBudget.length} budget${overBudget.length > 1 ? 's' : ''} exceeded: ${overBudget.map(o => o.category).join(', ')}`,
          type: 'danger',
          color: 'border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/20',
          iconColor: 'text-red-500 bg-red-100 dark:bg-red-900/40',
        });
      } else {
        items.push({
          icon: ShieldCheck,
          title: 'Budgets On Track',
          description: 'All your budgets are within their limits this month. Keep it up!',
          type: 'success',
          color: 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/20',
          iconColor: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/40',
        });
      }
    }

    // 3. Savings opportunity
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - totalExpenses) / monthlyIncome) * 100 : 0;
    if (savingsRate > 0 && savingsRate < 20) {
      items.push({
        icon: PiggyBank,
        title: 'Savings Opportunity',
        description: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for 20%+ by reducing discretionary spending.`,
        type: 'info',
        color: 'border-purple-200 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/20',
        iconColor: 'text-purple-500 bg-purple-100 dark:bg-purple-900/40',
      });
    } else if (savingsRate >= 20) {
      items.push({
        icon: PiggyBank,
        title: 'Great Savings Rate',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income — above the recommended 20% target!`,
        type: 'success',
        color: 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/20',
        iconColor: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/40',
      });
    }

    // 4. Goal recommendations
    if (goals.length > 0) {
      const closestGoal = goals
        .filter(g => g.currentAmount < g.targetAmount)
        .sort((a, b) => {
          const pctA = a.currentAmount / a.targetAmount;
          const pctB = b.currentAmount / b.targetAmount;
          return pctB - pctA;
        })[0];
      if (closestGoal) {
        const pct = ((closestGoal.currentAmount / closestGoal.targetAmount) * 100).toFixed(0);
        const remaining = closestGoal.targetAmount - closestGoal.currentAmount;
        items.push({
          icon: Lightbulb,
          title: 'Almost There!',
          description: `"${closestGoal.name}" is ${pct}% complete. Just $${remaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} to go.`,
          type: 'info',
          color: 'border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/20',
          iconColor: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/40',
        });
      }
    }

    return items.slice(0, 4);
  }, []);

  if (insights.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl card-hover animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Smart Insights</h3>
        <div className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>AI-Powered</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${insight.color} card-hover animate-fade-in animate-stagger-${i + 1}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${insight.iconColor} flex-shrink-0`}>
                <insight.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{insight.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
