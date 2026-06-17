import { Target, Award } from 'lucide-react';

export default function SavingsAnalysis({ totalGoalAmount, totalSaved, remainingGoalAmount, completedCount }) {
  const percentage = totalGoalAmount > 0 ? (totalSaved / totalGoalAmount) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full print:border-slate-300 print:shadow-none print:break-inside-avoid">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg print:bg-transparent">
          <Target className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Savings Performance</h3>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium text-slate-500">Total Targets</span>
          <span className="font-bold text-slate-900">${totalGoalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium text-slate-500">Total Saved</span>
          <span className="font-bold text-slate-900">${totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium text-slate-500">Remaining</span>
          <span className="font-bold text-blue-600">${remainingGoalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
          <div 
            className="bg-purple-500 h-2 rounded-full"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-right text-xs text-slate-500 font-medium mt-1">{percentage.toFixed(1)}% funded</p>
      </div>

      <div className="pt-4 border-t border-slate-100 print:border-slate-300">
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl print:bg-transparent print:border print:border-purple-200">
          <div className="flex items-center gap-2 text-purple-700">
            <Award className="w-5 h-5" />
            <span className="font-semibold">Goals Completed</span>
          </div>
          <span className="text-lg font-bold text-purple-900">{completedCount}</span>
        </div>
      </div>
    </div>
  );
}
