import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '../ui/Table';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SavingsTable({ goals, onEdit, onDelete, onAddContribution }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Goal</Th>
          <Th>Progress</Th>
          <Th>Target</Th>
          <Th>Deadline</Th>
          <Th className="text-right">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        <AnimatePresence>
          {goals.map((goal) => {
            const percent = (goal.saved / goal.target) * 100;
            return (
              <motion.tr
                key={goal.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0"
              >
                <Td>
                  <div className="font-medium text-slate-900">{goal.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{goal.priority} Priority</div>
                </Td>
                <Td>
                  <div className="w-32 flex items-center gap-2">
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${Math.min(percent, 100)}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{percent.toFixed(0)}%</span>
                  </div>
                </Td>
                <Td className="font-medium text-slate-900">₹{goal.target.toLocaleString('en-IN')}</Td>
                <Td className="text-slate-600">{new Date(goal.deadline).toLocaleDateString()}</Td>
                <Td className="text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => onAddContribution(goal)}
                      disabled={percent >= 100}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Add Contribution"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(goal)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(goal)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Td>
              </motion.tr>
            );
          })}
        </AnimatePresence>
      </Tbody>
    </Table>
  );
}
