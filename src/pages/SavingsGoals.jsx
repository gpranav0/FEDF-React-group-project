import React, { useState, useCallback } from 'react';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Target } from 'lucide-react';
import { useSavings } from '../context/SavingsContext';
import { SavingsMetrics } from '../components/savings/SavingsMetrics';
import { SavingsCards } from '../components/savings/SavingsCards';
import { SavingsTable } from '../components/savings/SavingsTable';
import { SavingsGoalForm } from '../components/savings/SavingsGoalForm';
import { ContributionModal } from '../components/savings/ContributionModal';
import { MilestoneTracker } from '../components/savings/MilestoneTracker';
import { GoalProgressChart } from '../components/charts/GoalProgressChart';
import { ContributionTrendChart } from '../components/charts/ContributionTrendChart';
import { GoalComparisonChart } from '../components/charts/GoalComparisonChart';
import toast from 'react-hot-toast';

const MemoSavingsCards = React.memo(SavingsCards);
const MemoSavingsTable = React.memo(SavingsTable);
const MemoGoalProgressChart = React.memo(GoalProgressChart);
const MemoContributionTrendChart = React.memo(ContributionTrendChart);
const MemoGoalComparisonChart = React.memo(GoalComparisonChart);

export function SavingsGoals() {
  const { state, addGoal, updateGoal, deleteGoal } = useSavings();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [goalToContribute, setGoalToContribute] = useState(null);

  const handleOpenAdd = useCallback(() => {
    setGoalToEdit(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((goal) => {
    setGoalToEdit(goal);
    setIsFormOpen(true);
  }, []);

  const handleSubmit = useCallback((goalData) => {
    if (goalToEdit) {
      updateGoal(goalData);
      toast.success('Goal updated successfully!');
    } else {
      addGoal(goalData);
      toast.success('Goal created successfully!');
    }
    setIsFormOpen(false);
  }, [goalToEdit, updateGoal, addGoal]);

  const confirmDelete = useCallback(() => {
    if (goalToDelete) {
      deleteGoal(goalToDelete.id);
      toast.success('Goal deleted successfully!');
      setGoalToDelete(null);
    }
  }, [goalToDelete, deleteGoal]);

  return (
    <div className="space-y-6 relative">
      <MilestoneTracker />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Savings Goals</h2>
        <Button onClick={handleOpenAdd}>Create Goal</Button>
      </div>

      <SavingsMetrics />

      {state.goals.length > 0 ? (
        <>
          <MemoSavingsCards 
            goals={state.goals} 
            onAddContribution={setGoalToContribute} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Goal Progress</h3>
              <div className="h-64">
                <MemoGoalProgressChart goals={state.goals} />
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Contribution Trend</h3>
              <div className="h-64">
                <MemoContributionTrendChart goals={state.goals} />
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Target vs Saved</h3>
            <div className="h-72">
              <MemoGoalComparisonChart goals={state.goals} />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden border-0 bg-transparent shadow-none">
            <MemoSavingsTable 
              goals={state.goals} 
              onEdit={handleOpenEdit} 
              onDelete={setGoalToDelete}
              onAddContribution={setGoalToContribute}
            />
          </Card>
        </>
      ) : (
        <Card>
          <EmptyState 
            icon={Target}
            title="No savings goals found"
            description="You haven't set up any savings goals yet. Start tracking your big purchases today!"
            action={<Button onClick={handleOpenAdd}>Create Your First Goal</Button>}
          />
        </Card>
      )}

      {/* Form Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={goalToEdit ? "Edit Goal" : "Create Goal"}
      >
        <SavingsGoalForm 
          initialData={goalToEdit} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </Modal>

      {/* Contribution Modal */}
      <Modal
        isOpen={!!goalToContribute}
        onClose={() => setGoalToContribute(null)}
        title="Add Contribution"
      >
        {goalToContribute && (
          <ContributionModal 
            goal={goalToContribute} 
            onClose={() => setGoalToContribute(null)} 
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!goalToDelete} 
        onClose={() => setGoalToDelete(null)} 
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete the goal "{goalToDelete?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setGoalToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
