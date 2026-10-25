import React from 'react';
import Layout from '../../../components/Layout/Layout';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

const Timetable = () => {
    // Define the time slots (Top Headers)
    const timeSlots = [
        '08:30 - 09:50',
        '10:00 - 11:20',
        '11:30 - 12:50',
        '01:30 - 02:50',
        '03:00 - 04:20'
    ];

    // Define the week days (Left Side)
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Mock Data for the timetable
    const schedule = {
        Monday: {
            '08:30 - 09:50': { code: 'CS-301', name: 'Data Structures', room: 'Room 201', teacher: 'John Doe', color: 'bg-blue-100 border-blue-300 text-blue-800' },
            '10:00 - 11:20': { code: 'CS-302', name: 'Web Dev', room: 'Lab 3', teacher: 'Sarah Wilson', color: 'bg-violet-100 border-violet-300 text-violet-800' },
            '01:30 - 02:50': { code: 'CS-303', name: 'Algorithms', room: 'Room 105', teacher: 'Mike Chen', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
        },
        Tuesday: {
            '08:30 - 09:50': { code: 'CS-304', name: 'Databases', room: 'Room 302', teacher: 'Lisa Brown', color: 'bg-orange-100 border-orange-300 text-orange-800' },
            '11:30 - 12:50': { code: 'CS-305', name: 'Operating Sys', room: 'Room 401', teacher: 'David Lee', color: 'bg-pink-100 border-pink-300 text-pink-800' },
            '03:00 - 04:20': { code: 'CS-302', name: 'Web Dev Lab', room: 'Lab 3', teacher: 'Sarah Wilson', color: 'bg-violet-100 border-violet-300 text-violet-800' },
        },
        Wednesday: {
            '10:00 - 11:20': { code: 'CS-301', name: 'Data Structures', room: 'Room 201', teacher: 'John Doe', color: 'bg-blue-100 border-blue-300 text-blue-800' },
            '01:30 - 02:50': { code: 'CS-303', name: 'Algorithms', room: 'Room 105', teacher: 'Mike Chen', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
            '03:00 - 04:20': { code: 'CS-305', name: 'Operating Sys', room: 'Room 401', teacher: 'David Lee', color: 'bg-pink-100 border-pink-300 text-pink-800' },
        },
        Thursday: {
            '08:30 - 09:50': { code: 'CS-302', name: 'Web Dev', room: 'Lab 3', teacher: 'Sarah Wilson', color: 'bg-violet-100 border-violet-300 text-violet-800' },
            '11:30 - 12:50': { code: 'CS-304', name: 'Databases', room: 'Room 302', teacher: 'Lisa Brown', color: 'bg-orange-100 border-orange-300 text-orange-800' },
            '01:30 - 02:50': { code: 'CS-301', name: 'Data Structures', room: 'Room 201', teacher: 'John Doe', color: 'bg-blue-100 border-blue-300 text-blue-800' },
        },
        Friday: {
            '10:00 - 11:20': { code: 'CS-303', name: 'Algorithms', room: 'Room 105', teacher: 'Mike Chen', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
            '01:30 - 02:50': { code: 'CS-305', name: 'Operating Sys', room: 'Room 401', teacher: 'David Lee', color: 'bg-pink-100 border-pink-300 text-pink-800' },
        }
    };

    return (
        <Layout title="Weekly Timetable" subtitle="Fall 2024 · Section C · BCS 5th Semester">
            <div className="space-y-6 pb-8">

                {/* Legend / Top info */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Class Schedule</h2>
                            <p className="text-xs text-gray-500">Scroll horizontally on mobile to see all days</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                        <Clock className="w-4 h-4" />
                        <span>5 Days a week · 5 Time Slots</span>
                    </div>
                </div>

                {/* Timetable Container with Horizontal Scroll */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="min-w-[900px]">

                            {/* Table Header (Time Slots) */}
                            <div className="grid grid-cols-6 border-b border-gray-200 bg-gray-600 text-white">
                                <div className="p-4 flex items-center justify-center font-bold text-sm tracking-wider uppercase border-r border-slate-700">
                                    Day / Time
                                </div>
                                {timeSlots.map((time, idx) => (
                                    <div key={idx} className="p-4 text-center font-bold text-sm tracking-wide border-r border-slate-700 last:border-0 flex items-center justify-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        {time}
                                    </div>
                                ))}
                            </div>

                            {/* Table Body (Days and Subjects) */}
                            <div className="divide-y divide-gray-200">
                                {days.map((day, dayIdx) => (
                                    <div key={day} className="grid grid-cols-6 group hover:bg-gray-50 transition-colors">

                                        {/* Day Label (Left Column) */}
                                        <div className={`p-4 flex items-center justify-center font-bold text-sm border-r border-gray-300 
                                            ${dayIdx % 2 === 0 ? 'bg-white text-indigo-700' : 'bg-slate-50 text-indigo-700'}`}>
                                            {day}
                                        </div>

                                        {/* Time Slot Cells */}
                                        {timeSlots.map((time) => {
                                            const classData = schedule[day]?.[time];

                                            return (
                                                <div key={time} className="p-1.5 border-r border-gray-300 last:border-0 relative">
                                                    {classData ? (
                                                        <div className={`h-full w-full rounded-xl border-l-4 p-2.5 flex flex-col justify-center shadow-sm transition-transform hover:scale-[1.02] cursor-pointer ${classData.color}`}>
                                                            <div className="flex items-center justify-between gap-1 mb-1">
                                                                <span className="text-[10px] font-black uppercase opacity-80">{classData.code}</span>
                                                            </div>
                                                            <h3 className="text-xs font-bold leading-tight line-clamp-2">{classData.name}</h3>
                                                            <div className="mt-1.5 space-y-0.5">
                                                                <p className="text-[10px] font-semibold flex items-center gap-1 opacity-90">
                                                                    <MapPin className="w-3 h-3" /> {classData.room}
                                                                </p>
                                                                <p className="text-[10px] font-medium flex items-center gap-1 opacity-75 truncate">
                                                                    <User className="w-3 h-3" /> {classData.teacher}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        // Empty slot
                                                        <div className="h-full w-full rounded-xl border border-dashed border-gray-200 flex items-center justify-center min-h-[90px]">
                                                            <span className="text-[10px] font-semibold text-gray-300 uppercase">Free</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default Timetable;