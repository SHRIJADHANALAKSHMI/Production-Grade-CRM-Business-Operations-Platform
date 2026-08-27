import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext.jsx';

import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Leads from './pages/Leads.jsx';
import Clients from './pages/Clients.jsx';

const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
    return (
        <Router>
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
                <Navbar />
                <main className="flex-grow pb-12">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
                        <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
