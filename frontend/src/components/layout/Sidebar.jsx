import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Briefcase, Settings, LogOut, BarChart3, Inbox, Folders } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext.jsx';

const Sidebar = () => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const sidebarNav = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['Admin', 'Manager'] },
        { name: 'Leads', icon: Inbox, path: '/leads', roles: ['Admin', 'Manager', 'Sales'] },
        { name: 'Clients', icon: UserCheck, path: '/clients', roles: ['Admin', 'Manager', 'Sales'] },
        { name: 'Projects', icon: Briefcase, path: '/projects', roles: ['Admin', 'Manager', 'Sales'] },
        { name: 'Settings', icon: Settings, path: '/settings', roles: ['Admin'] },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 h-screen fixed left-0 top-0 hidden md:flex flex-col z-20 shadow-2xl">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold text-xl tracking-wide">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-sm shadow-md ring-2 ring-purple-600/30">
                        ⚡
                    </div>
                    <span>CRM Pro</span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-2 px-4">
                    {sidebarNav.filter(nav => nav.roles.includes(user?.role || 'Admin')).map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                            : 'hover:bg-slate-800 hover:text-white'
                                        }`
                                    }
                                >
                                    <Icon size={20} />
                                    <span>{item.name}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-bold text-sm transition-colors"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </aside>
    );
};
export default Sidebar;
