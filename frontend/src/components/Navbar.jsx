import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { LayoutDashboard, Users, UserCheck, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-slate-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex space-x-6 items-center">
                        <span className="font-bold text-xl tracking-wider text-blue-400">CRM<span className="text-white">PRO</span></span>
                        <div className="hidden md:flex space-x-4">
                            <Link to="/" className="flex items-center space-x-1 hover:text-blue-400 transition"><LayoutDashboard size={18} /> <span>Dashboard</span></Link>
                            <Link to="/leads" className="flex items-center space-x-1 hover:text-blue-400 transition"><Users size={18} /> <span>Leads</span></Link>
                            <Link to="/clients" className="flex items-center space-x-1 hover:text-blue-400 transition"><UserCheck size={18} /> <span>Clients</span></Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-semibold">{user.name}</span>
                            <span className="text-xs text-slate-400">{user.role}</span>
                        </div>
                        <button onClick={handleLogout} className="p-2 bg-slate-800 rounded-lg hover:bg-red-600 transition text-slate-300 hover:text-white">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
