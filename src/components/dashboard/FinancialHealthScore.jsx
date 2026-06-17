import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { calculateHealthScore } from '../../utils/healthScoreUtils';

const STATUS_COLORS = {
  Excellent: { text: 'text-emerald-600', bg: 'bg-emerald-50', stroke: '#10b981' },
  Good: { text: 'text-blue-600', bg: 'bg-blue-50', stroke: '#2563eb' },
  Fair: { text: 'text-amber-600', bg: 'bg-amber-50', stroke: '#f59e0b' },
  Poor: { text: 'text-red-600', bg: 'bg-red-50', stroke: '#ef4444' },
};

export default function FinancialHealthScore() {
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const { score, status, strengths, improvements } = useMemo(() => {
    let expenses = [];
    let budgets = [];
    let goals = [];
    let settings = {};

    try { expenses = JSON.parse(localStorage.getItem('fintrack_expenses') || '[]'); } catch {}
    try { budgets = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]'); } catch {}
    try { goals = JSON.parse(localStorage.getItem('fintrack_goals') || '[]'); } catch {}
    try { settings = JSON.parse(localStorage.getItem('fintrack_settings') || '{}'); } catch {}

    const monthlyIncome = parseFloat(settings?.preferences?.incomeGoal) || 8250;
    
    return calculateHealthScore(expenses, budgets, goals, monthlyIncome);
  }, []);

  useEffect(() => {
    setDataLoaded(true);
  }, []);

  const colorConfig = STATUS_COLORS[status] || STATUS_COLORS.Poor;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Financial Health</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorConfig.bg} ${colorConfig.text}`}>
          {status}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative flex items-center justify-center">
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
            {/* Background ring */}
            <circle
              cx="70" cy="70" r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="12"
            />
            {/* Animated Progress ring */}
            {dataLoaded && (
              <motion.circle
                cx="70" cy="70" r={radius}
                fill="none"
                stroke={colorConfig.stroke}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {dataLoaded && (
              <motion.span 
                className="text-4xl font-extrabold text-slate-900"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {score}
              </motion.span>
            )}
            <span className="text-sm text-slate-500 font-medium mt-1">/ 100</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Strengths */}
        {strengths.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Strengths:</h4>
            <ul className="space-y-1.5">
              {strengths.map((str, idx) => (
                <motion.li 
                  key={idx} 
                  className="flex items-start text-sm text-slate-600"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + idx * 0.1 }}
                >
                  <Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{str}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {improvements.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Improvements:</h4>
            <ul className="space-y-1.5">
              {improvements.map((imp, idx) => (
                <motion.li 
                  key={idx} 
                  className="flex items-start text-sm text-slate-600"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + idx * 0.1 }}
                >
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2.5 mt-1.5 flex-shrink-0" />
                  <span>{imp}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
