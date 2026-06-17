export default function SettingsSection({ title, description, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-blue-50 text-primary rounded-lg">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
