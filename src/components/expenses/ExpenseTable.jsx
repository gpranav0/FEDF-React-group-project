import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ExpenseTable({ expenses, onEdit, onDelete }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Amount</Th>
          <Th>Category</Th>
          <Th>Date</Th>
          <Th>Payment Method</Th>
          <Th className="text-right">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        <AnimatePresence>
          {expenses.map((expense) => (
            <motion.tr
              key={expense.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0"
            >
              <Td>
                <div className="font-medium text-slate-900">{expense.title}</div>
                {expense.notes && <div className="text-xs text-slate-500 mt-0.5">{expense.notes}</div>}
              </Td>
              <Td>
                <div className="font-semibold text-slate-900">${expense.amount.toFixed(2)}</div>
              </Td>
              <Td>
                <Badge category={expense.category}>{expense.category}</Badge>
              </Td>
              <Td>
                <div className="text-slate-600">{new Date(expense.date).toLocaleDateString()}</div>
              </Td>
              <Td>
                <div className="text-slate-600">{expense.paymentMethod}</div>
              </Td>
              <Td className="text-right">
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => onEdit(expense)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(expense)}
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
