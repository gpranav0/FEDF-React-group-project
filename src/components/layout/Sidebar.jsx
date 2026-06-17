import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Target, 
  FileText, 
  LineChart, 
  Settings,
  ChevronLeft
} from 'lucide-react';

const menuItems = [
  { path: '/', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/expenses', name: 'Expenses', icon: Receipt },
  { path: '/budgets', name: 'Budgets', icon: PieChart },
  { path: '/goals', name: 'Savings Goals', icon: Target },
  { path: '/reports', name: 'Reports', icon: FileText },
  { path: '/analytics', name: 'Analytics', icon: LineChart },
  { path: '/settings', name: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 z-40 transition-all duration-300 ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'} flex flex-col`}>
        <div className="p-4 flex justify-end lg:hidden border-b border-slate-100">
          <button onClick={toggleSidebar} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                ${isActive ? 'bg-blue-50 text-primary font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
              title={!isOpen ? item.name : undefined}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isOpen ? '' : 'lg:mx-auto'}`} />
              <span className={`whitespace-nowrap transition-opacity duration-200 ${!isOpen ? 'lg:opacity-0 lg:w-0 lg:hidden' : 'opacity-100'}`}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
}
