import { useEffect, useState, useContext } from 'react';
import api from '../services/api.js';
import AuthContext from '../context/AuthContext.jsx';
import { UserCheck, Phone, Mail, History, Loader2, ArrowUpRight } from 'lucide-react';

const Clients = () => {
    const { user } = useContext(AuthContext);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setIsLoading(true);
                const res = await api.get('/clients');
                setClients(res.data.data.reverse());
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setIsLoading(false);
            }
        };
        if (user) fetchClients();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Active Clients Directory</h1>
                    <p className="text-sm text-slate-500 mt-1">Directory of all successfully converted pipeline leads.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(client => (
                    <div key={client._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center space-x-4 mb-5">
                            <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 ring-4 ring-purple-50 group-hover:bg-purple-100 transition-colors">
                                <UserCheck size={26} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{client.name}</h3>
                                <span className="inline-flex items-center space-x-1 text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md mt-1">
                                    <ArrowUpRight size={14} /> <span>Active Client</span>
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-5 border-t border-slate-100">
                            <div className="flex items-center text-sm text-slate-600 space-x-3">
                                <Mail size={16} className="text-slate-400 group-hover:text-purple-400 transition-colors" />
                                <span className="truncate">{client.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-600 space-x-3">
                                <Phone size={16} className="text-slate-400 group-hover:text-purple-400 transition-colors" />
                                <span>{client.phone || 'N/A'}</span>
                            </div>
                            {client.convertedFrom && (
                                <div className="flex items-center text-sm text-slate-600 space-x-3 pt-3">
                                    <History size={16} className="text-blue-400" />
                                    <span className="text-xs text-slate-500 font-medium truncate">Converted from Setup Lead: {client.convertedFrom.name || client.convertedFrom}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {clients.length === 0 && (
                    <div className="col-span-3 text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-slate-300">
                        <div className="bg-slate-50 p-4 rounded-full inline-block mb-4 text-slate-400">
                            <UserCheck size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No clients yet</h3>
                        <p className="text-slate-500 text-sm mt-1">Go to your Leads pipeline and convert a qualified lead to see them appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Clients;
