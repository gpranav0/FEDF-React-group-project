/**
 * Financial Health Score Calculator
 *
 * Weights:
 *   Savings Rate      — 40%
 *   Budget Utilization — 25%
 *   Goal Progress      — 20%
 *   Spending Consistency — 15%
 *
 * Score Levels:
 *   0–39  = Poor
 *   40–59 = Fair
 *   60–79 = Good
 *   80–100 = Excellent
 */

// ─── Score-level config ──────────────────────────────────────────────
export const SCORE_LEVELS = {
  Excellent: {
    min: 80,
    label: 'Excellent',
    emoji: '🏆',
    gradient: ['#10b981', '#059669'],  // emerald
    glow: 'rgba(16, 185, 129, 0.25)',
    text: 'text-emerald-600',
    bg: 'bg-emerald-50',
    darkText: 'dark:text-emerald-400',
    darkBg: 'dark:bg-emerald-900/20',
    tagline: 'Outstanding financial discipline',
  },
  Good: {
    min: 60,
    label: 'Good',
    emoji: '💪',
    gradient: ['#2563eb', '#3b82f6'],  // blue
    glow: 'rgba(37, 99, 235, 0.25)',
    text: 'text-blue-600',
    bg: 'bg-blue-50',
    darkText: 'dark:text-blue-400',
    darkBg: 'dark:bg-blue-900/20',
    tagline: 'Solid financial foundation',
  },
  Fair: {
    min: 40,
    label: 'Fair',
    emoji: '📊',
    gradient: ['#f59e0b', '#d97706'],  // amber
    glow: 'rgba(245, 158, 11, 0.25)',
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    darkText: 'dark:text-amber-400',
    darkBg: 'dark:bg-amber-900/20',
    tagline: 'Room for improvement',
  },
  Poor: {
    min: 0,
    label: 'Poor',
    emoji: '⚠️',
    gradient: ['#ef4444', '#dc2626'],  // red
    glow: 'rgba(239, 68, 68, 0.25)',
    text: 'text-red-600',
    bg: 'bg-red-50',
    darkText: 'dark:text-red-400',
    darkBg: 'dark:bg-red-900/20',
    tagline: 'Needs immediate attention',
  },
};

// ─── Breakdown factor metadata ───────────────────────────────────────
export const FACTOR_META = [
  { key: 'savingsScore',  label: 'Savings Rate',          weight: '40%', icon: '💰' },
  { key: 'budgetScore',   label: 'Budget Utilization',    weight: '25%', icon: '📋' },
  { key: 'goalScore',     label: 'Goal Progress',         weight: '20%', icon: '🎯' },
  { key: 'spendingScore', label: 'Spending Consistency',  weight: '15%', icon: '📊' },
];

// ─── Helper: get level config for a given score ──────────────────────
export function getScoreLevel(score) {
  if (score >= 80) return SCORE_LEVELS.Excellent;
  if (score >= 60) return SCORE_LEVELS.Good;
  if (score >= 40) return SCORE_LEVELS.Fair;
  return SCORE_LEVELS.Poor;
}

// ─── Main calculator ─────────────────────────────────────────────────
export function calculateHealthScore(expenses = [], budgets = [], goals = [], monthlyIncome = 8250) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 1. Savings Rate (40%) — Ideal: >= 20% of income saved
  const savingsRate = monthlyIncome > 0
    ? Math.max(0, (monthlyIncome - totalExpenses) / monthlyIncome)
    : 0;
  const savingsScore = Math.min(100, (savingsRate / 0.20) * 100);

  // 2. Budget Utilization (25%) — Ideal: staying within budget
  let budgetScore = 80; // default when no budgets set
  if (budgets.length > 0) {
    const now = new Date();
    let totalUtilScore = 0;
    budgets.forEach((b) => {
      const spent = expenses
        .filter((e) => {
          const d = new Date(e.date);
          return (
            e.category === b.category &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        })
        .reduce((s, e) => s + e.amount, 0);
      const util = b.amount > 0 ? spent / b.amount : 0;

      if (util <= 0.8) totalUtilScore += 100;
      else if (util <= 1.0) totalUtilScore += 80;
      else totalUtilScore += Math.max(0, 100 - (util - 1) * 200);
    });
    budgetScore = totalUtilScore / budgets.length;
  }

  // 3. Goal Progress (20%) — Ideal: steady contributions
  let goalScore = 70; // default when no goals set
  if (goals.length > 0) {
    const avgProgress =
      goals.reduce((sum, g) => {
        const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
        return sum + Math.min(100, pct);
      }, 0) / goals.length;
    goalScore = avgProgress;
  }

  // 4. Spending Consistency (15%) — Measures diversification across categories
  let spendingScore = 75;
  if (expenses.length > 0) {
    const catTotals = {};
    expenses.forEach((e) => {
      catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
    });
    const maxCatAmount = Math.max(...Object.values(catTotals));
    const concentration = totalExpenses > 0 ? maxCatAmount / totalExpenses : 0;
    // Lower concentration is better. < 30% is ideal (100)
    spendingScore = Math.max(0, Math.min(100, (1 - concentration) * 140));
  }

  // ─── Final score ──────────────────────────────────────────────────
  const finalScore = Math.round(
    savingsScore * 0.40 +
    budgetScore * 0.25 +
    goalScore * 0.20 +
    spendingScore * 0.15
  );
  const score = Math.max(0, Math.min(100, finalScore));

  // ─── Status ───────────────────────────────────────────────────────
  const level = getScoreLevel(score);

  // ─── Strengths & Improvements (richer messages) ───────────────────
  const strengths = [];
  const improvements = [];

  // Savings
  if (savingsScore >= 80) {
    strengths.push({
      text: 'Strong savings rate',
      detail: `Saving ${(savingsRate * 100).toFixed(0)}% of income`,
    });
  } else if (savingsScore >= 50) {
    improvements.push({
      text: 'Boost your savings rate',
      detail: 'Aim for at least 20% of monthly income',
    });
  } else {
    improvements.push({
      text: 'Savings rate needs attention',
      detail: 'Expenses are consuming most of your income',
    });
  }

  // Budgets
  if (budgetScore >= 80) {
    strengths.push({
      text: 'Budgets under control',
      detail: 'Spending within set category limits',
    });
  } else if (budgets.length === 0) {
    improvements.push({
      text: 'Set up monthly budgets',
      detail: 'Category limits help control spending',
    });
  } else {
    improvements.push({
      text: 'Some budgets exceeded',
      detail: 'Review over-budget categories this month',
    });
  }

  // Spending
  if (spendingScore >= 80) {
    strengths.push({
      text: 'Diversified spending',
      detail: 'No single category dominates your budget',
    });
  } else {
    improvements.push({
      text: 'Reduce category concentration',
      detail: 'Spread spending across more categories',
    });
  }

  // Goals
  if (goalScore >= 80) {
    strengths.push({
      text: 'Excellent goal progress',
      detail: 'On track to meet savings targets',
    });
  } else if (goals.length === 0) {
    improvements.push({
      text: 'Create savings goals',
      detail: 'Set targets to build financial security',
    });
  } else {
    improvements.push({
      text: 'Increase goal contributions',
      detail: 'Boost funding to stay on schedule',
    });
  }

  return {
    score,
    status: level.label,
    level,
    breakdown: {
      savingsScore: Math.round(savingsScore),
      budgetScore: Math.round(budgetScore),
      goalScore: Math.round(goalScore),
      spendingScore: Math.round(spendingScore),
    },
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
  };
}
