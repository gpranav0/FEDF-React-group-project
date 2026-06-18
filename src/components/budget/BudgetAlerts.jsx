import React from 'react';
import { useBudgets } from '../../context/BudgetContext';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function BudgetAlerts() {
  const { state, dismissAlert } = useBudgets();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {state.alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`glass-card p-4 flex items-start shadow-lg border-l-4 ${
              alert.type === 'Warning' ? 'border-rose-500 bg-rose-50/90' : 'border-amber-500 bg-amber-50/90'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {alert.type === 'Warning' ? (
                <AlertCircle className="w-5 h-5 text-rose-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-bold ${alert.type === 'Warning' ? 'text-rose-800' : 'text-amber-800'}`}>
                {alert.type}
              </h3>
              <p className={`text-sm mt-1 ${alert.type === 'Warning' ? 'text-rose-700' : 'text-amber-700'}`}>
                {alert.message}
              </p>
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className={`ml-4 flex-shrink-0 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                alert.type === 'Warning' 
                  ? 'text-rose-500 hover:bg-rose-100 focus:ring-rose-500 focus:ring-offset-rose-50' 
                  : 'text-amber-500 hover:bg-amber-100 focus:ring-amber-500 focus:ring-offset-amber-50'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
