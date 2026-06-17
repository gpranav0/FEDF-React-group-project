const GOALS = [
  { id: 1, name: 'Emergency Fund', saved: 8500, target: 10000, color: 'bg-emerald-500' },
  { id: 2, name: 'New Car Down Payment', saved: 4200, target: 15000, color: 'bg-blue-500' },
  { id: 3, name: 'Vacation to Japan', saved: 2100, target: 5000, color: 'bg-purple-500' },
];

export default function SavingsProgressCard() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Savings Goals</h3>
        <button className="text-sm font-medium text-primary hover:text-blue-700 transition-colors">Manage</button>
      </div>
      
      <div className="space-y-6">
        {GOALS.map((goal) => {
          const progress = Math.round((goal.saved / goal.target) * 100);
          return (
            <div key={goal.id}>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="font-semibold text-slate-900">{goal.name}</p>
                  <p className="text-sm text-slate-500">${goal.saved.toLocaleString()} / ${goal.target.toLocaleString()}</p>
                </div>
                <span className="text-sm font-bold text-slate-700">{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${goal.color} transition-all duration-1000 ease-out`} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
