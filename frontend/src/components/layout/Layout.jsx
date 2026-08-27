import Sidebar from './Sidebar.jsx';
import AppNavbar from './AppNavbar.jsx';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:ml-64 relative min-w-0">
                <AppNavbar />

                {/* Scrollable Content Container */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
