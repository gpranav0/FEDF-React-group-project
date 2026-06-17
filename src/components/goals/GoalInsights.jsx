import { Target, TrendingUp, Clock, Award } from 'lucide-react';

export default function GoalInsights({ goals }) {
  if (goals.length === 0) return null;

  const incompleteGoals = goals.filter(g => g.currentAmount < g.targetAmount);
  
  // Find closest goal
  const sortedByPercentage = [...incompleteGoals].sort((a, b) => {
    const pA = a.targetAmount > 0 ? a.currentAmount / a.targetAmount : 0;
    const pB = b.targetAmount > 0 ? b.currentAmount / b.targetAmount : 0;
    return pB - pA; // Descending percentage
  });
  const closestGoal = sortedByPercentage.length > 0 ? sortedByPercentage[0] : null;

  // Find largest goal
  const sortedByTarget = [...goals].sort((a, b) => b.targetAmount - a.targetAmount);
  const largestGoal = sortedByTarget.length > 0 ? sortedByTarget[0] : null;

  // Find mostly recently due
  const sortedByDate = [...incompleteGoals].sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
  const nextDueGoal = sortedByDate.length > 0 ? sortedByDate[0] : null;

  // Count completed
  const completedCount = goals.filter(g => g.currentAmount >= g.targetAmount).length;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Goal Insights</h3>
      
      <div className="space-y-6">
        {closestGoal && (
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 mt-1">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Closest to Completion</p>
              <p className="text-sm text-slate-500 mb-1">{closestGoal.name}</p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min((closestGoal.currentAmount / closestGoal.targetAmount) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {largestGoal && (
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-1">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Largest Target</p>
              <p className="text-sm text-slate-500">{largestGoal.name}</p>
              <p className="text-sm font-medium text-slate-700">${largestGoal.targetAmount.toLocaleString()}</p>
            </div>
          </div>
        )}

        {nextDueGoal && (
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600 mt-1">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Next Deadline</p>
              <p className="text-sm text-slate-500">{nextDueGoal.name}</p>
              <p className="text-xs text-orange-600 font-medium">{new Date(nextDueGoal.targetDate).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        {completedCount > 0 && (
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mt-1">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Achievements</p>
              <p className="text-sm text-slate-500">You have completed {completedCount} goal{completedCount > 1 ? 's' : ''}!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
