export const reportService = {
  generateMonthlySummary: (expenses, budgets, savingsGoals, filters) => {
    const activeMonth = filters.month || new Date().toISOString().slice(0, 7);
    
    const monthExpenses = expenses.filter(e => e.date.startsWith(activeMonth));
    const monthBudgets = budgets.filter(b => b.month === activeMonth);

    const totalIncome = 5000; // Mock base income
    const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingBalance = totalIncome - totalExpenses;

    const totalBudgetLimit = monthBudgets.reduce((sum, b) => sum + b.limit, 0);
    const budgetUsagePercent = totalBudgetLimit > 0 ? (totalExpenses / totalBudgetLimit) * 100 : 0;

    const totalSaved = savingsGoals.reduce((sum, g) => sum + g.saved, 0);
    const totalTarget = savingsGoals.reduce((sum, g) => sum + g.target, 0);
    const goalCompletionPercent = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    let savedThisMonth = 0;
    savingsGoals.forEach(g => {
      g.history?.forEach(h => {
        if (h.date.startsWith(activeMonth)) savedThisMonth += h.amount;
      });
    });
    const savingsRate = totalIncome > 0 ? (savedThisMonth / totalIncome) * 100 : 0;

    return {
      activeMonth,
      totalIncome,
      totalExpenses,
      remainingBalance,
      budgetUsagePercent,
      savingsRate,
      goalCompletionPercent,
      savedThisMonth
    };
  },

  generateCategoryAnalysis: (expenses, activeMonth) => {
    const monthExpenses = expenses.filter(e => e.date.startsWith(activeMonth));
    const catMap = {};
    monthExpenses.forEach(e => {
      catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });
    return Object.keys(catMap).map(cat => ({ category: cat, amount: catMap[cat] })).sort((a, b) => b.amount - a.amount);
  },

  generateInsights: (expenses, activeMonth) => {
    const insights = [];
    
    const [year, month] = activeMonth.split('-');
    const prevDate = new Date(year, parseInt(month) - 2);
    const prevMonthStr = prevDate.toISOString().slice(0, 7);

    const thisMonthExpenses = expenses.filter(e => e.date.startsWith(activeMonth));
    const lastMonthExpenses = expenses.filter(e => e.date.startsWith(prevMonthStr));

    const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    if (lastMonthTotal > 0) {
      const diff = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      if (diff > 10) {
        insights.push({ id: 1, type: 'Warning', message: `Total spending increased by ${diff.toFixed(1)}% compared to last month.` });
      } else if (diff < -10) {
        insights.push({ id: 2, type: 'Success', message: `Great job! Total spending decreased by ${Math.abs(diff).toFixed(1)}% compared to last month.` });
      }
    }

    const catAnalysis = reportService.generateCategoryAnalysis(expenses, activeMonth);
    if (catAnalysis.length > 0) {
      const topCat = catAnalysis[0];
      if (topCat.amount > thisMonthTotal * 0.4) {
        insights.push({ id: 3, type: 'Caution', message: `${topCat.category} makes up over 40% of your expenses.` });
      }
    }

    if (insights.length === 0) {
      insights.push({ id: 4, type: 'Info', message: `Your spending is stable this month.` });
    }

    return insights;
  }
};
