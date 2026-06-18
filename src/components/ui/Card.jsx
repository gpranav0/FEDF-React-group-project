import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, children, ...props }) {
  return (
    <div 
      className={cn("glass-card p-6 transition-all duration-300 hover:shadow-md", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
