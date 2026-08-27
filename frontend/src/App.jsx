import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthContext, { AuthProvider } from './context/AuthContext.jsx';

import Layout from './components/layout/Layout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Leads from './pages/Leads.jsx';
import Clients from './pages/Clients.jsx';
import ClientDetails from './pages/ClientDetails.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';

const NotFound = () => (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <p className="text-8xl font-black text-slate-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-700 mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
        <a href="/" className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 transition font-medium">
            Return to Dashboard
        </a>
    </div>
);

const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return user ? <Layout>{children}</Layout> : <Navigate to="/" />;
};

function AppRoutes() {
    const { user } = useContext(AuthContext);
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    success: { style: { background: '#10b981', color: '#fff' } },
                    error: { style: { background: '#ef4444', color: '#fff' } },
                }}
            />
            <Routes>
                <Route path="/" element={user ? (user.role === 'Sales' ? <Navigate to="/leads" replace /> : <Navigate to="/dashboard" replace />) : <LandingPage />} />
                <Route path="/register" element={user ? (user.role === 'Sales' ? <Navigate to="/leads" replace /> : <Navigate to="/dashboard" replace />) : <RegisterPage />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
                <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
                <Route path="/clients/:id" element={<PrivateRoute><ClientDetails /></PrivateRoute>} />
                <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
                <Route path="/projects/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
                <Route path="*" element={<PrivateRoute><NotFound /></PrivateRoute>} />
            </Routes>
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
