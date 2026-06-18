import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

const PRIORITIES = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

export function SavingsGoalForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      target: '',
      saved: '',
      monthlyContribution: '',
      deadline: '',
      priority: 'Medium'
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.target || Number(formData.target) <= 0) newErrors.target = 'Target must be > 0';
    if (Number(formData.saved) < 0) newErrors.saved = 'Saved cannot be negative';
    if (Number(formData.target) <= Number(formData.saved)) newErrors.target = 'Target must be > Saved';
    if (!formData.monthlyContribution || Number(formData.monthlyContribution) <= 0) newErrors.monthlyContribution = 'Contribution must be > 0';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    else if (new Date(formData.deadline) <= new Date()) newErrors.deadline = 'Deadline must be in the future';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        target: Number(formData.target),
        saved: Number(formData.saved) || 0,
        monthlyContribution: Number(formData.monthlyContribution)
      });
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Goal Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="e.g. New Car"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Target Amount (₹)"
          name="target"
          type="number"
          value={formData.target}
          onChange={handleChange}
          error={errors.target}
        />
        <Input
          label="Currently Saved (₹)"
          name="saved"
          type="number"
          value={formData.saved}
          onChange={handleChange}
          error={errors.saved}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Monthly Contribution (₹)"
          name="monthlyContribution"
          type="number"
          value={formData.monthlyContribution}
          onChange={handleChange}
          error={errors.monthlyContribution}
        />
        <Input
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          error={errors.deadline}
        />
      </div>

      <Select
        label="Priority"
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        options={PRIORITIES}
      />

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {initialData ? 'Update Goal' : 'Save Goal'}
        </Button>
      </div>
    </form>
  );
}
