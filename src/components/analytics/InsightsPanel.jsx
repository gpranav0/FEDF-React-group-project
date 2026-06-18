import React from 'react';
import { Card } from '../ui/Card';
import { AlertCircle, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InsightsPanel({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Smart Insights</h3>
      <div className="space-y-3">
        <AnimatePresence>
          {insights.map(insight => {
            let Icon = Info;
            let bgColor = 'bg-slate-50';
            let iconColor = 'text-slate-500';
            let iconBg = 'bg-slate-100';
            
            if (insight.type === 'Warning') {
              Icon = TrendingUp;
              bgColor = 'bg-rose-50/50';
              iconColor = 'text-rose-500';
              iconBg = 'bg-rose-100';
            } else if (insight.type === 'Caution') {
              Icon = AlertCircle;
              bgColor = 'bg-amber-50/50';
              iconColor = 'text-amber-500';
              iconBg = 'bg-amber-100';
            } else if (insight.type === 'Success') {
              Icon = TrendingDown;
              bgColor = 'bg-emerald-50/50';
              iconColor = 'text-emerald-500';
              iconBg = 'bg-emerald-100';
            }

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg flex items-start ${bgColor} border border-slate-100/50`}
              >
                <div className={`p-1.5 rounded-full ${iconBg} ${iconColor} mt-0.5 shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="ml-3 text-sm text-slate-700 leading-snug">
                  {insight.message}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
}
