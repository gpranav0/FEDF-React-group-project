import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import ExpenseStats from '../components/expenses/ExpenseStats';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ExpenseFormModal from '../components/expenses/ExpenseFormModal';

const DEFAULT_EXPENSES = [
  { id: 1, title: 'Weekly Groceries', category: 'Food', amount: 120.50, date: new Date().toISOString().split('T')[0], notes: 'Whole foods' },
  { id: 2, title: 'Uber Ride', category: 'Transport', amount: 24.20, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], notes: 'To airport' },
  { id: 3, title: 'Internet Bill', category: 'Bills', amount: 79.99, date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], notes: 'Monthly' },
];

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other'];

export default function Expenses() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('fintrack_expenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_EXPENSES;
      }
    }
    return DEFAULT_EXPENSES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fintrack_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleSaveExpense = (expenseData) => {
    if (expenseData.id) {
      setExpenses(expenses.map(exp => exp.id === expenseData.id ? expenseData : exp));
    } else {
      const newExpense = {
        ...expenseData,
        id: Date.now()
      };
      setExpenses([...expenses, newExpense]);
    }
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  const openAddModal = () => {
    setExpenseToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };

  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(exp => 
        exp.title.toLowerCase().includes(query) || 
        (exp.notes && exp.notes.toLowerCase().includes(query))
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter(exp => exp.category === categoryFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      } else if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [expenses, searchQuery, categoryFilter, sortBy]);

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="text-slate-500 mt-1">Manage and track your daily expenses.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {/* Stats */}
      <ExpenseStats expenses={expenses} />

      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search expenses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
          />
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="flex-1 md:flex-none flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none text-sm outline-none text-slate-700 w-full cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 md:flex-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none text-slate-700 cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <ExpenseTable 
        expenses={filteredAndSortedExpenses} 
        onEdit={openEditModal} 
        onDelete={handleDeleteExpense} 
      />

      {/* Modal */}
      <ExpenseFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExpense}
        expenseToEdit={expenseToEdit}
      />
    </div>
  );
}
