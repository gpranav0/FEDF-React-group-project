import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { useSavings } from '../../context/SavingsContext';
import { Target, TrendingUp, CheckCircle, PiggyBank } from 'lucide-react';

export function SavingsMetrics() {
  const { state } = useSavings();

  const metrics = useMemo(() => {
    const goals = state.goals;
    if (goals.length === 0) return { totalGoals: 0, totalTarget: 0, totalSaved: 0, completedCount: 0, avgProgress: 0 };

    const totalGoals = goals.length;
    const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
    const totalSaved = goals.reduce((acc, g) => acc + g.saved, 0);
    const completedCount = goals.filter(g => g.saved >= g.target).length;
    
    const totalProgress = goals.reduce((acc, g) => acc + (g.saved / g.target), 0);
    const avgProgress = (totalProgress / totalGoals) * 100;

    return { totalGoals, totalTarget, totalSaved, completedCount, avgProgress };
  }, [state.goals]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Saved</p>
            <p className="text-2xl font-bold text-slate-900">₹{metrics.totalSaved.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <PiggyBank className="w-6 h-6" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Target</p>
            <p className="text-2xl font-bold text-slate-900">₹{metrics.totalTarget.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
            <Target className="w-6 h-6" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Progress</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.avgProgress.toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Completed Goals</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.completedCount} / {metrics.totalGoals}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-full text-amber-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </div>
  );
}
