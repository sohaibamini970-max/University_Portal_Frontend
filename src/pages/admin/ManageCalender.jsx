import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import {
    Filter, BookOpen, Loader2, Calendar, ChevronDown, CheckCircle, AlertCircle, Edit2, Save, X
} from 'lucide-react';
import { api } from '../../context/AuthContext';

const ManageCalendar = () => {
    // Dropdowns
    const [programs, setPrograms] = useState([]);
    const [batches, setBatches] = useState([]);
    const [semesters, setSemesters] = useState([]);

    // Selections
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSection, setSelectedSection] = useState('A');

    // Data
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    // Global Generator Settings
    const [totalWeeks, setTotalWeeks] = useState(14);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    // Expanded Course State
    const [expandedCourseId, setExpandedCourseId] = useState(null);
    const [courseDates, setCourseDates] = useState({});
    const [loadingDates, setLoadingDates] = useState(false);

    // Inline Edit State
    const [editingDateId, setEditingDateId] = useState(null);
    const [editDateValue, setEditDateValue] = useState('');

    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [progRes, batchRes, semRes] = await Promise.all([
                    api.get('/programs'), api.get('/batches'), api.get('/semesters')
                ]);
                setPrograms(progRes.data);
                setBatches(batchRes.data);
                setSemesters(semRes.data);
                if (progRes.data.length > 0) setSelectedProgram(progRes.data[0].id);
                if (batchRes.data.length > 0) setSelectedBatch(batchRes.data[0].id);
                if (semRes.data.length > 0) setSelectedSemester(semRes.data[0].id);
            } catch (error) { console.error(error); }
        };
        fetchDropdowns();
    }, []);

    const fetchCourses = async () => {
        if (!selectedProgram || !selectedBatch || !selectedSemester) return;
        setLoading(true);
        try {
            const res = await api.get(`/academic-calendar/configure?programId=${selectedProgram}&batchId=${selectedBatch}&semesterId=${selectedSemester}&section=${selectedSection}`);
            setCourses(res.data);
            setExpandedCourseId(null); // Close expanded view on filter change
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCourses(); }, [selectedProgram, selectedBatch, selectedSemester, selectedSection]);

    const handleGenerate = async (course) => {
        const requiredClasses = course.creditHours * totalWeeks;
        if (!window.confirm(`This will generate ${requiredClasses} dates for ${course.courseCode} over ${totalWeeks} weeks, based on its scheduled days (${course.scheduleDays.join(', ')}). Proceed?`)) return;

        try {
            await api.post('/academic-calendar/generate', {
                teacherAssignmentId: course.teacherAssignmentId,
                totalWeeks: parseInt(totalWeeks),
                startDate: startDate
            });
            // Automatically expand and load dates after generating
            toggleCourseExpand(course);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to generate dates");
        }
    };

    const toggleCourseExpand = async (course) => {
        if (expandedCourseId === course.teacherAssignmentId) {
            setExpandedCourseId(null);
            return;
        }
        setExpandedCourseId(course.teacherAssignmentId);
        setLoadingDates(true);
        try {
            const res = await api.get(`/academic-calendar/course?teacherAssignmentId=${course.teacherAssignmentId}`);
            // Group by weekNumber
            const grouped = res.data.reduce((acc, curr) => {
                if (!acc[curr.weekNumber]) acc[curr.weekNumber] = [];
                acc[curr.weekNumber].push(curr);
                return acc;
            }, {});
            setCourseDates(grouped);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingDates(false);
        }
    };

    const handleEditClick = (cls) => {
        setEditingDateId(cls.id);
        setEditDateValue(cls.date);
    };

    const handleSaveDate = async (id) => {
        try {
            await api.put(`/academic-calendar/${id}/date`, { newDate: editDateValue });
            setEditingDateId(null);

            // Refresh the specific course dates
            const course = courses.find(c => c.teacherAssignmentId === expandedCourseId);
            if (course) {
                const res = await api.get(`/academic-calendar/course?teacherAssignmentId=${course.teacherAssignmentId}`);
                const grouped = res.data.reduce((acc, curr) => {
                    if (!acc[curr.weekNumber]) acc[curr.weekNumber] = [];
                    acc[curr.weekNumber].push(curr);
                    return acc;
                }, {});
                setCourseDates(grouped);
            }
        } catch (error) {
            alert("Failed to update date");
        }
    };

    return (
        <Layout title="Academic Calendar" subtitle="Manage class dates based on credit hours and timetables">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                {/* Global Settings Panel */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Filter className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">1. Select Configuration</h2>
                            <p className="text-sm text-gray-500">Choose the class group and set the semester duration.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Program</label>
                            <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch</label>
                            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Semester</label>
                            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section</label>
                            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                {['A', 'B', 'C', 'D', 'E', 'F'].map(sec => <option key={sec} value={sec}>Section {sec}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <div>
                            <label className="block text-xs font-bold text-indigo-700 uppercase mb-1">Semester Start Date</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm font-semibold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-indigo-700 uppercase mb-1">Total Weeks</label>
                            <input type="number" value={totalWeeks} onChange={e => setTotalWeeks(e.target.value)} min="1" max="20" className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm font-semibold" />
                        </div>
                    </div>
                </div>

                {/* Courses List */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">2. Course Dates Management</h2>
                            <p className="text-sm text-gray-500">Manage the specific dates for each course in Section {selectedSection}.</p>
                        </div>
                        {loading && <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />}
                    </div>

                    <div className="divide-y divide-gray-100">
                        {courses.length === 0 && !loading && (
                            <div className="p-10 text-center text-gray-500">
                                No courses found for this section.
                            </div>
                        )}

                        {courses.map(course => {
                            const requiredClasses = course.creditHours * totalWeeks;
                            const isExpanded = expandedCourseId === course.teacherAssignmentId;

                            return (
                                <div key={course.teacherAssignmentId} className="bg-white">

                                    {/* Course Row */}
                                    <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-lg">{course.courseCode} - {course.courseName}</p>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500 font-medium">
                                                    <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {course.creditHours} Credit Hours</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span>Scheduled on: {course.scheduleDays.join(', ')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
                                            <div className="text-right bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Required Classes</p>
                                                <p className="font-black text-indigo-600 text-lg">{requiredClasses}</p>
                                            </div>

                                            <button
                                                onClick={() => handleGenerate(course)}
                                                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-sm flex items-center gap-2"
                                            >
                                                <Calendar className="w-4 h-4" /> Auto-Generate
                                            </button>

                                            <button
                                                onClick={() => toggleCourseExpand(course)}
                                                className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 flex items-center gap-2"
                                            >
                                                {isExpanded ? 'Hide Dates' : 'View Dates'}
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Dates View */}
                                    {isExpanded && (
                                        <div className="p-6 bg-slate-50 border-t border-gray-100">
                                            {loadingDates ? (
                                                <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
                                            ) : Object.keys(courseDates).length === 0 ? (
                                                <div className="p-6 text-center text-orange-600 bg-orange-50 rounded-xl border border-orange-100">
                                                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                                    <p className="font-bold">No dates generated yet.</p>
                                                    <p className="text-sm mt-1">Click "Auto-Generate" to create the {requiredClasses} class dates.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    {/* Week Legend */}
                                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-indigo-100 border border-indigo-300"></div> Class Date</div>
                                                        <div className="flex items-center gap-1.5"><Edit2 className="w-3.5 h-3.5" /> Click to Edit</div>
                                                    </div>

                                                    {/* Weeks Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {Object.keys(courseDates).map(weekNum => (
                                                            <div key={weekNum} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                                                <div className="bg-indigo-50/50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                                                    <h4 className="font-bold text-gray-800">Week {weekNum}</h4>
                                                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">{courseDates[weekNum].length} Classes</span>
                                                                </div>
                                                                <div className="p-3 space-y-2">
                                                                    {courseDates[weekNum].map(cls => (
                                                                        <div key={cls.id} className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                                                                            <div className="w-6 h-6 rounded-md bg-white border border-gray-300 text-gray-600 flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm">
                                                                                {cls.classNumber}
                                                                            </div>

                                                                            {editingDateId === cls.id ? (
                                                                                <div className="flex-1 flex gap-1">
                                                                                    <input
                                                                                        type="date"
                                                                                        value={editDateValue}
                                                                                        onChange={e => setEditDateValue(e.target.value)}
                                                                                        className="flex-1 px-1.5 py-1 text-xs border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                                                                    />
                                                                                    <button onClick={() => handleSaveDate(cls.id)} className="p-1 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200"><Save className="w-3.5 h-3.5" /></button>
                                                                                    <button onClick={() => setEditingDateId(null)} className="p-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"><X className="w-3.5 h-3.5" /></button>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex-1 flex justify-between items-center group cursor-pointer" onClick={() => handleEditClick(cls)}>
                                                                                    <div>
                                                                                        <p className="text-sm font-bold text-gray-800">{new Date(cls.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{cls.dayName}</p>
                                                                                    </div>
                                                                                    <Edit2 className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ManageCalendar;