import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function BudgetInsights({ budgets, expensesData }) {
  if (budgets.length === 0) return null;

  const insights = budgets.map(budget => {
    const spent = expensesData[budget.category] || 0;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    return { ...budget, spent, percentage };
  }).sort((a, b) => b.percentage - a.percentage);

  const exceeding = insights.filter(i => i.percentage >= 100);
  const warning = insights.filter(i => i.percentage >= 70 && i.percentage < 100);
  const good = insights.filter(i => i.percentage < 70);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Budget Insights</h3>
      
      <div className="space-y-4">
        {exceeding.length > 0 && (
          <div>
            <h4 className="flex items-center text-sm font-semibold text-red-700 mb-2">
              <AlertCircle className="w-4 h-4 mr-2" /> Exceeding Budget
            </h4>
            <ul className="space-y-2">
              {exceeding.map(item => (
                <li key={item.category} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.category}</span>
                  <span className="font-medium text-red-600">{item.percentage.toFixed(0)}% used</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {warning.length > 0 && (
          <div>
            <h4 className="flex items-center text-sm font-semibold text-yellow-700 mb-2 mt-4">
              <AlertTriangle className="w-4 h-4 mr-2" /> Nearing Limit
            </h4>
            <ul className="space-y-2">
              {warning.map(item => (
                <li key={item.category} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.category}</span>
                  <span className="font-medium text-yellow-600">{item.percentage.toFixed(0)}% used</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {good.length > 0 && (
          <div>
            <h4 className="flex items-center text-sm font-semibold text-emerald-700 mb-2 mt-4">
              <CheckCircle2 className="w-4 h-4 mr-2" /> On Track
            </h4>
            <ul className="space-y-2">
              {good.slice(0, 3).map(item => (
                <li key={item.category} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.category}</span>
                  <span className="font-medium text-emerald-600">{item.percentage.toFixed(0)}% used</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
