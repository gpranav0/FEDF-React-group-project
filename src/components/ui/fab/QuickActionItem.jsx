import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: 15, scale: 0.9, transition: { duration: 0.2 } }
};

export default function QuickActionItem({ icon: Icon, label, onClick, color = "text-blue-600", bg = "bg-blue-50" }) {
  return (
    <motion.div 
      variants={itemVariants}
      className="flex items-center gap-3 justify-end"
    >
      <span className="text-sm font-medium text-slate-700 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 cursor-default select-none">
        {label}
      </span>
      <button
        type="button"
        onClick={onClick}
        className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary btn-press ${bg} ${color}`}
        aria-label={label}
      >
        <Icon className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
