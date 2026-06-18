import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export function SavingsCards({ goals, onAddContribution }) {
  const enhancedGoals = useMemo(() => {
    return goals.map(goal => {
      const percent = (goal.saved / goal.target) * 100;
      let progressColor = 'bg-rose-500';
      if (percent >= 91) progressColor = 'bg-emerald-500';
      else if (percent >= 61) progressColor = 'bg-blue-500';
      else if (percent >= 31) progressColor = 'bg-amber-500';

      let priorityColor = 'bg-slate-100 text-slate-700';
      if (goal.priority === 'High') priorityColor = 'bg-rose-100 text-rose-700';
      if (goal.priority === 'Low') priorityColor = 'bg-emerald-100 text-emerald-700';

      const remaining = goal.target - goal.saved;
      const monthsRemaining = goal.monthlyContribution > 0 ? Math.ceil(remaining / goal.monthlyContribution) : Infinity;
      
      const projectedDate = new Date();
      projectedDate.setMonth(projectedDate.getMonth() + monthsRemaining);

      const targetDate = new Date(goal.deadline);
      let status = 'On Track';
      if (percent >= 100) status = 'Completed';
      else if (projectedDate > targetDate) status = 'Delayed';

      return { ...goal, percent: Math.min(percent, 100), progressColor, priorityColor, remaining, monthsRemaining, status };
    });
  }, [goals]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {enhancedGoals.map(goal => (
        <Card key={goal.id} className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">{goal.name}</h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${goal.priorityColor}`}>
                {goal.priority} Priority
              </span>
            </div>
            {goal.status === 'Completed' ? (
               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                 Completed
               </span>
            ) : (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${goal.status === 'Delayed' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'}`}>
                {goal.status}
              </span>
            )}
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">₹{goal.saved.toLocaleString('en-IN')}</span>
              <span className="text-slate-500">of ₹{goal.target.toLocaleString('en-IN')}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${goal.percent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-2.5 rounded-full ${goal.progressColor}`}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>{goal.percent.toFixed(1)}%</span>
              <span>₹{goal.remaining.toLocaleString('en-IN')} left</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Monthly Contribution:</span>
              <span className="font-medium text-slate-900">₹{goal.monthlyContribution.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Deadline:</span>
              <span className="font-medium text-slate-900">{new Date(goal.deadline).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <Button 
              className="w-full" 
              variant="secondary"
              disabled={goal.percent >= 100}
              onClick={() => onAddContribution(goal)}
            >
              Add Contribution
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
