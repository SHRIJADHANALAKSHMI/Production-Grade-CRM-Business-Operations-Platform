import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import { Users, UserCheck, BadgeAlert } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ leads: 0, clients: 0, users: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get('http://localhost:5000/api/dashboard', config);
                setStats(res.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        if (user) fetchStats();
    }, [user]);

    return (
        <div className="max-w-7xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Business Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-xl"><BadgeAlert size={32} /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium tracking-wide">Total Leads</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.leads}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl"><UserCheck size={32} /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium tracking-wide">Active Clients</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.clients}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-xl"><Users size={32} /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium tracking-wide">Team Members</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.users}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
