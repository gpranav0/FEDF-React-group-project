import { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, PieChart, Target, FileText } from 'lucide-react';
import QuickActionItem from './QuickActionItem';
import { useNavigate } from 'react-router-dom';

const ACTIONS = [
  {
    id: 'fab-add-expense',
    label: 'Add Expense',
    description: 'Log a new transaction',
    icon: Receipt,
    path: '/expenses',
    gradient: ['#3b82f6', '#2563eb'], // blue
  },
  {
    id: 'fab-create-budget',
    label: 'Create Budget',
    description: 'Set spending limits',
    icon: PieChart,
    path: '/budgets',
    gradient: ['#10b981', '#059669'], // emerald
  },
  {
    id: 'fab-add-goal',
    label: 'Add Savings Goal',
    description: 'Track a new target',
    icon: Target,
    path: '/goals',
    gradient: ['#8b5cf6', '#7c3aed'], // purple
  },
  {
    id: 'fab-gen-report',
    label: 'Generate Report',
    description: 'Financial overview',
    icon: FileText,
    path: '/reports',
    gradient: ['#f59e0b', '#d97706'], // amber
  },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const menuVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, delay: 0.05 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function QuickActionMenu({ isOpen, closeMenu }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const itemRefs = useRef([]);

  const handleAction = useCallback(
    (path) => {
      navigate(path);
      closeMenu();
    },
    [navigate, closeMenu]
  );

  // Focus management: focus first item when menu opens
  useEffect(() => {
    if (isOpen && itemRefs.current[0]) {
      // Small delay so the animation has started
      const timer = setTimeout(() => {
        itemRefs.current[0]?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard navigation within the menu
  const handleKeyDown = useCallback(
    (e) => {
      const items = itemRefs.current.filter(Boolean);
      const currentIndex = items.indexOf(document.activeElement);

      switch (e.key) {
        case 'ArrowUp': {
          e.preventDefault();
          const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          items[prev]?.focus();
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          items[next]?.focus();
          break;
        }
        case 'Home': {
          e.preventDefault();
          items[0]?.focus();
          break;
        }
        case 'End': {
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;
        }
        case 'Tab': {
          // Trap focus within menu
          e.preventDefault();
          if (e.shiftKey) {
            const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            items[prev]?.focus();
          } else {
            const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            items[next]?.focus();
          }
          break;
        }
        default:
          break;
      }
    },
    []
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay — subtle blur */}
          <motion.div
            key="fab-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/40 backdrop-blur-[2px] z-40"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <motion.div
            key="fab-menu"
            ref={menuRef}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="menu"
            aria-label="Quick actions"
            onKeyDown={handleKeyDown}
            className="absolute bottom-[72px] right-0 w-[280px] flex flex-col gap-2 z-50"
          >
            {/* Header pill */}
            <motion.div
              variants={headerVariants}
              className="flex items-center gap-2 px-4 py-2 mb-1"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300/60 dark:via-slate-600/60 to-transparent" />
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400 dark:text-slate-500 select-none whitespace-nowrap">
                Quick Actions
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300/60 dark:via-slate-600/60 to-transparent" />
            </motion.div>

            {/* Action items */}
            {ACTIONS.map((action, i) => (
              <QuickActionItem
                key={action.id}
                ref={(el) => (itemRefs.current[i] = el)}
                icon={action.icon}
                label={action.label}
                description={action.description}
                gradient={action.gradient}
                index={i}
                onClick={() => handleAction(action.path)}
              />
            ))}

            {/* Subtle footer hint */}
            <motion.p
              variants={headerVariants}
              className="text-center text-[10px] text-slate-400/60 dark:text-slate-600 mt-1 select-none"
            >
              Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[9px]">Esc</kbd> to close
            </motion.p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
