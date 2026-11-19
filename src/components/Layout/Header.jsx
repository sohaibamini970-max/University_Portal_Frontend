import React, { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, Menu, Shield, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title, subtitle, onMenuClick }) => {
    const { user } = useAuth();
    const [actionsOpen, setActionsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const displayName = user?.fullName || user?.name || 'User';

    const userIdentifier = user?.enrollmentNo
        ? user.enrollmentNo
        : user?.role === 'superadmin'
            ? 'Super Admin'
            : '';

    const formattedRole = user?.role
        ? user.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : 'User';

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setActionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white border-b border-indigo-900 sticky top-0 z-30 shadow-md">
            <div className="flex items-start md:items-center justify-between px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 gap-2 sm:gap-3">

                {/* ============ LEFT SECTION ============ */}
                <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">

                    {/* Sidebar hamburger — visible xs → 768px, hidden at 769px+ */}
                    <button
                        onClick={onMenuClick}
                        className="inline-flex min-[769px]:hidden p-2 -ml-1 rounded-lg text-indigo-200 hover:bg-white/10 transition-colors shrink-0 mt-0.5"
                        aria-label="Open navigation menu"
                    >
                        <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <div className="flex flex-col min-w-0 flex-1">
                        <h1 className="text-base sm:text-lg md:text-2xl font-bold text-white truncate leading-tight">
                            {title}
                        </h1>

                        {subtitle && (
                            <p className="hidden sm:block text-xs md:text-sm text-indigo-200 mt-0.5 truncate">
                                {subtitle}
                            </p>
                        )}

                        <div className="md:hidden mt-1.5 flex flex-wrap items-center gap-1.5">
                            <span className="text-[9px] sm:text-[10px] text-indigo-300 uppercase tracking-wider font-bold">
                                Welcome,
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-white truncate max-w-[120px]">
                                {displayName}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-indigo-200 bg-white/10 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                <Shield className="w-2.5 h-2.5 text-emerald-400" />
                                <span className="truncate max-w-[80px]">{formattedRole}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* ============ RIGHT SECTION ============ */}
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 shrink-0 mt-0.5 md:mt-0">

                    {/* Desktop welcome text (md+) */}
                    <div className="hidden md:block text-right">
                        <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold">
                            Welcome back
                        </p>
                        <p className="text-xs lg:text-sm flex items-center justify-end gap-1.5 lg:gap-2">
                            {userIdentifier && (
                                <>
                                    <span className="font-semibold text-indigo-200 truncate max-w-[140px]">
                                        {userIdentifier}
                                    </span>
                                    <span className="text-indigo-400/50 hidden lg:inline">||</span>
                                </>
                            )}
                            <span className="font-bold text-white truncate max-w-[140px]">
                                {displayName}
                            </span>
                        </p>
                    </div>

                    {/* Date pill — xl+ only */}
                    <div className="hidden xl:flex items-center gap-2 text-xs font-semibold text-indigo-200 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{today}</span>
                    </div>

                    {/* INLINE ACTIONS (xl+) */}
                    <button className="hidden xl:inline-flex relative p-2 text-indigo-200 hover:bg-white/10 rounded-lg transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900" />
                    </button>

                    <div
                        className="hidden xl:flex w-10 h-10 rounded-full items-center justify-center text-white font-bold text-sm shadow-md shrink-0 border border-white/20"
                        style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}
                    >
                        {displayName.charAt(0).toUpperCase()}
                    </div>

                    {/* ===== COMPACT ACTIONS (below xl) ===== */}
                    <div className="xl:hidden relative" ref={dropdownRef}>

                        {/* --- < 769px: avatar only as dropdown trigger --- */}
                        <button
                            onClick={() => setActionsOpen(v => !v)}
                            className="min-[769px]:hidden inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm shadow-md shrink-0 border border-white/20 transition-transform active:scale-95"
                            style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}
                            aria-label="Open account menu"
                            aria-expanded={actionsOpen}
                        >
                            {displayName.charAt(0).toUpperCase()}
                        </button>

                        {/* --- 769px → 1279px: hamburger only as dropdown trigger --- */}
                        <button
                            onClick={() => setActionsOpen(v => !v)}
                            className="hidden min-[769px]:inline-flex xl:hidden p-2 -mr-1 rounded-lg text-indigo-200 hover:bg-white/10 transition-colors"
                            aria-label="Open actions"
                            aria-expanded={actionsOpen}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* --- Shared dropdown: xs avatar + sm hamburger --- */}
                        {actionsOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-slate-900/95 backdrop-blur-md border border-indigo-800 shadow-2xl overflow-hidden z-50">
                                <div className="p-4 border-b border-indigo-800 flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 border border-white/20"
                                        style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}
                                    >
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{displayName}</p>
                                        {userIdentifier && (
                                            <p className="text-[11px] text-indigo-300 truncate">{userIdentifier}</p>
                                        )}
                                        <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mt-0.5">
                                            {formattedRole}
                                        </p>
                                    </div>
                                </div>

                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-indigo-100 hover:bg-white/5 transition-colors">
                                    <div className="relative">
                                        <Bell className="w-4 h-4" />
                                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                                    </div>
                                    <span className="flex-1 text-left">Notifications</span>
                                    <span className="text-[10px] bg-red-500/90 text-white font-bold px-1.5 py-0.5 rounded-full">
                                        3
                                    </span>
                                </button>

                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-indigo-100 hover:bg-white/5 transition-colors">
                                    <User className="w-4 h-4" />
                                    <span className="flex-1 text-left">My Profile</span>
                                </button>

                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-indigo-100 hover:bg-white/5 transition-colors">
                                    <Settings className="w-4 h-4" />
                                    <span className="flex-1 text-left">Settings</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;