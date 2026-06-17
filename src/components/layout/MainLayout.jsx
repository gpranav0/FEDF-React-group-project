import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import FloatingActionButton from '../ui/fab/FloatingActionButton';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <Navbar toggleSidebar={() => setIsSidebarOpen(true)} />
      
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
      
      <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
        <div className="p-8">
          <Outlet />
        </div>
      </main>

      {/* Global Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
