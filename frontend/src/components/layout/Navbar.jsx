import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Left: Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
                        ⚡
                    </div>
                    <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">CRM Pro</span>
                </Link>

                {/* Center: Links (Hidden on small screens) */}
                <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
                    <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-purple-600 transition-colors">Features</button>
                    <button onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-purple-600 transition-colors">Solutions</button>
                    <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-purple-600 transition-colors">Pricing</button>
                    <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-purple-600 transition-colors">About</button>
                    <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-purple-600 transition-colors">Contact</button>
                </div>

                {/* Right: Auth Buttons */}
                <div className="flex items-center gap-3">
                    <button className="hidden sm:block px-5 py-2.5 rounded-xl font-semibold text-purple-600 border-2 border-purple-100 hover:border-purple-600/30 hover:bg-purple-50 transition-all">
                        Request Demo
                    </button>
                    <Link to="/" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 hover:shadow-lg hover:shadow-purple-600/30 transition-all">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
