import { DollarSign, TrendingDown, PiggyBank, Percent } from 'lucide-react';

export default function AnalyticsStats({ totalIncome, totalExpenses, totalSavings, savingsRate }) {
  const stats = [
    { title: "Total Income", amount: totalIncome, icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30", isCurrency: true },
    { title: "Total Expenses", amount: totalExpenses, icon: TrendingDown, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/30", isCurrency: true },
    { title: "Total Savings", amount: totalSavings, icon: PiggyBank, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30", isCurrency: true },
    { title: "Savings Rate", amount: savingsRate, icon: Percent, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30", isCurrency: false }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="glass-panel p-6 rounded-2xl hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</h3>
            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {stat.isCurrency
              ? `$${stat.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : `${stat.amount.toFixed(1)}%`}
          </p>
        </div>
      ))}
    </div>
  );
}
