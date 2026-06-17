import { motion } from 'framer-motion';
import { Edit, Trash2, Download, FileText, PieChart, Target, Receipt } from 'lucide-react';

export default function ActivityItem({ activity, index }) {
  const { actionType, title, description, timestamp } = activity;

  const getIconAndColor = () => {
    if (actionType.startsWith('expense_')) {
      if (actionType.includes('add')) return { icon: Receipt, bg: 'bg-blue-100', color: 'text-blue-600' };
      if (actionType.includes('update')) return { icon: Edit, bg: 'bg-blue-100', color: 'text-blue-600' };
      if (actionType.includes('delete')) return { icon: Trash2, bg: 'bg-red-100', color: 'text-red-600' };
    }
    if (actionType.startsWith('budget_')) {
      if (actionType.includes('add')) return { icon: PieChart, bg: 'bg-emerald-100', color: 'text-emerald-600' };
      if (actionType.includes('update')) return { icon: Edit, bg: 'bg-emerald-100', color: 'text-emerald-600' };
      if (actionType.includes('delete')) return { icon: Trash2, bg: 'bg-red-100', color: 'text-red-600' };
    }
    if (actionType.startsWith('goal_')) {
      if (actionType.includes('add')) return { icon: Target, bg: 'bg-purple-100', color: 'text-purple-600' };
      if (actionType.includes('update')) return { icon: Edit, bg: 'bg-purple-100', color: 'text-purple-600' };
      if (actionType.includes('delete')) return { icon: Trash2, bg: 'bg-red-100', color: 'text-red-600' };
    }
    if (actionType === 'report_export') {
      return { icon: Download, bg: 'bg-orange-100', color: 'text-orange-600' };
    }
    return { icon: FileText, bg: 'bg-slate-100', color: 'text-slate-600' };
  };

  const { icon: Icon, bg, color } = getIconAndColor();

  const timeString = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex gap-4 relative group"
    >
      {/* Timeline connector line */}
      <div className="absolute left-[19px] top-10 bottom-[-16px] w-[2px] bg-slate-100 group-last:hidden"></div>
      
      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm transition-transform group-hover:scale-110 ${bg} ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      
      <div className="flex-1 pb-4">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 transition-colors group-hover:bg-blue-50/50 group-hover:border-blue-100">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
            <span className="text-xs font-medium text-slate-400 whitespace-nowrap">{timeString}</span>
          </div>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
