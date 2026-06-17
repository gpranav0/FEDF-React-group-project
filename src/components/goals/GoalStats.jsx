import { Target, PiggyBank, TrendingUp, Award } from 'lucide-react';

export default function GoalStats({ totalGoalAmount, totalSaved, remainingAmount, goalsCompleted }) {
  const stats = [
    { title: "Total Goal Amount", amount: totalGoalAmount, icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Saved", amount: totalSaved, icon: PiggyBank, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Remaining Amount", amount: remainingAmount, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Goals Completed", amount: goalsCompleted, icon: Award, color: "text-purple-600", bg: "bg-purple-50", isCount: true }
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
