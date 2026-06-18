import { useState, useEffect, useMemo } from 'react';
import { FileText } from 'lucide-react';
import AnalyticsStats from '../components/analytics/AnalyticsStats';
import ExpensePieChart from '../components/analytics/ExpensePieChart';
import MonthlyExpenseChart from '../components/analytics/MonthlyExpenseChart';
import IncomeExpenseChart from '../components/analytics/IncomeExpenseChart';
import BudgetUtilizationChart from '../components/analytics/BudgetUtilizationChart';
import SavingsProgressChart from '../components/analytics/SavingsProgressChart';
import AnalyticsInsights from '../components/analytics/AnalyticsInsights';

const MOCK_MONTHLY_INCOME = 8250.00;
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Sample fallback data
const SAMPLE_EXPENSES = [
  { id: 's1', title: 'Groceries', category: 'Food', amount: 320, date: new Date().toISOString().split('T')[0], notes: '' },
  { id: 's2', title: 'Gas', category: 'Transport', amount: 85, date: new Date().toISOString().split('T')[0], notes: '' },
  { id: 's3', title: 'Netflix', category: 'Entertainment', amount: 15.99, date: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0], notes: '' },
  { id: 's4', title: 'Electricity', category: 'Bills', amount: 145, date: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0], notes: '' },
  { id: 's5', title: 'New Shoes', category: 'Shopping', amount: 120, date: new Date(Date.now() - 86400000 * 60).toISOString().split('T')[0], notes: '' },
  { id: 's6', title: 'Doctor Visit', category: 'Healthcare', amount: 200, date: new Date(Date.now() - 86400000 * 45).toISOString().split('T')[0], notes: '' },
  { id: 's7', title: 'Online Course', category: 'Education', amount: 49.99, date: new Date(Date.now() - 86400000 * 90).toISOString().split('T')[0], notes: '' },
  { id: 's8', title: 'Dinner Out', category: 'Food', amount: 68, date: new Date(Date.now() - 86400000 * 120).toISOString().split('T')[0], notes: '' },
  { id: 's9', title: 'Uber Rides', category: 'Transport', amount: 42, date: new Date(Date.now() - 86400000 * 150).toISOString().split('T')[0], notes: '' },
  { id: 's10', title: 'Internet Bill', category: 'Bills', amount: 79.99, date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0], notes: '' },
];

