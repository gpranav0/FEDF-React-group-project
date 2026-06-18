import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import FloatingActionButton from '../ui/fab/FloatingActionButton';
import CommandPalette from '../ui/CommandPalette';

export default function MainLayout() {
  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Desktop collapse state — persist user preference
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('fintrack_sidebar_collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('fintrack_sidebar_collapsed', isCollapsed);
  }, [isCollapsed]);

  const toggleCollapse = () => setIsCollapsed(prev => !prev);
  const openMobile = () => setIsMobileOpen(true);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 relative bg-blobs overflow-x-hidden">
      <Navbar toggleSidebar={openMobile} />
      
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleCollapse={toggleCollapse}
        isMobileOpen={isMobileOpen}
        closeMobile={closeMobile}
      />
      
      <main className={`pt-16 transition-all duration-300 ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Global Floating Action Button */}
      <FloatingActionButton />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />
    </div>
  );
}
