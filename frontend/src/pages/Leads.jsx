import { useEffect, useState, useContext } from 'react';
import api from '../services/api.js';
import AuthContext from '../context/AuthContext.jsx';
import { PlusCircle, ArrowRightCircle, User, Search, Filter, Trash2, ChevronLeft, ChevronRight, Mail, Phone, Loader2, FileX, Calendar, StickyNote, X } from 'lucide-react';
import toast from 'react-hot-toast';

const STAGE_STYLES = {
    new: 'bg-slate-100 text-slate-700',
    contacted: 'bg-blue-100 text-blue-700',
    interested: 'bg-yellow-100 text-yellow-700',
    proposal: 'bg-purple-100 text-purple-700',
    won: 'bg-emerald-100 text-emerald-700',
    lost: 'bg-red-100 text-red-700',
};

const STATUS_STYLES = {
    new: 'bg-purple-100 text-purple-800 border-purple-200',
    contacted: 'bg-orange-100 text-orange-800 border-orange-200',
    converted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const isOverdue = (date) => date && new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));
const isDueToday = (date) => {
    if (!date) return false;
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
};

const Leads = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role?.toLowerCase() === 'admin';

    const [leads, setLeads] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [editingLead, setEditingLead] = useState(null); // for notes/followup modal
    const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', notes: '', nextFollowUpDate: '', dealValue: '', expectedCloseDate: '' });

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [stageFilter, setStageFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLeads, setTotalLeads] = useState(0);
    const itemsPerPage = 8;

    useEffect(() => { fetchLeads(); }, [currentPage, searchQuery, statusFilter, stageFilter]);

    const fetchLeads = async () => {
        try {
            setIsLoading(true);
            // Construct explicitly as requested
            let url = `/leads?page=${currentPage}&limit=${itemsPerPage}`;
            if (statusFilter !== 'all') url += `&status=${statusFilter}`;
            if (stageFilter !== 'all') url += `&stage=${stageFilter}`;
            if (searchQuery) url += `&search=${searchQuery}`;

            const res = await api.get(url);
            console.log("API response:", res.data); // Debug log from spec

            setLeads(res.data.data);
            if (res.data.pagination) {
                setTotalPages(res.data.pagination.pages);
                setTotalLeads(res.data.pagination.total);
            }
        } catch (error) {
            toast.error('Failed to load leads');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddLead = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await api.post('/leads', newLead);
            toast.success('Lead created successfully!');
            setShowAdd(false);
            setNewLead({ name: '', email: '', phone: '', notes: '', nextFollowUpDate: '', dealValue: '', expectedCloseDate: '' });
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
            toast.success('Lead converted to client! 🎉');
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
            setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleStageChange = async (leadId, newStage) => {
        try {
            setActionLoading(`stage-${leadId}`);
            await api.patch(`/leads/${leadId}`, { stage: newStage });
            setLeads(prev => prev.map(l => l._id === leadId ? { ...l, stage: newStage } : l));
        } catch (error) {
            toast.error('Failed to update stage');
        } finally {
            setActionLoading(null);
        }
    };

    const handleSaveNotes = async () => {
        if (!editingLead) return;
        try {
            setIsSubmitting(true);
            await api.patch(`/leads/${editingLead._id}`, {
                notes: editingLead.notes,
                nextFollowUpDate: editingLead.nextFollowUpDate || null
            });
            toast.success('Follow-up saved!');
            setLeads(prev => prev.map(l => l._id === editingLead._id ? { ...l, ...editingLead } : l));
            setEditingLead(null);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (leadId) => {
        if (!window.confirm('Permanently delete this lead?')) return;
        try {
            setActionLoading(`delete-${leadId}`);
            await api.delete(`/leads/${leadId}`);
            toast.success('Lead deleted.');
            fetchLeads(); // explicitly refetch leads after delete
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(null);
        }
    };

    // Backend pagination applied. No local filtering array needed.

    const SkeletonRow = () => (
        <tr className="animate-pulse bg-white">
            {[1, 2, 3, 4, 5].map(i => <td key={i} className="px-5 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>)}
        </tr>
    );

    return (
        <div className="pb-12">
            {/* Notes / Follow-Up Modal */}
            {editingLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Follow-Up: {editingLead.name}</h3>
                            <button onClick={() => setEditingLead(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Notes</label>
                                <textarea rows={4} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm resize-none"
                                    value={editingLead.notes || ''} onChange={e => setEditingLead({ ...editingLead, notes: e.target.value })}
                                    placeholder="Add notes about this lead..." />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Next Follow-Up Date</label>
                                <input type="date" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                    value={editingLead.nextFollowUpDate ? new Date(editingLead.nextFollowUpDate).toISOString().split('T')[0] : ''}
                                    onChange={e => setEditingLead({ ...editingLead, nextFollowUpDate: e.target.value })} />
                            </div>
                            <button onClick={handleSaveNotes} disabled={isSubmitting}
                                className="w-full bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Save Follow-Up'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Leads Pipeline</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage, filter, and convert your active leads.</p>
                </div>
                <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 transition shadow-sm font-semibold">
                    <PlusCircle size={18} /> New Lead
                </button>
            </div>

            {/* Add Lead Form */}
            {showAdd && (
                <form onSubmit={handleAddLead} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input type="text" placeholder="Full Name *" required value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm" disabled={isSubmitting} />
                    <input type="email" placeholder="Email Address *" required value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm" disabled={isSubmitting} />
                    <input type="text" placeholder="Phone Number" value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm" disabled={isSubmitting} />
                    <input type="number" placeholder="Deal Value ($)" value={newLead.dealValue} onChange={e => setNewLead({ ...newLead, dealValue: e.target.value })} className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm" disabled={isSubmitting} />
                    <input type="date" placeholder="Expected Close Date" title="Expected Close Date" value={newLead.expectedCloseDate} onChange={e => setNewLead({ ...newLead, expectedCloseDate: e.target.value })} className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm" disabled={isSubmitting} />
                    <input type="date" placeholder="Follow-Up Date" title="Follow-Up Date" value={newLead.nextFollowUpDate} onChange={e => setNewLead({ ...newLead, nextFollowUpDate: e.target.value })} className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm" disabled={isSubmitting} />
                    <textarea placeholder="Initial notes..." value={newLead.notes} onChange={e => setNewLead({ ...newLead, notes: e.target.value })} rows={1} className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm resize-none" disabled={isSubmitting} />
                    <button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><PlusCircle size={18} /> Save Lead</>}
                    </button>
                </form>
            )}

            {/* Toolbar */}
            <div className="bg-slate-50 border border-b-0 border-slate-200 rounded-t-2xl p-4 flex flex-wrap gap-3 items-center justify-between">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white" />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <Filter size={16} className="text-slate-400" />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400">
                        <option value="all">All Statuses</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                    </select>
                    <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400">
                        <option value="all">All Stages</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="interested">Interested</option>
                        <option value="proposal">Proposal</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-b-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Lead</th>
                                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Deal Value</th>
                                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stage</th>
                                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Follow-Up</th>
                                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned</th>
                                <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
                            ) : leads.length === 0 ? (
                                <tr><td colSpan="7" className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 bg-slate-100 rounded-full text-slate-400"><FileX size={28} /></div>
                                        <p className="font-semibold text-slate-600">No leads found</p>
                                        <p className="text-sm text-slate-400">Try clearing your filters or add a new lead.</p>
                                    </div>
                                </td></tr>
                            ) : leads.map(lead => (
                                <tr key={lead._id} className={`group hover:bg-purple-50/40 transition-colors ${isOverdue(lead.nextFollowUpDate) && lead.status !== 'converted' ? 'border-l-2 border-l-red-400' : ''}`}>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm shrink-0">
                                                {lead.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-800 truncate">{lead.name}</p>
                                                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                                    <Mail size={11} /><span className="truncate">{lead.email}</span>
                                                </div>
                                                {lead.phone && <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5"><Phone size={11} /><span>{lead.phone}</span></div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-semibold text-slate-700">
                                        ${lead.dealValue?.toLocaleString() || 0}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="relative">
                                            {actionLoading === `stage-${lead._id}` && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-purple-500" size={12} />}
                                            <select value={lead.stage || 'new'} onChange={e => handleStageChange(lead._id, e.target.value)}
                                                disabled={actionLoading === `stage-${lead._id}` || lead.status === 'converted'}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-purple-400 appearance-none disabled:opacity-60 ${STAGE_STYLES[lead.stage] || STAGE_STYLES.new}`}>
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="qualified">Qualified</option>
                                                <option value="interested">Interested</option>
                                                <option value="proposal">Proposal</option>
                                                <option value="won">Won</option>
                                                <option value="lost">Lost</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        {lead.status === 'converted' ? (
                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">Converted</span>
                                        ) : (
                                            <div className="relative">
                                                {actionLoading === `status-${lead._id}` && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-purple-500" size={12} />}
                                                <select value={lead.status} onChange={e => handleStatusChange(lead._id, e.target.value)}
                                                    disabled={actionLoading === `status-${lead._id}`}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer focus:ring-2 focus:ring-purple-400 appearance-none disabled:opacity-60 ${STATUS_STYLES[lead.status]}`}>
                                                    <option value="new">New</option>
                                                    <option value="contacted">Contacted</option>
                                                </select>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <button onClick={() => setEditingLead({ ...lead })} className="group/btn flex items-center gap-2 text-sm hover:text-purple-600 transition">
                                            {lead.nextFollowUpDate ? (
                                                <span className={`flex items-center gap-1.5 font-medium ${isOverdue(lead.nextFollowUpDate) ? 'text-red-500' : isDueToday(lead.nextFollowUpDate) ? 'text-orange-500' : 'text-slate-600'}`}>
                                                    <Calendar size={14} />
                                                    {isOverdue(lead.nextFollowUpDate) ? '⚠ Overdue' : isDueToday(lead.nextFollowUpDate) ? '🔔 Today' : new Date(lead.nextFollowUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 flex items-center gap-1.5"><StickyNote size={14} /> Add Note</span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                {lead.assignedTo?.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <span className="text-sm text-slate-700 font-medium">{lead.assignedTo?.name || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {lead.status !== 'converted' && (
                                                <button onClick={() => convertToClient(lead._id)} disabled={actionLoading === `convert-${lead._id}`}
                                                    className="flex items-center gap-1.5 text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50">
                                                    {actionLoading === `convert-${lead._id}` ? <Loader2 className="animate-spin" size={14} /> : <><ArrowRightCircle size={14} /> Convert</>}
                                                </button>
                                            )}
                                            {isAdmin && (
                                                <button onClick={() => handleDelete(lead._id)} disabled={actionLoading === `delete-${lead._id}`}
                                                    className="text-red-400 hover:bg-red-50 hover:text-red-600 p-2 rounded-lg transition disabled:opacity-50">
                                                    {actionLoading === `delete-${lead._id}` ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && totalLeads > itemsPerPage && (
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalLeads)} of {totalLeads} leads
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-white text-slate-600 disabled:opacity-40 transition">
                                <ChevronLeft size={16} />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium text-slate-700">Page {currentPage} of {totalPages}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-white text-slate-600 disabled:opacity-40 transition">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leads;
