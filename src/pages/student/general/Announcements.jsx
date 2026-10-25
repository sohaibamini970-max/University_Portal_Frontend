import React from 'react';
import Layout from '../../../components/Layout/Layout';
import { Bell, Calendar, FileText, Download, CheckCircle, Info } from 'lucide-react';

const Announcements = () => {
    const announcements = [
        {
            id: 1,
            title: 'Mid-Term Examination Schedule Released',
            date: 'October 28, 2025',
            time: '10:00 AM',
            type: 'Exam',
            description: 'The mid-term examination schedule for the Fall 2024 semester has been published. Please check your student portal to view your exact dates, times, and seat numbers. Admit cards will be available for download starting November 5th.',
            isNew: true,
            icon: FileText,
            color: 'bg-violet-100 text-violet-700',
            borderColor: 'border-violet-500'
        },
        {
            id: 2,
            title: 'Spring 2025 Fee Voucher Available',
            date: 'October 26, 2025',
            time: '02:30 PM',
            type: 'Finance',
            description: 'Your fee voucher for the Spring 2025 semester is now available for download. The last date to submit the fee without a late fine is November 15, 2025. Please navigate to the "Fee Voucher" section to download your challan.',
            isNew: true,
            icon: Download,
            color: 'bg-orange-100 text-orange-700',
            borderColor: 'border-orange-500'
        },
        {
            id: 3,
            title: 'Course Registration for Next Semester',
            date: 'October 20, 2025',
            time: '09:00 AM',
            type: 'Academic',
            description: 'Course registration for the upcoming Spring 2025 semester is now open. Please consult with your academic advisor before registering. The registration portal will close on November 30, 2025.',
            isNew: false,
            icon: CheckCircle,
            color: 'bg-blue-100 text-blue-700',
            borderColor: 'border-blue-500'
        },
        {
            id: 4,
            title: 'University Sports Gala 2025',
            date: 'October 15, 2025',
            time: '11:00 AM',
            type: 'Event',
            description: 'Get ready for the annual University Sports Gala! Registrations for cricket, football, badminton, and athletics are now open. Contact the sports office to register your team. Let\'s show our department spirit!',
            isNew: false,
            icon: Info,
            color: 'bg-emerald-100 text-emerald-700',
            borderColor: 'border-emerald-500'
        }
    ];

    return (
        <Layout title="Announcements" subtitle="Important updates, notices, and events from the university">
            <div className="max-w-4xl mx-auto space-y-6 pb-8">

                {/* Header Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Bell className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">University Notice Board</h2>
                            <p className="text-indigo-100 mt-1">Stay updated with the latest campus news.</p>
                        </div>
                    </div>
                </div>

                {/* Announcements List */}
                <div className="space-y-4">
                    {announcements.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${item.borderColor} p-5 md:p-6 transition-all hover:shadow-md flex flex-col md:flex-row gap-5`}>

                                {/* Left Icon */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.color}`}>
                                            {item.type}
                                        </span>
                                        {item.isNew && (
                                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-red-100 text-red-600 animate-pulse">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" /> {item.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Bell className="w-3.5 h-3.5" /> {item.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
};

export default Announcements;