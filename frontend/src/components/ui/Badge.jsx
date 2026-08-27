const statusStyles = {
    new: 'bg-purple-100 text-purple-800 border-purple-200',
    contacted: 'bg-orange-100 text-orange-800 border-orange-200',
    converted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const statusLabels = {
    new: '🆕 New',
    contacted: '📞 Contacted',
    converted: '✅ Converted',
};

const Badge = ({ status }) => {
    return (
        <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border uppercase tracking-wide ${statusStyles[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {statusLabels[status] || status}
        </span>
    );
};

export default Badge;
