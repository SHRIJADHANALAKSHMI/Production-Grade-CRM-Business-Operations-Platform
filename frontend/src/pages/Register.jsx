import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';
import AuthContext from '../context/AuthContext.jsx';
import { Loader2 } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Sales');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await api.post('/auth/register', { name, email, password, role });
            login(res.data.data); // Login automatically after register
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Create Account</h2>
                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <select
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="Sales">Sales Rep</option>
                            <option value="Admin">Administrator</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Register'}
                    </button>
                    <p className="text-center text-sm text-slate-500 mt-4">
                        Already have an account? <Link to="/login" className="text-purple-600 font-medium hover:underline">Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
