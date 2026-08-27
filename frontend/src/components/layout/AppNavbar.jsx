import { Bell, Search, User } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext.jsx';

const AppNavbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="sticky top-0 z-10 w-full bg-white border-b border-slate-200 shadow-sm h-16 flex items-center px-6 transition-all duration-300">
            {/* Left: Search */}
            <div className="flex-1 flex items-center">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search leads, projects, clients..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">
                <button className="relative text-slate-500 hover:text-purple-600 transition-colors">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 border-l border-slate-200 pl-6 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 leading-none">{user?.name || 'Jane Doe'}</p>
                        <p className="text-xs font-medium text-slate-500 mt-1">{user?.role || 'Admin'}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold border border-purple-200 shadow-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppNavbar;
