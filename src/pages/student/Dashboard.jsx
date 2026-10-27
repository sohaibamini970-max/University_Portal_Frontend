import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import AnnouncementPopup from '../../components/common/AnnouncementPopup';
import {
    Award, TrendingUp, DollarSign, BookOpen, Calendar, Clock, MapPin,
    ArrowRight, CheckCircle, Trophy, Download, Ticket, Bell, ChevronRight,
    GraduationCap, Sparkles, ClipboardList, User, Hash, Users, Activity, BookMarked
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, subtext, color, background, tag }) => (
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
            <p className="mt-5 text-2xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 text-sm font-bold text-white">{label}</p>
            <p className="mt-1 text-xs font-medium text-white/75">{subtext}</p>
        </div>
    </div>
);

const SectionHeading = ({ title, subtitle, link, to, icon: Icon }) => (
    <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
            {Icon && <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700"><Icon className="h-5 w-5" /></div>}
            <div>
                <h2 className="text-xl font-bold tracking-tight text-indigo-600">{title}</h2>
                {subtitle && <p className="mt-0.5 text-xs font-medium text-slate-500">{subtitle}</p>}
            </div>
        </div>
        {link && <Link to={to} className="flex shrink-0 items-center gap-1 rounded-lg bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100 border border-gray-200">{link}<ChevronRight className="h-4 w-4" /></Link>}
    </div>
);

const StudentDashboard = () => {
    const studentInfo = {
        name: 'Muhammad Suhaib',
        regNo: '5950/BCS/2024F',
        section: 'C',
        session: 'Fall 2024 - Spring 2028',
        status: 'Active (Regular)',
        program: 'BS Computer Science (BCS)'
    };

    const stats = [
        { icon: Award, label: 'Current CGPA', value: '3.75', subtext: 'Out of 4.00 · Strong performance', tag: 'Academic', background: 'bg-[#2563EB]' },
        { icon: TrendingUp, label: 'Attendance', value: '92%', subtext: 'Excellent · Keep it consistent', tag: 'Attendance', background: 'bg-[#0F9D8A]' },
        { icon: BookOpen, label: 'Enrolled Courses', value: '06', subtext: 'Active courses this semester', tag: 'Learning', background: 'bg-[#7C3AED]' },
        { icon: DollarSign, label: 'Fee Status', value: 'Paid', subtext: 'Next due: December 15', tag: 'Finance', background: 'bg-[#EA580C]' }
    ];

    const courses = [
        { code: 'CS-301', name: 'Data Structures', teacher: 'John Doe', grade: 'A', color: 'text-blue-600' },
        { code: 'CS-302', name: 'Web Development', teacher: 'Sarah Wilson', grade: 'B+', color: 'text-violet-600' },
        { code: 'CS-303', name: 'Algorithms', teacher: 'Mike Chen', grade: 'A-', color: 'text-emerald-600' },
        { code: 'CS-304', name: 'Databases', teacher: 'Lisa Brown', grade: 'B', color: 'text-orange-600' }
    ];

    const attendance = [
        { name: 'Data Structures', attended: 38, total: 40, percentage: 95, color: 'bg-emerald-500' },
        { name: 'Web Development', attended: 30, total: 35, percentage: 85, color: 'bg-blue-500' },
        { name: 'Algorithms', attended: 39, total: 42, percentage: 92, color: 'bg-emerald-500' },
        { name: 'Databases', attended: 21, total: 30, percentage: 70, color: 'bg-orange-500' }
    ];

    const announcements = [
        { title: 'Mid-term exams schedule released', description: 'Check the examination timetable for your courses.', time: '2 hours ago', type: 'exam', icon: Trophy },
        { title: 'Fee voucher for Spring 2025 available', description: 'Your semester fee voucher is ready to download.', time: '1 day ago', type: 'fee', icon: DollarSign },
        { title: 'Course registration is now open', description: 'Complete your registration before November 30.', time: '2 days ago', type: 'registration', icon: BookOpen }
    ];

    const quickActions = [
        { icon: Calendar, label: 'View Timetable', description: 'Check your weekly classes', path: '/student/timetable', color: 'bg-blue-100 text-blue-700', hover: 'hover:border-blue-300 hover:bg-blue-50' },
        { icon: Download, label: 'Fee Voucher', description: 'Download your fee challan', path: '/student/fee-voucher', color: 'bg-orange-100 text-orange-700', hover: 'hover:border-orange-300 hover:bg-orange-50' },
        { icon: Ticket, label: 'Admit Card', description: 'Access examination details', path: '/student/admit-card', color: 'bg-violet-100 text-violet-700', hover: 'hover:border-violet-300 hover:bg-violet-50' },
        { icon: Trophy, label: 'Academic Results', description: 'View your examination results', path: '/student/results', color: 'bg-emerald-100 text-emerald-700', hover: 'hover:border-emerald-300 hover:bg-emerald-50' }
    ];

    return (
        <Layout title="Student Dashboard" subtitle="Enrollment No: 5950/BCS/2024F | Section C">
            <AnnouncementPopup />
            <div className="relative -mx-3 space-y-6 overflow-hidden rounded-3xl bg-gray-50 px-3 py-5 sm:-mx-5 sm:px-5 lg:px-6">

                {/* 1. Top Stats */}
                <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
                </div>

                {/* 2. Personal Info */}
                <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-indigo-600">Personal Information</h2>
                            <p className="mt-0.5 text-xs font-medium text-slate-500">Your official university profile details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5"><User className="w-4 h-4" /></div>
                            <div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Name</p><p className="text-sm font-bold text-slate-800 mt-0.5">{studentInfo.name}</p></div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5"><Hash className="w-4 h-4" /></div>
                            <div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Registration No</p><p className="text-sm font-bold text-slate-800 mt-0.5">{studentInfo.regNo}</p></div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5"><Users className="w-4 h-4" /></div>
                            <div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Section</p><p className="text-sm font-bold text-slate-800 mt-0.5">{studentInfo.section}</p></div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0 mt-0.5"><GraduationCap className="w-4 h-4" /></div>
                            <div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Program</p><p className="text-sm font-bold text-slate-800 mt-0.5">{studentInfo.program}</p></div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0 mt-0.5"><Calendar className="w-4 h-4" /></div>
                            <div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Session</p><p className="text-sm font-bold text-slate-800 mt-0.5">{studentInfo.session}</p></div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg shrink-0 mt-0.5"><Activity className="w-4 h-4" /></div>
                            <div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</p><p className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{studentInfo.status}</p></div>
                        </div>
                    </div>
                </div>

                {/* 3. Main Grid */}
                <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* My Courses */}
                    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6 xl:col-span-2">
                        <SectionHeading title="My Courses" subtitle="Your learning progress this semester" link="View all" to="/student/courses" icon={BookOpen} />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {courses.map((course) => (
                                <div key={course.code} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 border border-gray-100 ${course.color}`}>
                                                <BookOpen className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">{course.name}</h3>
                                                <p className="text-xs font-semibold text-gray-500">{course.code}</p>
                                            </div>
                                        </div>
                                        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700">{course.grade}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Instructor <span className="font-semibold text-gray-800">{course.teacher}</span></p>
                                    <Link to="/student/courses" className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors">
                                        View Details <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* My Attendance */}
                    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
                        <SectionHeading title="My Attendance" subtitle="Current semester overview" icon={Calendar} />
                        <div className="space-y-4">
                            {attendance.map((item) => (
                                <div key={item.name}>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="font-semibold text-gray-700">{item.name}</span>
                                        <span className="font-bold text-gray-900">{item.percentage}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1">{item.attended} / {item.total} classes attended</p>
                                </div>
                            ))}
                        </div>
                        <Link to="/student/attendance" className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-gray-900">
                            View Detailed Attendance <ArrowRight className="h-4 w-4" />
                        </Link>
                    </section>
                </div>

                {/* 4. Bottom Grid */}
                <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* Announcements */}
                    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6 xl:col-span-2">
                        <SectionHeading title="Announcements" subtitle="Important updates from your university" icon={Bell} />
                        <div className="space-y-3">
                            {announcements.map((announcement) => {
                                const Icon = announcement.icon;
                                return (
                                    <div key={announcement.title} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-gray-600 border border-gray-200">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-bold text-slate-900">{announcement.title}</h3>
                                            <p className="mt-0.5 text-xs text-slate-600">{announcement.description}</p>
                                            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{announcement.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
                        <SectionHeading title="Quick Actions" subtitle="Your most-used student services" icon={ClipboardList} />
                        <div className="space-y-2">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Link key={action.label} to={action.path} className="group flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm transition hover:border-gray-300 hover:bg-gray-50">
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${action.color}`}><Icon className="h-4 w-4" /></div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-700">{action.label}</h3>
                                        </div>
                                        <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-indigo-600" />
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="relative flex flex-col items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-center sm:flex-row sm:text-left">
                    <p className="text-xs font-semibold text-gray-600">Keep learning, keep growing. Your progress starts with consistency.</p>
                    <div className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-[11px] font-bold text-emerald-700"><CheckCircle className="h-3.5 w-3.5" /> Academic dashboard</div>
                </div>
            </div>
        </Layout>
    );
};

export default StudentDashboard;