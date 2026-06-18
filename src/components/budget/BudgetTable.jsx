import React, { useMemo } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function BudgetTable({ budgets, expenses, onEdit, onDelete }) {
  const tableData = useMemo(() => {
    return budgets.map(budget => {
      const spent = expenses
        .filter(exp => exp.date.startsWith(budget.month) && exp.category === budget.category)
        .reduce((sum, exp) => sum + exp.amount, 0);
      
      const remaining = budget.limit - spent;
      const percentUsed = (spent / budget.limit) * 100;
      
      let status = 'On Track';
      let statusClass = 'text-emerald-600 bg-emerald-50';
      if (percentUsed > 100) {
        status = 'Exceeded';
        statusClass = 'text-rose-600 bg-rose-50';
      } else if (percentUsed >= 86) {
        status = 'Warning';
        statusClass = 'text-orange-600 bg-orange-50';
      }

      return { ...budget, spent, remaining, status, statusClass };
    });
  }, [budgets, expenses]);

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Category</Th>
          <Th>Limit</Th>
          <Th>Spent</Th>
          <Th>Remaining</Th>
          <Th>Status</Th>
          <Th className="text-right">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        <AnimatePresence>
          {tableData.map((row) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0"
            >
              <Td><Badge category={row.category}>{row.category}</Badge></Td>
              <Td className="font-medium text-slate-900">₹{row.limit.toLocaleString('en-IN')}</Td>
              <Td className="text-slate-600">₹{row.spent.toLocaleString('en-IN')}</Td>
              <Td className={`font-medium ${row.remaining < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                ₹{row.remaining.toLocaleString('en-IN')}
              </Td>
              <Td>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.statusClass}`}>
                  {row.status}
                </span>
              </Td>
              <Td className="text-right">
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => onEdit(row)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(row)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Td>
            </motion.tr>
          ))}
        </AnimatePresence>
      </Tbody>
    </Table>
  );
}
