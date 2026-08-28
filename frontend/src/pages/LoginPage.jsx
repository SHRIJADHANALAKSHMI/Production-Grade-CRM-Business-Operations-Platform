import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';
import AuthContext from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle2, TrendingUp, Users, Zap } from 'lucide-react';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await api.post('/auth/login', { email, password });
            const user = res.data.data;
            const token = user.token;

            login(user, token);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-purple-200">
            {/* Left side: Marketing Content (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-purple-600/20 to-indigo-600/20 blur-3xl rounded-full pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full justify-between p-16 xl:p-20">
                    <Link to="/" className="flex items-center gap-3 w-fit group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
                            ⚡
                        </div>
                        <span className="text-2xl font-extrabold text-white">CRM Pro</span>
                    </Link>

                    <div className="mt-20">
                        <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.1] mb-6">
                            Manage Leads. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Close Deals.</span> <br />
                            Grow Your Business.
                        </h1>
                        <p className="text-xl text-slate-400 font-medium max-w-lg mb-12">
                            The all-in-one platform built for modern sales teams to turn prospects into loyal customers.
                        </p>

                        <div className="space-y-6">
                            <FeatureItem icon={TrendingUp} text="Track pipelines dynamically in real-time" />
                            <FeatureItem icon={Users} text="Collaborate natively with Role-Based Access" />
                            <FeatureItem icon={Zap} text="Automate tasks and increase conversion velocity" />
                        </div>
                    </div>

                    <div className="mt-auto pt-20">
                        <p className="text-sm text-slate-500 font-medium">© 2026 CRM Pro SaaS Platform.</p>
                    </div>
                </div>
            </div>

            {/* Right side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile top logo */}
                <div className="absolute top-8 left-8 lg:hidden">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">⚡</div>
                        <span className="font-extrabold text-slate-900 text-lg">CRM Pro</span>
                    </Link>
                </div>

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
                        <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
                    </div>

                    {/* Google Login Button */}
                    <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all mb-8 shadow-sm">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            <path fill="none" d="M1 1h22v22H1z" />
                        </svg>
                        Log in with Google
                    </button>

                    <div className="relative flex items-center mb-8">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold uppercase tracking-wider">Or continue with email</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* Standard Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-slate-50 hover:bg-white transition-all font-medium text-slate-900"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-slate-700">Password</label>
                                <a href="#" className="text-sm font-bold text-purple-600 hover:text-purple-700 transition">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-slate-50 hover:bg-white transition-all font-medium text-slate-900"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                            <label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer">Remember me for 30 days</label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-4 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-base shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 mt-6"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-600 font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Micro Component for Features
const FeatureItem = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Icon size={20} />
        </div>
        <span className="text-slate-300 font-medium text-lg">{text}</span>
    </div>
);

export default LoginPage;
