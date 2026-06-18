import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ExpenseProvider } from './context/ExpenseContext';
import { BudgetProvider } from './context/BudgetContext';
import { SavingsProvider } from './context/SavingsContext';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './monitoring/ErrorBoundary';
import { LoadingSkeleton } from './components/ui/LoadingSkeleton';

const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Expenses = lazy(() => import('./pages/Expenses').then(m => ({ default: m.Expenses })));
const BudgetPlanner = lazy(() => import('./pages/BudgetPlanner').then(m => ({ default: m.BudgetPlanner })));
const SavingsGoals = lazy(() => import('./pages/SavingsGoals').then(m => ({ default: m.SavingsGoals })));
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));

const PageLoader = () => (
  <div className="p-6 space-y-4 w-full h-full flex flex-col">
    <LoadingSkeleton className="h-10 w-1/4 mb-4" />
    <LoadingSkeleton className="h-64 w-full flex-1" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ExpenseProvider>
        <BudgetProvider>
          <SavingsProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
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
              </Suspense>
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
          </SavingsProvider>
        </BudgetProvider>
      </ExpenseProvider>
    </ErrorBoundary>
  );
}

export default App;
