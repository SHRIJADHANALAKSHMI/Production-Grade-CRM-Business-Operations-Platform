import { useEffect, useState, useContext } from 'react';
import api from '../services/api.js';
import AuthContext from '../context/AuthContext.jsx';
import { Users, UserCheck, TrendingUp, DollarSign, Activity, CheckCircle2, Loader2, ArrowUpRight, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const mockChartData = [
    { name: 'Jan', leads: 40, conversions: 24, revenue: 2400 },
    { name: 'Feb', leads: 30, conversions: 13, revenue: 1398 },
    { name: 'Mar', leads: 20, conversions: 98, revenue: 9800 },
    { name: 'Apr', leads: 27, conversions: 39, revenue: 3908 },
    { name: 'May', leads: 18, conversions: 48, revenue: 4800 },
    { name: 'Jun', leads: 23, conversions: 38, revenue: 3800 },
    { name: 'Jul', leads: 34, conversions: 43, revenue: 4300 },
];

const mockFunnelData = [
    { stage: 'Total Leads', count: 100 },
    { stage: 'Contacted', count: 75 },
    { stage: 'Qualified', count: 50 },
    { stage: 'Converted', count: 25 },
];

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ totalLeads: 0, totalClients: 0, convertedLeadsCount: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const res = await api.get('/dashboard');
                setStats(res.data.data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        if (user) fetchStats();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
        );
    }

    const StatCard = ({ icon: Icon, title, value, compText, compColor, bgColor, textColor }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${bgColor} ${textColor}`}>
                    <Icon size={24} />
                </div>
                <div className={`flex items-center space-x-1 text-xs font-bold px-2 py-1 rounded-full bg-slate-50 ${compColor}`}>
                    <ArrowUpRight size={14} /> <span>{compText}</span>
                </div>
            </div>
            <div>
                <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">{title}</p>
                <p className="text-3xl font-extrabold text-slate-800">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="pb-12 animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
                <p className="text-slate-500 mt-1">Here is what's happening with your pipeline today.</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={Target} title="Total Leads" value={stats.totalLeads} compText="12% vs last mo"
                    compColor="text-emerald-600" bgColor="bg-purple-100" textColor="text-purple-600"
                />
                <StatCard
                    icon={Users} title="Active Clients" value={stats.totalClients} compText="8% vs last mo"
                    compColor="text-emerald-600" bgColor="bg-blue-100" textColor="text-blue-600"
                />
                <StatCard
                    icon={UserCheck} title="Converted" value={stats.convertedLeadsCount} compText="3% vs last mo"
                    compColor="text-orange-500" bgColor="bg-emerald-100" textColor="text-emerald-600"
                />
                <StatCard
                    icon={DollarSign} title="Est. Revenue" value="$42,500" compText="24% vs last mo"
                    compColor="text-emerald-600" bgColor="bg-orange-100" textColor="text-orange-600"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Line Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Leads vs Conversions</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="leads" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                                <Area type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorConversions)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Funnel Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Sales Funnel</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={mockFunnelData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} width={90} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" fill="#9333ea" radius={[0, 4, 4, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row Activity & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Recent Activities</h2>
                        <button className="text-sm text-purple-600 font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-start space-x-4">
                                <div className="bg-purple-50 p-2 rounded-full text-purple-600 mt-1">
                                    <Activity size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">You updated lead status to Contacted</p>
                                    <p className="text-xs text-slate-500 mt-0.5">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Assigned Tasks</h2>
                        <button className="text-sm text-purple-600 font-medium hover:underline">Add Task</button>
                    </div>
                    <div className="space-y-4">
                        {['Call John regarding enterprise plan', 'Follow up with marketing lead', 'Send proposal to TechCorp inc'].map((task, i) => (
                            <div key={i} className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition cursor-pointer border border-transparent hover:border-slate-100">
                                <CheckCircle2 size={20} className="text-slate-300 hover:text-emerald-500 transition-colors" />
                                <span className="text-sm font-medium text-slate-700">{task}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
