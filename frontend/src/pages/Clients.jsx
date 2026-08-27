import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import { UserCheck, Phone, Mail, History } from 'lucide-react';

const Clients = () => {
    const { user } = useContext(AuthContext);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('http://localhost:5000/api/clients', config);
            setClients(res.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Active Clients Directory</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(client => (
                    <div key={client._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-emerald-600">
                                <UserCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{client.name}</h3>
                                <p className="text-xs text-emerald-600 font-medium">Joined {new Date(client.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center text-sm text-slate-600 space-x-3">
                                <Mail size={16} className="text-slate-400" /> <span>{client.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-600 space-x-3">
                                <Phone size={16} className="text-slate-400" /> <span>{client.phone || 'N/A'}</span>
                            </div>
                            {client.convertedFrom && (
                                <div className="flex items-center text-sm text-slate-600 space-x-3 pt-2">
                                    <History size={16} className="text-blue-400" />
                                    <span className="text-xs text-slate-400">Converted from Lead: {client.convertedFrom.name || client.convertedFrom}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {clients.length === 0 && (
                    <div className="col-span-3 text-center py-12 text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                        No clients yet. Go to Leads and convert a qualified lead!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Clients;
