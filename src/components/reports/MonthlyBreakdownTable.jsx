import React from 'react';

export default function MonthlyBreakdownTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500">
        No monthly data available yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print:border-slate-300 print:shadow-none">
      <div className="p-6 border-b border-slate-100 print:border-slate-300">
        <h3 className="text-lg font-bold text-slate-900">Monthly Breakdown</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 print:bg-transparent print:border-slate-300">
              <th className="p-4 text-sm font-semibold text-slate-600">Month</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Income</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Expenses</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Savings</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Net Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 print:divide-slate-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{row.month}</td>
                <td className="p-4 text-right text-emerald-600 font-medium">
                  ${row.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-right text-red-600 font-medium">
                  ${row.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-right text-blue-600 font-medium">
                  ${row.savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-right font-bold text-slate-900">
                  ${row.netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
