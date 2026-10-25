import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import {
    Calendar, Clock, MapPin, Plus, X, Layers, CheckCircle
} from 'lucide-react';

const ManageTimetable = () => {
    const [selectedSemester, setSelectedSemester] = useState('5th');
    const [selectedSection, setSelectedSection] = useState('A');
    const [activeCell, setActiveCell] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const availableCourses = [
        { id: 1, code: 'CS-301', name: 'Data Structures' },
        { id: 2, code: 'CS-302', name: 'Web Development' },
        { id: 3, code: 'CS-303', name: 'Algorithms' },
        { id: 4, code: 'CS-304', name: 'Databases' },
    ];

    const availableTeachers = [
        { id: 1, name: 'Dr. Smith' },
        { id: 2, name: 'Sarah Wilson' },
        { id: 3, name: 'Mike Chen' },
        { id: 4, name: 'David Lee' },
    ];

    // Mock Data: Fetching available spaces
    const availableSpaces = [
        { id: 1, name: 'Room 101 (Block A)', type: 'Classroom' },
        { id: 2, name: 'Room 201 (Block A)', type: 'Classroom' },
        { id: 3, name: 'Room 302 (Block B)', type: 'Classroom' },
        { id: 4, name: 'Lab 1 (Block C)', type: 'Lab' },
        { id: 5, name: 'Lab 3 (Block C)', type: 'Lab' },
    ];

    const timeSlots = ['08:30 - 09:50', '10:00 - 11:20', '11:30 - 12:50', '01:30 - 02:50', '03:00 - 04:20'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const [timetable, setTimetable] = useState({
        '5th': {
            'A': {
                Monday: {
                    '08:30 - 09:50': { course: 'CS-301', teacher: 'Dr. Smith', room: 'Room 101 (Block A)', color: 'bg-blue-100 border-blue-300 text-blue-800' },
                    '10:00 - 11:20': { course: 'CS-302', teacher: 'Sarah Wilson', room: 'Lab 3 (Block C)', color: 'bg-violet-100 border-violet-300 text-violet-800' },
                },
                Tuesday: {
                    '11:30 - 12:50': { course: 'CS-303', teacher: 'Mike Chen', room: 'Room 201 (Block A)', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
                }
            }
        }
    });

    const [formData, setFormData] = useState({
        course: '', teacher: '', room: ''
    });

    const handleCellClick = (day, time) => {
        const existingClass = timetable[selectedSemester]?.[selectedSection]?.[day]?.[time];
        setActiveCell({ day, time });
        if (existingClass) {
            setFormData(existingClass);
        } else {
            setFormData({ course: '', teacher: '', room: '' });
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const courseObj = availableCourses.find(c => c.name === formData.course);

        const newClass = {
            ...formData,
            course: courseObj ? courseObj.code : formData.course,
            color: 'bg-indigo-100 border-indigo-300 text-indigo-800'
        };

        setTimetable(prev => {
            const semesterData = prev[selectedSemester] || {};
            const sectionData = semesterData[selectedSection] || {};
            const dayData = sectionData[activeCell.day] || {};
            return {
                ...prev,
                [selectedSemester]: {
                    ...semesterData,
                    [selectedSection]: {
                        ...sectionData,
                        [activeCell.day]: { ...dayData, [activeCell.time]: newClass }
                    }
                }
            };
        });

        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setActiveCell(null);
        }, 1000);
    };

    const handleDelete = () => {
        setTimetable(prev => {
            const semesterData = { ...prev[selectedSemester] };
            const sectionData = { ...semesterData[selectedSection] };
            const dayData = { ...sectionData[activeCell.day] };
            delete dayData[activeCell.time];
            return {
                ...prev,
                [selectedSemester]: {
                    ...semesterData,
                    [selectedSection]: { ...sectionData, [activeCell.day]: dayData }
                }
            };
        });
        setActiveCell(null);
    };

    const currentTimetable = timetable[selectedSemester]?.[selectedSection] || {};

    return (
        <Layout title="Manage Timetable" subtitle="Efficiently build and update class schedules">
            <div className="space-y-6 pb-8 max-w-[1400px] mx-auto">

                {/* Control Panel */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Weekly Schedule Builder</h2>
                            <p className="text-sm text-gray-500">Click on any slot to assign or edit a class.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                            <Layers className="w-4 h-4 text-gray-500 ml-2" />
                            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="bg-transparent text-sm font-bold text-gray-800 focus:outline-none cursor-pointer pr-4">
                                {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(sem => <option key={sem} value={sem}>{sem} Semester</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                            <span className="text-xs font-bold text-emerald-600 ml-2 uppercase tracking-wide">Section</span>
                            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="bg-transparent text-sm font-bold text-emerald-800 focus:outline-none cursor-pointer pr-2">
                                {['A', 'B', 'C', 'D', 'E', 'F'].map(sec => <option key={sec} value={sec}>{sec}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Timetable Grid */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="min-w-[1000px]">
                            <div className="grid grid-cols-6 bg-slate-800 text-white border-b border-slate-700">
                                <div className="p-4 flex items-center justify-center font-bold text-sm uppercase tracking-wider border-r border-slate-700">Day / Time</div>
                                {timeSlots.map((time, idx) => (
                                    <div key={idx} className="p-4 text-center font-bold text-sm border-r border-slate-700 last:border-0 flex flex-col items-center justify-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />{time}
                                    </div>
                                ))}
                            </div>
                            <div className="divide-y divide-gray-200">
                                {days.map((day) => (
                                    <div key={day} className="grid grid-cols-6">
                                        <div className="p-4 flex items-center justify-center font-bold text-sm bg-slate-50 text-slate-700 border-r border-gray-200">{day}</div>
                                        {timeSlots.map((time) => {
                                            const classData = currentTimetable[day]?.[time];
                                            return (
                                                <div key={time} onClick={() => handleCellClick(day, time)} className="p-2 border-r border-gray-200 last:border-0 relative group cursor-pointer min-h-[120px]">
                                                    {classData ? (
                                                        <div className={`h-full w-full rounded-xl border-l-4 p-3 flex flex-col justify-center shadow-sm transition-all hover:scale-[1.02] ${classData.color}`}>
                                                            <div className="flex items-center justify-between gap-1 mb-1">
                                                                <span className="text-[10px] font-black uppercase opacity-80">{classData.course}</span>
                                                            </div>
                                                            <h3 className="text-xs font-bold leading-tight line-clamp-2">{classData.teacher}</h3>
                                                            <div className="mt-2 space-y-0.5">
                                                                <p className="text-[10px] font-semibold flex items-center gap-1 opacity-90"><MapPin className="w-3 h-3" /> {classData.room}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Plus className="w-6 h-6 mb-1 text-indigo-500" /><span className="text-xs font-bold text-indigo-500">Add Class</span>
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
                                <h2 className="text-lg font-bold">{currentTimetable[activeCell.day]?.[activeCell.time] ? 'Edit Class' : 'Add Class'}</h2>
                                <p className="text-slate-300 text-xs mt-0.5">{selectedSemester} Sem • Sec {selectedSection} • {activeCell.day} ({activeCell.time})</p>
                            </div>
                            <button onClick={() => setActiveCell(null)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                        </div>

                        {showSuccess ? (
                            <div className="p-8 text-center animate-in zoom-in-95">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-emerald-600" /></div>
                                <h3 className="text-lg font-bold text-gray-900">Schedule Updated!</h3>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Select Course</label>
                                    <select value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                        <option value="" disabled>-- Choose Course --</option>
                                        {availableCourses.map(c => <option key={c.id} value={c.name}>{c.code} - {c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Teacher</label>
                                    <select value={formData.teacher} onChange={(e) => setFormData({ ...formData, teacher: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                        <option value="" disabled>-- Select Teacher --</option>
                                        {availableTeachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                    </select>
                                </div>

                                {/* 👇 UPDATED ROOM DROPDOWN 👇 */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Room / Lab</label>
                                    <select value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                        <option value="" disabled>-- Select Room --</option>
                                        {availableSpaces.map(space => (
                                            <option key={space.id} value={space.name}>{space.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
                                    {currentTimetable[activeCell.day]?.[activeCell.time] && (
                                        <button type="button" onClick={handleDelete} className="px-4 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">Remove</button>
                                    )}
                                    <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors">Save Class</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ManageTimetable;