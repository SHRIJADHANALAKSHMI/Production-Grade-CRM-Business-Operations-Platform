import React from 'react';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800">
            {/* Sidebar reserved space for desktop */}
            <Sidebar />

            {/* Main content shifted right */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 p-6 overflow-auto relative">
                    <div className="mx-auto w-full max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
export default Layout;
