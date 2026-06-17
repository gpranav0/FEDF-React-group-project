import { AlertTriangle, TrendingUp, TrendingDown, PiggyBank, Target, Lightbulb, CheckCircle2, ShieldAlert, Award } from 'lucide-react';

export function generateInsights(expenses = [], budgets = [], goals = [], settings = {}) {
  const insights = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyIncome = parseFloat(settings?.preferences?.incomeGoal) || 8250;
  const currencySymbol = settings?.preferences?.currency?.match(/\((.*?)\)/)?.[1] || '$';

  // Helpers
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const totalSpentThisMonth = currentMonthExpenses.reduce((s, e) => s + e.amount, 0);

  const prevMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    let pm = currentMonth - 1;
    let py = currentYear;
    if (pm < 0) { pm = 11; py--; }
    return d.getMonth() === pm && d.getFullYear() === py;
  });
  const totalSpentLastMonth = prevMonthExpenses.reduce((s, e) => s + e.amount, 0);

  // --- Spending Insights ---
  const catTotals = {};
  currentMonthExpenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  
  if (sortedCats.length > 0) {
    const [topCat, topAmount] = sortedCats[0];
    const pct = totalSpentThisMonth > 0 ? ((topAmount / totalSpentThisMonth) * 100).toFixed(0) : 0;
    
    if (pct > 40) {
      insights.push({
        id: 'spend-1',
        title: 'High Category Spending',
        description: `${topCat} accounts for ${pct}% of your spending this month (${currencySymbol}${topAmount.toLocaleString()}).`,
        priority: 'warning',
        icon: TrendingUp
      });
    } else {
      insights.push({
        id: 'spend-2',
        title: 'Top Spending Category',
        description: `You've spent ${currencySymbol}${topAmount.toLocaleString()} on ${topCat} so far this month.`,
        priority: 'info',
        icon: Lightbulb
      });
    }
  }

  if (totalSpentLastMonth > 0) {
    const diff = totalSpentThisMonth - totalSpentLastMonth;
    if (diff > totalSpentLastMonth * 0.2 && totalSpentThisMonth > 0) {
      insights.push({
        id: 'spend-3',
        title: 'Spending Increased',
        description: `Your spending is up by ${currencySymbol}${diff.toLocaleString()} compared to last month.`,
        priority: 'warning',
        icon: TrendingUp
      });
    } else if (diff < 0) {
      insights.push({
        id: 'spend-4',
        title: 'Great Saving Habit!',
        description: `You've spent ${currencySymbol}${Math.abs(diff).toLocaleString()} less than last month!`,
        priority: 'success',
        icon: TrendingDown
      });
    }
  }

  // --- Budget Insights ---
  if (budgets.length > 0) {
    let overBudgets = [];
    let nearBudgets = [];
    let underBudgets = [];

    budgets.forEach(b => {
      const spent = currentMonthExpenses.filter(e => e.category === b.category).reduce((s, e) => s + e.amount, 0);
      const pct = b.amount > 0 ? (spent / b.amount) * 100 : 0;
      
      if (pct >= 100) overBudgets.push({ name: b.category, over: spent - b.amount });
      else if (pct >= 85) nearBudgets.push({ name: b.category, left: b.amount - spent });
      else if (pct < 50 && spent > 0) underBudgets.push({ name: b.category });
    });

    if (overBudgets.length > 0) {
      insights.push({
        id: 'budget-over',
        title: 'Budgets Exceeded',
        description: `You've exceeded your limits for ${overBudgets.map(b => b.name).join(', ')}.`,
        priority: 'warning',
        icon: ShieldAlert
      });
    }
    
    if (nearBudgets.length > 0 && overBudgets.length === 0) {
      insights.push({
        id: 'budget-near',
        title: 'Nearing Budget Limits',
        description: `${nearBudgets.map(b => b.name).join(', ')} are close to their limits.`,
        priority: 'warning',
        icon: AlertTriangle
      });
    }

    if (underBudgets.length > 0) {
      insights.push({
        id: 'budget-under',
        title: 'Under Budget',
        description: `Great job staying well under budget for ${underBudgets[0].name}.`,
        priority: 'success',
        icon: CheckCircle2
      });
    }
  } else {
    insights.push({
      id: 'budget-none',
      title: 'Optimize with Budgets',
      description: 'Set category limits to better control where your money goes.',
      priority: 'info',
      icon: Lightbulb
    });
  }

  // --- Savings Insights ---
  if (goals.length > 0) {
    const closestGoal = goals
      .filter(g => g.currentAmount < g.targetAmount)
      .sort((a, b) => (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount))[0];

    if (closestGoal) {
      const pct = ((closestGoal.currentAmount / closestGoal.targetAmount) * 100).toFixed(0);
      insights.push({
        id: 'goal-close',
        title: 'Goal Almost Reached!',
        description: `You're ${pct}% of the way to your "${closestGoal.name}" goal.`,
        priority: 'success',
        icon: Target
      });
    }

    const completed = goals.filter(g => g.currentAmount >= g.targetAmount);
    if (completed.length > 0) {
      insights.push({
        id: 'goal-done',
        title: 'Goals Achieved',
        description: `You've fully funded ${completed.length} savings goals.`,
        priority: 'success',
        icon: Award
      });
    }
  } else {
    insights.push({
      id: 'goal-none',
      title: 'Start Saving',
      description: 'Create a savings goal to start tracking progress toward big milestones.',
      priority: 'info',
      icon: PiggyBank
    });
  }

  // --- Financial Recommendations ---
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - totalSpentThisMonth) / monthlyIncome) * 100 : 0;
  if (savingsRate < 20 && totalSpentThisMonth > 0) {
    insights.push({
      id: 'rec-1',
      title: 'Savings Opportunity',
      description: `Try reducing discretionary spending to hit a 20% savings rate.`,
      priority: 'info',
      icon: Lightbulb
    });
  } else if (savingsRate >= 20) {
    insights.push({
      id: 'rec-2',
      title: 'Excellent Savings Rate',
      description: `You're saving ${savingsRate.toFixed(0)}% of your income! Keep it up.`,
      priority: 'success',
      icon: PiggyBank
    });
  }

  // Sort: Warnings first, then successes, then infos
  const priorityOrder = { 'warning': 1, 'success': 2, 'info': 3 };
  insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return insights.slice(0, 4);
}
