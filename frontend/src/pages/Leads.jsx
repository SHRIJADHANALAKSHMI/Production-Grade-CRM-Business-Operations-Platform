import { useEffect, useState, useContext } from 'react';
import api from '../services/api.js';
import AuthContext from '../context/AuthContext.jsx';
import {
    PlusCircle, ArrowRightCircle, User, Search, Filter,
    Trash2, ChevronLeft, ChevronRight, Mail, Phone, Loader2, FileX
} from 'lucide-react';
import toast from 'react-hot-toast';

const Leads = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role?.toLowerCase() === 'admin';

    const [leads, setLeads] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newLead, setNewLead] = useState({ name: '', email: '', phone: '' });

    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(null); // track leadId

    // Filters, Search, Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/leads');
            setLeads(res.data.data.reverse()); // latest first
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddLead = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await api.post('/leads', newLead);
            toast.success('Lead added successfully!');
            setShowAdd(false);
            setNewLead({ name: '', email: '', phone: '' });
            fetchLeads();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const convertToClient = async (leadId) => {
        try {
            setActionLoading(`convert-${leadId}`);
            await api.post(`/leads/${leadId}/convert`);
            toast.success('Lead converted to client!');
            fetchLeads();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleStatusChange = async (leadId, newStatus) => {
        try {
            setActionLoading(`status-${leadId}`);
            await api.patch(`/leads/${leadId}`, { status: newStatus });
            setLeads(leads.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (leadId) => {
        if (!window.confirm("Are you sure you want to permanently delete this lead?")) return;
        try {
            setActionLoading(`delete-${leadId}`);
            await api.delete(`/leads/${leadId}`);
            setLeads(leads.filter(l => l._id !== leadId));
            toast.success('Lead deleted.');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(null);
        }
    };

    // Applied Filters locally
    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Calculate Pagination
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
    const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Pagination Handlers
    const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
    const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

    // Reset page when filters change
    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

    const SkeletonRow = () => (
        <tr className="animate-pulse bg-white">
            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div><div className="h-3 bg-slate-100 rounded w-1/2"></div></td>
            <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-24"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
            <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-full"></div></td>
        </tr>
    );

    return (
        <div className="max-w-7xl mx-auto py-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Leads Pipeline</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage, filter, and convert your active pipeline.</p>
                </div>
                <button onClick={() => setShowAdd(!showAdd)} className="flex items-center space-x-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 transition shadow-sm font-medium">
                    <PlusCircle size={20} /> <span>New Lead</span>
                </button>
            </div>

            {/* Add Form */}
            {showAdd && (
                <form onSubmit={handleAddLead} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4">
                    <input type="text" placeholder="Full Name" required value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-500" disabled={isSubmitting} />
                    <input type="email" placeholder="Email Address" required value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-500" disabled={isSubmitting} />
                    <div className="flex space-x-3 md:col-span-2">
                        <input type="text" placeholder="Phone Number" value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 w-full" disabled={isSubmitting} />
                        <button type="submit" disabled={isSubmitting} className="bg-emerald-600 flex items-center justify-center font-semibold text-white px-8 py-2 rounded-xl hover:bg-emerald-700 disabled:opacity-50">
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Save Lead'}
                        </button>
                    </div>
                </form>
            )}

            {/* SaaS Toolbar */}
            <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search leads by name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <Filter className="text-slate-400" size={18} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-auto border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                        <option value="all">All Statuses</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                    </select>
                </div>
            </div>

            {/* Main SaaS Table */}
            <div className="bg-white rounded-b-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Info</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pipeline Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Rep</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 relative">
                            {isLoading ? (
                                <>
                                    <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
                                </>
                            ) : paginatedLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="bg-slate-100 p-4 rounded-full text-slate-400">
                                                <FileX size={32} />
                                            </div>
                                            <p className="text-slate-600 font-medium">No leads match your criteria.</p>
                                            <p className="text-slate-400 text-sm">Try adjusting your filters or search term.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedLeads.map(lead => (
                                    <tr key={lead._id} className="hover:bg-purple-50/50 transition-colors group">

                                        <td className="px-6 py-4 max-w-[200px]">
                                            <div className="flex items-start space-x-3">
                                                <div className="bg-slate-100 p-2 rounded-lg text-slate-500 mt-0.5"><User size={18} /></div>
                                                <div className="truncate">
                                                    <p className="font-semibold text-slate-800 truncate">{lead.name}</p>
                                                    <div className="flex items-center text-xs text-slate-500 space-x-1 mt-1 truncate"><Mail size={12} /> <span className="truncate">{lead.email}</span></div>
                                                    {lead.phone && <div className="flex items-center text-xs text-slate-500 space-x-1 mt-0.5"><Phone size={12} /> <span>{lead.phone}</span></div>}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {lead.status === 'converted' ? (
                                                <span className="px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                                                    Converted
                                                </span>
                                            ) : (
                                                <div className="relative inline-block w-40">
                                                    {actionLoading === `status-${lead._id}` && <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 animate-spin" size={14} />}
                                                    <select
                                                        value={lead.status}
                                                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                                        disabled={actionLoading === `status-${lead._id}`}
                                                        className={`w-full appearance-none border rounded-lg px-4 py-1.5 text-xs font-bold uppercase transition focus:ring-2 focus:ring-purple-500 ${lead.status === 'new' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-orange-100 text-orange-800 border-orange-200'
                                                            } disabled:opacity-50 cursor-pointer`}
                                                    >
                                                        <option value="new">🆕 New</option>
                                                        <option value="contacted">📞 Contacted</option>
                                                    </select>
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                                    {lead.assignedTo?.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div className="text-sm">
                                                    <p className="font-medium text-slate-700">{lead.assignedTo?.name || 'Unassigned'}</p>
                                                    {isAdmin && <p className="text-xs text-slate-400">Rep ID: {lead.assignedTo?._id?.substring(0, 6) || ''}</p>}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                {lead.status !== 'converted' && (
                                                    <button
                                                        onClick={() => convertToClient(lead._id)}
                                                        disabled={actionLoading === `convert-${lead._id}`}
                                                        className="bg-slate-100 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1.5 text-sm transition disabled:opacity-50"
                                                    >
                                                        {actionLoading === `convert-${lead._id}` ? <Loader2 className="animate-spin" size={16} /> : <><ArrowRightCircle size={16} /> <span>Convert</span></>}
                                                    </button>
                                                )}
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => handleDelete(lead._id)}
                                                        disabled={actionLoading === `delete-${lead._id}`}
                                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50"
                                                        title="Delete Lead"
                                                    >
                                                        {actionLoading === `delete-${lead._id}` ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {!isLoading && filteredLeads.length > 0 && (
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> of <span className="font-semibold text-slate-700">{filteredLeads.length}</span> results
                        </p>
                        <div className="flex space-x-2">
                            <button onClick={handlePrev} disabled={currentPage === 1} className="p-2 border border-slate-200 rounded-lg hover:bg-white text-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition">
                                <ChevronLeft size={18} />
                            </button>
                            <div className="px-4 py-2 text-sm font-medium text-slate-700 flex items-center">
                                Page {currentPage} of {totalPages}
                            </div>
                            <button onClick={handleNext} disabled={currentPage === totalPages} className="p-2 border border-slate-200 rounded-lg hover:bg-white text-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Leads;
