import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import unilogo from '../../assets/unilogo.png';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, BookOpen, GraduationCap, Building2,
    Settings, LogOut, ChevronLeft, ChevronRight, ChevronDown,
    Calendar, FileText, UserCheck, ClipboardList, DollarSign,
    Award, Home, Map, Info, Download, Trophy, Laptop, Ticket, Bell,
    X, FileCheck, Megaphone, CalendarDays, ToggleRight,
    Shield, Power, AlertCircle, LayoutTemplate, Lock, Image
} from 'lucide-react';

const menuConfig = {
    superadmin: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/superadmin/dashboard' },
        { icon: Building2, label: 'Departments', path: '/superadmin/departments' },
        { icon: BookOpen, label: 'Academics', path: '/superadmin/academics/programs' },
        { icon: Users, label: 'All Users', path: '/superadmin/users' },
        { icon: BookOpen, label: 'Courses', path: '/superadmin/courses' },
        { icon: Megaphone, label: 'Announcements', path: '/superadmin/announcements' },
        {
            icon: Settings,
            label: 'Settings',
            children: [
                { icon: Lock, label: 'Change Password', path: '/superadmin/settings/password' },
                { icon: Image, label: 'Profile Image', path: '/superadmin/settings/profile' },
            ]
        },
    ],
    systemadmin: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/systemadmin/dashboard' },
        {
            icon: Users,
            label: 'User Management',
            children: [
                { icon: GraduationCap, label: 'Students', path: '/systemadmin/users/students' },
                { icon: BookOpen, label: 'Teachers', path: '/systemadmin/users/teachers' },
                { icon: Shield, label: 'Admins', path: '/systemadmin/users/admins' },
            ]
        },
        { icon: BookOpen, label: 'Courses', path: '/systemadmin/courses' },
        {
            icon: ToggleRight,
            label: 'Registration',
            children: [
                { icon: Power, label: 'Manage Registration', path: '/systemadmin/registration/manage' },
                { icon: GraduationCap, label: '1st Sem Auto-Assign', path: '/systemadmin/registration/first-semester' },
<<<<<<< HEAD
                { icon: BookOpen, label: 'Student Registrations', path: '/systemadmin/registration/students' },
            ]
        },
        {
            icon: Settings,
            label: 'Settings',
            children: [
                { icon: Lock, label: 'Change Password', path: '/systemadmin/settings/password' },
                { icon: Image, label: 'Profile Image', path: '/systemadmin/settings/profile' },
=======
                 { icon: BookOpen, label: 'Student Registrations', path: '/systemadmin/registration/students' },
>>>>>>> 48ee14e4b0486ed9bbb0f38b00f1d40965b2e1da
            ]
        },
    ],
    department_admin: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        {
            icon: Users,
            label: 'People',
            children: [
                { icon: BookOpen, label: 'Teachers', path: '/admin/teachers' },
                { icon: GraduationCap, label: 'Students', path: '/admin/students' },
            ],
        },
        {
            icon: BookOpen,
            label: 'Academics',
            children: [
                { icon: UserCheck, label: 'Assign Courses', path: '/admin/assign-courses' },
                { icon: Calendar, label: 'Manage Timetable', path: '/admin/timetable' },
                { icon: Building2, label: 'Rooms & Labs', path: '/admin/rooms' },
            ],
        },
        {
            icon: Megaphone,
            label: 'Communication',
            children: [
                { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
            ],
        },
        {
            icon: Settings,
            label: 'Settings',
            children: [
                { icon: Lock, label: 'Change Password', path: '/admin/settings/password' },
                { icon: Image, label: 'Profile Image', path: '/admin/settings/profile' },
            ]
        },
    ],
    admissions: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admissions/dashboard' },
        { icon: Users, label: 'Students', path: '/admissions/students' },
        { icon: BookOpen, label: 'Teachers', path: '/admissions/teachers' },
        {
            icon: Settings,
            label: 'Settings',
            children: [
                { icon: Lock, label: 'Change Password', path: '/admissions/settings/password' },
                { icon: Image, label: 'Profile Image', path: '/admissions/settings/profile' },
            ]
        },
    ],
    finance: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/finance/dashboard' },
        { icon: DollarSign, label: 'Fee Management', path: '/finance/fees' },
        { icon: FileText, label: 'Fee Rates', path: '/finance/rates' },
        {
            icon: Settings,
            label: 'Settings',
            children: [
                { icon: Lock, label: 'Change Password', path: '/finance/settings/password' },
                { icon: Image, label: 'Profile Image', path: '/finance/settings/profile' },
            ]
        },
    ],
    examination: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/examination/dashboard' },
        { icon: CalendarDays, label: 'Exam Timetable', path: '/examination/timetable' },
        { icon: FileCheck, label: 'Check Results', path: '/examination/results/publish' },
        {
            icon: FileText,
            label: 'Transcripts',
            children: [
                { icon: FileText, label: 'Manage Student Transcripts', path: '/examination/transcripts' },
                { icon: LayoutTemplate, label: 'Transcript Design', path: '/examination/transcripts/design' },
            ]
        },
        {
            icon: Settings,
            label: 'Settings',
            children: [
                { icon: Lock, label: 'Change Password', path: '/examination/settings/password' },
                { icon: Image, label: 'Profile Image', path: '/examination/settings/profile' },
            ]
        },
    ],
    teacher: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard' },
        { icon: BookOpen, label: 'My Courses', path: '/teacher/courses' },
        { icon: BookOpen, label: 'My Classes', path: '/teacher/classes' },
        { icon: UserCheck, label: 'Attendance', path: '/teacher/attendance' },
        { icon: ClipboardList, label: 'Assessment', path: '/teacher/assessments' },
        {
            icon: Settings,
            label: 'Settings',
            children: [
                { icon: Lock, label: 'Change Password', path: '/teacher/settings/password' },
                { icon: Image, label: 'Profile Image', path: '/teacher/settings/profile' },
            ]
        },
    ],
    student: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
        {
            icon: Home,
            label: 'General',
            children: [
                { icon: UserCheck, label: 'Attendance', path: '/student/attendance' },
                { icon: Calendar, label: 'Timetable', path: '/student/timetable' },
                { icon: Map, label: 'Roadmap', path: '/student/roadmap' },
                { icon: Bell, label: 'Announcements', path: '/student/announcements' },
            ],
        },
        {
            icon: BookOpen,
            label: 'Course',
            children: [
                { icon: BookOpen, label: 'My Courses', path: '/student/courses' },
                { icon: Info, label: 'Course Info', path: '/student/course-info' },
            ],
        },
        {
            icon: ClipboardList,
            label: 'Registration',
            children: [
                { icon: FileText, label: 'Registration', path: '/student/registration' },
            ],
        },
        {
            icon: DollarSign,
            label: 'Fee',
            children: [
                { icon: Download, label: 'Download Voucher', path: '/student/fee-voucher' },
            ],
        },
        {
            icon: Award,
            label: 'Exam',
            children: [
                { icon: Ticket, label: 'Exam Admit Card', path: '/student/admit-card' },
                { icon: FileCheck, label: 'Assessment Result', path: '/student/assessment-result' },
                { icon: Trophy, label: 'Results', path: '/student/results' },
                { icon: Laptop, label: 'Online Exam', path: '/student/online-exam' },
                { icon: FileText, label: 'Transcript', path: '/student/transcript' },
            ],
        },
        {
            icon: Settings,
            label: 'Settings',
            children: [
                { icon: Lock, label: 'Change Password', path: '/student/settings/password' },
                { icon: Image, label: 'Profile Image', path: '/student/settings/profile' },
            ]
        },
    ],
};

