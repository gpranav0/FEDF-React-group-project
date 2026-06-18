export const transactions = [
  { id: 1, date: '2026-06-18', description: 'Grocery Store', amount: -120.50, category: 'Food' },
  { id: 2, date: '2026-06-17', description: 'Salary', amount: 4500.00, category: 'Income' },
  { id: 3, date: '2026-06-16', description: 'Electric Bill', amount: -95.20, category: 'Utilities' },
  { id: 4, date: '2026-06-15', description: 'Internet', amount: -60.00, category: 'Utilities' },
  { id: 5, date: '2026-06-14', description: 'Restaurant', amount: -45.00, category: 'Food' },
];

export const summaryData = {
  totalIncome: 4500.00,
  totalExpenses: 320.70,
  savings: 1200.00,
  balance: 4179.30
};

export const savingsGoals = [
  { id: 1, name: 'Emergency Fund', target: 10000, current: 4500 },
  { id: 2, name: 'Vacation', target: 2000, current: 800 },
  { id: 3, name: 'New Laptop', target: 1500, current: 1500 },
];

export const expensesByCategory = [
  { name: 'Food', value: 400 },
  { name: 'Utilities', value: 300 },
  { name: 'Entertainment', value: 200 },
  { name: 'Transport', value: 150 },
];
