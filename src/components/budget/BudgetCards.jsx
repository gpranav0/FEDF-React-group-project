import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';

export function BudgetCards({ budgets, expenses }) {
  const categoryStats = useMemo(() => {
    return budgets.map(budget => {
      const spent = expenses
        .filter(exp => exp.date.startsWith(budget.month) && exp.category === budget.category)
        .reduce((sum, exp) => sum + exp.amount, 0);
      
      const remaining = budget.limit - spent;
      const percentUsed = (spent / budget.limit) * 100;
      
      let colorClass = 'bg-emerald-500';
      if (percentUsed > 100) {
        colorClass = 'bg-rose-500';
      } else if (percentUsed >= 86) {
        colorClass = 'bg-orange-500';
      } else if (percentUsed >= 61) {
        colorClass = 'bg-amber-500';
      }

      return { ...budget, spent, remaining, percentUsed: Math.min(percentUsed, 100), colorClass };
    });
  }, [budgets, expenses]);

  if (categoryStats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categoryStats.map(stat => (
        <Card key={stat.id} className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <Badge category={stat.category}>{stat.category}</Badge>
            <span className="text-sm font-semibold text-slate-700">
              ₹{stat.spent.toLocaleString('en-IN')} / ₹{stat.limit.toLocaleString('en-IN')}
            </span>
          </div>
          
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stat.percentUsed}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-2.5 rounded-full ${stat.colorClass}`}
            />
          </div>
          
          <div className="flex justify-between text-xs text-slate-500 mt-auto pt-2">
            <span>{stat.percentUsed.toFixed(1)}% used</span>
            <span className={stat.remaining < 0 ? 'text-rose-600 font-medium' : ''}>
              {stat.remaining < 0 ? `Overspent by ₹${Math.abs(stat.remaining).toLocaleString('en-IN')}` : `₹${stat.remaining.toLocaleString('en-IN')} left`}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
