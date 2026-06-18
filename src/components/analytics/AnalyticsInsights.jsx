import { Lightbulb, TrendingUp, TrendingDown, BarChart3, Target } from 'lucide-react';

export default function AnalyticsInsights({ highestCategory, lowestCategory, avgMonthly, bestSavingsMonth, budgetEfficiency }) {
  const insights = [
    {
      icon: TrendingDown,
      iconBg: "bg-red-50 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      title: "Highest Spending",
      text: highestCategory ? `${highestCategory.name} at $${highestCategory.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'No data yet'
    },
    {
      icon: TrendingUp,
      iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      title: "Lowest Spending",
      text: lowestCategory ? `${lowestCategory.name} at $${lowestCategory.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'No data yet'
    },
    {
      icon: BarChart3,
      iconBg: "bg-blue-50 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      title: "Avg Monthly Spending",
      text: `$${avgMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      icon: Target,
      iconBg: "bg-purple-50 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      title: "Budget Efficiency",
      text: `${budgetEfficiency.toFixed(1)}% of allocated budget used`
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Analytics Insights</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex gap-3 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-transparent dark:border-slate-700/50">
            <div className={`p-2 rounded-lg ${insight.iconBg} ${insight.iconColor} h-fit`}>
              <insight.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{insight.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{insight.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
