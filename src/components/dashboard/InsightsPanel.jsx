import { useState, useEffect, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { generateInsights } from '../../utils/insightsUtils';
import InsightCard from './InsightCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function InsightsPanel() {
  const [dataLoaded, setDataLoaded] = useState(false);

  const insights = useMemo(() => {
    let expenses = [];
    let budgets = [];
    let goals = [];
    let settings = {};

    try { expenses = JSON.parse(localStorage.getItem('fintrack_expenses') || '[]'); } catch { }
    try { budgets = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]'); } catch { }
    try { goals = JSON.parse(localStorage.getItem('fintrack_goals') || '[]'); } catch { }
    try { settings = JSON.parse(localStorage.getItem('fintrack_settings') || '{}'); } catch { }

    return generateInsights(expenses, budgets, goals, settings);
  }, []);

  useEffect(() => {
    // Simulate slight delay to allow smooth staggered loading animation
    const timer = setTimeout(() => setDataLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (insights.length === 0) return null;

  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/60 h-full flex flex-col relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Smart Insights</h3>
          <p className="text-sm text-slate-500">Automated financial observations</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 shadow-sm text-xs font-bold text-indigo-600">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered</span>
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <AnimatePresence>
          {dataLoaded ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {insights.map((insight, i) => (
                <InsightCard key={insight.id} insight={insight} index={i} />
              ))}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-24 w-full rounded-xl" />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
