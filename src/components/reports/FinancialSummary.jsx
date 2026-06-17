import { PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function FinancialSummary({ monthlyIncome, monthlyExpenses, monthlySavings, savingsRate }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full print:border-slate-300 print:shadow-none print:break-inside-avoid">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg print:bg-transparent">
          <PieChart className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Monthly Summary</h3>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-slate-500">Income</span>
            <span className="font-bold text-slate-900">
              ${monthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full w-full"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-slate-500">Expenses</span>
            <span className="font-bold text-slate-900">
              ${monthlyExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((monthlyExpenses / (monthlyIncome || 1)) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-slate-500">Savings</span>
            <span className="font-bold text-slate-900">
              ${monthlySavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((monthlySavings / (monthlyIncome || 1)) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 mt-6 print:border-slate-300">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Savings Rate</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-primary">{savingsRate.toFixed(1)}%</span>
              {savingsRate >= 20 ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">Recommended target: 20% or higher</p>
        </div>
      </div>
    </div>
  );
}
