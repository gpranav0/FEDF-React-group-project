import { forwardRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8, filter: 'blur(4px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 22,
      delay: i * 0.06,
    },
  }),
  exit: (i) => ({
    opacity: 0,
    y: 12,
    scale: 0.85,
    filter: 'blur(4px)',
    transition: {
      duration: 0.18,
      delay: i * 0.03,
    },
  }),
};

const QuickActionItem = forwardRef(function QuickActionItem(
  { icon: Icon, label, description, onClick, gradient, index = 0 },
  ref
) {
  const [ripple, setRipple] = useState(null);

  const handleClick = useCallback(
    (e) => {
      // Ripple effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipple({ x, y, id: Date.now() });
      setTimeout(() => setRipple(null), 500);

      onClick?.();
    },
    [onClick]
  );

  return (
    <motion.button
      ref={ref}
      type="button"
      custom={index}
      variants={itemVariants}
      onClick={handleClick}
      whileHover={{ scale: 1.02, x: -4 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex items-center gap-4 w-full pl-4 pr-5 py-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-black/30 transition-shadow duration-300 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      aria-label={label}
    >
      {/* Hover gradient shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${gradient?.[0] || '#eff6ff'}22 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Ripple */}
      {ripple && (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ping pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            background: gradient?.[0] || '#3b82f6',
            opacity: 0.2,
          }}
        />
      )}

      {/* Icon container */}
      <div
        className="relative flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]"
        style={{
          background: `linear-gradient(135deg, ${gradient?.[0] || '#3b82f6'}, ${gradient?.[1] || '#6366f1'})`,
          boxShadow: `0 4px 14px -2px ${gradient?.[0] || '#3b82f6'}50`,
        }}
      >
        <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
      </div>

      {/* Text */}
      <div className="flex flex-col items-start min-w-0">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
          {label}
        </span>
        {description && (
          <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
            {description}
          </span>
        )}
      </div>

      {/* Chevron / arrow hint */}
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
        <svg
          className="w-4 h-4 text-slate-300 dark:text-slate-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.button>
  );
});

export default QuickActionItem;
