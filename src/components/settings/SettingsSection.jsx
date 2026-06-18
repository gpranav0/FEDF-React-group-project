export default function SettingsSection({ title, description, icon: Icon, children }) {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-400 rounded-lg">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
