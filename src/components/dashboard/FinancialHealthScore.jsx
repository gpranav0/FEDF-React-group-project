import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Lightbulb, ShieldCheck, AlertTriangle, Target } from 'lucide-react';

const HEALTH_LEVELS = [
  { min: 0,  max: 39, label: 'Poor',      color: '#ef4444', bg: 'bg-red-50',     text: 'text-red-600',     ring: 'stroke-red-500' },
  { min: 40, max: 59, label: 'Fair',       color: '#f59e0b', bg: 'bg-amber-50',   text: 'text-amber-600',   ring: 'stroke-amber-500' },
  { min: 60, max: 79, label: 'Good',       color: '#2563eb', bg: 'bg-blue-50',     text: 'text-blue-600',    ring: 'stroke-blue-500' },
  { min: 80, max: 100, label: 'Excellent', color: '#10b981', bg: 'bg-emerald-50',  text: 'text-emerald-600', ring: 'stroke-emerald-500' },
];

function getLevel(score) {
  return HEALTH_LEVELS.find(l => score >= l.min && score <= l.max) || HEALTH_LEVELS[0];
}

export default function FinancialHealthScore() {
  // Load data from localStorage
  const { score, breakdown, recommendations } = useMemo(() => {
    let expenses = [];
    let budgets = [];
    let goals = [];
    let settings = {};

    try {
      const e = localStorage.getItem('fintrack_expenses');
      if (e) expenses = JSON.parse(e);
    } catch {}
    try {
      const b = localStorage.getItem('fintrack_budgets');
      if (b) budgets = JSON.parse(b);
    } catch {}
    try {
      const g = localStorage.getItem('fintrack_goals');
      if (g) goals = JSON.parse(g);
    } catch {}
    try {
      const s = localStorage.getItem('fintrack_settings');
      if (s) settings = JSON.parse(s);
    } catch {}

    const monthlyIncome = parseFloat(settings?.preferences?.incomeGoal) || 8250;
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // --- 1. Savings Rate Score (0-100, weight 30%) ---
    const savingsRate = monthlyIncome > 0 ? Math.max(0, (monthlyIncome - totalExpenses) / monthlyIncome) : 0;
    // Ideal: >= 20% = 100, 0% = 0
    const savingsScore = Math.min(100, (savingsRate / 0.2) * 100);

    // --- 2. Budget Utilization Score (0-100, weight 25%) ---
    let budgetScore = 75; // default if no budgets
    if (budgets.length > 0) {
      const now = new Date();
      let totalUtil = 0;
      budgets.forEach(b => {
        const spent = expenses
          .filter(e => {
            const d = new Date(e.date);
            return e.category === b.category && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          })
          .reduce((s, e) => s + e.amount, 0);
        const util = b.amount > 0 ? spent / b.amount : 0;
        // Ideal: 50-80% utilization = 100, over 100% or under 20% = lower
        if (util <= 0.8) totalUtil += 100;
        else if (util <= 1.0) totalUtil += 60;
        else totalUtil += Math.max(0, 30 - (util - 1) * 30);
      });
      budgetScore = totalUtil / budgets.length;
    }

    // --- 3. Expense Patterns Score (0-100, weight 25%) ---
    // Measures diversification - not overspending in one category
    let expensePatternScore = 70;
    if (expenses.length > 0) {
      const catTotals = {};
      expenses.forEach(e => {
        catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
      });
      const cats = Object.values(catTotals);
      const maxCat = Math.max(...cats);
      const concentration = totalExpenses > 0 ? maxCat / totalExpenses : 0;
      // Lower concentration is better. concentration < 0.3 = 100, > 0.8 = 20
      expensePatternScore = Math.max(20, Math.min(100, (1 - concentration) * 125));
    }

    // --- 4. Goal Progress Score (0-100, weight 20%) ---
    let goalScore = 60; // default if no goals
    if (goals.length > 0) {
      const avgProgress = goals.reduce((sum, g) => {
        const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
        return sum + Math.min(100, pct);
      }, 0) / goals.length;
      goalScore = avgProgress;
    }

    // Weighted total
    const totalScore = Math.round(
      savingsScore * 0.30 +
      budgetScore * 0.25 +
      expensePatternScore * 0.25 +
      goalScore * 0.20
    );

    const finalScore = Math.max(0, Math.min(100, totalScore));

    // Build recommendations
    const recs = [];
    if (savingsScore < 60) {
      recs.push({ icon: TrendingUp, text: 'Try to save at least 20% of your income each month', type: 'warning' });
    }
    if (budgetScore < 60) {
      recs.push({ icon: AlertTriangle, text: 'Some budgets are over-utilized. Consider adjusting spending limits', type: 'warning' });
    }
    if (expensePatternScore < 60) {
      recs.push({ icon: Lightbulb, text: 'Diversify spending — one category dominates your expenses', type: 'info' });
    }
    if (goalScore < 50) {
      recs.push({ icon: Target, text: 'Increase contributions to your savings goals', type: 'info' });
    }
    if (finalScore >= 80) {
      recs.push({ icon: ShieldCheck, text: 'Great work! Your finances are in excellent shape', type: 'success' });
    }

    return {
      score: finalScore,
      breakdown: {
        savings: Math.round(savingsScore),
        budget: Math.round(budgetScore),
        expenses: Math.round(expensePatternScore),
        goals: Math.round(goalScore),
      },
      recommendations: recs.slice(0, 3),
    };
  }, []);

  const level = getLevel(score);

  // SVG Ring
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const breakdownItems = [
    { label: 'Savings Rate', value: breakdown.savings },
    { label: 'Budget Use', value: breakdown.budget },
    { label: 'Spending', value: breakdown.expenses },
    { label: 'Goal Progress', value: breakdown.goals },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 card-hover animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-900">Financial Health</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${level.bg} ${level.text}`}>
          {level.label}
        </span>
      </div>

      <div className="flex items-center gap-6 mb-6">
        {/* Circular Progress Ring */}
        <div className="relative flex-shrink-0">
          <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
            {/* Background ring */}
            <circle
              cx="65" cy="65" r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            {/* Progress ring */}
            <circle
              cx="65" cy="65" r={radius}
              fill="none"
              stroke={level.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="animate-ring-fill"
              style={{ '--ring-circumference': circumference, transition: 'stroke-dashoffset 1.2s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900">{score}</span>
            <span className="text-xs text-slate-500 font-medium">/ 100</span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 space-y-3">
          {breakdownItems.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">{item.label}</span>
                <span className="text-slate-500">{item.value}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full animate-progress-fill"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: getLevel(item.value).color,
                    transition: 'width 1s ease-out',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-2 border-t border-slate-100 pt-4">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs ${
                rec.type === 'warning' ? 'bg-amber-50 text-amber-800' :
                rec.type === 'success' ? 'bg-emerald-50 text-emerald-800' :
                'bg-blue-50 text-blue-800'
              }`}
            >
              <rec.icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">{rec.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
