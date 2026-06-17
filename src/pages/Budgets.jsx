import { useState, useEffect, useMemo } from 'react';
import { Plus, PiggyBank } from 'lucide-react';
import BudgetStats from '../components/budgets/BudgetStats';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetFormModal from '../components/budgets/BudgetFormModal';
import BudgetInsights from '../components/budgets/BudgetInsights';

export default function Budgets() {
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('fintrack_budgets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [expenses, setExpenses] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);

  // Load expenses on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('fintrack_expenses');
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch(e) {}
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fintrack_budgets', JSON.stringify(budgets));
  }, [budgets]);

  const currentMonthExpenses = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenses.filter(exp => {
      const date = new Date(exp.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
  }, [expenses]);

  // Calculate expenses per category for the current month
  const expensesByCategory = useMemo(() => {
    const totals = {};
    currentMonthExpenses.forEach(exp => {
      if (!totals[exp.category]) {
        totals[exp.category] = 0;
      }
      totals[exp.category] += exp.amount;
    });
    return totals;
  }, [currentMonthExpenses]);

  // Overall stats calculations
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  // Total spent only counts towards categories that HAVE a budget, or all expenses?
  // Let's count all expenses that have a corresponding budget for "Total Spent" in the context of budgets, 
  // or maybe all expenses. The plan usually implies total spent against tracked budgets.
  // We'll calculate the sum of expenses that fall into budgeted categories.
  const totalSpent = budgets.reduce((sum, b) => sum + (expensesByCategory[b.category] || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleSaveBudget = (budgetData) => {
    const existingIndex = budgets.findIndex(b => b.category === budgetData.category);
    if (existingIndex >= 0) {
      // Edit
      const updatedBudgets = [...budgets];
      updatedBudgets[existingIndex] = budgetData;
      setBudgets(updatedBudgets);
    } else {
      // Add
      setBudgets([...budgets, budgetData]);
    }
  };

  const handleDeleteBudget = (category) => {
    if (window.confirm(`Are you sure you want to delete the budget for ${category}?`)) {
      setBudgets(budgets.filter(b => b.category !== category));
    }
  };

  const openAddModal = () => {
    setBudgetToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (budget) => {
    setBudgetToEdit(budget);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Budgets</h1>
          <p className="text-slate-500 mt-1">Set and monitor your monthly spending limits.</p>
        </div>
        <button 
          onClick={openAddModal}
          disabled={budgets.length >= 8} // Max categories
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" /> Create Budget
        </button>
      </div>

      {budgets.length > 0 ? (
        <>
          {/* Stats */}
          <BudgetStats 
            totalBudget={totalBudget} 
            totalSpent={totalSpent} 
            remainingBudget={remainingBudget} 
            utilization={utilization} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area: Cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {budgets.map(budget => (
                  <BudgetCard 
                    key={budget.category}
                    budget={budget}
                    spent={expensesByCategory[budget.category] || 0}
                    onEdit={openEditModal}
                    onDelete={handleDeleteBudget}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar / Insights */}
            <div>
              <BudgetInsights budgets={budgets} expensesData={expensesByCategory} />
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100 text-center px-4">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <PiggyBank className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No budgets set yet</h2>
          <p className="text-slate-500 max-w-md mb-8">
            Take control of your finances by setting monthly limits for different categories. 
            We'll track your spending and help you stay on target.
          </p>
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
          >
            <Plus className="w-5 h-5" /> Create Your First Budget
          </button>
        </div>
      )}

      {/* Modal */}
      <BudgetFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBudget}
        budgetToEdit={budgetToEdit}
        existingBudgets={budgets}
      />
    </div>
  );
}
