import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import { PlusCircle, Building2, Phone, Mail, ArrowRightCircle } from 'lucide-react';

const Leads = () => {
    const { user } = useContext(AuthContext);
    const [leads, setLeads] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newLead, setNewLead] = useState({ title: '', company: '', email: '', phone: '' });

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
            setNewLead({ title: '', company: '', email: '', phone: '' });
            fetchLeads();
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding lead');
        }
    };

    const convertToClient = async (leadId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`http://localhost:5000/api/clients/convert/${leadId}`, {}, config);
            fetchLeads();
            alert('Lead successfully converted to Client!');
        } catch (error) {
            console.error('Error converting lead:', error);
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
                    <input type="text" placeholder="Title/Name" required value={newLead.title} onChange={e => setNewLead({ ...newLead, title: e.target.value })} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Company" required value={newLead.company} onChange={e => setNewLead({ ...newLead, company: e.target.value })} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <input type="email" placeholder="Email" required value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <div className="flex space-x-2">
                        <input type="text" placeholder="Phone" value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full" />
                        <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Save</button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Lead</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Contact</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {leads.map(lead => (
                            <tr key={lead._id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-800">{lead.title}</div>
                                    <div className="flex items-center text-sm text-slate-500 space-x-1 mt-1"><Building2 size={14} /> <span>{lead.company}</span></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-sm text-slate-600 space-x-1 mb-1"><Mail size={14} /> <span>{lead.email}</span></div>
                                    <div className="flex items-center text-sm text-slate-500 space-x-1"><Phone size={14} /> <span>{lead.phone || 'N/A'}</span></div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{lead.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => convertToClient(lead._id)} className="text-emerald-600 hover:text-emerald-800 flex items-center justify-end space-x-1 text-sm font-medium">
                                        <span>Convert to Client</span> <ArrowRightCircle size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No leads found. Create one above!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leads;
