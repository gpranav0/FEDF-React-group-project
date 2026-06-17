export function logActivity(actionType, title, description) {
  try {
    const raw = localStorage.getItem('fintrack_activity');
    const activities = raw ? JSON.parse(raw) : [];

    const newActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      actionType,
      title,
      description,
      timestamp: new Date().toISOString(),
    };

    // Keep only the most recent 100 activities to prevent localStorage bloat
    const updatedActivities = [newActivity, ...activities].slice(0, 100);
    localStorage.setItem('fintrack_activity', JSON.stringify(updatedActivities));
    
    return newActivity;
  } catch (e) {
    console.error('Failed to log activity', e);
  }
}

export function getActivities() {
  try {
    const raw = localStorage.getItem('fintrack_activity');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to retrieve activities', e);
    return [];
  }
}
