import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Receipt } from 'lucide-react';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ExpenseTable } from '../components/expenses/ExpenseTable';
import { ExpenseMetrics } from '../components/expenses/ExpenseMetrics';
import { useExpenses } from '../context/ExpenseContext';
import toast from 'react-hot-toast';

export function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const handleOpenAdd = () => {
    setExpenseToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (expense) => {
    setExpenseToEdit(expense);
    setIsFormOpen(true);
  };

  const handleSubmit = (expenseData) => {
    if (expenseToEdit) {
      updateExpense(expenseToEdit.id, expenseData);
      toast.success('Expense updated successfully!');
    } else {
      addExpense(expenseData);
      toast.success('Expense added successfully!');
    }
    setIsFormOpen(false);
  };

  const confirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
      toast.success('Expense deleted successfully!');
      setExpenseToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Expenses</h2>
        <Button onClick={handleOpenAdd}>Add Expense</Button>
      </div>

      <ExpenseMetrics />

      <Card className="p-0 overflow-hidden border-0 bg-transparent shadow-none">
        {expenses.length > 0 ? (
          <ExpenseTable 
            expenses={expenses} 
            onEdit={handleOpenEdit} 
            onDelete={setExpenseToDelete} 
          />
        ) : (
          <Card>
            <EmptyState 
              icon={Receipt}
              title="No expenses found"
              description="You haven't recorded any expenses yet. Add your first expense to track your spending."
            />
          </Card>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={expenseToEdit ? "Edit Expense" : "Add New Expense"}
      >
        <ExpenseForm 
          initialData={expenseToEdit} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!expenseToDelete} 
        onClose={() => setExpenseToDelete(null)} 
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete the expense "{expenseToDelete?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setExpenseToDelete(null)}>
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
