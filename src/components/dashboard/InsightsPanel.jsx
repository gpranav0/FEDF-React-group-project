import { useState, useEffect, useMemo } from 'react';
import { Sparkles, Activity } from 'lucide-react';
import { generateInsights } from '../../utils/insightsUtils';
import InsightCard from './InsightCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function InsightsPanel() {
  const [dataLoaded, setDataLoaded] = useState(false);

  // Generate personalized insights based on current app data
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
    const timer = setTimeout(() => setDataLoaded(true), 250);
    return () => clearTimeout(timer);
  }, []);

  // Show a fallback empty state if no insights can be generated
  if (dataLoaded && insights.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Activity className="w-8 h-8 text-blue-300 dark:text-slate-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Not enough data</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Add more expenses, budgets, and savings goals to receive personalized financial insights.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col relative overflow-hidden group">
      {/* Decorative gradient glow in top right */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none transition-all duration-700 group-hover:bg-indigo-500/10" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Smart Insights
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Personalized financial advisor
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-100/60 dark:border-indigo-800/50 shadow-sm text-xs font-bold text-indigo-600 dark:text-indigo-400 self-start">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered</span>
        </div>
      </div>

      {/* Grid of Insight Cards */}
      <div className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {dataLoaded ? (
            <motion.div
              key="insights-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {insights.map((insight, i) => (
                <InsightCard key={insight.id} insight={insight} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="insights-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800/50 h-[92px] w-full rounded-xl border border-slate-200/50 dark:border-slate-700/50" />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
