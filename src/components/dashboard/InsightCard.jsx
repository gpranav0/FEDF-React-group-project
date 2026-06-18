import { motion } from 'framer-motion';

export default function InsightCard({ insight, index }) {
  const { title, description, priority, icon: Icon } = insight;

  const getStyles = () => {
    switch (priority) {
      case 'warning':
        return {
          border: 'border-l-[3px] border-l-amber-500 border-slate-200/60',
          hoverBorder: 'group-hover:border-slate-300',
          iconBg: 'bg-amber-50 dark:bg-amber-500/10',
          iconColor: 'text-amber-500 dark:text-amber-400',
          shadow: 'shadow-sm shadow-slate-200/50 dark:shadow-none',
          hoverGlow: 'group-hover:shadow-[0_8px_30px_-4px_rgba(245,158,11,0.15)] dark:group-hover:shadow-[0_8px_30px_-4px_rgba(245,158,11,0.05)]'
        };
      case 'success':
        return {
          border: 'border-l-[3px] border-l-emerald-500 border-slate-200/60',
          hoverBorder: 'group-hover:border-slate-300',
          iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
          iconColor: 'text-emerald-500 dark:text-emerald-400',
          shadow: 'shadow-sm shadow-slate-200/50 dark:shadow-none',
          hoverGlow: 'group-hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.15)] dark:group-hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.05)]'
        };
      case 'info':
      default:
        return {
          border: 'border-l-[3px] border-l-blue-500 border-slate-200/60',
          hoverBorder: 'group-hover:border-slate-300',
          iconBg: 'bg-blue-50 dark:bg-blue-500/10',
          iconColor: 'text-blue-500 dark:text-blue-400',
          shadow: 'shadow-sm shadow-slate-200/50 dark:shadow-none',
          hoverGlow: 'group-hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.15)] dark:group-hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.05)]'
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`group relative overflow-hidden p-4 rounded-xl bg-white dark:bg-slate-800 border ${styles.border} ${styles.hoverBorder} ${styles.shadow} ${styles.hoverGlow} transition-all duration-300 hover:-translate-y-1 cursor-default`}
    >
      <div className="flex items-start gap-3.5 relative z-10">
        <div className={`p-2.5 rounded-xl ${styles.iconBg} ${styles.iconColor} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          {Icon && <Icon className="w-4 h-4" strokeWidth={2.5} />}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-bold text-slate-800 dark:text-white mb-1 leading-tight group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">{title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
