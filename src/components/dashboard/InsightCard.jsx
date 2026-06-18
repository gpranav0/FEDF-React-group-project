import { motion } from 'framer-motion';

export default function InsightCard({ insight, index }) {
  const { title, description, priority, icon: Icon } = insight;

  const getStyles = () => {
    switch (priority) {
      case 'warning':
        return {
          border: 'border-amber-200/60 hover:border-amber-300',
          bg: 'bg-gradient-to-br from-amber-50/80 to-orange-50/30',
          iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
          iconColor: 'text-white',
          glow: 'group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]'
        };
      case 'success':
        return {
          border: 'border-emerald-200/60 hover:border-emerald-300',
          bg: 'bg-gradient-to-br from-emerald-50/80 to-teal-50/30',
          iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
          iconColor: 'text-white',
          glow: 'group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
        };
      case 'info':
      default:
        return {
          border: 'border-blue-200/60 hover:border-blue-300',
          bg: 'bg-gradient-to-br from-blue-50/80 to-indigo-50/30',
          iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
          iconColor: 'text-white',
          glow: 'group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]'
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative group overflow-hidden p-4 rounded-xl border backdrop-blur-sm ${styles.border} ${styles.bg} transition-all duration-300 hover:-translate-y-1 ${styles.glow} cursor-default`}
    >
      <div className="flex items-start gap-3 relative z-10">
        <div className={`p-2.5 rounded-xl ${styles.iconBg} ${styles.iconColor} shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          {Icon && <Icon className="w-4 h-4" />}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-bold text-slate-800 mb-1 leading-tight group-hover:text-slate-900 transition-colors">{title}</p>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
