import { Lightbulb, TrendingUp, TrendingDown, BarChart3, Target } from 'lucide-react';

export default function AnalyticsInsights({ highestCategory, lowestCategory, avgMonthly, bestSavingsMonth, budgetEfficiency }) {
  const insights = [
    {
      icon: TrendingDown,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      title: "Highest Spending",
      text: highestCategory ? `${highestCategory.name} at $${highestCategory.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'No data yet'
    },
    {
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      title: "Lowest Spending",
      text: lowestCategory ? `${lowestCategory.name} at $${lowestCategory.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'No data yet'
    },
    {
      icon: BarChart3,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      title: "Avg Monthly Spending",
      text: `$${avgMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      icon: Target,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      title: "Budget Efficiency",
      text: `${budgetEfficiency.toFixed(1)}% of allocated budget used`
    }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Analytics Insights</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex gap-3 p-4 bg-slate-50 rounded-xl">
            <div className={`p-2 rounded-lg ${insight.iconBg} ${insight.iconColor} h-fit`}>
              <insight.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
              <p className="text-sm text-slate-600 mt-0.5">{insight.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
