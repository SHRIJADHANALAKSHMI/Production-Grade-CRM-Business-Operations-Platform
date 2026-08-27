import { Bell, Search, User, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';
import api from '../../services/api.js';

const AppNavbar = () => {
    const { user, logout, notifications, markNotificationRead } = useContext(AuthContext);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfileDrop, setShowProfileDrop] = useState(false);

    // Search
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDrop, setShowSearchDrop] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            setShowSearchDrop(false);
            return;
        }
        const delay = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await api.get(`/search?q=${searchQuery}`);
                setSearchResults(res.data.data);
                setShowSearchDrop(true);
            } catch (e) {
                console.error("Search failed");
            } finally {
                setIsSearching(false);
            }
        }, 500);
        return () => clearTimeout(delay);
    }, [searchQuery]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm h-16 flex items-center px-6 transition-all duration-300">
            {/* Left: Search */}
            <div className="flex-1 flex items-center">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search leads, projects, clients..."
                        className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                    />

                    {/* Search Dropdown */}
                    {showSearchDrop && (
                        <div className="absolute top-12 left-0 w-full bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50">
                            {isSearching ? (
                                <div className="p-4 flex justify-center"><Loader2 size={16} className="animate-spin text-purple-600" /></div>
                            ) : searchResults.length > 0 ? (
                                <div className="max-h-64 overflow-y-auto">
                                    {searchResults.map(res => (
                                        <button
                                            key={res._id}
                                            onClick={() => { navigate(res.url); setShowSearchDrop(false); setSearchQuery(""); }}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 flex flex-col transition"
                                        >
                                            <span className="font-bold text-slate-800 text-sm flex justify-between items-center">
                                                {res.name} <span className="text-[10px] text-slate-400 uppercase">{res.type}</span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-sm font-medium text-slate-500">No results found.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">

                {/* Notification Dropdown Container */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifs(!showNotifs)}
                        className={`relative text-slate-500 hover:text-purple-600 transition-colors p-2 rounded-full ${showNotifs ? 'bg-purple-50 text-purple-600' : ''}`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                    </button>

                    {showNotifs && (
                        <div className="absolute top-12 right-0 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col z-50">
                            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                                <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                            </div>
                            <div className="flex-1 max-h-80 overflow-y-auto w-full">
                                {notifications.length > 0 ? notifications.map(notif => (
                                    <div key={notif._id} onClick={() => { if (!notif.read) markNotificationRead(notif._id); if (notif.link) { navigate(notif.link); setShowNotifs(false); } }} className={`p-4 border-b border-slate-50 cursor-pointer transition ${notif.read ? 'bg-white opacity-60' : 'bg-purple-50/30 hover:bg-purple-50'}`}>
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-purple-500 shrink-0">
                                                {notif.read ? <CheckCircle2 size={14} className="text-slate-400" /> : <Bell size={14} className="text-purple-600" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-xs ${notif.read ? 'text-slate-600 font-medium' : 'text-slate-800 font-bold'}`}>{notif.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : <div className="p-8 text-center text-slate-400 text-sm font-medium">No active alerts.</div>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown Container */}
                <div className="relative border-l border-slate-200 pl-6">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowProfileDrop(!showProfileDrop)}>
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-800 leading-none">{user?.name || 'Jane Doe'}</p>
                            <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mt-1">{user?.role || 'Admin'}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold border border-purple-200 shadow-sm">
                            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                        </div>
                    </div>

                    {showProfileDrop && (
                        <div className="absolute top-12 right-0 w-48 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden flex flex-col z-50">
                            <div className="p-3 border-b border-slate-100 bg-slate-50/50 block sm:hidden">
                                <p className="text-sm font-bold text-slate-800 leading-none">{user?.name}</p>
                                <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mt-1">{user?.role}</p>
                            </div>
                            <button onClick={() => { setShowProfileDrop(false); navigate('/settings'); }} className="text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-purple-600 w-full transition">My Profile</button>
                            <button onClick={() => { setShowProfileDrop(false); navigate('/settings'); }} className="text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-purple-600 w-full transition">Settings</button>
                            <div className="h-px bg-slate-100 w-full"></div>
                            <button onClick={() => { setShowProfileDrop(false); logout(); navigate('/'); }} className="text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 w-full transition">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AppNavbar;
