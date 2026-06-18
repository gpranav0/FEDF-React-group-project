import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PieChart as PieChartIcon } from 'lucide-react';
import { useBudgets } from '../context/BudgetContext';
import { useExpenses } from '../context/ExpenseContext';
import { BudgetMetrics } from '../components/budget/BudgetMetrics';
import { BudgetCards } from '../components/budget/BudgetCards';
import { BudgetTable } from '../components/budget/BudgetTable';
import { BudgetAlerts } from '../components/budget/BudgetAlerts';
import { BudgetForm } from '../components/budget/BudgetForm';
import { BudgetDistributionChart } from '../components/charts/BudgetDistributionChart';
import { SpendingVsBudgetChart } from '../components/charts/SpendingVsBudgetChart';
import { MonthlyTrendChart } from '../components/charts/MonthlyTrendChart';
import toast from 'react-hot-toast';

const MemoBudgetDistributionChart = React.memo(BudgetDistributionChart);
const MemoSpendingVsBudgetChart = React.memo(SpendingVsBudgetChart);
const MemoMonthlyTrendChart = React.memo(MonthlyTrendChart);
const MemoBudgetCards = React.memo(BudgetCards);
const MemoBudgetTable = React.memo(BudgetTable);

export function BudgetPlanner() {
  const { state, addBudget, updateBudget, deleteBudget, setMonth } = useBudgets();
  const { expenses } = useExpenses();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  const currentBudgets = useMemo(() => {
    return state.budgets.filter(b => b.month === state.selectedMonth);
  }, [state.budgets, state.selectedMonth]);

  const handleOpenAdd = useCallback(() => {
    setBudgetToEdit(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((budget) => {
    setBudgetToEdit(budget);
    setIsFormOpen(true);
  }, []);

  const handleSubmit = useCallback((budgetData) => {
    if (budgetToEdit) {
      updateBudget(budgetData);
      toast.success('Budget updated successfully!');
    } else {
      addBudget(budgetData);
      toast.success('Budget created successfully!');
    }
    setIsFormOpen(false);
  }, [budgetToEdit, addBudget, updateBudget]);

  const confirmDelete = useCallback(() => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete.id);
      toast.success('Budget deleted successfully!');
      setBudgetToDelete(null);
    }
  }, [budgetToDelete, deleteBudget]);

  return (
    <div className="space-y-6 relative">
      <BudgetAlerts />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Budget Planner</h2>
        
        <div className="flex items-center gap-3">
          <input 
            type="month" 
            value={state.selectedMonth} 
            onChange={(e) => setMonth(e.target.value)}
            className="h-10 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
          <Button onClick={handleOpenAdd}>Create Budget</Button>
        </div>
      </div>

      <BudgetMetrics />

      {currentBudgets.length > 0 ? (
        <>
          <MemoBudgetCards budgets={currentBudgets} expenses={expenses} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Budget Distribution</h3>
              <div className="h-64">
                <MemoBudgetDistributionChart budgets={currentBudgets} />
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Spending vs Budget</h3>
              <div className="h-64">
                <MemoSpendingVsBudgetChart budgets={currentBudgets} expenses={expenses} />
              </div>
            </Card>
          </div>
          
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Historical Trend</h3>
            <div className="h-72">
              <MemoMonthlyTrendChart budgets={state.budgets} expenses={expenses} />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden border-0 bg-transparent shadow-none">
            <MemoBudgetTable 
              budgets={currentBudgets} 
              expenses={expenses} 
              onEdit={handleOpenEdit} 
              onDelete={setBudgetToDelete} 
            />
          </Card>
        </>
      ) : (
        <Card>
          <EmptyState 
            icon={PieChartIcon}
            title="No budgets found"
            description="You haven't set up any budgets for this month."
            action={<Button onClick={handleOpenAdd}>Create Your First Budget</Button>}
          />
        </Card>
      )}

      {/* Form Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={budgetToEdit ? "Edit Budget" : "Create Budget"}
      >
        <BudgetForm 
          initialData={budgetToEdit} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!budgetToDelete} 
        onClose={() => setBudgetToDelete(null)} 
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete the budget for "{budgetToDelete?.category}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setBudgetToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
