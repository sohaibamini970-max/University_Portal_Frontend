import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DataTable from '../../../components/common/DataTable';
import {
    Search, CalendarDays, CheckCircle, ArrowLeft,
    Clock, MapPin, Filter, Users, Edit2, Save, UserCheck, Building2
} from 'lucide-react';

const DomainTimetable = () => {
    const { domainId } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('3rd');
    const [selectedBatch, setSelectedBatch] = useState('2023-2027');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Editing state for inline table edit
    const [editingCell, setEditingCell] = useState(null); // { courseCode, field }
    const [editValue, setEditValue] = useState('');

    const domainNames = { cs: 'Computer Science', it: 'Information Technology', se: 'Software Engineering', ai: 'Artificial Intelligence' };
    const currentDomainName = domainNames[domainId] || 'Unknown Domain';

    // Available Batches per Semester
    const semesterBatches = {
        '1st': ['2025-2029'],
        '2nd': ['2024-2028'],
        '3rd': ['2023-2027', '2022-2026'],
        '4th': ['2022-2026'],
        '5th': ['2021-2025'],
        '6th': ['2021-2025'],
        '7th': ['2020-2024'],
        '8th': ['2020-2024'],
    };
    const currentBatches = semesterBatches[selectedSemester] || [];

    // Dropdown Options
    const departmentLocations = ['Main Campus', 'City Campus', 'North Campus'];
    const examHalls = ['Hall A', 'Hall B', 'Hall C', 'Lab 1', 'Lab 2'];
    const availableTeachers = ['Dr. Smith', 'Sarah Wilson', 'Mike Chen', 'Dr. Ali', 'David Lee'];

    // Master Mock Data of Courses
    const allCourses = [
        { domain: 'cs', semester: '3rd', course: 'Data Structures', code: 'CS-301' },
        { domain: 'cs', semester: '3rd', course: 'Algorithms', code: 'CS-303' },
        { domain: 'cs', semester: '3rd', course: 'Web Development', code: 'CS-302' },
        { domain: 'cs', semester: '5th', course: 'Operating Systems', code: 'CS-401' },
        { domain: 'it', semester: '4th', course: 'Networking', code: 'IT-401' },
        { domain: 'se', semester: '5th', course: 'Software Architecture', code: 'SE-501' },
    ];

    // State to hold the timetable data
    const [timetable, setTimetable] = useState([]);

    // When dropdowns change, reset the timetable with the required courses
    useEffect(() => {
        // Filter courses based on selected domain and semester
        const requiredCourses = allCourses.filter(
            c => c.domain === domainId && c.semester === selectedSemester
        );

        // Map them into exam records (empty dates initially)
        const initialTimetable = requiredCourses.map(course => ({
            id: course.code, // unique identifier for the row
            ...course,
            batch: selectedBatch,
            date: '',
            time: '',
            duration: '3 Hours',
            location: '',
            hall: '',
            invigilator: ''
        }));

        setTimetable(initialTimetable);
    }, [domainId, selectedSemester, selectedBatch]);

    // Filter data for search
    const filteredData = timetable.filter(e =>
        e.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle Inline Edit (Dates)
    const startEdit = (id, field, currentValue) => {
        setEditingCell({ id, field });
        setEditValue(currentValue);
    };

    const saveInlineEdit = (id) => {
        setTimetable(prev => prev.map(exam =>
            exam.id === id ? { ...exam, [editingCell.field]: editValue } : exam
        ));
        setEditingCell(null);
    };

    // Handle Dropdown Updates
    const handleDropdownChange = (id, field, value) => {
        setTimetable(prev => prev.map(exam =>
            exam.id === id ? { ...exam, [field]: value } : exam
        ));
    };

    const columns = [
        {
            key: 'course',
            label: 'Course Info',
            render: (row) => (
                <div>
                    <p className="font-bold text-gray-900 text-sm">{row.course}</p>
                    <p className="text-xs text-indigo-600 font-semibold">{row.code}</p>
                </div>
            )
        },
        {
            key: 'date',
            label: 'Date & Time (Click to edit)',
            render: (row) => (
                <div className="text-sm space-y-1">
                    {/* Inline Date Edit */}
                    {editingCell?.id === row.id && editingCell?.field === 'date' ? (
                        <input
                            type="date"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveInlineEdit(row.id)}
                            autoFocus
                            className="px-2 py-1 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none w-full"
                        />
                    ) : (
                        <p
                            onClick={() => startEdit(row.id, 'date', row.date)}
                            className="font-medium text-gray-800 flex items-center gap-1.5 cursor-pointer hover:bg-gray-100 p-1 -ml-1 rounded transition-colors group"
                        >
                            <CalendarDays className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-500" />
                            {row.date || 'Set Date'}
                            <Edit2 className="w-3 h-3 text-transparent group-hover:text-indigo-400 ml-auto" />
                        </p>
                    )}

                    {/* Inline Time Edit */}
                    {editingCell?.id === row.id && editingCell?.field === 'time' ? (
                        <input
                            type="time"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveInlineEdit(row.id)}
                            autoFocus
                            className="px-2 py-1 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none w-full"
                        />
                    ) : (
                        <p
                            onClick={() => startEdit(row.id, 'time', row.time)}
                            className="text-xs text-gray-500 flex items-center gap-1.5 cursor-pointer hover:bg-gray-100 p-1 -ml-1 rounded transition-colors group"
                        >
                            <Clock className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-500" />
                            {row.time || 'Set Time'} ({row.duration})
                            <Edit2 className="w-3 h-3 text-transparent group-hover:text-indigo-400 ml-auto" />
                        </p>
                    )}
                </div>
            )
        },
        {
            key: 'location',
            label: 'Dept. Location',
            render: (row) => (
                <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                    <select
                        value={row.location}
                        onChange={(e) => handleDropdownChange(row.id, 'location', e.target.value)}
                        className="w-full max-w-[140px] px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="">Select Location</option>
                        {departmentLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </div>
            )
        },
        {
            key: 'hall',
            label: 'Exam Hall',
            render: (row) => (
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <select
                        value={row.hall}
                        onChange={(e) => handleDropdownChange(row.id, 'hall', e.target.value)}
                        className="w-full max-w-[120px] px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="">Select Hall</option>
                        {examHalls.map(hall => <option key={hall} value={hall}>{hall}</option>)}
                    </select>
                </div>
            )
        },
        {
            key: 'invigilator',
            label: 'Invigilator',
            render: (row) => (
                <div className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-gray-400 shrink-0" />
                    <select
                        value={row.invigilator}
                        onChange={(e) => handleDropdownChange(row.id, 'invigilator', e.target.value)}
                        className="w-full max-w-[150px] px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="">Select Teacher</option>
                        {availableTeachers.map(teacher => <option key={teacher} value={teacher}>{teacher}</option>)}
                    </select>
                </div>
            )
        },
    ];

    const handleSaveTimetable = () => {
        // Here you would send the `timetable` array to your backend API
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setShowSaveModal(false);
        }, 2000);
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <button onClick={() => navigate('/examination/timetable')} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentDomainName} Exams</h2>
                    <p className="text-sm text-gray-500">Pre-loaded courses. Fill in the dates, halls, and invigilators.</p>
                </div>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col lg:flex-row items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text" placeholder="Search exams..."
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Semester Filter */}
                    <div className="flex items-center gap-2 w-full sm:w-auto bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
                        <Filter className="w-4 h-4 text-indigo-600" />
                        <select
                            value={selectedSemester}
                            onChange={(e) => {
                                setSelectedSemester(e.target.value);
                                setSelectedBatch(semesterBatches[e.target.value][0] || '');
                            }}
                            className="bg-transparent text-sm font-bold text-indigo-800 focus:outline-none cursor-pointer w-full"
                        >
                            {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(sem => (
                                <option key={sem} value={sem}>{sem} Semester</option>
                            ))}
                        </select>
                    </div>

                    {/* Batch Filter */}
                    <div className="flex items-center gap-2 w-full sm:w-auto bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="bg-transparent text-sm font-bold text-emerald-800 focus:outline-none cursor-pointer w-full"
                        >
                            {currentBatches.map(batch => (
                                <option key={batch} value={batch}>Batch {batch}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button
                        onClick={() => setShowSaveModal(true)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                    >
                        <Save className="w-4 h-4" /> Save Timetable
                    </button>
                </div>
            </div>

            <DataTable columns={columns} data={filteredData} itemsPerPage={10} />

            {/* ================= SAVE TIMETABLE CONFIRMATION MODAL ================= */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 text-center">

                        {showSuccess ? (
                            <div className="p-8 animate-in zoom-in-95">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Timetable Saved!</h2>
                                <p className="text-sm text-gray-500">The exam schedule has been published successfully.</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-indigo-600 p-6 text-white">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Save className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-xl font-bold">Confirm & Save Timetable</h2>
                                    <p className="text-indigo-100 text-sm mt-1">You are about to publish the exam schedule.</p>
                                </div>
                                <div className="p-6">
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-500">Domain</span>
                                            <span className="font-bold text-gray-800">{currentDomainName}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-500">Semester</span>
                                            <span className="font-bold text-gray-800">{selectedSemester} Semester</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-500">Batch</span>
                                            <span className="font-bold text-gray-800">{selectedBatch}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                                            <span className="text-sm text-gray-500">Total Exams</span>
                                            <span className="font-bold text-indigo-700 text-lg">{filteredData.length}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setShowSaveModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                        <button onClick={handleSaveTimetable} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md">Confirm Save</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DomainTimetable;