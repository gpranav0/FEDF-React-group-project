import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ALL_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other'];

export default function BudgetFormModal({ isOpen, onClose, onSave, budgetToEdit, existingBudgets }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: ''
  });

  useEffect(() => {
    if (budgetToEdit) {
      setFormData({ ...budgetToEdit });
    } else {
      // Find first available category, or default to Food if all somehow deleted
      const availableCats = ALL_CATEGORIES.filter(cat => !existingBudgets.some(b => b.category === cat));
      setFormData({
        category: availableCats.length > 0 ? availableCats[0] : 'Food',
        amount: ''
      });
    }
  }, [budgetToEdit, isOpen, existingBudgets]);

  if (!isOpen) return null;

  // Calculate available categories for the dropdown
  const availableCategories = ALL_CATEGORIES.filter(cat => {
    if (budgetToEdit && budgetToEdit.category === cat) return true; // Include current category if editing
    return !existingBudgets.some(b => b.category === cat);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      category: formData.category,
      amount: parseFloat(formData.amount)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            {budgetToEdit ? 'Edit Budget' : 'Add Budget'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              disabled={!!budgetToEdit} // Disable category change when editing
              className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${budgetToEdit ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Budget Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
              <input 
                type="number" 
                required
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
