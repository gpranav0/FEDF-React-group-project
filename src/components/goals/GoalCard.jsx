import { Edit2, Trash2, Plus, Calendar, Award } from 'lucide-react';

export default function GoalCard({ goal, onEdit, onDelete, onAddFunds }) {
  const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const isCompleted = percentage >= 100;
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  
  // Calculate days remaining
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(goal.targetDate);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let dateStatus = "";
  let dateColor = "text-slate-500";
  
  if (isCompleted) {
    dateStatus = "Goal Achieved!";
    dateColor = "text-emerald-600 font-medium";
  } else if (diffDays < 0) {
    dateStatus = `${Math.abs(diffDays)} days overdue`;
    dateColor = "text-red-500 font-medium";
  } else if (diffDays === 0) {
    dateStatus = "Due today!";
    dateColor = "text-orange-500 font-medium";
  } else {
    dateStatus = `${diffDays} days left`;
  }

  let statusColor = "bg-blue-500";
  if (isCompleted) statusColor = "bg-emerald-500";
  else if (diffDays < 0) statusColor = "bg-red-500";

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border ${isCompleted ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100'} flex flex-col h-full group card-hover-lift`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-lg">{goal.name}</h3>
            {isCompleted && (
              <span className="bg-emerald-100 text-emerald-700 p-1 rounded-full" title="Goal Completed">
                <Award className="w-4 h-4" />
              </span>
            )}
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 inline-block">
            {goal.category}
          </span>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isCompleted && (
            <button 
              onClick={() => onAddFunds(goal)}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Add Funds"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => onEdit(goal)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Goal"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(goal.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-2 mt-2">
        <span className="text-2xl font-bold text-slate-900">
          ${goal.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-sm font-medium text-slate-500 mb-1">
          / ${goal.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-1000 ${statusColor}`} 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center text-sm mt-auto pt-2">
        <span className="font-medium text-slate-700">
          {percentage.toFixed(1)}%
        </span>
        
        <span className={`flex items-center text-xs ${dateColor}`}>
          {!isCompleted && <Calendar className="w-3 h-3 mr-1" />}
          {dateStatus}
        </span>
      </div>
      
      {!isCompleted && (
        <div className="mt-2 text-xs text-slate-500 text-right">
          ${Math.abs(remainingAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} to go
        </div>
      )}
    </div>
  );
}
