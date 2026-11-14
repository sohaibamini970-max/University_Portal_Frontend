import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { api } from '../../context/AuthContext';
import {
    BookOpen, Users, Award, CheckCircle, Clock, MapPin,
    User, Hash, Briefcase, Mail, Calendar, ClipboardList, ArrowRight, Loader2
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, subtext, background, tag }) => (
    <div className={`group relative overflow-hidden rounded-2xl p-5 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${background}`}>
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10" />
        <div className="absolute right-16 -bottom-12 h-28 w-28 rounded-full bg-black/5" />
        <div className="relative z-10">
            <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur-sm">
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/95">{tag}</span>
            </div>
            <p className="mt-5 text-3xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 text-sm font-bold text-white">{label}</p>
            <p className="mt-1 text-xs font-medium text-white/75">{subtext}</p>
        </div>
    </div>
);

const SectionHeading = ({ title, subtitle, link, to, icon: Icon }) => (
    <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
            {Icon && <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700"><Icon className="h-5 w-5" /></div>}
            <div>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
                {subtitle && <p className="mt-0.5 text-xs font-medium text-slate-500">{subtitle}</p>}
            </div>
        </div>
        {link && <Link to={to} className="flex shrink-0 items-center gap-1 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100">{link}<ArrowRight className="h-4 w-4" /></Link>}
    </div>
);

const TeacherDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/teachers/dashboard-stats');
                setData(res.data);
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const quickActions = [
        { icon: ClipboardList, label: 'Assignments', description: 'Create or grade', path: '/teacher/assessments', color: 'bg-indigo-100 text-indigo-700', hover: 'hover:border-indigo-300 hover:bg-indigo-50' },
        { icon: CheckCircle, label: 'Attendance', description: 'Mark today\'s', path: '/teacher/attendance', color: 'bg-emerald-100 text-emerald-700', hover: 'hover:border-emerald-300 hover:bg-emerald-50' },
        { icon: Users, label: 'Students', description: 'View directory', path: '/teacher/classes', color: 'bg-orange-100 text-orange-700', hover: 'hover:border-orange-300 hover:bg-orange-50' },
        { icon: BookOpen, label: 'My Classes', description: 'View schedule', path: '/teacher/classes', color: 'bg-blue-100 text-blue-700', hover: 'hover:border-blue-300 hover:bg-blue-50' }
    ];

    if (loading) {
        return (
            <Layout title="Teacher Dashboard">
                <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
            </Layout>
        );
    }

    // Fallback if data is empty
    if (!data) return <Layout title="Teacher Dashboard"><div className="p-10 text-center">No data found.</div></Layout>;

    const stats = [
        {
            icon: BookOpen,
            label: 'Total Courses',
            value: data.stats.totalCourses.toString().padStart(2, '0'),
            subtext: 'Active this semester',
            tag: 'Teaching',
            background: 'bg-[#2563EB]' // Blue
        },
        {
            icon: Users,
            label: 'Total Sections',
            value: data.stats.totalSections.toString().padStart(2, '0'),
            subtext: 'Assigned to your classes',
            tag: 'Classes',
            background: 'bg-[#7C3AED]' // Purple
        },
        {
            icon: Award,
            label: 'Current Package',
            value: 'Pending',
            subtext: 'Module coming soon',
            tag: 'Finance',
            background: 'bg-[#EA580C]' // Orange
        },
        {
            icon: CheckCircle,
            label: 'Attendance',
            value: 'N/A',
            subtext: 'Module coming soon',
            tag: 'Record',
            background: 'bg-[#0F9D8A]' // Teal
        }
    ];

    return (
        <Layout title="Teacher Dashboard" subtitle="Welcome back! Here's your teaching overview">
            <div className="relative -mx-3 space-y-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-3 py-5 sm:-mx-5 sm:px-5 lg:px-6">
                <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
                <div className="pointer-events-none absolute -left-24 bottom-20 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

                {/* 1. Stat Cards */}
                <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
                </div>

                {/* 2. Personal Information Container */}
                <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Faculty Information</h2>
                            <p className="mt-0.5 text-xs font-medium text-slate-500">Your official university profile details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5"><User className="w-4 h-4" /></div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Name</p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5">{data.teacherInfo.name}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5"><Hash className="w-4 h-4" /></div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Employee ID</p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5">{data.teacherInfo.empId}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0 mt-0.5"><Award className="w-4 h-4" /></div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Designation</p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5">{data.teacherInfo.designation}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5"><Briefcase className="w-4 h-4" /></div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Department</p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5">{data.teacherInfo.department}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 sm:col-span-2 md:col-span-2">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0 mt-0.5"><Mail className="w-4 h-4" /></div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">{data.teacherInfo.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Schedule & Quick Actions */}
                <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 via-indigo-50 to-white p-5 shadow-md md:p-6 xl:col-span-2">
                        <SectionHeading
                            title="My Assigned Courses"
                            subtitle="Courses you are currently teaching"
                            icon={Calendar}
                            link="Full Timetable"
                            to="/teacher/classes"
                        />

                        {data.schedule.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.schedule.map((item, idx) => (
                                    <div key={idx} className="rounded-xl border border-white/90 bg-blue-50 p-4 shadow-sm transition-transform hover:-translate-y-1">
                                        <div className="mb-3 inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                                            <Clock className="h-3.5 w-3.5" />{item.time} – {item.end}
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900">{item.courseName}</h3>
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                                                <MapPin className="h-3.5 w-3.5" />{item.room}
                                            </div>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-slate-700 shadow-sm">
                                                Section {item.section}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500 bg-white/50 rounded-xl border border-dashed border-gray-300">
                                No courses assigned yet.
                            </div>
                        )}
                    </section>

                    <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-50 p-5 shadow-md md:p-6">
                        <SectionHeading title="Quick Actions" subtitle="Frequently used tools" icon={ClipboardList} />
                        <div className="space-y-3">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Link key={action.label} to={action.path} className={`group flex items-center gap-3 rounded-xl border border-white/90 bg-white/75 p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${action.hover}`}>
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.color}`}><Icon className="h-5 w-5" /></div>
                                        <div className="min-w-0 flex-1"><h3 className="text-sm font-bold text-slate-900">{action.label}</h3><p className="mt-1 text-[11px] font-medium text-slate-500">{action.description}</p></div>
                                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-700" />
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default TeacherDashboard;