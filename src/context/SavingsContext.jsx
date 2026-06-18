import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSavingsStorage } from '../hooks/useSavingsStorage';

const SavingsContext = createContext();

const savingsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
      
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => g.id === action.payload.id ? action.payload : g)
      };
      
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(g => g.id !== action.payload)
      };
      
    case 'ADD_CONTRIBUTION': {
      const { goalId, amount, date } = action.payload;
      return {
        ...state,
        goals: state.goals.map(g => {
          if (g.id === goalId) {
            const newSaved = g.saved + amount;
            const newHistory = [...g.history, { amount, date }];
            return { ...g, saved: newSaved, history: newHistory };
          }
          return g;
        })
      };
    }
      
    case 'MARK_COMPLETE':
      return {
        ...state,
        goals: state.goals.map(g => g.id === action.payload ? { ...g, saved: g.target } : g)
      };
      
    case 'SET_SELECTED_GOAL':
      return { ...state, selectedGoal: action.payload };
      
    case 'ADD_ACHIEVEMENT':
      return { ...state, achievements: [...state.achievements, action.payload] };

    case 'DISMISS_ACHIEVEMENT':
      return { ...state, achievements: state.achievements.filter(a => a.id !== action.payload) };

    default:
      return state;
  }
};

export function SavingsProvider({ children }) {
  const [persistedGoals, setPersistedGoals] = useSavingsStorage('fintrack_savings_goals', []);
  const [persistedAchievements, setPersistedAchievements] = useSavingsStorage('fintrack_savings_achievements', []);

  const initialState = {
    goals: persistedGoals,
    selectedGoal: null,
    achievements: persistedAchievements,
  };

  const [state, dispatch] = useReducer(savingsReducer, initialState);

  // Sync to local storage
  useEffect(() => {
    setPersistedGoals(state.goals);
  }, [state.goals, setPersistedGoals]);

  useEffect(() => {
    setPersistedAchievements(state.achievements);
  }, [state.achievements, setPersistedAchievements]);

  const addGoal = (goal) => dispatch({ type: 'ADD_GOAL', payload: { ...goal, id: Date.now().toString(), history: [] } });
  const updateGoal = (goal) => dispatch({ type: 'UPDATE_GOAL', payload: goal });
  const deleteGoal = (id) => dispatch({ type: 'DELETE_GOAL', payload: id });
  const addContribution = (goalId, amount) => dispatch({ type: 'ADD_CONTRIBUTION', payload: { goalId, amount, date: new Date().toISOString() } });
  const markComplete = (id) => dispatch({ type: 'MARK_COMPLETE', payload: id });
  const setSelectedGoal = (id) => dispatch({ type: 'SET_SELECTED_GOAL', payload: id });
  const addAchievement = (achievement) => dispatch({ type: 'ADD_ACHIEVEMENT', payload: { ...achievement, id: Date.now().toString() } });
  const dismissAchievement = (id) => dispatch({ type: 'DISMISS_ACHIEVEMENT', payload: id });

  return (
    <SavingsContext.Provider value={{ 
      state, 
      addGoal, 
      updateGoal, 
      deleteGoal, 
      addContribution, 
      markComplete, 
      setSelectedGoal,
      addAchievement,
      dismissAchievement
    }}>
      {children}
    </SavingsContext.Provider>
  );
}

export function useSavings() {
  const context = useContext(SavingsContext);
  if (!context) {
    throw new Error('useSavings must be used within a SavingsProvider');
  }
  return context;
}
