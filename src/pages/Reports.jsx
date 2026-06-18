import React from 'react';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { BarChart3 } from 'lucide-react';

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
        <Button>Generate Report</Button>
      </div>
      <Card>
        <EmptyState 
          icon={BarChart3}
          title="No data to generate reports"
          description="Add more transactions to view detailed analytics and reports of your finances."
        />
      </Card>
    </div>
  );
}
