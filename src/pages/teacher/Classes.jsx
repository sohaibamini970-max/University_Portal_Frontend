    import React, { useState } from 'react';
    import Layout from '../../components/Layout/Layout';
    import { BookOpen, Users, Clock, MapPin, Calendar, Filter } from 'lucide-react';

    const Classes = () => {
        const [selectedSection, setSelectedSection] = useState('A');

        // Time slots for the timetable header
        const timeSlots = [
            '08:30 - 09:50',
            '10:00 - 11:20',
            '11:30 - 12:50',
            '01:30 - 02:50',
            '03:00 - 04:20'
        ];

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        // Master Data: Timetable mapped by Section
        const sectionTimetables = {
            A: {
                Monday: {
                    '08:30 - 09:50': { code: 'CS-301', name: 'Data Structures', room: 'Room 201', students: 45, color: 'bg-blue-100 border-blue-300 text-blue-800' },
                    '10:00 - 11:20': { code: 'CS-302', name: 'Web Dev', room: 'Lab 3', students: 42, color: 'bg-violet-100 border-violet-300 text-violet-800' },
                    '01:30 - 02:50': { code: 'CS-303', name: 'Algorithms', room: 'Room 105', students: 38, color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
                },
                Tuesday: {
                    '08:30 - 09:50': { code: 'CS-304', name: 'Databases', room: 'Room 302', students: 31, color: 'bg-orange-100 border-orange-300 text-orange-800' },
                    '11:30 - 12:50': { code: 'CS-301', name: 'Data Structures', room: 'Room 201', students: 45, color: 'bg-blue-100 border-blue-300 text-blue-800' },
                },
                Wednesday: {
                    '10:00 - 11:20': { code: 'CS-302', name: 'Web Dev', room: 'Lab 3', students: 42, color: 'bg-violet-100 border-violet-300 text-violet-800' },
                    '01:30 - 02:50': { code: 'CS-303', name: 'Algorithms', room: 'Room 105', students: 38, color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
                },
                Thursday: {
                    '08:30 - 09:50': { code: 'CS-304', name: 'Databases', room: 'Room 302', students: 31, color: 'bg-orange-100 border-orange-300 text-orange-800' },
                    '03:00 - 04:20': { code: 'CS-301', name: 'Data Structures', room: 'Room 201', students: 45, color: 'bg-blue-100 border-blue-300 text-blue-800' },
                },
                Friday: {
                    '10:00 - 11:20': { code: 'CS-303', name: 'Algorithms', room: 'Room 105', students: 38, color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
                }
            },
            B: {
                Monday: {
                    '10:00 - 11:20': { code: 'CS-301', name: 'Data Structures', room: 'Room 201', students: 40, color: 'bg-blue-100 border-blue-300 text-blue-800' },
                    '01:30 - 02:50': { code: 'CS-302', name: 'Web Dev', room: 'Lab 3', students: 35, color: 'bg-violet-100 border-violet-300 text-violet-800' },
                },
                Tuesday: {
                    '08:30 - 09:50': { code: 'CS-303', name: 'Algorithms', room: 'Room 105', students: 42, color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
                },
                Wednesday: {
                    '11:30 - 12:50': { code: 'CS-304', name: 'Databases', room: 'Room 302', students: 38, color: 'bg-orange-100 border-orange-300 text-orange-800' },
                },
                Thursday: {
                    '10:00 - 11:20': { code: 'CS-301', name: 'Data Structures', room: 'Room 201', students: 40, color: 'bg-blue-100 border-blue-300 text-blue-800' },
                },
                Friday: {
                    '08:30 - 09:50': { code: 'CS-302', name: 'Web Dev', room: 'Lab 3', students: 35, color: 'bg-violet-100 border-violet-300 text-violet-800' },
                }
            }
        };

        // Get current timetable based on selected section (fallback to A if section not found)
        const currentTimetable = sectionTimetables[selectedSection] || sectionTimetables['A'];

        return (
            <Layout title="Class Timetable" subtitle="View your weekly teaching schedule">
                <div className="space-y-6 pb-8">

                    {/* Control Panel */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Weekly Schedule</h2>
                                <p className="text-sm text-gray-500">Fall 2024 Timetable</p>
                            </div>
                        </div>

                        {/* Section Dropdown */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-gray-700 whitespace-nowrap flex items-center gap-1">
                                <Filter className="w-4 h-4" /> Section:
                            </label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer w-28"
                            >
                                {['A', 'B'].map(sec => (
                                    <option key={sec} value={sec}>Section {sec}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Timetable Container */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="min-w-[900px]">

                                {/* Table Header (Time Slots) */}
                                <div className="grid grid-cols-6 border-b border-gray-200 bg-slate-800 text-white">
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

                                {/* Table Body (Days and Classes) */}
                                <div className="divide-y divide-gray-200">
                                    {days.map((day, dayIdx) => (
                                        <div key={day} className="grid grid-cols-6 group hover:bg-gray-50 transition-colors">

                                            {/* Day Label (Left Column) */}
                                            <div className={`p-4 flex items-center justify-center font-bold text-sm border-r border-gray-200 
                                                ${dayIdx % 2 === 0 ? 'bg-white text-indigo-700' : 'bg-slate-50 text-indigo-700'}`}>
                                                {day}
                                            </div>

                                            {/* Time Slot Cells */}
                                            {timeSlots.map((time) => {
                                                const classData = currentTimetable[day]?.[time];

                                                return (
                                                    <div key={time} className="p-1.5 border-r border-gray-200 last:border-0 relative">
                                                        {classData ? (
                                                            <div className={`h-full w-full rounded-xl border-l-4 p-2.5 flex flex-col justify-between shadow-sm transition-transform hover:scale-[1.02] cursor-pointer ${classData.color}`}>
                                                                <div>
                                                                    <div className="flex items-center justify-between gap-1 mb-1">
                                                                        <span className="text-[10px] font-black uppercase opacity-80">{classData.code}</span>
                                                                    </div>
                                                                    <h3 className="text-xs font-bold leading-tight line-clamp-2">{classData.name}</h3>
                                                                </div>

                                                                <div className="mt-2 space-y-0.5">
                                                                    <p className="text-[10px] font-semibold flex items-center gap-1 opacity-90">
                                                                        <MapPin className="w-3 h-3" /> {classData.room}
                                                                    </p>
                                                                    <p className="text-[10px] font-medium flex items-center gap-1 opacity-75">
                                                                        <Users className="w-3 h-3" /> {classData.students} Students
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            // Empty slot
                                                            <div className="h-full w-full rounded-xl border border-dashed border-gray-200 flex items-center justify-center min-h-[100px]">
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

    export default Classes;