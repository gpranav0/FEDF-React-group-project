import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { useBudgets } from '../../context/BudgetContext';
import { useExpenses } from '../../context/ExpenseContext';
import { Wallet, PieChart, TrendingDown, PiggyBank } from 'lucide-react';

export function BudgetMetrics() {
  const { state: budgetState } = useBudgets();
  const { expenses } = useExpenses();

  const metrics = useMemo(() => {
    const activeMonth = budgetState.selectedMonth;
    
    const currentBudgets = budgetState.budgets.filter(b => b.month === activeMonth);
    const totalBudget = currentBudgets.reduce((acc, b) => acc + b.limit, 0);

    const monthExpenses = expenses.filter(exp => exp.date.startsWith(activeMonth));
    const usedBudget = monthExpenses.reduce((acc, exp) => acc + exp.amount, 0);

    const remainingBudget = totalBudget - usedBudget;
    const savingsPercent = totalBudget > 0 ? Math.max(((totalBudget - usedBudget) / totalBudget) * 100, 0) : 0;

    return { totalBudget, usedBudget, remainingBudget, savingsPercent };
  }, [budgetState.budgets, budgetState.selectedMonth, expenses]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Budget</p>
            <p className="text-2xl font-bold text-slate-900">₹{metrics.totalBudget.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Used Budget</p>
            <p className="text-2xl font-bold text-slate-900">₹{metrics.usedBudget.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-full text-rose-600">
            <PieChart className="w-6 h-6" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Remaining</p>
            <p className={`text-2xl font-bold ${metrics.remainingBudget < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              ₹{metrics.remainingBudget.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Savings Opportunity</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.savingsPercent.toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <PiggyBank className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </div>
  );
}
