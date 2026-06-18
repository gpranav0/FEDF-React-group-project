import React from 'react';
import { useSavings } from '../../context/SavingsContext';
import { Award, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MilestoneTracker() {
  const { state, dismissAchievement } = useSavings();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {state.achievements.map((ach) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="glass-card p-4 flex items-start shadow-xl border-l-4 border-amber-400 bg-white"
          >
            <div className="flex-shrink-0 mt-0.5 p-1.5 bg-amber-100 rounded-full text-amber-500">
              <Award className="w-6 h-6" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-bold text-slate-900">Milestone Unlocked!</h3>
              <p className="text-sm mt-1 text-slate-600">{ach.message}</p>
            </div>
            <button
              onClick={() => dismissAchievement(ach.id)}
              className="ml-4 flex-shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
