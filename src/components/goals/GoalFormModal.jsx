import { useState, useEffect } from 'react';
import { X, PlusCircle } from 'lucide-react';

const CATEGORIES = ['Emergency Fund', 'Travel', 'Vehicle', 'Education', 'Home', 'Electronics', 'Investment', 'Other'];

export default function GoalFormModal({ isOpen, onClose, onSave, goalToEdit, isAddingFunds }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Emergency Fund',
    targetAmount: '',
    currentAmount: '',
    targetDate: new Date().toISOString().split('T')[0]
  });

  const [addFundsAmount, setAddFundsAmount] = useState('');

  useEffect(() => {
    if (goalToEdit) {
      if (isAddingFunds) {
        setAddFundsAmount('');
      } else {
        setFormData({ ...goalToEdit });
      }
    } else {
      setFormData({
        name: '',
        category: 'Emergency Fund',
        targetAmount: '',
        currentAmount: '0',
        targetDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [goalToEdit, isOpen, isAddingFunds]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAddingFunds) {
      const added = parseFloat(addFundsAmount) || 0;
      onSave({
        ...goalToEdit,
        currentAmount: goalToEdit.currentAmount + added
      });
    } else {
      onSave({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            {isAddingFunds ? 'Add Funds to Goal' : goalToEdit ? 'Edit Goal' : 'Create Goal'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isAddingFunds ? (
            <>
              <div className="mb-4 text-center">
                <p className="text-sm text-slate-500 mb-1">Adding funds to</p>
                <p className="font-bold text-slate-900 text-lg">{goalToEdit.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount to Add</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input 
                    type="number" 
                    required
                    min="0.01"
                    step="0.01"
                    value={addFundsAmount}
                    onChange={(e) => setAddFundsAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium">
                  <PlusCircle className="w-4 h-4" /> Add Funds
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Goal Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="e.g. Dream Vacation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                    <input 
                      type="number" 
                      required
                      min="1"
                      step="0.01"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Currently Saved</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={formData.currentAmount}
                      onChange={(e) => setFormData({...formData, currentAmount: e.target.value})}
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Date</label>
                <input 
                  type="date" 
                  required
                  value={formData.targetDate}
                  onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  {goalToEdit ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
