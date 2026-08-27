import Navbar from '../components/layout/Navbar.jsx';
import LoginCard from '../components/auth/LoginCard.jsx';
import { Users, BarChart3, Briefcase } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
            <Navbar />

            {/* Main Content Split */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-20 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">

                {/* Left Side: Marketing / Hero */}
                <div className="flex-1 w-full flex flex-col justify-center animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 font-bold text-sm w-max mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                        </span>
                        v2.0 Released
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                        Manage Leads. <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">
                            Close Deals.
                        </span> <br />
                        Grow Your Business.
                    </h1>

                    <p className="text-lg lg:text-xl text-slate-600 font-medium mb-10 max-w-xl leading-relaxed">
                        All-in-one CRM to manage leads, track sales, and grow your business efficiently. Built for modern fast-moving teams.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Lead & Customer Management</h3>
                                <p className="text-slate-500 text-sm font-medium">Track entire lifecycles seamlessly.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <BarChart3 size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Sales Pipeline & Analytics</h3>
                                <p className="text-slate-500 text-sm font-medium">Real-time charts and funnel stats.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Projects, Tasks & Invoices</h3>
                                <p className="text-slate-500 text-sm font-medium">Automated handover post-conversion.</p>
                            </div>
                        </div>
                    </div>

                    {/* Floating Dashboard Mock (Simplified) */}
                    <div className="mt-12 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 max-w-lg hidden lg:block transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                        <div className="flex gap-4 items-center mb-6">
                            <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                            <div className="flex-1">
                                <div className="h-3 w-1/3 bg-slate-200 rounded mb-2"></div>
                                <div className="h-2 w-1/4 bg-slate-100 rounded"></div>
                            </div>
                            <div className="h-6 w-16 bg-emerald-100 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-20 bg-purple-50 rounded-xl border border-purple-100"></div>
                            <div className="h-20 bg-blue-50 rounded-xl border border-blue-100"></div>
                            <div className="h-20 bg-emerald-50 rounded-xl border border-emerald-100"></div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Component */}
                <div className="w-full lg:w-max flex justify-center lg:justify-end relative z-10">
                    {/* Decorative Blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-purple-400/20 to-indigo-500/20 blur-3xl rounded-full -z-10"></div>
                    <LoginCard />
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
