import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import QuickActionMenu from './QuickActionMenu';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={containerRef}>
      <QuickActionMenu isOpen={isOpen} closeMenu={closeMenu} />
      
      <button
        type="button"
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open quick actions"}
        aria-expanded={isOpen}
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 z-10 hover:-translate-y-1"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </button>
    </div>
  );
}
