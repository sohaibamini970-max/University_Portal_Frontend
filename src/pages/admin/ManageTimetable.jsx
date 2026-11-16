import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import {
    Calendar, Clock, MapPin, Plus, X, CheckCircle, Loader2, Trash2, Settings2, Lock
} from 'lucide-react';
import { api } from '../../context/AuthContext';

const ManageTimetable = () => {
    const [programs, setPrograms] = useState([]);
    const [batches, setBatches] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSection, setSelectedSection] = useState('A');

    const [timeSlots, setTimeSlots] = useState([]);
    const [newSlot, setNewSlot] = useState({ start: '', end: '' });
    const [showSlotManager, setShowSlotManager] = useState(false);
    const [slotLoading, setSlotLoading] = useState(false);

    const [timetable, setTimetable] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [activeCell, setActiveCell] = useState(null);

    const [formData, setFormData] = useState({ teacherAssignmentId: '', roomId: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [progRes, batchRes, semRes, roomRes, slotRes] = await Promise.all([
                    api.get('/programs'), api.get('/batches'), api.get('/semesters'), api.get('/rooms'), api.get('/time-slots')
                ]);
                setPrograms(progRes.data);
                setBatches(batchRes.data);
                setSemesters(semRes.data);
                setRooms(roomRes.data);

                const formattedSlots = slotRes.data.map(s => `${s.startTime} - ${s.endTime}`);
                setTimeSlots(formattedSlots);

                if (progRes.data.length > 0) setSelectedProgram(progRes.data[0].id);
                if (batchRes.data.length > 0) setSelectedBatch(batchRes.data[0].id);
                if (semRes.data.length > 0) setSelectedSemester(semRes.data[0].id);
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchTimetable = async () => {
            if (!selectedProgram || !selectedBatch || !selectedSemester) return;
            try {
                const [gridRes, coursesRes] = await Promise.all([
                    api.get(`/timetables?programId=${selectedProgram}&batchId=${selectedBatch}&semesterId=${selectedSemester}&section=${selectedSection}`),
                    api.get(`/timetables/available-courses?programId=${selectedProgram}&batchId=${selectedBatch}&semesterId=${selectedSemester}&section=${selectedSection}`)
                ]);
                setTimetable(gridRes.data);
                setAvailableCourses(coursesRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTimetable();
    }, [selectedProgram, selectedBatch, selectedSemester, selectedSection]);

    const handleAddSlot = async (e) => {
        e.preventDefault();
        if (!newSlot.start || !newSlot.end) return;

        setSlotLoading(true);
        try {
            await api.post('/time-slots', {
                startTime: newSlot.start,
                endTime: newSlot.end
            });
            const res = await api.get('/time-slots');
            const formattedSlots = res.data.map(s => `${s.startTime} - ${s.endTime}`);
            setTimeSlots(formattedSlots.sort());
            setNewSlot({ start: '', end: '' });
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add time slot");
        } finally {
            setSlotLoading(false);
        }
    };

    const handleRemoveSlot = async (slotString) => {
        if (!window.confirm("Are you sure you want to remove this time slot?")) return;

        try {
            const res = await api.get('/time-slots');
            const targetSlot = res.data.find(s => `${s.startTime} - ${s.endTime}` === slotString);

            if (targetSlot) {
                await api.delete(`/time-slots/${targetSlot.id}`);
                setTimeSlots(timeSlots.filter(s => s !== slotString));
            }
        } catch (error) {
            alert("Failed to remove time slot");
        }
    };

    const handleCellClick = (day, time) => {
        const existing = timetable.find(t => t.dayOfWeek === day && t.timeSlot === time);
        if (existing) {
            setActiveCell({ day, time, existing });
            setFormData({ teacherAssignmentId: existing.teacherAssignmentId, roomId: '' });
        } else {
            setActiveCell({ day, time, existing: null });
            setFormData({ teacherAssignmentId: '', roomId: '' });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/timetables', {
                teacherAssignmentId: parseInt(formData.teacherAssignmentId),
                roomId: parseInt(formData.roomId),
                dayOfWeek: activeCell.day,
                timeSlot: activeCell.time
            });

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setActiveCell(null);
                api.get(`/timetables?programId=${selectedProgram}&batchId=${selectedBatch}&semesterId=${selectedSemester}&section=${selectedSection}`)
                    .then(res => setTimetable(res.data));
            }, 1000);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to save class");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Remove this class from the schedule?")) return;
        try {
            await api.delete(`/timetables/${activeCell.existing.id}`);
            setTimetable(prev => prev.filter(t => t.id !== activeCell.existing.id));
            setActiveCell(null);
        } catch (error) {
            alert("Failed to remove class");
        }
    };

    if (loading) return <Layout title="Manage Timetable"><div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div></Layout>;

    return (
        <Layout title="Manage Timetable" subtitle="Efficiently build and update class schedules">
            <div className="space-y-6 pb-8 max-w-[1400px] mx-auto">

                {/* Control Panel */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col xl:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full xl:w-auto">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Schedule Builder</h2>
                            <p className="text-sm text-gray-500">Select filters to load the grid.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full xl:w-auto items-center">
                        <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none">
                            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none">
                            {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none">
                            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <div className="flex gap-2">
                            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 outline-none">
                                {['A', 'B', 'C', 'D', 'E', 'F'].map(sec => <option key={sec} value={sec}>Sec {sec}</option>)}
                            </select>
                            <button onClick={() => setShowSlotManager(!showSlotManager)} className={`p-2 rounded-xl border transition-colors ${showSlotManager ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`} title="Manage Time Slots">
                                <Settings2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* TIME SLOT MANAGER */}
                {showSlotManager && (
                    <div className="bg-white border border-indigo-200 rounded-2xl shadow-sm p-5 animate-in fade-in">
                        <div className="flex items-center gap-2 mb-4">
                            <Settings2 className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-bold text-gray-900">Manage Time Slots</h3>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {timeSlots.map(slot => (
                                <div key={slot} className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg">
                                    <span className="text-sm font-bold text-indigo-800">{slot}</span>
                                    <button onClick={() => handleRemoveSlot(slot)} className="text-indigo-400 hover:text-red-500 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {timeSlots.length === 0 && <p className="text-sm text-gray-500 italic">No time slots defined.</p>}
                        </div>

                        <form onSubmit={handleAddSlot} className="flex items-center gap-3">
                            <input type="time" required value={newSlot.start} onChange={e => setNewSlot({ ...newSlot, start: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                            <span className="text-gray-500 font-bold">to</span>
                            <input type="time" required value={newSlot.end} onChange={e => setNewSlot({ ...newSlot, end: e.target.value })} className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                            <button type="submit" disabled={slotLoading} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm flex items-center gap-2 disabled:opacity-50">
                                {slotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Add Slot</>}
                            </button>
                        </form>
                    </div>
                )}

                {/* 👇 TIMETABLE GRID - STRICT COLUMN ENFORCEMENT 👇 */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="min-w-[1000px]">
                            {/* Table Header */}
                            <div
                                className="grid bg-slate-800 text-white border-b border-slate-700"
                                style={{ gridTemplateColumns: `120px repeat(${timeSlots.length}, minmax(140px, 1fr))` }}
                            >
                                <div className="p-4 flex items-center justify-center font-bold text-sm uppercase tracking-wider border-r border-slate-700">Day / Time</div>
                                {timeSlots.map((time, idx) => (
                                    <div key={idx} className="p-4 text-center font-bold text-sm border-r border-slate-700 last:border-0 flex flex-col items-center justify-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />{time}
                                    </div>
                                ))}
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {days.map((day) => (
                                    <div
                                        key={day}
                                        className="grid"
                                        style={{ gridTemplateColumns: `120px repeat(${timeSlots.length}, minmax(140px, 1fr))` }}
                                    >
                                        <div className="p-4 flex items-center justify-center font-bold text-sm bg-slate-50 text-slate-700 border-r border-gray-200">{day}</div>

                                        {timeSlots.map((time) => {
                                            const cls = timetable.find(t => t.dayOfWeek === day && t.timeSlot === time);

                                            return (
                                                <div
                                                    key={time}
                                                    onClick={() => handleCellClick(day, time)}
                                                    className="p-2 border-r border-gray-200 last:border-0 relative group cursor-pointer min-h-[120px]"
                                                >
                                                    {cls ? (
                                                        /* 👇 LOCKED SLOT CARD - PREVENTS OVERFLOW 👇 */
                                                        <div className="h-full w-full rounded-xl border-l-4 border-indigo-500 bg-indigo-50 p-3 flex flex-col justify-center shadow-sm relative overflow-hidden group-hover:bg-indigo-100 transition-colors">
                                                            <div className="absolute top-2 right-2 text-indigo-300">
                                                                <Lock className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-[10px] font-black uppercase text-indigo-700 opacity-80 truncate">
                                                                {cls.courseCode}
                                                            </span>

                                                            {/* break-words keeps long titles inside the box */}
                                                            <h3 className="text-sm font-bold text-indigo-900 leading-tight mt-1 pr-5 break-words line-clamp-3">
                                                                {cls.courseName}
                                                            </h3>

                                                            <p className="text-xs font-semibold text-indigo-700 mt-1 truncate">
                                                                {cls.teacherName}
                                                            </p>

                                                            <p className="text-[10px] font-bold text-indigo-500 mt-2 flex items-center gap-1 truncate">
                                                                <MapPin className="w-3 h-3 shrink-0" /> {cls.roomName}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        /* 👇 AVAILABLE SLOT CARD 👇 */
                                                        <div className="h-full w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Plus className="w-6 h-6 mb-1 text-emerald-500" />
                                                            <span className="text-xs font-bold text-emerald-600">Available</span>
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

            {/* MODAL */}
            {activeCell && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-800 p-5 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-lg font-bold">{activeCell.existing ? 'Class Scheduled' : 'Assign Class'}</h2>
                                <p className="text-slate-300 text-xs mt-0.5">{activeCell.day} • {activeCell.time}</p>
                            </div>
                            <button onClick={() => setActiveCell(null)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                        </div>

                        {showSuccess ? (
                            <div className="p-8 text-center animate-in zoom-in-95">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-emerald-600" /></div>
                                <h3 className="text-lg font-bold text-gray-900">Class Saved!</h3>
                            </div>
                        ) : activeCell.existing ? (
                            <div className="p-6 space-y-4">
                                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-center">
                                    <p className="text-xs font-bold text-indigo-500 uppercase">{activeCell.existing.courseCode}</p>
                                    <p className="font-bold text-lg text-indigo-900 mt-1">{activeCell.existing.courseName}</p>
                                    <p className="text-sm font-semibold text-indigo-700 mt-1">{activeCell.existing.teacherName}</p>
                                    <p className="text-xs font-bold text-indigo-500 mt-2 flex items-center justify-center gap-1"><MapPin className="w-3 h-3" /> {activeCell.existing.roomName}</p>
                                </div>
                                <button onClick={handleDelete} className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                                    <Trash2 className="w-4 h-4" /> Remove Class
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                {availableCourses.length === 0 ? (
                                    <div className="p-4 bg-orange-50 text-orange-700 text-sm font-bold rounded-xl text-center">
                                        No courses assigned to this section yet.
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Select Course</label>
                                            <select value={formData.teacherAssignmentId} onChange={(e) => setFormData({ ...formData, teacherAssignmentId: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                                <option value="" disabled>-- Choose Course --</option>
                                                {availableCourses.map(c => (
                                                    <option key={c.teacherAssignmentId} value={c.teacherAssignmentId}>
                                                        {c.courseCode} - {c.courseName} ({c.teacherName})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Select Room / Lab</label>
                                            <select value={formData.roomId} onChange={(e) => setFormData({ ...formData, roomId: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                                <option value="" disabled>-- Select Room --</option>
                                                {rooms.map(r => <option key={r.id} value={r.id}>{r.roomNumber} ({r.roomType})</option>)}
                                            </select>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100 flex gap-3">
                                            <button type="button" onClick={() => setActiveCell(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl">Cancel</button>
                                            <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl flex justify-center items-center gap-2">
                                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Class'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ManageTimetable;