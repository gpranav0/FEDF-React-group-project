import { DollarSign, Calendar, Clock, ListOrdered } from 'lucide-react';

export default function ExpenseStats({ expenses }) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenses = expenses
    .filter(exp => {
      const date = new Date(exp.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses
    .filter(exp => exp.date === todayStr)
    .reduce((sum, exp) => sum + exp.amount, 0);

  const stats = [
    { title: "Total Expenses", amount: totalExpenses, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "This Month", amount: thisMonthExpenses, icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Today's Spending", amount: todayExpenses, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Total Transactions", amount: expenses.length, icon: ListOrdered, color: "text-purple-600", bg: "bg-purple-50", isCount: true }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stat.isCount ? stat.amount : `$${stat.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </p>
        </div>
      ))}
    </div>
  );
}
