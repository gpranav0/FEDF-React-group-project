import { DollarSign, TrendingDown, PiggyBank, Percent } from 'lucide-react';

export default function AnalyticsStats({ totalIncome, totalExpenses, totalSavings, savingsRate }) {
  const stats = [
    { title: "Total Income", amount: totalIncome, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", isCurrency: true },
    { title: "Total Expenses", amount: totalExpenses, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50", isCurrency: true },
    { title: "Total Savings", amount: totalSavings, icon: PiggyBank, color: "text-blue-600", bg: "bg-blue-50", isCurrency: true },
    { title: "Savings Rate", amount: savingsRate, icon: Percent, color: "text-purple-600", bg: "bg-purple-50", isCurrency: false }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stat.isCurrency
              ? `$${stat.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : `${stat.amount.toFixed(1)}%`}
          </p>
        </div>
      ))}
    </div>
  );
}
