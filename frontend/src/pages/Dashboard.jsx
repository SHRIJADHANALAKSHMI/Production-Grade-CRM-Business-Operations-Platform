import { useEffect, useState, useContext } from 'react';
import api from '../services/api.js';
import AuthContext from '../context/AuthContext.jsx';
import {
    Users, UserCheck, TrendingUp, DollarSign, Loader2,
    ArrowUpRight, Target, AlertCircle, Calendar, Activity, CheckCircle2
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { isOverdue, isDueToday } from '../utils/dateHelpers.js';

const STATUS_COLORS = ['#9333ea', '#f97316', '#10b981', '#3b82f6'];
const STAGE_COLORS = ['#9333ea', '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#64748b'];

const timeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
};

const STATUS_BADGE = {
    new: 'bg-purple-100 text-purple-700',
    contacted: 'bg-orange-100 text-orange-700',
    converted: 'bg-emerald-100 text-emerald-700',
    interested: 'bg-yellow-100 text-yellow-700',
};

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [followUps, setFollowUps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchAll = async () => {
            try {
                setIsLoading(true);
                const [statsRes, followRes] = await Promise.all([
                    api.get('/dashboard'),
                    api.get('/leads/followups')
                ]);
                setStats(statsRes.data.data);
                setFollowUps(followRes.data.data.slice(0, 5));
            } catch (err) {
                console.error(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
        );
    }

    // Build status pie data from real leadsByStatus
    const statusPieData = stats?.leadsByStatus
        ? Object.entries(stats.leadsByStatus)
            .filter(([, count]) => count > 0)
            .map(([status, count]) => ({
                name: status.charAt(0).toUpperCase() + status.slice(1),
                value: count
            }))
        : [];

    // Build funnel data for bar chart
    const funnelData = stats?.leadsByStatus
        ? [
            { stage: 'New', count: stats.leadsByStatus.new || 0 },
            { stage: 'Contacted', count: stats.leadsByStatus.contacted || 0 },
            { stage: 'Interested', count: stats.leadsByStatus.interested || 0 },
            { stage: 'Converted', count: stats.leadsByStatus.converted || 0 },
        ]
        : [];

    const StatCard = ({ icon: Icon, title, value, sub, color, bg }) => (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${bg} ${color}`}><Icon size={22} /></div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight size={12} />{sub}
                </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{title}</p>
            <p className="text-3xl font-extrabold text-slate-800">{value}</p>
        </div>
    );

    return (
        <div className="pb-12">
            <div className="mb-7">
                <h1 className="text-2xl font-bold text-slate-800">
                    Welcome back, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-slate-500 mt-1 text-sm">Here's your live pipeline summary.</p>
            </div>

            {/* Stat Cards — all real data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
                <StatCard icon={Target} title="Total Leads" value={stats?.totalLeads ?? 0} sub="All time" color="text-purple-600" bg="bg-purple-100" />
                <StatCard icon={Users} title="Active Clients" value={stats?.totalClients ?? 0} sub="All time" color="text-blue-600" bg="bg-blue-100" />
                <StatCard icon={UserCheck} title="Converted Leads" value={stats?.convertedLeads ?? 0} sub="Total" color="text-emerald-600" bg="bg-emerald-100" />
                <StatCard icon={TrendingUp} title="Conversion Rate" value={`${stats?.conversionRate ?? 0}%`} sub="Lead→Client" color="text-orange-600" bg="bg-orange-100" />
            </div>

            {/* Follow-ups alert banner — real count */}
            {stats?.followUpsTodayCount > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-7 flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><AlertCircle size={20} /></div>
                    <div>
                        <p className="font-bold text-orange-800">
                            {stats.followUpsTodayCount} follow-up{stats.followUpsTodayCount > 1 ? 's' : ''} due today!
                        </p>
                        <p className="text-sm text-orange-600">Open the Leads page to take action.</p>
                    </div>
                </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">
                {/* Stage Breakdown — Real data */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-base font-bold text-slate-800 mb-5">Stage Breakdown</h2>
                    {stats?.stageBreakdown?.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.stageBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, textTransform: 'capitalize' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]} barSize={32}>
                                        {stats.stageBreakdown.map((_, i) => <Cell key={i} fill={STAGE_COLORS[i % STAGE_COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                            <Target size={32} className="mb-2 opacity-40" />
                            <p className="text-sm">No stage data yet</p>
                        </div>
                    )}
                </div>

                {/* Sales Funnel — real leadsByStatus data */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-base font-bold text-slate-800 mb-5">Sales Funnel</h2>
                    {funnelData.some(d => d.count > 0) ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={funnelData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false}
                                        tick={{ fill: '#475569', fontSize: 12 }} width={75} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="count" name="Leads" radius={[0, 6, 6, 0]} barSize={28}>
                                        {funnelData.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                            <Target size={32} className="mb-2 opacity-40" />
                            <p className="text-sm">No lead data yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities — real data from recentActivities */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-base font-bold text-slate-800">Recent Activity</h2>
                        <a href="/leads" className="text-sm text-purple-600 hover:underline font-medium">View All</a>
                    </div>
                    {stats?.recentActivities?.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm shrink-0">
                                        {activity.leadName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-700">{activity.text}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[activity.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {activity.status}
                                            </span>
                                            <span className="text-xs text-slate-400">{timeAgo(activity.time)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <Activity size={32} className="mx-auto mb-2 opacity-40" />
                            <p className="text-sm">No recent activity</p>
                        </div>
                    )}
                </div>

                {/* Follow-Ups Due — real data from /leads/followups */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-base font-bold text-slate-800">📅 Follow-Ups Due</h2>
                        <a href="/leads" className="text-sm text-purple-600 hover:underline font-medium">Manage</a>
                    </div>
                    {followUps.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <Calendar size={32} className="mx-auto mb-2 opacity-40" />
                            <p className="text-sm">No pending follow-ups 🎉</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {followUps.map(lead => (
                                <div key={lead._id} className={`flex items-center gap-3 p-3 rounded-xl border transition ${isOverdue(lead.nextFollowUpDate)
                                    ? 'bg-red-50 border-red-200'
                                    : isDueToday(lead.nextFollowUpDate)
                                        ? 'bg-orange-50 border-orange-200'
                                        : 'bg-slate-50 border-slate-100'
                                    }`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isOverdue(lead.nextFollowUpDate) ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                                        }`}>
                                        {lead.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 text-sm truncate">{lead.name}</p>
                                        <p className={`text-xs font-medium ${isOverdue(lead.nextFollowUpDate) ? 'text-red-500' : isDueToday(lead.nextFollowUpDate) ? 'text-orange-500' : 'text-slate-500'
                                            }`}>
                                            {isOverdue(lead.nextFollowUpDate)
                                                ? '⚠ Overdue'
                                                : isDueToday(lead.nextFollowUpDate)
                                                    ? '🔔 Due today'
                                                    : new Date(lead.nextFollowUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                            }
                                        </p>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${STATUS_BADGE[lead.status] || 'bg-slate-100 text-slate-600'}`}>
                                        {lead.stage || lead.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
