import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useBudgets } from '../../context/BudgetContext';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'Food', label: 'Food' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Bills', label: 'Bills' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Health', label: 'Health' },
  { value: 'Other', label: 'Other' },
];

export function BudgetForm({ initialData, onSubmit, onCancel }) {
  const { state } = useBudgets();
  
  const [formData, setFormData] = useState(
    initialData || {
      category: '',
      limit: '',
      month: state.selectedMonth
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.limit || Number(formData.limit) <= 0) newErrors.limit = 'Budget limit must be greater than 0';
    if (!formData.month) newErrors.month = 'Month is required';
    
    const isDuplicate = state.budgets.some(b => 
      b.category === formData.category && 
      b.month === formData.month && 
      (!initialData || b.id !== initialData.id)
    );
    
    if (isDuplicate) {
      newErrors.category = 'A budget for this category already exists in the selected month';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...formData, limit: Number(formData.limit) });
      if (!initialData) {
        setFormData({
          category: '',
          limit: '',
          month: state.selectedMonth
        });
      }
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        error={errors.category}
        options={CATEGORIES}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Monthly Limit (₹)"
          name="limit"
          type="number"
          step="0.01"
          value={formData.limit}
          onChange={handleChange}
          error={errors.limit}
          placeholder="0.00"
        />
        <Input
          label="Month"
          name="month"
          type="month"
          value={formData.month}
          onChange={handleChange}
          error={errors.month}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {initialData ? 'Update Budget' : 'Save Budget'}
        </Button>
      </div>
    </form>
  );
}
