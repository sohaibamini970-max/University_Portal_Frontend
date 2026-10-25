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
            {Icon && <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700"><Icon className="h-5 w-5" /></div>}
            <div>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
                {subtitle && <p className="mt-0.5 text-xs font-medium text-slate-500">{subtitle}</p>}
            </div>
        </div>
        {link && <Link to={to} className="flex shrink-0 items-center gap-1 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100">{link}<ChevronRight className="h-4 w-4" /></Link>}
    </div>
);

const StudentDashboard = () => {
    // Student Personal Info Data
    const studentInfo = {
        name: 'Muhammad Suhaib',
        regNo: '5950/BCS/2024F',
        section: 'C',
        session: 'Fall 2024 - Spring 2028',
        status: 'Active (Regular)',
        program: 'BS Computer Science (BCS)'
    };

    const stats = [
        {
            icon: Award,
            label: 'Current CGPA',
            value: '3.75',
            subtext: 'Out of 4.00 · Strong performance',
            tag: 'Academic',
            background: 'bg-[#2563EB]'
        },
        {
            icon: TrendingUp,
            label: 'Attendance',
            value: '92%',
            subtext: 'Excellent · Keep it consistent',
            tag: 'Attendance',
            background: 'bg-[#0F9D8A]'
        },
        {
            icon: BookOpen,
            label: 'Enrolled Courses',
            value: '06',
            subtext: 'Active courses this semester',
            tag: 'Learning',
            background: 'bg-[#7C3AED]'
        },
        {
            icon: DollarSign,
            label: 'Fee Status',
            value: 'Paid',
            subtext: 'Next due: December 15',
            tag: 'Finance',
            background: 'bg-[#EA580C]'
        }
    ];

    const courses = [
        { code: 'CS-301', name: 'Data Structures', teacher: 'John Doe', progress: 75, grade: 'A', color: 'bg-blue-600', tint: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
        { code: 'CS-302', name: 'Web Development', teacher: 'Sarah Wilson', progress: 60, grade: 'B+', color: 'bg-violet-600', tint: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
        { code: 'CS-303', name: 'Algorithms', teacher: 'Mike Chen', progress: 85, grade: 'A-', color: 'bg-emerald-600', tint: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
        { code: 'CS-304', name: 'Databases', teacher: 'Lisa Brown', progress: 45, grade: 'B', color: 'bg-orange-600', tint: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' }
    ];

    const schedule = [
        { time: '09:00 AM', end: '10:30 AM', course: 'Data Structures', room: 'Room 201', teacher: 'John Doe', color: 'bg-blue-600', tint: 'bg-blue-50', text: 'text-blue-700' },
        { time: '11:00 AM', end: '12:30 PM', course: 'Web Development', room: 'Lab 3', teacher: 'Sarah Wilson', color: 'bg-violet-600', tint: 'bg-violet-50', text: 'text-violet-700' },
        { time: '02:00 PM', end: '03:30 PM', course: 'Algorithms', room: 'Room 105', teacher: 'Mike Chen', color: 'bg-emerald-600', tint: 'bg-emerald-50', text: 'text-emerald-700' }
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
            <div className="relative -mx-3 space-y-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-3 py-5 sm:-mx-5 sm:px-5 lg:px-6">
                {/* Decorative background accents */}
                <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
                <div className="pointer-events-none absolute -left-24 bottom-20 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

                {/* Stat Cards */}
                <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
                </div>

                {/* 👇 NEW PERSONAL INFORMATION CONTAINER 👇 */}
                <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Personal Information</h2>
                            <p className="mt-0.5 text-xs font-medium text-slate-500">Your official university profile details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
                        {/* Name */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
                                <User className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Name</p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5">{studentInfo.name}</p>
                            </div>
                        </div>
                        {/* Registration No */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                                <Hash className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Registration No</p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5">{studentInfo.regNo}</p>
                            </div>
                        </div>
                        {/* Section */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                                <Users className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Section</p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5">{studentInfo.section}</p>
                            </div>
                        </div>
                        {/* Program */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0 mt-0.5">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Program</p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5">{studentInfo.program}</p>
                            </div>
                        </div>
                        {/* Current Session */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0 mt-0.5">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Session</p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5">{studentInfo.session}</p>
                            </div>
                        </div>
                        {/* Status */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg shrink-0 mt-0.5">
                                <Activity className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</p>
                                <p className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    {studentInfo.status}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 👆 END PERSONAL INFORMATION CONTAINER 👆 */}

                <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <section className="rounded-2xl border border-blue-200/70 bg-gradient-to-br from-white/90 to-blue-100/80 p-5 shadow-md backdrop-blur-sm md:p-6 xl:col-span-2">
                        <SectionHeading title="My Courses" subtitle="Your learning progress this semester" link="View all" to="/student/courses" icon={BookOpen} />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {courses.map((course) => (
                                <div key={course.code} className={`rounded-2xl border ${course.border} ${course.tint} p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${course.color} text-white shadow-md`}><BookOpen className="h-5 w-5" /></div>
                                            <div><h3 className="text-sm font-bold text-slate-900">{course.name}</h3><p className={`mt-1 text-[11px] font-bold ${course.text}`}>{course.code}</p></div>
                                        </div>
                                        <span className="rounded-lg bg-white/80 px-2.5 py-1 text-xs font-black text-slate-800 shadow-sm">Grade {course.grade}</span>
                                    </div>
                                    <p className="mt-4 text-xs font-medium text-slate-600">Instructor <span className="font-bold text-slate-800">{course.teacher}</span></p>
                                    <div className="mt-4">
                                        <div className="mb-2 flex justify-between text-xs"><span className="font-semibold text-slate-600">Course progress</span><span className={`font-black ${course.text}`}>{course.progress}%</span></div>
                                        <div className="h-2.5 overflow-hidden rounded-full bg-white/90 shadow-inner"><div className={`h-full rounded-full ${course.color}`} style={{ width: `${course.progress}%` }} /></div>
                                    </div>
                                    <Link to="/student/courses" className={`mt-4 flex items-center justify-between border-t ${course.border} pt-3 text-xs font-extrabold ${course.text} transition hover:opacity-75`}>Explore course <ArrowRight className="h-4 w-4" /></Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 via-indigo-50 to-white p-5 shadow-md md:p-6">
                        <SectionHeading title="Today's Classes" subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} icon={Calendar} />
                        <div className="space-y-3">
                            {schedule.map((item) => (
                                <div key={item.course} className={`rounded-xl border border-white/90 ${item.tint} p-3 shadow-sm`}>
                                    <div className={`mb-2 inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2 py-1 text-[11px] font-bold ${item.text}`}><Clock className="h-3.5 w-3.5" />{item.time} – {item.end}</div>
                                    <h3 className="text-sm font-bold text-slate-900">{item.course}</h3>
                                    <p className="mt-1 text-xs font-medium text-slate-600">{item.teacher}</p>
                                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-500"><MapPin className="h-3.5 w-3.5" />{item.room}</div>
                                </div>
                            ))}
                        </div>
                        <Link to="/student/timetable" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 py-3 text-xs font-extrabold text-white shadow-md transition hover:bg-indigo-800">Full Timetable <ArrowRight className="h-4 w-4" /></Link>
                    </section>
                </div>

                <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-5 shadow-md md:p-6 xl:col-span-2">
                        <SectionHeading title="Announcements" subtitle="Important updates from your university" icon={Bell} />
                        <div className="space-y-3">
                            {announcements.map((announcement) => {
                                const Icon = announcement.icon;
                                const styles = {
                                    exam: 'bg-violet-100 text-violet-700 border-violet-200',
                                    fee: 'bg-orange-100 text-orange-700 border-orange-200',
                                    registration: 'bg-blue-100 text-blue-700 border-blue-200'
                                };
                                return (
                                    <div key={announcement.title} className="flex items-start gap-3 rounded-xl border border-white/90 bg-white/75 p-3 shadow-sm sm:gap-4 sm:p-4">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${styles[announcement.type]}`}><Icon className="h-5 w-5" /></div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-bold leading-snug text-slate-900">{announcement.title}</h3>
                                            <p className="mt-1 text-xs leading-relaxed text-slate-600">{announcement.description}</p>
                                            <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{announcement.time}</p>
                                        </div>
                                        <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-slate-400" />
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-50 p-5 shadow-md md:p-6">
                        <SectionHeading title="Quick Actions" subtitle="Your most-used student services" icon={ClipboardList} />
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

                <div className="relative flex flex-col items-center justify-between gap-2 rounded-xl border border-indigo-200/70 bg-indigo-100/70 px-4 py-3 text-center sm:flex-row sm:text-left">
                    <p className="text-xs font-semibold text-indigo-900">Keep learning, keep growing. Your progress starts with consistency.</p>
                    <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-extrabold text-emerald-800"><CheckCircle className="h-3.5 w-3.5" /> Academic dashboard</div>
                </div>
            </div>
        </Layout>
    );
};

export default StudentDashboard;