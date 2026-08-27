/**
 * Date helpers for follow-up tracking
 */

export const isOverdue = (date) => {
    if (!date) return false;
    return new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));
};

export const isDueToday = (date) => {
    if (!date) return false;
    return new Date(date).toDateString() === new Date().toDateString();
};

export const isUpcoming = (date) => {
    if (!date) return false;
    const d = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return d >= tomorrow;
};

export const formatFollowUpDate = (date) => {
    if (!date) return null;
    if (isOverdue(date)) return { label: '⚠ Overdue', color: 'text-red-500' };
    if (isDueToday(date)) return { label: '🔔 Due Today', color: 'text-orange-500' };
    return {
        label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        color: 'text-slate-600'
    };
};
