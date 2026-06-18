export default function EmptyState({ icon: Icon, imageUrl, title, description, actionLabel, onAction, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 glass-panel rounded-2xl text-center px-6 animate-fade-in ${className}`}>
      {imageUrl ? (
        <div className="w-32 h-32 mb-6 animate-float">
          <img src={imageUrl} alt={title} className="w-full h-full object-contain drop-shadow-xl" />
        </div>
      ) : (
        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 animate-float">
          <Icon className="w-10 h-10 text-primary dark:text-blue-400" />
        </div>
      )}
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 text-sm leading-relaxed">{description}</p>
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
