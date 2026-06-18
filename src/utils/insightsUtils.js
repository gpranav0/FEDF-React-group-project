import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Target, 
  Lightbulb, 
  CheckCircle2, 
  ShieldAlert, 
  Award,
  Clock
} from 'lucide-react';

export function generateInsights(expenses = [], budgets = [], goals = [], settings = {}) {
  const insights = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyIncome = parseFloat(settings?.preferences?.incomeGoal) || 8250;
  const currencySymbol = settings?.preferences?.currency?.match(/\((.*?)\)/)?.[1] || '$';

  // --- Helpers ---
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

  // ─── Spending Insights ──────────────────────────────────────────────────
  const catTotals = {};
  currentMonthExpenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  
  if (sortedCats.length > 0) {
    const [topCat, topAmount] = sortedCats[0];
    const pct = totalSpentThisMonth > 0 ? ((topAmount / totalSpentThisMonth) * 100).toFixed(0) : 0;
    
    // Highest spending category
    if (pct > 40) {
      insights.push({
        id: 'spend-high',
        title: 'High Category Spending',
        description: `${topCat} accounts for ${pct}% of your spending this month (${currencySymbol}${topAmount.toLocaleString()}). Consider reducing expenses here.`,
        priority: 'warning',
        icon: TrendingUp
      });
    } else {
      insights.push({
        id: 'spend-top',
        title: 'Top Spending Category',
        description: `Your highest expense category is ${topCat} at ${currencySymbol}${topAmount.toLocaleString()}.`,
        priority: 'info',
        icon: Lightbulb
      });
    }
  }

  // Unusual spending increases / Monthly spending trends
  if (totalSpentLastMonth > 0) {
    const diff = totalSpentThisMonth - totalSpentLastMonth;
    const diffPct = (diff / totalSpentLastMonth) * 100;
    
    if (diffPct > 20 && totalSpentThisMonth > 0) {
      insights.push({
        id: 'spend-increase',
        title: 'Unusual Spending Increase',
        description: `Your spending is up by ${diffPct.toFixed(0)}% (${currencySymbol}${diff.toLocaleString()}) compared to last month. Review your recent transactions.`,
        priority: 'warning',
        icon: AlertTriangle
      });
    } else if (diff < 0) {
      insights.push({
        id: 'spend-decrease',
        title: 'Positive Spending Trend',
        description: `Great job! You've spent ${currencySymbol}${Math.abs(diff).toLocaleString()} less than last month.`,
        priority: 'success',
        icon: TrendingDown
      });
    }
  }

  // ─── Budget Insights ────────────────────────────────────────────────────
  if (budgets.length > 0) {
    let overBudgets = [];
    let nearBudgets = [];
    let underBudgets = [];

    budgets.forEach(b => {
      const spent = currentMonthExpenses.filter(e => e.category === b.category).reduce((s, e) => s + e.amount, 0);
      const pct = b.amount > 0 ? (spent / b.amount) * 100 : 0;
      
      if (pct >= 100) overBudgets.push({ name: b.category, over: spent - b.amount });
      else if (pct >= 85) nearBudgets.push({ name: b.category, left: b.amount - spent });
      else if (pct < 50 && spent > 0) underBudgets.push({ name: b.category, amount: b.amount - spent });
    });

    // Categories exceeding budgets
    if (overBudgets.length > 0) {
      insights.push({
        id: 'budget-over',
        title: 'Budgets Exceeded',
        description: `You've exceeded your budget limits for ${overBudgets.map(b => b.name).join(', ')}. Try to minimize spending here.`,
        priority: 'warning',
        icon: ShieldAlert
      });
    }
    
    // Categories nearing budget limits
    if (nearBudgets.length > 0 && overBudgets.length === 0) {
      insights.push({
        id: 'budget-near',
        title: 'Nearing Budget Limits',
        description: `${nearBudgets.map(b => b.name).join(', ')} ${nearBudgets.length > 1 ? 'are' : 'is'} close to the monthly limit. Spend carefully.`,
        priority: 'warning',
        icon: AlertTriangle
      });
    }

    // Categories significantly under budget
    if (underBudgets.length > 0) {
      insights.push({
        id: 'budget-under',
        title: 'Significantly Under Budget',
        description: `You are well under budget for ${underBudgets[0].name}. You could reallocate ${currencySymbol}${underBudgets[0].amount.toLocaleString()} to savings.`,
        priority: 'success',
        icon: CheckCircle2
      });
    }
  } else {
    insights.push({
      id: 'budget-none',
      title: 'Budget Optimization',
      description: 'Set category limits to better control where your money goes and identify savings opportunities.',
      priority: 'info',
      icon: Lightbulb
    });
  }

  // ─── Savings Insights ───────────────────────────────────────────────────
  if (goals.length > 0) {
    const incompleteGoals = goals.filter(g => g.currentAmount < g.targetAmount);
    
    if (incompleteGoals.length > 0) {
      // Closest goal to completion
      const closestGoal = [...incompleteGoals].sort((a, b) => 
        (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount)
      )[0];

      const pct = ((closestGoal.currentAmount / closestGoal.targetAmount) * 100).toFixed(0);
      insights.push({
        id: 'goal-close',
        title: 'Goal Almost Reached!',
        description: `You're ${pct}% of the way to your "${closestGoal.name}" goal. Keep pushing!`,
        priority: 'success',
        icon: Target
      });

      // Goals falling behind schedule (mock logic: assuming a goal under 10% is behind)
      const behindGoals = incompleteGoals.filter(g => (g.currentAmount / g.targetAmount) < 0.1);
      if (behindGoals.length > 0) {
        insights.push({
          id: 'goal-behind',
          title: 'Goals Falling Behind',
          description: `Progress on "${behindGoals[0].name}" is slow. Consider setting up automatic transfers to stay on track.`,
          priority: 'warning',
          icon: Clock
        });
      }
    }

    const completed = goals.filter(g => g.currentAmount >= g.targetAmount);
    if (completed.length > 0) {
      insights.push({
        id: 'goal-done',
        title: 'Goals Achieved',
        description: `You've fully funded ${completed.length} savings goal${completed.length > 1 ? 's' : ''}! Celebrate your success.`,
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

  // ─── Financial Recommendations ──────────────────────────────────────────
  const recommendedSavings = monthlyIncome * 0.20;
  const currentSavings = monthlyIncome - totalSpentThisMonth;
  
  if (currentSavings < recommendedSavings && monthlyIncome > 0) {
    insights.push({
      id: 'rec-savings',
      title: 'Suggested Savings Opportunity',
      description: `We recommend saving ${currencySymbol}${recommendedSavings.toLocaleString()} (20% of income) monthly. You're currently on track for ${currencySymbol}${Math.max(0, currentSavings).toLocaleString()}.`,
      priority: 'info',
      icon: PiggyBank
    });
  } else if (currentSavings >= recommendedSavings && monthlyIncome > 0) {
    insights.push({
      id: 'rec-great',
      title: 'Excellent Savings Rate',
      description: `You're saving over 20% of your income! Consider investing the surplus for long-term growth.`,
      priority: 'success',
      icon: TrendingUp
    });
  }

  // Sort: Warnings first, then successes, then infos
  const priorityOrder = { 'warning': 1, 'success': 2, 'info': 3 };
  insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Return top 4 insights
  return insights.slice(0, 4);
}
