import React, { useState, useEffect } from 'react';
import {
    Search, Award, BookOpen, X, Save, CheckCircle,
    Trash2, Edit2, Layers, Filter
} from 'lucide-react';
import { api } from '../../../context/AuthContext';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [allCoursesForPrereq, setAllCoursesForPrereq] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // 👇 NEW: Filter dropdowns 👇
    const [programs, setPrograms] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    // 👇 NEW: Course IDs that match the current program/semester filter 👇
    const [filteredCourseIds, setFilteredCourseIds] = useState(null); // null = no filter active
    const [filterLoading, setFilterLoading] = useState(false);

    // Modal State
    const [editingCourse, setEditingCourse] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    // 1. Fetch Data
    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data);
            setAllCoursesForPrereq(res.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    // 👇 NEW: Fetch programs & semesters for dropdowns 👇
    const fetchFilterOptions = async () => {
        try {
            const [progRes, semRes] = await Promise.all([
                api.get('/programs'),
                api.get('/semesters'),
            ]);
            setPrograms(progRes.data);
            setSemesters(semRes.data);
        } catch (error) {
            console.error("Failed to fetch filter options", error);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchFilterOptions();
    }, []);

    // 👇 NEW: Fetch filtered course IDs when program/semester changes 👇
    useEffect(() => {
        const applyFilter = async () => {
            // No filter → show all courses
            if (!selectedProgram && !selectedSemester) {
                setFilteredCourseIds(null);
                return;
            }

            setFilterLoading(true);
            try {
                const params = {};
                if (selectedProgram) params.programId = selectedProgram;
                if (selectedSemester) params.semesterId = selectedSemester;

                const res = await api.get('/program-courses', { params });
                // Deduplicate course IDs (same course may appear across batches)
                const ids = [...new Set(res.data.map(pc => pc.courseId))];
                setFilteredCourseIds(ids);
            } catch (error) {
                console.error("Failed to filter courses", error);
                setFilteredCourseIds([]);
            } finally {
                setFilterLoading(false);
            }
        };

        applyFilter();
    }, [selectedProgram, selectedSemester]);

    // 2. Open Edit Modal
    const handleOpenEdit = (course) => {
        setEditingCourse(course);
        setEditFormData({
            code: course.code,
            name: course.name,
            creditHours: course.creditHours,
            type: course.type,
            prerequisiteId: course.prerequisiteId || '',
            isActive: course.isActive
        });
    };

    // 3. Save Changes
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...editFormData,
                creditHours: parseInt(editFormData.creditHours),
                prerequisiteId: editFormData.prerequisiteId ? parseInt(editFormData.prerequisiteId) : null
            };

            await api.put(`/courses/${editingCourse.id}`, payload);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setEditingCourse(null);
                fetchCourses();
            }, 1500);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update course");
        }
    };

    // 4. Delete Course
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This might affect program assignments.")) return;
        try {
            await api.delete(`/courses/${id}`);
            fetchCourses();
        } catch (error) {
            alert(error.response?.data?.message || "Cannot delete course. It might be assigned to a program.");
        }
    };

    // 5. Reset filters
    const handleClearFilters = () => {
        setSelectedProgram('');
        setSelectedSemester('');
    };

    // 👇 Filter: program/semester first, then search query 👇
    const filteredCourses = courses
        .filter(course => {
            if (filteredCourseIds === null) return true; // no program/semester filter
            return filteredCourseIds.includes(course.id);
        })
        .filter(course =>
            course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // Table Columns
    const columns = [
        {
            key: 'code', label: 'Code',
            render: (row) => <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md text-xs">{row.code}</span>
        },
        {
            key: 'name', label: 'Course Name',
            render: (row) => (
                <div>
                    <p className="font-bold text-gray-900">{row.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-gray-500 font-medium">{row.type}</span>
                        {row.prerequisite && (
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                                Prereq: {row.prerequisite.code}
                            </span>
                        )}
                    </div>
                </div>
            )
        },
        {
            key: 'creditHours', label: 'Credits',
            render: (row) => (
                <div className="flex justify-center items-center gap-1 text-sm font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md w-max">
                    <Award className="w-3.5 h-3.5 text-gray-400" /> {row.creditHours}
                </div>
            )
        },
        {
            key: 'status', label: 'Status',
            render: (row) => <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{row.isActive ? 'Active' : 'Inactive'}</span>,
        },
        {
            key: 'action', label: 'Action',
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleOpenEdit(row)}
                        className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    if (loading) return <div className="text-center py-10 text-gray-500">Loading courses...</div>;

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
                            <p className="text-3xl font-bold mt-1">{courses.filter(c => c.isActive).length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Layers className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Credits</p>
                        <p className="text-3xl font-bold mt-1 text-emerald-600">{courses.reduce((sum, c) => sum + c.creditHours, 0)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Award className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* 👇 NEW: Filter + Search Bar 👇 */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500 shrink-0">
                    <Filter className="w-4 h-4" /> Filter:
                </div>

                <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none min-w-[180px]"
                >
                    <option value="">All Programs</option>
                    {programs.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>

                <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none min-w-[150px]"
                >
                    <option value="">All Semesters</option>
                    {semesters.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>

                {(selectedProgram || selectedSemester) && (
                    <button
                        onClick={handleClearFilters}
                        className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        <X className="w-3.5 h-3.5" /> Clear
                    </button>
                )}

                <div className="flex-1" />

                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by code or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            {/* Filter status hint */}
            {filteredCourseIds !== null && (
                <p className="text-xs font-medium text-gray-500 -mt-2">
                    Showing <span className="font-bold text-indigo-600">{filteredCourses.length}</span> course(s)
                    {selectedProgram && <> in <span className="font-bold">{[...programs, ...semesters].find(x => String(x.id) === selectedProgram)?.name}</span></>}
                    {selectedSemester && <> for <span className="font-bold">{[...programs, ...semesters].find(x => String(x.id) === selectedSemester)?.name}</span></>}
                    .
                </p>
            )}

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider">
                                {columns.map((col, i) => (
                                    <th key={i} className="px-6 py-4">{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filterLoading ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                                        Filtering courses...
                                    </td>
                                </tr>
                            ) : filteredCourses.map((row, rowIndex) => (
                                <tr key={row.id} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-gray-50 transition-colors`}>
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 text-sm text-gray-700">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {!filterLoading && filteredCourses.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                                        No courses found for the selected filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* EDIT MODAL (unchanged) */}
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
                            </div>
                        ) : (
                            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-5">
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

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                        <select value={editFormData.type} onChange={e => setEditFormData({ ...editFormData, type: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                                            <option>Core</option>
                                            <option>Elective</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Credits</label>
                                        <input type="number" value={editFormData.creditHours} onChange={e => setEditFormData({ ...editFormData, creditHours: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                        <select value={editFormData.isActive} onChange={e => setEditFormData({ ...editFormData, isActive: e.target.value === 'true' })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prerequisite</label>
                                        <select value={editFormData.prerequisiteId} onChange={e => setEditFormData({ ...editFormData, prerequisiteId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                                            <option value="">None</option>
                                            {allCoursesForPrereq
                                                .filter(c => c.id !== editingCourse.id)
                                                .map(c => (
                                                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                                                ))
                                            }
                                        </select>
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