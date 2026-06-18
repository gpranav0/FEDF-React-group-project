import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  FileText,
  LineChart,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  X,
  Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
  { section: 'MAIN' },
  { path: '/', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/expenses', name: 'Expenses', icon: Receipt },
  { path: '/budgets', name: 'Budgets', icon: PieChart },
  { path: '/goals', name: 'Savings Goals', icon: Target },
  { section: 'ANALYTICS' },
  { path: '/reports', name: 'Reports', icon: FileText },
  { path: '/analytics', name: 'Analytics', icon: LineChart },
  { section: 'SYSTEM' },
  { path: '/settings', name: 'Settings', icon: Settings },
];

function SidebarContent({ isCollapsed, toggleCollapse, closeMobile, isMobile }) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className={`flex items-center h-16 border-b border-slate-100 dark:border-slate-800/50 px-4 ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-bold text-slate-800 dark:text-white whitespace-nowrap overflow-hidden"
              >
                FinTrack
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Close button on mobile, collapse toggle on desktop */}
        {isMobile ? (
          <button
            onClick={closeMobile}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={toggleCollapse}
            className={`p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors ${isCollapsed ? 'hidden' : ''}`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1 custom-scrollbar">
        {NAV_ITEMS.map((item, idx) => {
          // Section header
          if (item.section) {
            if (isCollapsed && !isMobile) {
              return <div key={item.section} className={`${idx > 0 ? 'pt-3' : ''} pb-1`}><div className="h-px bg-slate-100 dark:bg-slate-800/50 mx-1" /></div>;
            }
            return (
              <div key={item.section} className={`${idx > 0 ? 'pt-4' : ''} pb-2 px-3`}>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase"
                >
                  {item.section}
                </motion.span>
              </div>
            );
          }

          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={isMobile ? closeMobile : undefined}
              className="block"
              aria-label={item.name}
            >
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'
                  }
                  ${isCollapsed && !isMobile ? 'justify-center' : ''}
                `}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-600 dark:bg-blue-400 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />

                <AnimatePresence>
                  {(!isCollapsed || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`text-sm whitespace-nowrap overflow-hidden ${isActive ? 'font-semibold' : 'font-medium'}`}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed state */}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
                    {item.name}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45" />
                  </div>
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: Expand toggle for collapsed desktop sidebar */}
      {!isMobile && isCollapsed && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/50">
          <button
            onClick={toggleCollapse}
            className="w-full p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center"
            aria-label="Expand sidebar"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom: User card for expanded */}
      {(!isCollapsed || isMobile) && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">JD</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">John Doe</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">Premium Account</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isCollapsed, toggleCollapse, isMobileOpen, closeMobile }) {
  return (
    <>
      {/* MOBILE: Overlay + Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMobile}
            />

            {/* Drawer */}
            <motion.aside
              key="mobile-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed top-0 left-0 h-full w-[280px] glass-panel z-50 shadow-2xl lg:hidden"
            >
              <SidebarContent
                isCollapsed={false}
                toggleCollapse={toggleCollapse}
                closeMobile={closeMobile}
                isMobile={true}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP: Persistent sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 h-full glass-panel border-r border-slate-200/80 dark:border-slate-800/80 z-30 hidden lg:block shadow-sm"
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
          closeMobile={closeMobile}
          isMobile={false}
        />
      </motion.aside>
    </>
  );
}
