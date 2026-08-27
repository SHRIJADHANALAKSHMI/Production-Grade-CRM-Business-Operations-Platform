import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Briefcase, Settings } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { name: 'Leads', icon: <Users size={20} />, path: '/leads' },
        { name: 'Clients', icon: <UserCheck size={20} />, path: '/clients' },
        { name: 'Projects', icon: <Briefcase size={20} />, path: '/projects' },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 h-screen fixed left-0 top-0 hidden md:flex flex-col z-20">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold text-xl tracking-wide">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-sm shadow-sm ring-2 ring-purple-600/30">
                        ⚡
                    </div>
                    <span>CRM Pro</span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-1.5 px-3">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-purple-600 text-white font-medium shadow-md shadow-purple-900/50'
                                        : 'hover:bg-slate-800 hover:text-white'
                                    }`
                                }
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
                CRM MVP &copy; {new Date().getFullYear()}
            </div>
        </aside>
    );
};
export default Sidebar;
