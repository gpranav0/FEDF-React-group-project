import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

export default function SecurityForm({ security, onSave, onToast }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFactor, setTwoFactor] = useState(security.twoFactor || false);
  const [passwords, setPasswords] = useState({ current: '', newPassword: '', confirm: '' });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      onToast('Passwords do not match!', 'error');
      return;
    }
    if (passwords.newPassword.length < 8) {
      onToast('Password must be at least 8 characters!', 'error');
      return;
    }
    onSave({ ...security, twoFactor });
    setPasswords({ current: '', newPassword: '', confirm: '' });
    onToast('Password updated successfully!');
  };

  const handleTwoFactorToggle = (val) => {
    setTwoFactor(val);
    onSave({ ...security, twoFactor: val });
    onToast(val ? 'Two-Factor Authentication enabled!' : 'Two-Factor Authentication disabled.');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <h4 className="text-sm font-semibold text-slate-700">Change Password</h4>

        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
          <input
            type={showCurrent ? 'text' : 'password'}
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className="w-full px-4 py-2 pr-10 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="••••••••"
          />
          <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-9 text-slate-400 hover:text-slate-600">
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input
              type={showNew ? 'text' : 'password'}
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full px-4 py-2 pr-10 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-9 text-slate-400 hover:text-slate-600">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full px-4 py-2 pr-10 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-9 text-slate-400 hover:text-slate-600">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm">
            Update Password
          </button>
        </div>
      </form>

      <div className="border-t border-slate-100 pt-4">
        <ToggleSwitch
          enabled={twoFactor}
          onChange={handleTwoFactorToggle}
          label="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
        />
      </div>
    </div>
  );
}
