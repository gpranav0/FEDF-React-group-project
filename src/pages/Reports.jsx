import { useState, useEffect, useMemo } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import ReportStats from '../components/reports/ReportStats';
import FinancialSummary from '../components/reports/FinancialSummary';
import ExpenseAnalysis from '../components/reports/ExpenseAnalysis';
import BudgetAnalysis from '../components/reports/BudgetAnalysis';
import SavingsAnalysis from '../components/reports/SavingsAnalysis';
import MonthlyBreakdownTable from '../components/reports/MonthlyBreakdownTable';
import FinancialInsights from '../components/reports/FinancialInsights';
import EmptyState from '../components/ui/EmptyState';
import { logActivity } from '../utils/activityLogger';

const MOCK_MONTHLY_INCOME = 8250.00;

export default function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  // Fetch data from localStorage
  useEffect(() => {
    try {
      const savedExpenses = localStorage.getItem('fintrack_expenses');
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      
      const savedBudgets = localStorage.getItem('fintrack_budgets');
      if (savedBudgets) setBudgets(JSON.parse(savedBudgets));

      const savedGoals = localStorage.getItem('fintrack_goals');
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    } catch (e) {
      console.error("Failed to load local storage data for reports", e);
    }
  }, []);

  // Compute stats
  const totalExpenses = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);
  
  // For the sake of the report, let's assume MOCK_MONTHLY_INCOME is per month for the months we have expenses in.
  // Alternatively, just use it as a static monthly income for current month logic.
  // Let's create a monthly grouped data.
  const monthlyDataMap = useMemo(() => {
    const map = {};
    expenses.forEach(exp => {
      const date = new Date(exp.date);
      const monthStr = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!map[monthStr]) {
        map[monthStr] = { month: monthStr, income: MOCK_MONTHLY_INCOME, expenses: 0, savings: 0, netBalance: 0 };
      }
      map[monthStr].expenses += exp.amount;
    });
    
    // Add savings contributions (just dividing current saved by months for simplicity, or using a static value)
    // Actually, let's mock the savings contribution to be a flat rate if there are goals, for demonstration in the report.
    const activeMonths = Object.keys(map);
    const totalCurrentSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const savingsPerMonth = activeMonths.length > 0 ? totalCurrentSaved / activeMonths.length : 0;

    activeMonths.forEach(m => {
      map[m].savings = savingsPerMonth;
      map[m].netBalance = map[m].income - map[m].expenses - map[m].savings;
    });

    return Object.values(map).sort((a, b) => new Date(b.month) - new Date(a.month));
  }, [expenses, goals]);

  const currentMonthData = monthlyDataMap.length > 0 ? monthlyDataMap[0] : { month: 'Current', income: MOCK_MONTHLY_INCOME, expenses: 0, savings: 0, netBalance: MOCK_MONTHLY_INCOME };

  // Expense Analysis
  const expenseAnalysis = useMemo(() => {
    const catTotals = {};
    expenses.forEach(exp => {
      catTotals[exp.category] = (catTotals[exp.category] || 0) + exp.amount;
    });
    const categories = Object.keys(catTotals).map(name => ({ name, amount: catTotals[name] })).sort((a, b) => b.amount - a.amount);
    
    return {
      highest: categories.length > 0 ? categories[0] : { name: 'N/A', amount: 0 },
      lowest: categories.length > 0 ? categories[categories.length - 1] : { name: 'N/A', amount: 0 },
      count: categories.length,
      average: expenses.length > 0 ? totalExpenses / expenses.length : 0
    };
  }, [expenses, totalExpenses]);

  // Budget Analysis
  const budgetAnalysis = useMemo(() => {
    const totalAllocated = budgets.reduce((sum, b) => sum + b.amount, 0);
    let totalUsed = 0;
    const overBudget = [];
    
    // Calculate used per budget
    budgets.forEach(b => {
      const used = expenses.filter(e => e.category === b.category).reduce((sum, e) => sum + e.amount, 0);
      totalUsed += used;
      if (used > b.amount) {
        overBudget.push({ name: b.category, overage: used - b.amount });
      }
    });

    return { totalAllocated, totalUsed, overBudget };
  }, [budgets, expenses]);

  // Savings Analysis
  const savingsAnalysis = useMemo(() => {
    const totalGoalAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    return {
      totalGoalAmount,
      totalSaved,
      remaining: Math.max(0, totalGoalAmount - totalSaved),
      completed: goals.filter(g => g.currentAmount >= g.targetAmount).length
    };
  }, [goals]);

  // Calculate Net totals
  const totalIncome = monthlyDataMap.length > 0 ? monthlyDataMap.length * MOCK_MONTHLY_INCOME : MOCK_MONTHLY_INCOME;
  const netBalance = totalIncome - totalExpenses - savingsAnalysis.totalSaved;
  const savingsRate = currentMonthData.income > 0 ? (currentMonthData.savings / currentMonthData.income) * 100 : 0;

  const exportCSV = () => {
    const headers = ['Month', 'Income', 'Expenses', 'Savings', 'Net Balance'];
    const rows = monthlyDataMap.map(row => [
      row.month, 
      row.income.toFixed(2), 
      row.expenses.toFixed(2), 
      row.savings.toFixed(2), 
      row.netBalance.toFixed(2)
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fintrack_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logActivity('report_export', 'Exported Report', 'Downloaded financial data as CSV');
  };

  const exportPDF = () => {
    logActivity('report_export', 'Exported Report', 'Printed/Saved financial report as PDF');
    window.print();
  };

  if (expenses.length === 0 && budgets.length === 0 && goals.length === 0) {
    return (
      <div className="space-y-8 pb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Reports</h1>
          <p className="text-slate-500 mt-1">Comprehensive overview of your financial health.</p>
        </div>
        <EmptyState
          icon={FileText}
          title="No data to report"
          description="Your financial reports will appear here once you start adding expenses, setting budgets, and creating savings goals."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 print:space-y-6 print:pb-0 print:bg-white print:text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Reports</h1>
          <p className="text-slate-500 mt-1">Comprehensive overview of your financial health.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
          >
            <FileText className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={exportPDF}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold text-slate-900">FinTrack Executive Report</h1>
        <p className="text-slate-500 mt-2">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Stats */}
      <ReportStats 
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        totalSavings={savingsAnalysis.totalSaved}
        netBalance={netBalance}
      />

      {/* Grid Layout 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:break-inside-avoid">
        <FinancialSummary 
          monthlyIncome={currentMonthData.income}
          monthlyExpenses={currentMonthData.expenses}
          monthlySavings={currentMonthData.savings}
          savingsRate={savingsRate}
        />
        <FinancialInsights 
          biggestExpense={expenseAnalysis.highest}
          budgetEfficiency={budgetAnalysis.totalAllocated > 0 ? (budgetAnalysis.totalUsed / budgetAnalysis.totalAllocated) * 100 : 0}
          goalsOnTrack={goals.length > 0}
        />
      </div>

      {/* Grid Layout 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4 print:break-inside-avoid print:mt-6">
        <ExpenseAnalysis 
          highestCategory={expenseAnalysis.highest}
          lowestCategory={expenseAnalysis.lowest}
          totalCategoriesUsed={expenseAnalysis.count}
          averageExpense={expenseAnalysis.average}
        />
        <BudgetAnalysis 
          totalAllocated={budgetAnalysis.totalAllocated}
          totalUsed={budgetAnalysis.totalUsed}
          categoriesOverBudget={budgetAnalysis.overBudget}
        />
        <SavingsAnalysis 
          totalGoalAmount={savingsAnalysis.totalGoalAmount}
          totalSaved={savingsAnalysis.totalSaved}
          remainingGoalAmount={savingsAnalysis.remaining}
          completedCount={savingsAnalysis.completed}
        />
      </div>

      {/* Table */}
      <div className="print:mt-6">
        <MonthlyBreakdownTable data={monthlyDataMap} />
      </div>

    </div>
  );
}
