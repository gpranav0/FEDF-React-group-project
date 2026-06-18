import { useState, useEffect, useMemo } from 'react';
import { Plus, Target } from 'lucide-react';
import GoalStats from '../components/goals/GoalStats';
import GoalCard from '../components/goals/GoalCard';
import GoalFormModal from '../components/goals/GoalFormModal';
import GoalInsights from '../components/goals/GoalInsights';
import EmptyState from '../components/ui/EmptyState';
import { logActivity } from '../utils/activityLogger';

const DEFAULT_GOALS = [
  { id: 1, name: 'Emergency Fund', category: 'Emergency Fund', targetAmount: 10000, currentAmount: 4500, targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] },
  { id: 2, name: 'Japan Trip', category: 'Travel', targetAmount: 3500, currentAmount: 1200, targetDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0] },
  { id: 3, name: 'New Laptop', category: 'Electronics', targetAmount: 1500, currentAmount: 1500, targetDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0] },
];

export default function SavingsGoals() {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('fintrack_goals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        // use default
      }
    }
    return DEFAULT_GOALS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [isAddingFunds, setIsAddingFunds] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fintrack_goals', JSON.stringify(goals));
  }, [goals]);

  // Overall stats
  const totalGoalAmount = useMemo(() => goals.reduce((sum, g) => sum + g.targetAmount, 0), [goals]);
  const totalSaved = useMemo(() => goals.reduce((sum, g) => sum + g.currentAmount, 0), [goals]);
  const remainingAmount = Math.max(0, totalGoalAmount - totalSaved);
  const goalsCompleted = useMemo(() => goals.filter(g => g.currentAmount >= g.targetAmount).length, [goals]);

  const handleSaveGoal = (goalData) => {
    let settings = {};
    try { settings = JSON.parse(localStorage.getItem('fintrack_settings') || '{}'); } catch {}
    const currencySymbol = settings?.preferences?.currency?.match(/\((.*?)\)/)?.[1] || '$';

    if (goalData.id) {
      setGoals(goals.map(g => g.id === goalData.id ? goalData : g));
      logActivity('goal_update', 'Updated Goal', `${goalData.name} adjusted. Target: ${currencySymbol}${parseFloat(goalData.targetAmount).toLocaleString()}`);
    } else {
      const newGoal = {
        ...goalData,
        id: Date.now()
      };
      setGoals([...goals, newGoal]);
      logActivity('goal_add', 'Created Goal', `New goal: ${goalData.name} for ${currencySymbol}${parseFloat(goalData.targetAmount).toLocaleString()}`);
    }
  };

  const handleDeleteGoal = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      const goal = goals.find(g => g.id === id);
      setGoals(goals.filter(g => g.id !== id));
      if (goal) logActivity('goal_delete', 'Deleted Goal', `Removed goal: ${goal.name}`);
    }
  };

  const openAddModal = () => {
    setGoalToEdit(null);
    setIsAddingFunds(false);
    setIsModalOpen(true);
  };

  const openEditModal = (goal) => {
    setGoalToEdit(goal);
    setIsAddingFunds(false);
    setIsModalOpen(true);
  };

  const openAddFundsModal = (goal) => {
    setGoalToEdit(goal);
    setIsAddingFunds(true);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Savings Goals</h1>
          <p className="text-slate-500 mt-1">Track your progress towards your financial dreams.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Create Goal
        </button>
      </div>

      {goals.length > 0 ? (
        <>
          {/* Stats */}
          <GoalStats 
            totalGoalAmount={totalGoalAmount} 
            totalSaved={totalSaved} 
            remainingAmount={remainingAmount} 
            goalsCompleted={goalsCompleted} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area: Cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goals.map(goal => (
                  <GoalCard 
                    key={goal.id}
                    goal={goal}
                    onEdit={openEditModal}
                    onDelete={handleDeleteGoal}
                    onAddFunds={openAddFundsModal}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar / Insights */}
            <div>
              <GoalInsights goals={goals} />
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={Target}
          imageUrl="/empty_goals.png"
          title="No savings goals yet"
          description="Setting targets is the first step towards turning the invisible into the visible. Create a goal to start building your future."
          actionLabel="🎯 Create Your First Goal"
          onAction={openAddModal}
        />
      )}

      {/* Modal */}
      <GoalFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGoal}
        goalToEdit={goalToEdit}
        isAddingFunds={isAddingFunds}
      />
    </div>
  );
}
