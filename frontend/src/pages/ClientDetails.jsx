import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Loader2, ArrowLeft, Mail, Phone, Building2, User,
    Briefcase, FileText, CheckCircle2, Clock, CheckSquare,
    Activity as ActivityIcon, Calendar, DollarSign
} from 'lucide-react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const ClientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const res = await api.get(`/clients/${id}/full-data`);
                setData(res.data.data);
            } catch (error) {
                toast.error('Failed to load client 360 data');
                navigate('/clients');
            } finally {
                setIsLoading(false);
            }
        };
        fetchClientData();
    }, [id, navigate]);

    if (isLoading || !data) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
        );
    }

    const { client, activities, quotes, projects, tasks, stats } = data;

    const KPICard = ({ title, value, icon: Icon, color, bg }) => (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
                <p className="text-2xl font-extrabold text-slate-900">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                <Icon size={24} />
            </div>
        </div>
    );

    return (
        <div className="pb-12 max-w-6xl mx-auto h-full flex flex-col">
            {/* Header Section */}
            <div className="mb-6">
                <button flex="true" onClick={() => navigate('/clients')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors mb-4">
                    <ArrowLeft size={16} /> Back to Clients
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex gap-6 items-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30">
                            {client.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-extrabold text-slate-900">{client.name}</h1>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${client.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                                    {client.status?.toUpperCase() || 'ACTIVE'}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                                {client.company && (
                                    <span className="flex items-center gap-1.5"><Building2 size={16} /> {client.company}</span>
                                )}
                                <span className="flex items-center gap-1.5"><Mail size={16} /> {client.email}</span>
                                {client.phone && (
                                    <span className="flex items-center gap-1.5"><Phone size={16} /> {client.phone}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[200px] border-l-0 lg:border-l-2 border-slate-100 lg:pl-8">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Manager</p>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs ring-2 ring-white">
                                {client.assignedTo?.name?.charAt(0) || <User size={14} />}
                            </div>
                            <span className="font-bold text-slate-700">{client.assignedTo?.name || 'Unassigned'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard title="Total Value" value={`$${stats.totalDealsValue.toLocaleString()}`} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-100" />
                <KPICard title="Active Projects" value={stats.activeProjects} icon={Briefcase} color="text-purple-600" bg="bg-purple-100" />
                <KPICard title="Pending Payments" value={`$${stats.pendingPayments.toLocaleString()}`} icon={FileText} color="text-orange-600" bg="bg-orange-100" />
                <KPICard title="Last Activity" value={activities.length > 0 ? new Date(activities[0].createdAt).toLocaleDateString() : 'N/A'} icon={ActivityIcon} color="text-blue-600" bg="bg-blue-100" />
            </div>

            {/* Tabs System */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="flex px-4 pt-2 border-b border-slate-100 overflow-x-auto hide-scrollbar">
                    {['overview', 'projects', 'tasks', 'quotes', 'activity'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 font-bold text-sm capitalize transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-purple-600' : 'text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-600 rounded-t-full"></span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                    {activeTab === 'overview' && (
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-800 mb-4 text-lg">Client History</h3>
                                    <div className="text-slate-600 text-sm leading-relaxed space-y-2">
                                        <p>Client originated from lead tracking context: <span className="font-bold">{client.convertedFrom?.source || 'Organic'}</span></p>
                                        <p>Created on: <span className="font-bold">{new Date(client.createdAt).toLocaleDateString()}</span></p>
                                        {client.notes ? <p className="italic bg-slate-50 p-4 rounded-lg mt-4 border border-slate-100">"{client.notes}"</p> : null}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ActivityIcon size={18} /> Recent Flow</h3>
                                    {activities.slice(0, 4).map(act => (
                                        <div key={act._id} className="mb-4 pl-4 border-l-2 border-purple-200 last:mb-0 relative">
                                            <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-purple-500"></span>
                                            <p className="text-sm text-slate-700 font-medium">{act.description}</p>
                                            <span className="text-xs text-slate-400">{new Date(act.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        projects.length === 0 ? <EmptyState icon={Briefcase} msg="No projects found." /> :
                            <div className="space-y-4">
                                {projects.map(proj => (
                                    <div key={proj._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg mb-1">{proj.name}</h4>
                                            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Calendar size={14} /> Started {new Date(proj.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="w-full md:w-64">
                                            <div className="flex justify-between text-xs font-bold mb-1">
                                                <span>Progress</span>
                                                <span className="text-purple-600">{proj.progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full"><div className="bg-purple-600 h-2 rounded-full" style={{ width: `${proj.progress}%` }}></div></div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${proj.status === 'active' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : proj.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                                            {proj.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                    )}

                    {activeTab === 'tasks' && (
                        tasks.length === 0 ? <EmptyState icon={CheckSquare} msg="No tasks mapped to this client." /> :
                            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="p-4">Task Title</th>
                                            <th className="p-4 hidden md:table-cell">Assigned To</th>
                                            <th className="p-4">Priority</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map(task => (
                                            <tr key={task._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                                <td className="p-4 font-bold text-sm text-slate-800">{task.title}</td>
                                                <td className="p-4 text-sm text-slate-600 hidden md:table-cell">{task.assignedTo?.name || 'Unassigned'}</td>
                                                <td className="p-4">
                                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>{task.priority}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${task.status === 'done' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
                                                        {task.status === 'done' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                        {task.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                    )}

                    {activeTab === 'quotes' && (
                        quotes.length === 0 ? <EmptyState icon={FileText} msg="No proposals generated." /> :
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {quotes.map(quote => (
                                    <div key={quote._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-slate-800 line-clamp-1">{quote.title}</h4>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase border ${quote.status === 'accepted' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>{quote.status}</span>
                                        </div>
                                        <p className="text-2xl font-extrabold text-slate-900 mb-1">${quote.amount.toLocaleString()}</p>
                                        <p className="text-xs text-slate-400">Created {new Date(quote.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                    )}

                    {activeTab === 'activity' && (
                        activities.length === 0 ? <EmptyState icon={ActivityIcon} msg="No activities recorded." /> :
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
                                <div className="space-y-6">
                                    {activities.map((act, idx) => (
                                        <div key={act._id} className="relative flex gap-6">
                                            {/* Timeline Line */}
                                            {idx !== activities.length - 1 && <div className="absolute top-10 bottom-[-24px] left-5 w-px bg-slate-200"></div>}

                                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border-4 border-white shadow-sm ring-1 ring-slate-200">
                                                {act.action === 'converted' ? <User size={16} className="text-emerald-600" /> :
                                                    act.action === 'created' ? <Plus size={16} className="text-blue-600" /> :
                                                        <ActivityIcon size={16} className="text-purple-600" />}
                                            </div>
                                            <div className="flex-1 pt-2">
                                                <p className="text-sm text-slate-800 font-bold mb-1">{act.description}</p>
                                                <p className="text-xs font-medium text-slate-400 flex justify-between items-center">
                                                    <span>by {act.createdBy?.name || 'System'}</span>
                                                    <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(act.createdAt).toLocaleString()}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const EmptyState = ({ icon: Icon, msg }) => (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 text-slate-400">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <Icon size={24} className="text-slate-300" />
        </div>
        <p className="text-sm font-semibold">{msg}</p>
    </div>
);

export default ClientDetails;
