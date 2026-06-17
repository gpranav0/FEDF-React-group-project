import { motion } from 'framer-motion';

export default function InsightCard({ insight, index }) {
  const { title, description, priority, icon: Icon } = insight;

  const getStyles = () => {
    switch (priority) {
      case 'warning':
        return {
          border: 'border-amber-200 hover:border-amber-300',
          bg: 'bg-amber-50/50 hover:bg-amber-50',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600'
        };
      case 'success':
        return {
          border: 'border-emerald-200 hover:border-emerald-300',
          bg: 'bg-emerald-50/50 hover:bg-emerald-50',
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600'
        };
      case 'info':
      default:
        return {
          border: 'border-blue-200 hover:border-blue-300',
          bg: 'bg-blue-50/50 hover:bg-blue-50',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`p-4 rounded-xl border ${styles.border} ${styles.bg} transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-default`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl ${styles.iconBg} ${styles.iconColor} flex-shrink-0`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-800 mb-1 leading-tight">{title}</p>
          <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
