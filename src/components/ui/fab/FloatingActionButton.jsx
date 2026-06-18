import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import QuickActionMenu from './QuickActionMenu';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    // Return focus to the FAB button after close
    requestAnimationFrame(() => buttonRef.current?.focus());
  }, []);

  // Close when clicking outside (only clicks that pass through the overlay
  // are handled by the overlay itself; this catches edge cases)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeMenu]);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, closeMenu]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      ref={containerRef}
    >
      {/* Quick Action Menu */}
      <QuickActionMenu isOpen={isOpen} closeMenu={closeMenu} />

      {/* Pulsing ring behind the button (only when closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="pulse-ring"
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.4, 0],
              scale: [1, 1.6, 1.8],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeOut',
            }}
            style={{
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, transparent 70%)',
              width: 56,
              height: 56,
            }}
          />
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close quick actions menu' : 'Open quick actions'}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-blue-600/25 dark:shadow-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-300/50 dark:focus:ring-blue-500/30 focus:ring-offset-2 dark:focus:ring-offset-slate-900 z-10 overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:shadow-blue-600/30 dark:hover:shadow-blue-500/25"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)',
        }}
      >
        {/* Animated rotating shimmer */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.15) 10%, transparent 20%)',
            }}
          />
        )}

        {/* Plus → X icon rotation */}
        <motion.div
          animate={{
            rotate: isOpen ? 135 : 0,
            scale: isOpen ? 0.9 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="relative z-10"
        >
          <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
        </motion.div>
      </motion.button>
    </div>
  );
}
