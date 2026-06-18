import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { BudgetPlanner } from './pages/BudgetPlanner';
import { SavingsGoals } from './pages/SavingsGoals';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { ExpenseProvider } from './context/ExpenseContext';
import { BudgetProvider } from './context/BudgetContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ExpenseProvider>
      <BudgetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="budget" element={<BudgetPlanner />} />
            <Route path="savings" element={<SavingsGoals />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        </BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'glass-card text-slate-900',
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#0f172a',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </BudgetProvider>
    </ExpenseProvider>
  );
}

export default App;
