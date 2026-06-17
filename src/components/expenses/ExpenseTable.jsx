import { Edit2, Trash2, Receipt } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No expenses found"
        description="Start tracking your spending by adding your first expense. We'll help you understand where your money goes."
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-sm font-semibold text-slate-600">Title</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Category</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Amount</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Notes</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{expense.title}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {expense.category}
                  </span>
                </td>
                <td className="p-4 font-semibold text-slate-900">
                  ${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-sm text-slate-500">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="p-4 text-sm text-slate-500 truncate max-w-[200px]">{expense.notes || '-'}</td>
                <td className="p-4 text-right space-x-2">
                  <button 
                    onClick={() => onEdit(expense)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(expense.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
