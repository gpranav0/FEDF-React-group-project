import React from 'react';
import { cn } from '../../utils/cn';

const colorVariants = {
  Food: 'bg-orange-100 text-orange-700 border-orange-200',
  Transport: 'bg-blue-100 text-blue-700 border-blue-200',
  Shopping: 'bg-purple-100 text-purple-700 border-purple-200',
  Bills: 'bg-rose-100 text-rose-700 border-rose-200',
  Entertainment: 'bg-pink-100 text-pink-700 border-pink-200',
  Health: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
  default: 'bg-slate-100 text-slate-700 border-slate-200'
};

export function Badge({ children, category, className, ...props }) {
  const variant = colorVariants[category] || colorVariants.default;
  
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variant,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
