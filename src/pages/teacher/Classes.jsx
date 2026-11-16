import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { BookOpen, Users, Clock, MapPin, Calendar, Filter, Loader2 } from 'lucide-react';
import { api } from '../../context/AuthContext';

const Classes = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [selectedProgram, setSelectedProgram] = useState('All');
    const [selectedBatch, setSelectedBatch] = useState('All');

    // Dynamic Time Slots (Can also be fetched from backend, but hardcoded for now to match the grid)
    const timeSlots = [
        '08:00 - 08:50', '08:50 - 09:40', '09:40 - 10:30',
        '10:30 - 11:20', '11:20 - 12:10', '12:10 - 01:00',
        '01:30 - 02:20', '02:20 - 03:10', '03:10 - 04:00'
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const res = await api.get('/timetables/my-timetable');
                setTimetable(res.data);
            } catch (error) {
                console.error("Failed to fetch timetable", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTimetable();
    }, []);

    // Extract unique programs and batches for the dropdowns
    const uniquePrograms = ['All', ...new Set(timetable.map(t => t.programName))];
    const uniqueBatches = ['All', ...new Set(timetable.map(t => t.batchName))];

    // Filter the schedule based on dropdowns
    const filteredTimetable = timetable.filter(t => {
        const matchProgram = selectedProgram === 'All' || t.programName === selectedProgram;
        const matchBatch = selectedBatch === 'All' || t.batchName === selectedBatch;
        return matchProgram && matchBatch;
    });

    if (loading) return <Layout title="Class Timetable"><div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div></Layout>;

    return (
        <Layout title="Class Timetable" subtitle="View your weekly teaching schedule">
            <div className="space-y-6 pb-8 max-w-[1400px] mx-auto">

                {/* Control Panel */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Weekly Schedule</h2>
                            <p className="text-sm text-gray-500">Your assigned classes</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-bold text-gray-700">Program:</span>
                            <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} className="bg-transparent text-sm font-semibold text-gray-800 outline-none cursor-pointer">
                                {uniquePrograms.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <span className="text-sm font-bold text-gray-700">Batch:</span>
                            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="bg-transparent text-sm font-semibold text-gray-800 outline-none cursor-pointer">
                                {uniqueBatches.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Timetable Grid */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="min-w-[1000px]">

                            {/* Header */}
                            <div
                                className="grid bg-slate-800 text-white border-b border-slate-700"
                                style={{ gridTemplateColumns: `120px repeat(${timeSlots.length}, minmax(120px, 1fr))` }}
                            >
                                <div className="p-4 flex items-center justify-center font-bold text-sm uppercase tracking-wider border-r border-slate-700">
                                    Day / Time
                                </div>
                                {timeSlots.map((time, idx) => (
                                    <div key={idx} className="p-4 text-center font-bold text-sm border-r border-slate-700 last:border-0 flex flex-col items-center justify-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />{time}
                                    </div>
                                ))}
                            </div>

                            {/* Body */}
                            <div className="divide-y divide-gray-200">
                                {days.map((day) => (
                                    <div
                                        key={day}
                                        className="grid"
                                        style={{ gridTemplateColumns: `120px repeat(${timeSlots.length}, minmax(120px, 1fr))` }}
                                    >
                                        {/* Day Label */}
                                        <div className="p-4 flex items-center justify-center font-bold text-sm bg-slate-50 text-slate-700 border-r border-gray-200">
                                            {day}
                                        </div>

                                        {/* Time Slot Cells */}
                                        {timeSlots.map((time) => {
                                            const cls = filteredTimetable.find(t => t.dayOfWeek === day && t.timeSlot === time);

                                            return (
                                                <div key={time} className="p-1.5 border-r border-gray-200 last:border-0 relative min-h-[100px]">
                                                    {cls ? (
                                                        <div className="h-full w-full rounded-xl border-l-4 border-indigo-500 bg-indigo-50 p-2.5 flex flex-col justify-center shadow-sm relative overflow-hidden group hover:bg-indigo-100 transition-colors">
                                                            <span className="text-[10px] font-black uppercase text-indigo-700 opacity-80 truncate">
                                                                {cls.courseCode}
                                                            </span>

                                                            <h3 className="text-xs font-bold text-indigo-900 leading-tight mt-1 line-clamp-2">
                                                                {cls.courseName}
                                                            </h3>

                                                            <div className="mt-2 space-y-0.5">
                                                                <p className="text-[10px] font-semibold text-indigo-700 flex items-center gap-1 truncate">
                                                                    <Users className="w-3 h-3 shrink-0" /> {cls.programName} ({cls.batchName})
                                                                </p>
                                                                <p className="text-[10px] font-bold text-indigo-500 flex items-center gap-1 truncate">
                                                                    <MapPin className="w-3 h-3 shrink-0" /> {cls.roomName} • Sec {cls.section}
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

export default Classes;