const SAMPLE_GOALS = [
  { id: 'sg1', name: 'Emergency Fund', category: 'Emergency Fund', targetAmount: 10000, currentAmount: 4500, targetDate: '2027-01-01' },
  { id: 'sg2', name: 'Japan Trip', category: 'Travel', targetAmount: 3500, currentAmount: 1200, targetDate: '2026-10-01' },
  { id: 'sg3', name: 'New Laptop', category: 'Electronics', targetAmount: 1500, currentAmount: 1500, targetDate: '2026-05-01' },
];

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    try {
      const savedExpenses = localStorage.getItem('fintrack_expenses');
      setExpenses(savedExpenses ? JSON.parse(savedExpenses) : SAMPLE_EXPENSES);

      const savedBudgets = localStorage.getItem('fintrack_budgets');
      setBudgets(savedBudgets ? JSON.parse(savedBudgets) : []);

      const savedGoals = localStorage.getItem('fintrack_goals');
      const parsedGoals = savedGoals ? JSON.parse(savedGoals) : SAMPLE_GOALS;
      setGoals(parsedGoals.length > 0 ? parsedGoals : SAMPLE_GOALS);
    } catch (e) {
      setExpenses(SAMPLE_EXPENSES);
      setGoals(SAMPLE_GOALS);
    }
  }, []);

  // Total Expenses
  const totalExpenses = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);
  const totalSavings = useMemo(() => goals.reduce((sum, g) => sum + g.currentAmount, 0), [goals]);

  // Build monthly grouped data for the last 6 months
  const monthlyData = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: MONTH_NAMES[d.getMonth()],
        monthIdx: d.getMonth(),
        year: d.getFullYear(),
        expenses: 0,
        income: MOCK_MONTHLY_INCOME + (Math.random() * 500 - 250) // slight variance for realism
      });
    }

    expenses.forEach(exp => {
      const date = new Date(exp.date);
      const entry = months.find(m => m.monthIdx === date.getMonth() && m.year === date.getFullYear());
      if (entry) {
        entry.expenses += exp.amount;
      }
    });

    // Round income for cleanliness
    months.forEach(m => m.income = Math.round(m.income * 100) / 100);

    return months;
  }, [expenses]);

  // Pie chart data: expenses by category
  const pieData = useMemo(() => {
    const totals = {};
    expenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return Object.keys(totals).map(name => ({ name, value: totals[name] })).sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Budget utilization
  const budgetUtilization = useMemo(() => {
    const totalAllocated = budgets.reduce((sum, b) => sum + b.amount, 0);
    if (totalAllocated === 0) return 0;
    
    let totalUsed = 0;
    budgets.forEach(b => {
      const used = expenses
        .filter(e => {
          const d = new Date(e.date);
          const now = new Date();
          return e.category === b.category && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, e) => sum + e.amount, 0);
      totalUsed += used;
    });
    return (totalUsed / totalAllocated) * 100;
  }, [budgets, expenses]);

  // Expense analysis
  const expenseAnalysis = useMemo(() => {
    const catTotals = {};
    expenses.forEach(exp => {
      catTotals[exp.category] = (catTotals[exp.category] || 0) + exp.amount;
    });
    const categories = Object.keys(catTotals).map(name => ({ name, amount: catTotals[name] })).sort((a, b) => b.amount - a.amount);
    return {
      highest: categories.length > 0 ? categories[0] : null,
      lowest: categories.length > 0 ? categories[categories.length - 1] : null,
    };
  }, [expenses]);

  // Average monthly spending
  const avgMonthly = useMemo(() => {
    const monthsWithExpenses = monthlyData.filter(m => m.expenses > 0);
    return monthsWithExpenses.length > 0 ? monthsWithExpenses.reduce((sum, m) => sum + m.expenses, 0) / monthsWithExpenses.length : 0;
  }, [monthlyData]);

  // Stats calculations
  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // CSV Export
  const exportCSV = () => {
    const headers = ['Category', 'Amount'];
    const rows = pieData.map(d => [d.name, d.value.toFixed(2)]);
    
    const monthlyHeaders = ['Month', 'Income', 'Expenses'];
    const monthlyRows = monthlyData.map(m => [m.month, m.income.toFixed(2), m.expenses.toFixed(2)]);

    const csvParts = [
      'EXPENSE DISTRIBUTION',
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n'),
      '',
      'MONTHLY BREAKDOWN',
      [monthlyHeaders.join(','), ...monthlyRows.map(r => r.join(','))].join('\n')
    ];

    const csvContent = csvParts.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fintrack_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Visualize your spending, savings, and budgeting trends.</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
        >
          <FileText className="w-4 h-4" /> Export Analytics
        </button>
      </div>

      {/* Top Stats */}
      <AnalyticsStats
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        totalSavings={totalSavings}
        savingsRate={savingsRate}
      />

      {/* Row 1: Pie Chart + Income vs Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart data={pieData} />
        <IncomeExpenseChart data={monthlyData} />
      </div>

      {/* Row 2: Monthly Expenses Bar + Budget Utilization Radial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyExpenseChart data={monthlyData} />
        </div>
        <BudgetUtilizationChart percentage={budgetUtilization} />
      </div>

      {/* Row 3: Savings Progress */}
      <SavingsProgressChart data={goals} />

      {/* Row 4: Insights */}
      <AnalyticsInsights
        highestCategory={expenseAnalysis.highest}
        lowestCategory={expenseAnalysis.lowest}
        avgMonthly={avgMonthly}
        bestSavingsMonth={null}
        budgetEfficiency={budgetUtilization}
      />
    </div>
  );
}
