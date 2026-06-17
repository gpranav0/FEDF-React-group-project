import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { getActivities } from '../../utils/activityLogger';
import ActivityItem from './ActivityItem';
import EmptyState from '../ui/EmptyState';

export default function ActivityTimeline() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Load from local storage
    setActivities(getActivities());
    
    // Listen to local storage changes to update across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'fintrack_activity') {
        setActivities(getActivities());
      }
    };
    
    // Also read on window focus to catch intra-session updates if navigation happens
    const handleFocus = () => setActivities(getActivities());
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const groupActivitiesByDay = (acts) => {
    const groups = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    acts.forEach(act => {
      const dateStr = new Date(act.timestamp).toDateString();
      let label = dateStr;
      if (dateStr === today) label = 'Today';
      else if (dateStr === yesterday) label = 'Yesterday';
      else {
        label = new Date(act.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(act);
    });

    return groups;
  };

  const grouped = groupActivitiesByDay(activities);
  const groupKeys = Object.keys(grouped);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[500px] min-h-[300px]">
        {activities.length > 0 ? (
          <div className="space-y-6">
            {groupKeys.map(dateLabel => (
              <div key={dateLabel}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{dateLabel}</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                
                <div>
                  {grouped[dateLabel].map((act, idx) => (
                    <ActivityItem key={act.id} activity={act} index={idx} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full min-h-[250px] flex items-center justify-center">
             <EmptyState
              icon={Activity}
              title="No recent activity"
              description="Actions you perform like adding expenses or setting budgets will appear here."
            />
          </div>
        )}
      </div>
    </div>
  );
}
