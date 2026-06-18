# System Architecture

## State Management
The application strictly utilizes the **Context API** paired with the `useReducer` hook to enforce predictable, immutable state transitions.
- `ExpenseContext`: Manages raw transactional data.
- `BudgetContext`: Listens to Expense data to derive and dispatch automatic Warning/Caution alerts.
- `SavingsContext`: Logs independent goal progress and tracks contribution histories for trend mapping.

All Context states are bound to local storage using custom hooks (`useLocalStorage`, `useBudgetStorage`, `useSavingsStorage`) ensuring persistent sessions without a database.

## Service Abstraction
Business logic is intentionally decoupled from React components.
- `reportService.js`: Pure functions responsible for slicing data, calculating metrics, and identifying trend anomalies.
- `reportApi.js`: Simulates a network layer by wrapping the pure service calculations in asynchronous Promises. This forces the UI to respect Loading states and prevents race conditions.

## Performance Engineering
- **Code Splitting**: Major route components (`Dashboard`, `Reports`, etc.) are lazily loaded via `React.lazy()` and `Suspense`, vastly reducing the initial JavaScript payload.
- **Memoization**: Heavy visual components (like Recharts visualizations and DataTables) are wrapped in `React.memo`, preventing cascading re-renders when higher-level filter states change.
- **Web Vitals**: A dedicated `metrics.js` module tracks Core Web Vitals (LCP, FCP, CLS) in the production environment.
