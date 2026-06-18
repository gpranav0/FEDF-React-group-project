import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useBudgetStorage } from '../hooks/useBudgetStorage';
import { useExpenses } from './ExpenseContext';

const BudgetContext = createContext();

const budgetReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b => b.id === action.payload.id ? action.payload : b)
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload)
      };
    case 'SET_MONTH':
      return { ...state, selectedMonth: action.payload };
    case 'GENERATE_ALERTS':
      return { ...state, alerts: action.payload };
    case 'DISMISS_ALERT':
      return { ...state, alerts: state.alerts.filter(a => a.id !== action.payload) };
    case 'SET_INITIAL_BUDGETS':
      return { ...state, budgets: action.payload };
    default:
      return state;
  }
};

export function BudgetProvider({ children }) {
  const [persistedBudgets, setPersistedBudgets] = useBudgetStorage('fintrack_budgets', []);
  
  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
  
  const initialState = {
    budgets: persistedBudgets,
    alerts: [],
    selectedMonth: currentMonthStr,
  };

  const [state, dispatch] = useReducer(budgetReducer, initialState);
  const { expenses } = useExpenses();

  // Sync state to local storage when budgets change
  useEffect(() => {
    setPersistedBudgets(state.budgets);
  }, [state.budgets, setPersistedBudgets]);

  // Generate Alerts based on expenses
  const generateAlerts = useCallback(() => {
    const newAlerts = [];
    
    // Group expenses by month and category
    const expensesByMonthCat = {};
    expenses.forEach(exp => {
      const month = exp.date.slice(0, 7);
      const key = `${month}-${exp.category}`;
      expensesByMonthCat[key] = (expensesByMonthCat[key] || 0) + exp.amount;
    });

    state.budgets.forEach(budget => {
      if (budget.month !== state.selectedMonth) return;
      const key = `${budget.month}-${budget.category}`;
      const spent = expensesByMonthCat[key] || 0;
      const limit = budget.limit;
      const percent = (spent / limit) * 100;

      if (percent > 100) {
        newAlerts.push({
          id: `warn-${budget.id}`,
          type: 'Warning',
          message: `${budget.category} budget exceeded by ₹${(spent - limit).toFixed(2)}`
        });
      } else if (percent >= 90) {
        newAlerts.push({
          id: `caut-${budget.id}`,
          type: 'Caution',
          message: `${budget.category} reached ${percent.toFixed(0)}%`
        });
      }
    });

    dispatch({ type: 'GENERATE_ALERTS', payload: newAlerts });
  }, [state.budgets, state.selectedMonth, expenses]);

  useEffect(() => {
    generateAlerts();
  }, [generateAlerts]);

  const addBudget = (budget) => dispatch({ type: 'ADD_BUDGET', payload: { ...budget, id: Date.now().toString() } });
  const updateBudget = (budget) => dispatch({ type: 'UPDATE_BUDGET', payload: budget });
  const deleteBudget = (id) => dispatch({ type: 'DELETE_BUDGET', payload: id });
  const setMonth = (month) => dispatch({ type: 'SET_MONTH', payload: month });
  const dismissAlert = (id) => dispatch({ type: 'DISMISS_ALERT', payload: id });

  return (
    <BudgetContext.Provider value={{ state, addBudget, updateBudget, deleteBudget, setMonth, dismissAlert }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgets() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
}
