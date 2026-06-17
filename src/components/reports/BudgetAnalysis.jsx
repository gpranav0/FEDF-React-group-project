import { PieChart, AlertTriangle } from 'lucide-react';

export default function BudgetAnalysis({ totalAllocated, totalUsed, categoriesOverBudget }) {
  const remaining = totalAllocated - totalUsed;
  const percentage = totalAllocated > 0 ? (totalUsed / totalAllocated) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full print:border-slate-300 print:shadow-none print:break-inside-avoid">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg print:bg-transparent">
          <PieChart className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Budget Performance</h3>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium text-slate-500">Allocated</span>
          <span className="font-bold text-slate-900">${totalAllocated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium text-slate-500">Used</span>
          <span className="font-bold text-slate-900">${totalUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium text-slate-500">Remaining</span>
          <span className={`font-bold ${remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            ${remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
          <div 
            className={`h-2 rounded-full ${percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-orange-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {categoriesOverBudget.length > 0 && (
        <div className="pt-4 border-t border-slate-100 print:border-slate-300">
          <h4 className="flex items-center text-sm font-semibold text-red-700 mb-3">
            <AlertTriangle className="w-4 h-4 mr-2" /> Over Budget Categories
          </h4>
          <ul className="space-y-2">
            {categoriesOverBudget.map((cat, idx) => (
              <li key={idx} className="flex justify-between text-sm p-2 bg-red-50 rounded-lg print:bg-transparent print:border print:border-red-200">
                <span className="font-medium text-red-900">{cat.name}</span>
                <span className="text-red-700">${cat.overage.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} over</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
