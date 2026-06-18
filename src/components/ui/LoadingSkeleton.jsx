import React from 'react';
import { motion } from 'framer-motion';

export function LoadingSkeleton({ className }) {
  return (
    <motion.div 
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`bg-slate-200 rounded-lg ${className}`}
    />
  );
}