const SidebarGroup = ({ item, isCollapsed, setIsMobileOpen }) => {
    const location = useLocation();
    const isChildActive = item.children.some(child => location.pathname === child.path);
    const [open, setOpen] = useState(isChildActive);

    useEffect(() => {
        if (isChildActive) setOpen(true);
    }, [isChildActive]);

    const Icon = item.icon;

    if (isCollapsed) {
        return (
            <div className="flex justify-center p-3 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer" title={item.label}>
                <Icon className="w-6 h-6 shrink-0" />
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-[15px] font-bold rounded-lg transition-colors ${open ? 'text-slate-900' : 'text-slate-700 hover:bg-slate-50'
                    }`}
            >
                <span className="flex items-center gap-4">
                    <Icon className="w-5 h-5 shrink-0 text-slate-500" strokeWidth={2} />
                    <span>{item.label}</span>
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} strokeWidth={2.5} />
            </button>

            {open && (
                <div className="ml-5 pl-4 border-l-2 border-slate-100 space-y-1 my-1">
                    {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                            <NavLink
                                key={child.path}
                                to={child.path}
                                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                <ChildIcon className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                                <span>{child.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    let menuKey = user?.role;
    if (user?.role === 'department_admin') {
        const deptCode = user.departmentCode || user.department?.code;
        if (deptCode === 'ADM') menuKey = 'admissions';
        else if (deptCode === 'FIN') menuKey = 'finance';
        else if (deptCode === 'EXM') menuKey = 'examination';
        else menuKey = 'department_admin';
    }

    const menuItems = menuConfig[menuKey] || [];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside
            className={`
                bg-white border-r border-slate-200 h-screen flex flex-col transition-all duration-300 z-50
                md:sticky md:top-0 md:translate-x-0
                ${isCollapsed ? 'md:w-20' : 'md:w-[280px]'}
                fixed inset-y-0 left-0 w-[280px] shadow-sm
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
        >
            {/* Top Logo & Collapse Section */}
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-5 h-[100px] shrink-0 border-b border-slate-100 relative`}>
                <div className="flex items-center gap-2">

                    {/* Transparent Logo */}
                    <div className="flex items-center justify-center shrink-0">
                        <img src={unilogo} alt="University Logo" className={isCollapsed ? "w-10 h-10 object-contain" : "w-[60px] h-auto object-contain"} />
                    </div>

                    {/* Vertical Line & Text (Hidden when collapsed) */}
                    {!isCollapsed && !isMobileOpen && (
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-[1px] bg-slate-300"></div>
                            <div className="flex flex-col">
                                <h1 className="font-bold text-[#4a2b6e] text-sm leading-tight tracking-tight">Sir Syed University</h1>
                                <p className="text-[10px] font-semibold text-slate-500 italic">of Engineering & Technology</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop Collapse Button (Top Right) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex text-slate-500 hover:text-slate-700 transition-colors p-1"
                >
                    {isCollapsed ? <ChevronRight className="w-6 h-6" strokeWidth={2} /> : <ChevronLeft className="w-8 h-8" strokeWidth={2} />}
                </button>

                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="md:hidden text-slate-400 hover:text-slate-700 p-1"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                {menuItems.map((item, idx) =>
                    item.children ? (
                        <SidebarGroup key={idx} item={item} isCollapsed={isCollapsed && !isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
                    ) : (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3.5 text-[15px] font-bold rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                } ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`
                            }
                            title={isCollapsed && !isMobileOpen ? item.label : ''}
                        >
                            <item.icon className={`w-5 h-5 shrink-0 ${isCollapsed && !isMobileOpen ? '' : 'text-slate-500'}`} strokeWidth={2} />
                            {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
                        </NavLink>
                    )
                )}
            </nav>

            {/* Footer (Only Logout) */}
            <div className="p-4 border-t border-slate-100 shrink-0">
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-4 px-4 py-3 text-[15px] font-bold rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}
                >
                    <LogOut className="w-5 h-5 shrink-0 text-slate-500" strokeWidth={2} />
                    {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;