import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ReportFilters } from '../components/filters/ReportFilters';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { DataTable } from '../components/ui/DataTable';
import { InsightsPanel } from '../components/analytics/InsightsPanel';
import { CategoryRadarChart } from '../components/charts/CategoryRadarChart';
import { CashFlowComposedChart } from '../components/charts/CashFlowComposedChart';
import { useExpenses } from '../context/ExpenseContext';
import { useBudgets } from '../context/BudgetContext';
import { useSavings } from '../context/SavingsContext';
import { reportApi } from '../services/reportApi';
import { exportPdf } from '../services/exportPdf';
import { exportExcel } from '../services/exportExcel';
import { exportCsv } from '../services/exportCsv';
import { Download, FileText, Table as TableIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const MemoCategoryRadarChart = React.memo(CategoryRadarChart);
const MemoCashFlowComposedChart = React.memo(CashFlowComposedChart);
const MemoDataTable = React.memo(DataTable);

export function Reports() {
  const { expenses } = useExpenses();
  const { state: budgetState } = useBudgets();
  const { state: savingsState } = useSavings();

  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7),
    category: 'All',
    paymentMethod: 'All',
    dateRange: 'This Month'
  });

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await reportApi.fetchDashboardData(
        expenses, 
        budgetState.budgets, 
        savingsState.goals, 
        filters
      );
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [expenses, budgetState.budgets, savingsState.goals, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      month: new Date().toISOString().slice(0, 7),
      category: 'All',
      paymentMethod: 'All',
      dateRange: 'This Month'
    });
  };

  const handleExport = (format) => {
    if (!data?.filteredExpenses || data.filteredExpenses.length === 0) {
      toast.error('No data to export for this period.');
      return;
    }

    const exportData = data.filteredExpenses.map(e => ({
      Date: new Date(e.date).toLocaleDateString(),
      Title: e.title,
      Category: e.category,
      'Payment Method': e.paymentMethod,
      Amount: `₹${e.amount}`
    }));

    const filename = `Financial_Report_${filters.month}`;

    if (format === 'pdf') {
      exportPdf(exportData, filename, `Expense Report - ${filters.month}`);
    } else if (format === 'excel') {
      exportExcel(exportData, filename);
    } else if (format === 'csv') {
      exportCsv(exportData, filename);
    }
    
    toast.success(`${format.toUpperCase()} export generated successfully!`);
  };

  const tableColumns = useMemo(() => [
    { key: 'date', label: 'Date', render: (row) => new Date(row.date).toLocaleDateString() },
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'amount', label: 'Amount', render: (row) => `₹${row.amount.toLocaleString('en-IN')}` }
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => handleExport('pdf')} title="Export PDF">
            <FileText className="w-4 h-4 mr-2" /> PDF
          </Button>
          <Button variant="secondary" onClick={() => handleExport('excel')} title="Export Excel">
            <TableIcon className="w-4 h-4 mr-2" /> Excel
          </Button>
          <Button variant="secondary" onClick={() => handleExport('csv')} title="Export CSV">
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
        </div>
      </div>

      <ReportFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onClearFilters={handleClearFilters} 
      />

      {error ? (
        <Card className="text-center py-10">
          <p className="text-rose-500 mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </Card>
      ) : loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <LoadingSkeleton key={i} className="h-24 w-full" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LoadingSkeleton className="h-64 lg:col-span-1" />
            <LoadingSkeleton className="h-64 lg:col-span-2" />
          </div>
          <LoadingSkeleton className="h-96 w-full" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <p className="text-sm font-medium text-slate-500">Total Income</p>
              <p className="text-2xl font-bold text-slate-900">₹{data.summary.totalIncome.toLocaleString('en-IN')}</p>
            </Card>
            <Card>
              <p className="text-sm font-medium text-slate-500">Total Expenses</p>
              <p className="text-2xl font-bold text-rose-600">₹{data.summary.totalExpenses.toLocaleString('en-IN')}</p>
            </Card>
            <Card>
              <p className="text-sm font-medium text-slate-500">Remaining Balance</p>
              <p className={`text-2xl font-bold ${data.summary.remainingBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ₹{data.summary.remainingBalance.toLocaleString('en-IN')}
              </p>
            </Card>
            <Card>
              <p className="text-sm font-medium text-slate-500">Budget Usage</p>
              <p className="text-2xl font-bold text-slate-900">{data.summary.budgetUsagePercent.toFixed(1)}%</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <InsightsPanel insights={data.insights} />
              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Category Radar</h3>
                <div className="h-64">
                  <MemoCategoryRadarChart data={data.categoryAnalysis} />
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Daily Cash Flow</h3>
                <div className="h-72">
                  <MemoCashFlowComposedChart expenses={expenses} activeMonth={data.summary.activeMonth} />
                </div>
              </Card>
            </div>
          </div>

          <Card className="p-0 overflow-hidden border-0 bg-transparent shadow-none">
             <h3 className="text-lg font-semibold text-slate-900 mb-4 px-1">Transaction History</h3>
             <MemoDataTable data={data.filteredExpenses} columns={tableColumns} />
          </Card>
        </div>
      ) : null}
    </div>
  );
}
