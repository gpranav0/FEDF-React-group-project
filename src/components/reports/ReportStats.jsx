import { DollarSign, TrendingDown, PiggyBank, Wallet } from 'lucide-react';

export default function ReportStats({ totalIncome, totalExpenses, totalSavings, netBalance }) {
  const stats = [
    { title: "Total Income", amount: totalIncome, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Total Expenses", amount: totalExpenses, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50" },
    { title: "Total Savings", amount: totalSavings, icon: PiggyBank, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Net Balance", amount: netBalance, icon: Wallet, color: "text-purple-600", bg: "bg-purple-50" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 print:grid-cols-4 print:gap-4 print:mb-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:border-slate-300 print:shadow-none print:p-4">
          <div className="flex justify-between items-center mb-4 print:mb-2">
            <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} print:bg-transparent`}>
              <stat.icon className="w-5 h-5 print:w-4 print:h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 print:text-xl">
            ${stat.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      ))}
    </div>
  );
}
