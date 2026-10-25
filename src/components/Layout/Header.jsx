import React from 'react';
import { Bell, Calendar, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title, subtitle, onMenuClick }) => {
    const { user } = useAuth();

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const enrollmentNo = user?.enrollmentNo || '2024F-BCS-134';
    const displayName = user?.name
        ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
        : 'Student';

    return (
        <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white border-b border-indigo-900 sticky top-0 z-30 shadow-md">
            <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 gap-3">

                {/* Left Section: Hamburger, Title, and Mobile Welcome Block */}
                <div className="flex items-center md:items-start gap-3 min-w-0">
                    {/* Hamburger Icon for Mobile */}
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 -ml-2 rounded-lg text-indigo-200 hover:bg-white/10 transition-colors self-start mt-0.5"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col min-w-0">
                        <h1 className="text-lg md:text-2xl font-bold text-white truncate">{title}</h1>
                        {subtitle && (
                            <p className="text-xs md:text-sm text-indigo-200 mt-0.5 truncate hidden sm:block">
                                {subtitle}
                            </p>
                        )}

                        {/* 👇 MOBILE ONLY WELCOME BLOCK 👇 */}
                        <div className="md:hidden mt-2 flex flex-col gap-1">
                            <div className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold">
                                Welcome back, <span className="text-white">{displayName}</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-indigo-200 bg-white/10 px-2 py-1 rounded-md w-max backdrop-blur-sm">
                                <span>ID:</span>
                                <span className="font-semibold text-white">{enrollmentNo}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Desktop Welcome, Date, Notifications, Avatar */}
                <div className="flex items-center gap-2 md:gap-4 shrink-0 self-start md:self-center mt-1 md:mt-0">

                    {/* Desktop Welcome Text */}
                    <div className="hidden md:block text-right">
                        <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold">
                            Welcome back
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold text-indigo-200">{enrollmentNo}</span>
                            <span className="text-indigo-400/50 mx-2">||</span>
                            <span className="font-bold text-white">{displayName}</span>
                        </p>
                    </div>

                    {/* Date pill (Hidden on tablet/mobile) */}
                    <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-indigo-200 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{today}</span>
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2 text-indigo-200 hover:bg-white/10 rounded-lg transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900"></span>
                    </button>

                    {/* Avatar */}
                    <div
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0 border border-white/20"
                        style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}
                    >
                        {displayName.charAt(0).toUpperCase()}
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;