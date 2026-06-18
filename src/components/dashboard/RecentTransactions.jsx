import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Coffee, Car, Home, Smartphone, Zap, Monitor, Heart, GraduationCap, DollarSign, HelpCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_STYLES = {
  Food: { icon: Coffee, color: 'text-amber-500', bg: 'bg-amber-100/50 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800/50' },
  Shopping: { icon: ShoppingBag, color: 'text-pink-500', bg: 'bg-pink-100/50 dark:bg-pink-900/30', border: 'border-pink-200 dark:border-pink-800/50' },
  Housing: { icon: Home, color: 'text-indigo-500', bg: 'bg-indigo-100/50 dark:bg-indigo-900/30', border: 'border-indigo-200 dark:border-indigo-800/50' },
  Transport: { icon: Car, color: 'text-orange-500', bg: 'bg-orange-100/50 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800/50' },
  Electronics: { icon: Smartphone, color: 'text-blue-500', bg: 'bg-blue-100/50 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800/50' },
  Utilities: { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100/50 dark:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-800/50' },
  Entertainment: { icon: Monitor, color: 'text-purple-500', bg: 'bg-purple-100/50 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800/50' },
  Healthcare: { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-100/50 dark:bg-rose-900/30', border: 'border-rose-200 dark:border-rose-800/50' },
  Education: { icon: GraduationCap, color: 'text-emerald-500', bg: 'bg-emerald-100/50 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800/50' },
  Salary: { icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-100/50 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800/50' },
  Other: { icon: HelpCircle, color: 'text-slate-500', bg: 'bg-slate-100/50 dark:bg-slate-800/50', border: 'border-slate-200 dark:border-slate-700/50' },
};

function getRelativeTimeString(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  // Strip time for day comparison
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  useEffect(() => {
    try {
      const expenses = JSON.parse(localStorage.getItem('fintrack_expenses') || '[]');
      const settings = JSON.parse(localStorage.getItem('fintrack_settings') || '{}');

      const symbol = settings?.preferences?.currency?.match(/\((.*?)\)/)?.[1] || '$';
      setCurrencySymbol(symbol);

      // Convert expenses to transaction format
      let formattedTxs = expenses.map(exp => ({
        ...exp,
        type: 'expense'
      }));

      // Inject a mock income transaction based on MOCK_MONTHLY_INCOME to make it realistic
      // (Since the app doesn't formally track income items yet)
      const mockIncomeDate = new Date();
      mockIncomeDate.setDate(1); // 1st of current month

      if (formattedTxs.length > 0) {
        formattedTxs.push({
          id: 'mock-income',
          name: 'Monthly Salary',
          category: 'Salary',
          amount: 8250,
          date: mockIncomeDate.toISOString(),
          type: 'income'
        });
      }

      // Sort by date descending
      formattedTxs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(formattedTxs);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your latest financial activity</p>
        </div>
        <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors">
          View All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
        {transactions.length === 0 ? (
          <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, i) => {
              const style = CATEGORY_STYLES[tx.category] || CATEGORY_STYLES.Other;
              const isIncome = tx.type === 'income';
              const formattedAmount = `${isIncome ? '+' : '-'}${currencySymbol}${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
              const relativeTime = getRelativeTimeString(tx.date);

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className={`relative p-3 rounded-xl border ${style.border} ${style.bg} ${style.color} shadow-sm group-hover:scale-105 transition-transform`}>
                      <style.icon className="w-5 h-5" />
                      {/* Income/Expense micro-indicator */}
                      <div className={`absolute -right-1 -bottom-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${isIncome ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {isIncome ? <ArrowUpRight className="w-2.5 h-2.5 text-white" /> : <ArrowDownLeft className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tx.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{relativeTime}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{tx.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-base ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {formattedAmount}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
