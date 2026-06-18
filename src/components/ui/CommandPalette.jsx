import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, Receipt, PieChart, Target, FileText, LineChart, Settings,
  Plus, Command
} from 'lucide-react';

const COMMANDS = [
  { id: 'nav-dash', label: 'Go to Dashboard', icon: LayoutDashboard, action: 'navigate', path: '/', section: 'Navigation' },
  { id: 'nav-exp', label: 'Go to Expenses', icon: Receipt, action: 'navigate', path: '/expenses', section: 'Navigation' },
  { id: 'nav-bud', label: 'Go to Budgets', icon: PieChart, action: 'navigate', path: '/budgets', section: 'Navigation' },
  { id: 'nav-goals', label: 'Go to Savings Goals', icon: Target, action: 'navigate', path: '/goals', section: 'Navigation' },
  { id: 'nav-rep', label: 'Go to Reports', icon: FileText, action: 'navigate', path: '/reports', section: 'Navigation' },
  { id: 'nav-ana', label: 'Go to Analytics', icon: LineChart, action: 'navigate', path: '/analytics', section: 'Navigation' },
  { id: 'nav-set', label: 'Go to Settings', icon: Settings, action: 'navigate', path: '/settings', section: 'Navigation' },
  { id: 'act-exp', label: 'Add Expense', icon: Plus, action: 'navigate', path: '/expenses', section: 'Actions' },
  { id: 'act-bud', label: 'Create Budget', icon: Plus, action: 'navigate', path: '/budgets', section: 'Actions' },
  { id: 'act-goal', label: 'Create Savings Goal', icon: Plus, action: 'navigate', path: '/goals', section: 'Actions' },
  { id: 'act-rep', label: 'Generate Report', icon: FileText, action: 'navigate', path: '/reports', section: 'Actions' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  // Open/close with Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!query) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter(c => c.label.toLowerCase().includes(q));
  }, [query]);

  // Group by section
  const grouped = useMemo(() => {
    const sections = {};
    filtered.forEach(cmd => {
      if (!sections[cmd.section]) sections[cmd.section] = [];
      sections[cmd.section].push(cmd);
    });
    return sections;
  }, [filtered]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) executeCommand(filtered[selectedIndex]);
    }
  };

  const executeCommand = (cmd) => {
    if (cmd.action === 'navigate') {
      navigate(cmd.path);
    }
    setIsOpen(false);
  };

  // Scroll active into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  let flatIdx = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100]"
            onClick={() => setIsOpen(false)}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 z-[101] overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search actions..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                className="flex-1 text-sm outline-none placeholder:text-slate-400 bg-transparent"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[300px] overflow-y-auto py-2 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-400">No results found</div>
              ) : (
                Object.entries(grouped).map(([section, cmds]) => (
                  <div key={section}>
                    <div className="px-4 py-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{section}</span>
                    </div>
                    {cmds.map((cmd) => {
                      flatIdx++;
                      const idx = flatIdx;
                      const isActive = idx === selectedIndex;
                      return (
                        <button
                          key={cmd.id}
                          data-index={idx}
                          onClick={() => executeCommand(cmd)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          <cmd.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="text-sm font-medium">{cmd.label}</span>
                          {isActive && (
                            <kbd className="ml-auto text-[10px] font-semibold text-blue-400 bg-blue-100 px-1.5 py-0.5 rounded">↵</kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="bg-slate-200 px-1 rounded text-slate-500">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="bg-slate-200 px-1 rounded text-slate-500">↵</kbd> Select</span>
              </div>
              <span className="flex items-center gap-1"><Command className="w-3 h-3" />+K to toggle</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
