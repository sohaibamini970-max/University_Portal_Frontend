import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { Calendar, Clock, MapPin, User, Loader2 } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const Timetable = () => {
    const [schedule, setSchedule] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const [timetableRes, slotsRes] = await Promise.all([
                    api.get('/students/my-timetable'),
                    api.get('/time-slots')
                ]);

                setSchedule(timetableRes.data);

                // 👇 FALLBACK: If DB returns empty, use default slots
                let formattedSlots = [];
                if (slotsRes.data && slotsRes.data.length > 0) {
                    formattedSlots = slotsRes.data.map(s => `${s.startTime} - ${s.endTime}`);
                } else {
                    formattedSlots = [
                        '08:30 - 09:50',
                        '10:00 - 11:20',
                        '11:30 - 12:50',
                        '01:30 - 02:50',
                        '03:00 - 04:20'
                    ];
                }

                setTimeSlots(formattedSlots.sort());
            } catch (error) {
                console.error("Failed to load timetable", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTimetable();
    }, []);

    if (loading) return <Layout title="Weekly Timetable"><div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div></Layout>;

    return (
        <Layout title="Weekly Timetable" subtitle="Your enrolled classes schedule">
            <div className="space-y-6 pb-8 max-w-[1400px] mx-auto">

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
                        <span>{days.length} Days a week · {timeSlots.length} Time Slots</span>
                    </div>
                </div>

                {/* Timetable Container */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <div style={{ minWidth: `${Math.max(900, timeSlots.length * 150 + 120)}px` }}>

                            {/* Table Header */}
                            <div
                                className="grid bg-slate-800 text-white border-b border-slate-700"
                                style={{ gridTemplateColumns: `120px repeat(${timeSlots.length}, minmax(150px, 1fr))` }}
                            >
                                <div className="p-4 flex items-center justify-center font-bold text-sm tracking-wider uppercase border-r border-slate-700 shrink-0">
                                    Day / Time
                                </div>
                                {timeSlots.map((time, idx) => (
                                    <div key={idx} className="p-4 text-center font-bold text-sm tracking-wide border-r border-slate-700 last:border-0 flex flex-col items-center justify-center gap-1.5 shrink-0 whitespace-nowrap">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        {time}
                                    </div>
                                ))}
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {days.map((day) => (
                                    <div
                                        key={day}
                                        className="grid"
                                        style={{ gridTemplateColumns: `120px repeat(${timeSlots.length}, minmax(150px, 1fr))` }}
                                    >
                                        <div className={`p-4 flex items-center justify-center font-bold text-sm border-r border-gray-200 shrink-0 bg-slate-50 text-slate-700`}>
                                            {day}
                                        </div>

                                        {timeSlots.map((time) => {
                                            const cls = schedule.find(s => s.dayOfWeek === day && s.timeSlot === time);

                                            return (
                                                <div key={time} className="p-1.5 border-r border-gray-200 last:border-0 relative min-h-[110px]">
                                                    {cls ? (
                                                        <div className="h-full w-full rounded-xl border-l-4 border-indigo-500 bg-indigo-50 p-3 flex flex-col justify-center shadow-sm relative overflow-hidden group hover:bg-indigo-100 transition-colors">
                                                            <span className="text-[10px] font-black uppercase text-indigo-700 opacity-80 truncate">
                                                                {cls.courseCode}
                                                            </span>
                                                            <h3 className="text-sm font-bold text-indigo-900 leading-tight mt-1 pr-2 break-words line-clamp-3">
                                                                {cls.courseName}
                                                            </h3>
                                                            <div className="mt-2 space-y-0.5">
                                                                <p className="text-[10px] font-semibold text-indigo-700 flex items-center gap-1 truncate">
                                                                    <User className="w-3 h-3 shrink-0" /> {cls.teacherName}
                                                                </p>
                                                                <p className="text-[10px] font-bold text-indigo-500 flex items-center gap-1 truncate">
                                                                    <MapPin className="w-3 h-3 shrink-0" /> {cls.roomName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full w-full rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
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