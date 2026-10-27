import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
                { icon: BookOpen, label: 'Student Registrations', path: '/systemadmin/registration/students' },
            ]
        },
        {
            icon: Settings,
            label: 'Settings',
            children: [
                { icon: Lock, label: 'Change Password', path: '/systemadmin/settings/password' },
                { icon: Image, label: 'Profile Image', path: '/systemadmin/settings/profile' },
            ]
        },
    ],
    // 👇 EDUCATION DEPARTMENTS (CS, IT, SE)
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
    // 👇 BUSINESS DEPARTMENTS (Admissions, Finance, Examination)
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
            label: 'Courses',
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
            icon: DollarSign,
            label: 'Fee',
            children: [
                { icon: Download, label: 'Download Voucher', path: '/student/fee-voucher' },
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
            <div className="sidebar-item justify-center" title={item.label}>
                <Icon className="w-5 h-5 shrink-0" />
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className={`sidebar-item w-full justify-between ${open ? 'sidebar-item-active' : ''}`}
            >
                <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-90'}`} />
            </button>

            {open && (
                <div className="ml-4 mt-1 pl-3 border-l-2 border-blue-100 space-y-1">
                    {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                            <NavLink
                                key={child.path}
                                to={child.path}
                                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:bg-gray-50 hover:text-blue-600'}`
                                }
                            >
                                <ChildIcon className="w-3.5 h-3.5 shrink-0" />
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

    // 👇 SMART MENU SELECTION LOGIC 👇
    let menuKey = user?.role;

    if (user?.role === 'department_admin') {
        const deptCode = user.departmentCode || user.department?.code;

        if (deptCode === 'ADM') menuKey = 'admissions';
        else if (deptCode === 'FIN') menuKey = 'finance';
        else if (deptCode === 'EXM') menuKey = 'examination';
        else menuKey = 'department_admin'; // Fallback for CS, IT, SE
    }

    const menuItems = menuConfig[menuKey] || [];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside
            className={`
                bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 z-50
                md:sticky md:top-0 md:translate-x-0
                ${isCollapsed ? 'md:w-20' : 'md:w-64'}
                fixed inset-y-0 left-0 w-64 shadow-2xl
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
        >
            {/* Logo & Mobile Close Button */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #7e22ce)' }}>
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    {(!isCollapsed || isMobileOpen) && (
                        <div>
                            <h1 className="font-bold text-gray-800 text-sm leading-tight">University</h1>
                            <p className="text-xs text-gray-500">Portal</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="md:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {menuItems.map((item, idx) =>
                    item.children ? (
                        <SidebarGroup key={idx} item={item} isCollapsed={isCollapsed && !isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
                    ) : (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                            className={({ isActive }) =>
                                `sidebar-item ${isActive ? 'sidebar-item-active' : ''} ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`
                            }
                            title={isCollapsed && !isMobileOpen ? item.label : ''}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
                        </NavLink>
                    )
                )}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 space-y-1 shrink-0">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`hidden md:flex sidebar-item w-full ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}
                >
                    {isCollapsed && !isMobileOpen ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span>Collapse</span>
                        </>
                    )}
                </button>

                <button
                    onClick={handleLogout}
                    className={`sidebar-item w-full text-red-500 hover:bg-red-50 hover:text-red-600 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;