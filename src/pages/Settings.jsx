import { useState, useEffect } from 'react';
import { User, Palette, Bell, Database, Shield, Settings2, Download, Upload, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';
import SettingsSection from '../components/settings/SettingsSection';
import ToggleSwitch from '../components/settings/ToggleSwitch';
import ProfileForm from '../components/settings/ProfileForm';
import PreferencesForm from '../components/settings/PreferencesForm';
import SecurityForm from '../components/settings/SecurityForm';

const DEFAULT_SETTINGS = {
  profile: {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    avatar: ''
  },
  preferences: {
    currency: 'USD ($)',
    incomeGoal: '8250',
    fyStartMonth: 'January'
  },
  appearance: {
    darkMode: false,
    compactMode: false
  },
  notifications: {
    budgetAlerts: true,
    expenseReminders: true,
    savingsReminders: false,
    monthlyReport: true
  },
  security: {
    twoFactor: false
  }
};

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('fintrack_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [toast, setToast] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('fintrack_settings', JSON.stringify(settings));
  }, [settings]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Appearance handlers
  const handleAppearanceChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, [key]: value }
    }));
    showToast(`${key === 'darkMode' ? 'Theme' : 'Compact mode'} updated!`);
  };

  // Notification handlers
  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
    showToast('Notification preference saved!');
  };

  // Data management
  const handleExportAll = () => {
    const allData = {
      settings: settings,
      expenses: JSON.parse(localStorage.getItem('fintrack_expenses') || '[]'),
      budgets: JSON.parse(localStorage.getItem('fintrack_budgets') || '[]'),
      goals: JSON.parse(localStorage.getItem('fintrack_goals') || '[]'),
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fintrack_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('All data exported successfully!');
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.expenses) localStorage.setItem('fintrack_expenses', JSON.stringify(data.expenses));
        if (data.budgets) localStorage.setItem('fintrack_budgets', JSON.stringify(data.budgets));
        if (data.goals) localStorage.setItem('fintrack_goals', JSON.stringify(data.goals));
        if (data.settings) {
          setSettings(data.settings);
        }
        showToast('Data imported successfully! Refresh to see changes.');
      } catch (err) {
        showToast('Invalid file format!', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    localStorage.removeItem('fintrack_expenses');
    localStorage.removeItem('fintrack_budgets');
    localStorage.removeItem('fintrack_goals');
    localStorage.removeItem('fintrack_settings');
    setSettings(DEFAULT_SETTINGS);
    setShowClearConfirm(false);
    showToast('All data has been cleared.');
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account, preferences, and application settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Profile */}
          <SettingsSection title="Profile Settings" description="Manage your personal information" icon={User}>
            <ProfileForm
              profile={settings.profile}
              onSave={(profile) => setSettings(prev => ({ ...prev, profile }))}
              onToast={showToast}
            />
          </SettingsSection>

          {/* 2. Financial Preferences */}
          <SettingsSection title="Financial Preferences" description="Configure your financial defaults" icon={Settings2}>
            <PreferencesForm
              preferences={settings.preferences}
              onSave={(preferences) => setSettings(prev => ({ ...prev, preferences }))}
              onToast={showToast}
            />
          </SettingsSection>

          {/* 6. Security */}
          <SettingsSection title="Security" description="Manage your password and authentication" icon={Shield}>
            <SecurityForm
              security={settings.security}
              onSave={(security) => setSettings(prev => ({ ...prev, security }))}
              onToast={showToast}
            />
          </SettingsSection>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* 3. Appearance */}
          <SettingsSection title="Appearance" description="Customize the look and feel" icon={Palette}>
            <div className="divide-y divide-slate-100">
              <ToggleSwitch
                enabled={settings.appearance.darkMode}
                onChange={(val) => handleAppearanceChange('darkMode', val)}
                label="Dark Mode"
                description="Switch to a dark color scheme"
              />
              <ToggleSwitch
                enabled={settings.appearance.compactMode}
                onChange={(val) => handleAppearanceChange('compactMode', val)}
                label="Compact Mode"
                description="Reduce spacing for denser layouts"
              />
            </div>
          </SettingsSection>

          {/* 4. Notifications */}
          <SettingsSection title="Notifications" description="Choose what alerts you receive" icon={Bell}>
            <div className="divide-y divide-slate-100">
              <ToggleSwitch
                enabled={settings.notifications.budgetAlerts}
                onChange={(val) => handleNotificationChange('budgetAlerts', val)}
                label="Budget Alerts"
                description="Get notified when nearing budget limits"
              />
              <ToggleSwitch
                enabled={settings.notifications.expenseReminders}
                onChange={(val) => handleNotificationChange('expenseReminders', val)}
                label="Expense Reminders"
                description="Daily reminders to log expenses"
              />
              <ToggleSwitch
                enabled={settings.notifications.savingsReminders}
                onChange={(val) => handleNotificationChange('savingsReminders', val)}
                label="Savings Goal Reminders"
                description="Weekly updates on savings progress"
              />
              <ToggleSwitch
                enabled={settings.notifications.monthlyReport}
                onChange={(val) => handleNotificationChange('monthlyReport', val)}
                label="Monthly Reports"
                description="Receive monthly financial summaries"
              />
            </div>
          </SettingsSection>

          {/* 5. Data Management */}
          <SettingsSection title="Data Management" description="Export, import, or clear your data" icon={Database}>
            <div className="space-y-3">
              <button
                onClick={handleExportAll}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                <Download className="w-4 h-4" /> Export All Data
              </button>

              <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium text-sm cursor-pointer">
                <Upload className="w-4 h-4" /> Import Data
                <input type="file" accept=".json" className="hidden" onChange={handleImportData} />
              </label>

              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium text-sm"
              >
                <Trash2 className="w-4 h-4" /> Clear All Data
              </button>
            </div>
          </SettingsSection>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Clear All Data?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                This will permanently delete all your expenses, budgets, savings goals, and settings. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Everything
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all animate-slide-up ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'
        }`}>
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          )}
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
