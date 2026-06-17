export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100 text-center px-6 animate-fade-in ${className}`}>
      <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mb-6 animate-float">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-sm mb-8 text-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium btn-press"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
