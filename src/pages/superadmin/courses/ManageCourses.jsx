import React, { useState } from 'react';
import { Search, Layers, Award, BookOpen, X, Save, CheckCircle } from 'lucide-react';

const ManageCourses = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // State for the Edit Modal
    const [editingCourse, setEditingCourse] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [selectedSections, setSelectedSections] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const allSections = ['A', 'B', 'C', 'D', 'E', 'F'];
    const allSemesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

    const [courses, setCourses] = useState([
        { id: 1, code: 'CS-301', name: 'Data Structures', department: 'Computer Science', credits: 4, type: 'Core', semester: '3rd', status: 'Active', sections: ['A', 'B', 'C'] },
        { id: 2, code: 'CS-302', name: 'Web Development', department: 'Software Engineering', credits: 3, type: 'Elective', semester: '4th', status: 'Active', sections: ['A', 'B'] },
        { id: 3, code: 'IT-401', name: 'Cyber Security', department: 'Information Technology', credits: 3, type: 'Core', semester: '5th', status: 'Active', sections: ['A'] },
        { id: 4, code: 'MATH-101', name: 'Calculus I', department: 'Mathematics', credits: 3, type: 'Core', semester: '1st', status: 'Inactive', sections: [] },
    ]);

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenEdit = (course) => {
        setEditingCourse(course);
        setEditFormData(course);
        setSelectedSections(course.sections || []);
    };

    const handleSectionToggle = (sec) => {
        setSelectedSections(prev =>
            prev.includes(sec) ? prev.filter(s => s !== sec) : [...prev, sec]
        );
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();

        // Update the courses array
        setCourses(prev => prev.map(c =>
            c.id === editingCourse.id
                ? { ...editFormData, sections: selectedSections }
                : c
        ));

        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setEditingCourse(null);
        }, 1500);
    };

    // Custom Table Columns with an Edit Action
    const columns = [
        {
            key: 'code', label: 'Code',
            render: (row) => <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md text-xs">{row.code}</span>
        },
        {
            key: 'name', label: 'Course Name',
            render: (row) => (
                <div>
                    <p className="font-bold text-gray-900">{row.name}</p>
                    <p className="text-[11px] text-gray-500 font-medium">{row.type}</p>
                </div>
            )
        },
        {
            key: 'department', label: 'Department',
            render: (row) => (
                <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{row.department}</span>
                </div>
            )
        },
        {
            key: 'semester', label: 'Semester',
            render: (row) => (
                <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-2 py-1 rounded-md">
                    {row.semester} Sem
                </span>
            )
        },
        {
            key: 'sections', label: 'Sections',
            render: (row) => (
                <div className="flex flex-wrap gap-1">
                    {row.sections.length > 0 ? row.sections.map(sec => (
                        <span key={sec} className="w-6 h-6 flex items-center justify-center bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded">
                            {sec}
                        </span>
                    )) : <span className="text-xs text-gray-400">None</span>}
                </div>
            )
        },
        {
            key: 'credits', label: 'Credits',
            render: (row) => (
                <div className="flex justify-center items-center gap-1 text-sm font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md w-max mx-auto">
                    <Award className="w-3.5 h-3.5 text-gray-400" /> {row.credits}
                </div>
            )
        },
        {
            key: 'status', label: 'Status',
            render: (row) => <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{row.status}</span>,
        },
        {
            key: 'action', label: 'Action',
            render: (row) => (
                <button
                    onClick={() => handleOpenEdit(row)}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors"
                >
                    Edit
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Courses</p>
                        <p className="text-3xl font-bold mt-1 text-gray-900">{courses.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium opacity-90">Active Courses</p>
                            <p className="text-3xl font-bold mt-1">{courses.filter(c => c.status === 'Active').length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Layers className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Credits</p>
                        <p className="text-3xl font-bold mt-1 text-emerald-600">{courses.reduce((sum, c) => sum + c.credits, 0)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Award className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
                <div className="relative w-full sm:w-80 p-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            {/* Custom Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider">
                                {columns.map((col, i) => (
                                    <th key={i} className="px-6 py-4">{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCourses.map((row, rowIndex) => (
                                <tr key={row.id} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-gray-50 transition-colors`}>
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 text-sm text-gray-700">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {filteredCourses.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                                        No courses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 👇 CUSTOM EDIT MODAL 👇 */}
            {editingCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                        <div className="bg-slate-800 p-5 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-lg font-bold">Update Course</h2>
                                <p className="text-slate-300 text-xs mt-0.5">{editingCourse.code} • {editingCourse.name}</p>
                            </div>
                            <button onClick={() => setEditingCourse(null)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {showSuccess ? (
                            <div className="p-10 text-center animate-in zoom-in-95">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Course Updated!</h3>
                                <p className="text-sm text-gray-500 mt-1">The changes have been saved successfully.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-5">

                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course Code</label>
                                        <input type="text" value={editFormData.code} onChange={e => setEditFormData({ ...editFormData, code: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course Name</label>
                                        <input type="text" value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                </div>

                                {/* Dropdowns */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Semester</label>
                                        <select value={editFormData.semester} onChange={e => setEditFormData({ ...editFormData, semester: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                                            {allSemesters.map(sem => <option key={sem} value={sem}>{sem} Sem</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                        <select value={editFormData.type} onChange={e => setEditFormData({ ...editFormData, type: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                                            <option>Core</option>
                                            <option>Elective</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Credits</label>
                                        <input type="number" value={editFormData.credits} onChange={e => setEditFormData({ ...editFormData, credits: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                        <select value={editFormData.status} onChange={e => setEditFormData({ ...editFormData, status: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Sections Checkboxes */}
                                <div className="pt-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Manage Sections</label>
                                    <div className="flex flex-wrap gap-3">
                                        {allSections.map(sec => {
                                            const isSelected = selectedSections.includes(sec);
                                            return (
                                                <label key={sec} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 border-indigo-300 text-indigo-800' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleSectionToggle(sec)}
                                                        className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
                                                    />
                                                    <span className="text-sm font-bold">Sec {sec}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex gap-3">
                                    <button type="button" onClick={() => setEditingCourse(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2">
                                        <Save className="w-4 h-4" /> Save Changes
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageCourses;