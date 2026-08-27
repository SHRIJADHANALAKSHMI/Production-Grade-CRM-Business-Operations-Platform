import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            login(res.data);
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="p-8 bg-white shadow-xl rounded-2xl w-96">
                <h2 className="mb-6 text-2xl font-bold text-center text-slate-800">Login to CRM</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button type="submit" className="w-full p-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        Sign In
                    </button>
                </form>
                <p className="mt-4 text-center text-slate-500">
                    No account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
