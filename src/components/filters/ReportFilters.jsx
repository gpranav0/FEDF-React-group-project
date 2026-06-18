import React from 'react';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export function ReportFilters({ filters, onFilterChange, onClearFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="glass-card p-4 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>Clear All</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
          <input 
            type="month"
            name="month"
            value={filters.month}
            onChange={handleChange}
            className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
        </div>
        <Select
          label="Category"
          name="category"
          value={filters.category}
          onChange={handleChange}
          options={[
            { value: 'All', label: 'All Categories' },
            { value: 'Food', label: 'Food' },
            { value: 'Transport', label: 'Transport' },
            { value: 'Shopping', label: 'Shopping' },
            { value: 'Bills', label: 'Bills' },
            { value: 'Entertainment', label: 'Entertainment' },
          ]}
        />
        <Select
          label="Payment Method"
          name="paymentMethod"
          value={filters.paymentMethod}
          onChange={handleChange}
          options={[
            { value: 'All', label: 'All Methods' },
            { value: 'Cash', label: 'Cash' },
            { value: 'Credit Card', label: 'Credit Card' },
            { value: 'Debit Card', label: 'Debit Card' },
            { value: 'UPI', label: 'UPI' },
          ]}
        />
        <Select
          label="Date Range Preset"
          name="dateRange"
          value={filters.dateRange}
          onChange={handleChange}
          options={[
            { value: 'This Month', label: 'This Month' },
            { value: 'Last Month', label: 'Last Month' },
            { value: 'This Year', label: 'This Year' },
            { value: 'All Time', label: 'All Time' },
          ]}
        />
      </div>
    </div>
  );
}
