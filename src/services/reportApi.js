import { reportService } from './reportService';

// Simulates network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reportApi = {
  fetchDashboardData: async (expenses, budgets, savingsGoals, filters) => {
    await delay(800); // simulate 800ms load time for async realism
    
    try {
      const summary = reportService.generateMonthlySummary(expenses, budgets, savingsGoals, filters);
      const categoryAnalysis = reportService.generateCategoryAnalysis(expenses, summary.activeMonth);
      const insights = reportService.generateInsights(expenses, summary.activeMonth);

      // Return unified payload
      return {
        summary,
        categoryAnalysis,
        insights,
        filteredExpenses: expenses.filter(e => e.date.startsWith(summary.activeMonth))
      };
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }
};
