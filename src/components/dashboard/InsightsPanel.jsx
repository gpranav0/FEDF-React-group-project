import { useState, useEffect, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { generateInsights } from '../../utils/insightsUtils';
import InsightCard from './InsightCard';

export default function InsightsPanel() {
  const [dataLoaded, setDataLoaded] = useState(false);

  const insights = useMemo(() => {
    let expenses = [];
    let budgets = [];
    let goals = [];
    let settings = {};

    try { expenses = JSON.parse(localStorage.getItem('fintrack_expenses') || '[]'); } catch {}
    try { budgets = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]'); } catch {}
    try { goals = JSON.parse(localStorage.getItem('fintrack_goals') || '[]'); } catch {}
    try { settings = JSON.parse(localStorage.getItem('fintrack_settings') || '{}'); } catch {}

    return generateInsights(expenses, budgets, goals, settings);
  }, []);

  useEffect(() => {
    setDataLoaded(true);
  }, []);

  if (insights.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-900">Smart Financial Insights</h3>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-600">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered</span>
        </div>
      </div>
      
      {dataLoaded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {insights.map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
