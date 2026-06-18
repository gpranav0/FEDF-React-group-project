import React from 'react';
import { Card } from '../ui/Card';
import { DollarSign, Calendar, TrendingUp, Receipt } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

export function ExpenseMetrics() {
  const { expenses } = useExpenses();

  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const expensesThisMonth = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    })
    .reduce((acc, exp) => acc + exp.amount, 0);

  const highestExpense = expenses.length > 0 
    ? Math.max(...expenses.map(exp => exp.amount))
    : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Expenses</p>
            <p className="text-2xl font-bold text-slate-900">${totalExpenses.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-full text-rose-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">This Month</p>
            <p className="text-2xl font-bold text-slate-900">${expensesThisMonth.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Highest Expense</p>
            <p className="text-2xl font-bold text-slate-900">${highestExpense.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-full text-orange-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Transactions</p>
            <p className="text-2xl font-bold text-slate-900">{expenses.length}</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </div>
  );
}
