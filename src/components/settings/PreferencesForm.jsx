import { useState } from 'react';

const CURRENCIES = ['USD ($)', 'EUR (€)', 'GBP (£)', 'INR (₹)', 'JPY (¥)', 'CAD (C$)', 'AUD (A$)'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function PreferencesForm({ preferences, onSave, onToast }) {
  const [form, setForm] = useState({ ...preferences });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onToast('Preferences updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Default Currency</label>
        <select
          value={form.currency}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
        >
          {CURRENCIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Income Goal</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
          <input
            type="number"
            min="0"
            step="100"
            value={form.incomeGoal}
            onChange={(e) => setForm({ ...form, incomeGoal: e.target.value })}
            className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="8250"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Financial Year Start Month</label>
        <select
          value={form.fyStartMonth}
          onChange={(e) => setForm({ ...form, fyStartMonth: e.target.value })}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
        >
          {MONTHS.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
        >
          Save Preferences
        </button>
      </div>
    </form>
  );
}
