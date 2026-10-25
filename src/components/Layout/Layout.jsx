import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ title, subtitle, children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 relative">

            {/* Sidebar (Handles both Desktop and Mobile views) */}
            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* Mobile Backdrop Overlay - Darkens the screen when sidebar is open on mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Right Side Container */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header with Menu Button */}
                <Header
                    title={title}
                    subtitle={subtitle}
                    onMenuClick={() => setIsMobileOpen(true)}
                />

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 relative z-0">
                    {children ?? <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default Layout;