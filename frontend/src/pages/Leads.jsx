import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import { PlusCircle, Phone, Mail, ArrowRightCircle, User } from 'lucide-react';

const Leads = () => {
    const { user } = useContext(AuthContext);
    const [leads, setLeads] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newLead, setNewLead] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('http://localhost:5000/api/leads', config);
            setLeads(res.data);
        } catch (error) {
            console.error('Error fetching leads:', error);
        }
    };

    const handleAddLead = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/leads', newLead, config);
            setShowAdd(false);
            setNewLead({ name: '', email: '', phone: '' });
            fetchLeads();
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding lead');
        }
    };

    const convertToClient = async (leadId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`http://localhost:5000/api/leads/${leadId}/convert`, {}, config);
            fetchLeads();
            alert('Lead successfully converted to a Client!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error converting lead');
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Leads Pipeline</h1>
                <button onClick={() => setShowAdd(!showAdd)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <PlusCircle size={20} /> <span>New Lead</span>
                </button>
            </div>

            {showAdd && (
                <form onSubmit={handleAddLead} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" placeholder="Full Name" required value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <input type="email" placeholder="Email Address" required value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <div className="flex space-x-2 md:col-span-2">
                        <input type="text" placeholder="Phone Number" value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full" />
                        <button type="submit" className="bg-emerald-600 font-semibold text-white px-8 py-2 rounded-lg hover:bg-emerald-700">Save</button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Lead Details</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Contact</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {leads.map(lead => (
                            <tr key={lead._id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 flex items-center space-x-3">
                                    <User size={18} className="text-slate-400" />
                                    <span className="font-medium text-slate-800">{lead.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-sm text-slate-600 space-x-1 mb-1"><Mail size={14} /> <span>{lead.email}</span></div>
                                    <div className="flex items-center text-sm text-slate-500 space-x-1"><Phone size={14} /> <span>{lead.phone || 'N/A'}</span></div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 uppercase">{lead.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {lead.status !== 'converted' ? (
                                        <button onClick={() => convertToClient(lead._id)} className="text-emerald-600 hover:text-emerald-800 flex items-center justify-end space-x-1 text-sm font-medium ml-auto">
                                            <span>Convert Client</span> <ArrowRightCircle size={16} />
                                        </button>
                                    ) : (
                                        <span className="text-slate-400 text-sm">Converted</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No leads found. Drop one in above!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leads;
