import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, PieChart, Target, FileText } from 'lucide-react';
import QuickActionItem from './QuickActionItem';
import { useNavigate } from 'react-router-dom';

const ACTIONS = [
  { label: 'Add Expense', icon: Receipt, path: '/expenses', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Create Budget', icon: PieChart, path: '/budgets', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Add Savings Goal', icon: Target, path: '/goals', color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Generate Report', icon: FileText, path: '/reports', color: 'text-orange-600', bg: 'bg-orange-50' },
];

export default function QuickActionMenu({ isOpen, closeMenu }) {
  const navigate = useNavigate();

  const handleAction = (path) => {
    navigate(path);
    closeMenu();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1, // Animate from bottom to top
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: 1,
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute bottom-20 right-0 flex flex-col gap-3 pb-2 w-max"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {[...ACTIONS].reverse().map((action) => (
            <QuickActionItem
              key={action.label}
              icon={action.icon}
              label={action.label}
              color={action.color}
              bg={action.bg}
              onClick={() => handleAction(action.path)}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
