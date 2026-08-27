import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const LoginCard = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('admin@crm.com');
    const [password, setPassword] = useState('admin123');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await api.post('/auth/login', { email, password });

            // Expected backend token via standard method
            const token = res.data.token || res.data.data?.token;
            localStorage.setItem('token', token); // explicit raw extraction

            login(res.data.data.user || res.data.data, token);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/20 backdrop-blur-xl p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back 👋</h2>
            <p className="text-slate-500 mb-8 font-medium">Please enter your details to sign in.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium bg-slate-50/50"
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium bg-slate-50/50"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex items-center justify-between text-sm font-medium">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                        <span className="text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
                    </label>
                    <a href="#" className="text-purple-600 hover:text-purple-700 hover:underline transition-all">Forgot password?</a>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-[15px] shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:transform-none"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Login to Account'}
                </button>
            </form>

            <div className="mt-8 flex items-center justify-center space-x-4">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Or continue with</span>
                <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <button type="button" className="mt-6 w-full flex items-center justify-center py-3 px-4 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-[15px] transition-all">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.43 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.16 6.16-4.16z" />
                </svg>
                Google
            </button>

            <p className="mt-8 text-center text-sm font-medium text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-purple-600 font-bold hover:text-purple-700 hover:underline transition-all">
                    Register now
                </Link>
            </p>
        </div>
    );
};

export default LoginCard;
