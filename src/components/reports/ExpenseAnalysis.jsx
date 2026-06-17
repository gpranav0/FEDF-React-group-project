import { Receipt } from 'lucide-react';

export default function ExpenseAnalysis({ highestCategory, lowestCategory, totalCategoriesUsed, averageExpense }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full print:border-slate-300 print:shadow-none print:break-inside-avoid">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-50 text-red-600 rounded-lg print:bg-transparent">
          <Receipt className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Expense Analysis</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl print:border print:border-slate-200 print:bg-transparent">
          <span className="text-sm font-medium text-slate-600">Highest Category</span>
          <div className="text-right">
            <span className="block text-sm font-bold text-slate-900">{highestCategory.name}</span>
            <span className="text-xs text-slate-500">${highestCategory.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl print:border print:border-slate-200 print:bg-transparent">
          <span className="text-sm font-medium text-slate-600">Lowest Category</span>
          <div className="text-right">
            <span className="block text-sm font-bold text-slate-900">{lowestCategory.name}</span>
            <span className="text-xs text-slate-500">${lowestCategory.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl print:border print:border-slate-200 print:bg-transparent">
          <span className="text-sm font-medium text-slate-600">Categories Used</span>
          <span className="font-bold text-slate-900">{totalCategoriesUsed}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl print:border print:border-slate-200 print:bg-transparent">
          <span className="text-sm font-medium text-slate-600">Average Expense</span>
          <span className="font-bold text-slate-900">${averageExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
