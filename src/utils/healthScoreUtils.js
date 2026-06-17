export function calculateHealthScore(expenses = [], budgets = [], goals = [], monthlyIncome = 8250) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 1. Savings Rate (40%)
  // Ideal: >= 20%
  const savingsRate = monthlyIncome > 0 ? Math.max(0, (monthlyIncome - totalExpenses) / monthlyIncome) : 0;
  const savingsScore = Math.min(100, (savingsRate / 0.20) * 100);

  // 2. Budget Utilization (25%)
  // Ideal: Not exceeding budget
  let budgetScore = 80; // default if no budgets
  if (budgets.length > 0) {
    const now = new Date();
    let totalUtilScore = 0;
    budgets.forEach(b => {
      const spent = expenses
        .filter(e => {
          const d = new Date(e.date);
          return e.category === b.category && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((s, e) => s + e.amount, 0);
      const util = b.amount > 0 ? spent / b.amount : 0;
      
      if (util <= 0.8) totalUtilScore += 100;
      else if (util <= 1.0) totalUtilScore += 80;
      else totalUtilScore += Math.max(0, 100 - (util - 1) * 200); // sharply drops off after 100%
    });
    budgetScore = totalUtilScore / budgets.length;
  }

  // 3. Goal Progress (20%)
  // Ideal: Making steady progress
  let goalScore = 70; // default if no goals
  if (goals.length > 0) {
    const avgProgress = goals.reduce((sum, g) => {
      const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
      return sum + Math.min(100, pct);
    }, 0) / goals.length;
    goalScore = avgProgress;
  }

  // 4. Spending Consistency (15%)
  // Measures diversification
  let spendingScore = 75;
  if (expenses.length > 0) {
    const catTotals = {};
    expenses.forEach(e => {
      catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
    });
    const maxCatAmount = Math.max(...Object.values(catTotals));
    const concentration = totalExpenses > 0 ? maxCatAmount / totalExpenses : 0;
    
    // Lower concentration is better. < 30% is ideal (100)
    spendingScore = Math.max(0, Math.min(100, (1 - concentration) * 140));
  }

  const finalScore = Math.round(
    (savingsScore * 0.40) +
    (budgetScore * 0.25) +
    (goalScore * 0.20) +
    (spendingScore * 0.15)
  );

  const score = Math.max(0, Math.min(100, finalScore));
  
  let status = "Poor";
  if (score >= 80) status = "Excellent";
  else if (score >= 60) status = "Good";
  else if (score >= 40) status = "Fair";

  const strengths = [];
  const improvements = [];

  if (savingsScore >= 80) strengths.push("Strong savings rate");
  else improvements.push("Try to save at least 20% of your income");

  if (budgetScore >= 80) strengths.push("Budgets under control");
  else improvements.push("Some budgets are exceeded");

  if (spendingScore >= 80) strengths.push("Diversified spending");
  else improvements.push("Reduce heavy spending in top categories");

  if (goalScore >= 80) strengths.push("Excellent progress on goals");
  else if (goals.length === 0) improvements.push("Set up savings goals to plan for the future");
  else improvements.push("Increase contributions to your goals");

  return {
    score,
    status,
    breakdown: { savingsScore, budgetScore, goalScore, spendingScore },
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3)
  };
}
