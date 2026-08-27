import { useContext } from 'react';
import { Bell, Search, Calendar, LogOut } from 'lucide-react';
import AuthContext from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center bg-slate-100/70 px-4 py-2 rounded-xl w-64 md:w-96 border border-slate-200 focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-300 transition-all">
                <Search size={18} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Search leads, clients, projects..."
                    className="bg-transparent border-none focus:outline-none ml-2 w-full text-sm placeholder-slate-400 text-slate-700"
                />
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Calendar size={16} />
                    <span className="font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <button className="relative text-slate-400 hover:text-purple-600 transition">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name}</p>
                        <p className="text-xs text-slate-500">{user?.role === 'Admin' ? 'Administrator' : 'Sales Rep'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center cursor-pointer shadow-inner border border-purple-200">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 ml-1 p-2 rounded-lg hover:bg-red-50 transition" title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};
export default Navbar;
