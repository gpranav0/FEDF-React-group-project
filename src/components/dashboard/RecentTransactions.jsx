import { ShoppingBag, Coffee, Car, Home, Smartphone } from 'lucide-react';

const TRANSACTIONS = [
  { id: 1, name: 'Apple Store', category: 'Electronics', amount: '-$999.00', date: 'Today, 2:45 PM', icon: Smartphone, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 2, name: 'Whole Foods', category: 'Groceries', amount: '-$124.50', date: 'Yesterday, 10:20 AM', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 3, name: 'Uber', category: 'Transport', amount: '-$24.20', date: 'Jun 11, 8:15 PM', icon: Car, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 4, name: 'Starbucks', category: 'Dining', amount: '-$5.50', date: 'Jun 11, 8:00 AM', icon: Coffee, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 5, name: 'Rent Payment', category: 'Housing', amount: '-$1,800.00', date: 'Jun 1, 9:00 AM', icon: Home, color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function RecentTransactions() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full card-hover">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
        <button className="text-sm font-medium text-primary hover:text-blue-700 transition-colors">View All</button>
      </div>
      <div className="space-y-4">
        {TRANSACTIONS.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 -mx-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${tx.bg} ${tx.color}`}>
                <tx.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{tx.name}</p>
                <p className="text-xs text-slate-500">{tx.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">{tx.amount}</p>
              <p className="text-xs text-slate-500">{tx.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
