import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useSavings } from '../../context/SavingsContext';
import toast from 'react-hot-toast';

export function ContributionModal({ goal, onClose }) {
  const { addContribution, addAchievement } = useSavings();
  const [amount, setAmount] = useState(goal.monthlyContribution || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    
    if (!numAmount || numAmount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    const remaining = goal.target - goal.saved;
    if (numAmount > remaining) {
      setError(`Amount cannot exceed remaining target (₹${remaining})`);
      return;
    }

    const prevPercent = (goal.saved / goal.target) * 100;
    const newSaved = goal.saved + numAmount;
    const newPercent = (newSaved / goal.target) * 100;

    const milestones = [25, 50, 75, 100];
    for (let ms of milestones) {
      if (prevPercent < ms && newPercent >= ms) {
        addAchievement({
          goalId: goal.id,
          goalName: goal.name,
          milestone: ms,
          message: `Congratulations! You've reached ${ms}% of your ${goal.name} goal!`,
          date: new Date().toISOString()
        });
      }
    }

    addContribution(goal.id, numAmount);
    toast.success(`Successfully added ₹${numAmount} to ${goal.name}!`);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg mb-4 text-center">
        <p className="text-sm text-slate-500 mb-1">Current Progress</p>
        <p className="text-xl font-bold text-slate-900">
          ₹{goal.saved.toLocaleString('en-IN')} / ₹{goal.target.toLocaleString('en-IN')}
        </p>
        <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
          <div 
            className="bg-indigo-600 h-2 rounded-full" 
            style={{ width: `${Math.min((goal.saved / goal.target) * 100, 100)}%` }}
          />
        </div>
      </div>

      <Input
        label="Contribution Amount (₹)"
        type="number"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
          if (error) setError('');
        }}
        error={error}
        autoFocus
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Funds
        </Button>
      </div>
    </form>
  );
}
