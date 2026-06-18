import React from 'react';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Target } from 'lucide-react';

export function SavingsGoals() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Savings Goals</h2>
        <Button>New Goal</Button>
      </div>
      <Card>
        <EmptyState 
          icon={Target}
          title="No goals found"
          description="Set a savings goal to start tracking your progress towards your financial targets."
        />
      </Card>
    </div>
  );
}
