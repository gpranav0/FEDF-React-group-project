import { useNavigate } from 'react-router-dom';
import { Plus, PieChart, Target, FileText } from 'lucide-react';

const actions = [
  {
    label: 'Add Expense',
    description: 'Log a new expense',
    icon: Plus,
    path: '/expenses',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    hoverBg: 'hover:bg-blue-100',
    borderColor: 'hover:border-blue-200',
  },
  {
    label: 'Create Budget',
    description: 'Set spending limits',
    icon: PieChart,
    path: '/budgets',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    hoverBg: 'hover:bg-emerald-100',
    borderColor: 'hover:border-emerald-200',
  },
  {
    label: 'Add Goal',
    description: 'New savings target',
    icon: Target,
    path: '/goals',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    hoverBg: 'hover:bg-purple-100',
    borderColor: 'hover:border-purple-200',
  },
  {
    label: 'View Reports',
    description: 'Financial summaries',
    icon: FileText,
    path: '/reports',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    hoverBg: 'hover:bg-orange-100',
    borderColor: 'hover:border-orange-200',
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <button
          key={action.label}
          onClick={() => navigate(action.path)}
          className={`flex flex-col items-center gap-2.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm card-hover btn-press transition-all group animate-fade-in animate-stagger-${index + 1} ${action.borderColor}`}
        >
          <div className={`p-3 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
            <action.icon className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">{action.label}</p>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{action.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
