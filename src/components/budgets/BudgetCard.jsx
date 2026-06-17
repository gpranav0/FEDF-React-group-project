import { Edit2, Trash2, AlertTriangle } from 'lucide-react';

export default function BudgetCard({ budget, spent, onEdit, onDelete }) {
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  const remaining = budget.amount - spent;
  
  let statusColor = "bg-emerald-500";
  let textColor = "text-emerald-700";
  let bgLight = "bg-emerald-50";
  
  if (percentage >= 90) {
    statusColor = "bg-red-500";
    textColor = "text-red-700";
    bgLight = "bg-red-50";
  } else if (percentage >= 70) {
    statusColor = "bg-yellow-500";
    textColor = "text-yellow-700";
    bgLight = "bg-yellow-50";
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${bgLight} ${textColor}`}>
          {budget.category}
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit(budget)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(budget.category)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-2">
        <span className="text-2xl font-bold text-slate-900">
          ${spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-sm font-medium text-slate-500 mb-1">
          / ${budget.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${statusColor}`} 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center text-sm mt-auto pt-2">
        <span className="text-slate-500">
          {percentage >= 100 ? (
            <span className="flex items-center text-red-600 font-medium">
              <AlertTriangle className="w-3 h-3 mr-1" /> Over budget
            </span>
          ) : (
            `${percentage.toFixed(1)}% used`
          )}
        </span>
        <span className={`font-medium ${remaining < 0 ? 'text-red-600' : 'text-slate-700'}`}>
          ${Math.abs(remaining).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {remaining < 0 ? 'over' : 'left'}
        </span>
      </div>
    </div>
  );
}
