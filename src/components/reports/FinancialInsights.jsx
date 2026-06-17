import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function FinancialInsights({ biggestExpense, strongestSavings, budgetEfficiency, goalsOnTrack }) {
  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md h-full print:bg-white print:text-slate-900 print:border print:border-slate-300 print:shadow-none print:break-inside-avoid">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-800 text-yellow-400 rounded-lg print:bg-slate-100 print:text-yellow-600">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold">Key Insights</h3>
      </div>

      <div className="space-y-6">
        {biggestExpense && (
          <div className="flex gap-4">
            <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5 print:text-orange-500" />
            <div>
              <p className="text-sm font-semibold mb-1">Highest Spending Area</p>
              <p className="text-sm text-slate-300 print:text-slate-600">
                Your highest spending category is <span className="font-medium text-white print:text-slate-900">{biggestExpense.name}</span>, making up a significant portion of your recent expenses.
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 print:text-emerald-500" />
          <div>
            <p className="text-sm font-semibold mb-1">Budget Efficiency</p>
            <p className="text-sm text-slate-300 print:text-slate-600">
              You are using <span className="font-medium text-white print:text-slate-900">{budgetEfficiency.toFixed(1)}%</span> of your allocated budgets overall. 
              {budgetEfficiency > 90 ? ' Consider adjusting your limits.' : ' Great job staying within limits!'}
            </p>
          </div>
        </div>

        {goalsOnTrack && (
          <div className="flex gap-4">
            <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 print:text-blue-500" />
            <div>
              <p className="text-sm font-semibold mb-1">Savings Progress</p>
              <p className="text-sm text-slate-300 print:text-slate-600">
                You are making progress on multiple savings goals. Keep allocating funds regularly to reach your targets faster.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
