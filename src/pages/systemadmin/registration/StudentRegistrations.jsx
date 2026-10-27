import React, { useState } from 'react';
import DataTable from '../../../components/common/DataTable';
import { Search, Plus, X, Trash2, CheckCircle, BookOpen, AlertCircle } from 'lucide-react';

const StudentRegistrations = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock Data: Students and their registered courses
    const [students, setStudents] = useState([
        {
            id: 1, name: 'Ali Raza', rollNo: '5950/BCS/2024F', program: 'BCS', semester: '2nd', batch: '2024-2028',
            registeredCourses: [
                { code: 'CS-102', name: 'Programming Fundamentals', credits: 4, section: 'A' },
                { code: 'MATH-102', name: 'Calculus II', credits: 3, section: 'B' }
            ]
        },
        {
            id: 2, name: 'Sara Khan', rollNo: '5951/BCS/2024F', program: 'BCS', semester: '2nd', batch: '2024-2028',
            registeredCourses: [
                { code: 'CS-102', name: 'Programming Fundamentals', credits: 4, section: 'B' },
                { code: 'ENG-102', name: 'English Composition', credits: 3, section: 'A' }
            ]
        },
        {
            id: 3, name: 'Usman Ahmed', rollNo: '5800/BSE/2023F', program: 'BSE', semester: '3rd', batch: '2023-2027',
            registeredCourses: []
        },
    ]);

    // Available courses to add
    const availableCourses = [
        { code: 'CS-201', name: 'Data Structures', credits: 4, sections: ['A', 'B'] },
        { code: 'CS-202', name: 'Algorithms', credits: 4, sections: ['A'] },
        { code: 'MATH-201', name: 'Linear Algebra', credits: 3, sections: ['A', 'B', 'C'] },
    ];

    const [newCourse, setNewCourse] = useState({ code: '', section: '' });

    const filteredData = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRemoveCourse = (studentId, courseCode) => {
        setStudents(prev => prev.map(student => {
            if (student.id === studentId) {
                return {
                    ...student,
                    registeredCourses: student.registeredCourses.filter(c => c.code !== courseCode)
                };
            }
            return student;
        }));
        // Update local modal state if it's open
        setSelectedStudent(prev => ({
            ...prev,
            registeredCourses: prev.registeredCourses.filter(c => c.code !== courseCode)
        }));
    };

    const handleAddCourse = (e) => {
        e.preventDefault();
        if (!newCourse.code || !newCourse.section) return;

        const courseInfo = availableCourses.find(c => c.code === newCourse.code);

        const courseToAdd = {
            code: courseInfo.code,
            name: courseInfo.name,
            credits: courseInfo.credits,
            section: newCourse.section
        };

        setStudents(prev => prev.map(student => {
            if (student.id === selectedStudent.id) {
                return {
                    ...student,
                    registeredCourses: [...student.registeredCourses, courseToAdd]
                };
            }
            return student;
        }));

        setSelectedStudent(prev => ({
            ...prev,
            registeredCourses: [...prev.registeredCourses, courseToAdd]
        }));

        setShowAddModal(false);
        setNewCourse({ code: '', section: '' });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1500);
    };

    const columns = [
        {
            key: 'name',
            label: 'Student Info',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {row.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.rollNo}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'program',
            label: 'Program & Batch',
            render: (row) => (
                <div>
                    <p className="text-sm font-semibold text-gray-800">{row.program}</p>
                    <p className="text-xs text-gray-500">{row.batch}</p>
                </div>
            )
        },
        {
            key: 'semester',
            label: 'Semester',
            render: (row) => (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold border border-slate-200">
                    {row.semester} Sem
                </span>
            )
        },
        {
            key: 'registeredCourses',
            label: 'Registered Courses',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md border border-indigo-100">
                        {row.registeredCourses.length} Courses
                    </span>
                </div>
            )
        },
        {
            key: 'action',
            label: 'Action',
            render: (row) => (
                <button
                    onClick={() => setSelectedStudent(row)}
                    className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition-colors"
                >
                    Manage Courses
                </button>
            )
        }
    ];

    return (
        <div className="space-y-4 max-w-7xl mx-auto">
            {/* Control Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80 p-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by student name or roll no..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            {/* Students Table */}
            <DataTable columns={columns} data={filteredData} itemsPerPage={5} />

            {/* 👇 MANAGE COURSES MODAL 👇 */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="bg-slate-800 p-6 text-white relative shrink-0">
                            <button onClick={() => setSelectedStudent(null)} className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                                    {selectedStudent.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                                    <p className="text-slate-300 font-medium">{selectedStudent.rollNo} • {selectedStudent.program}</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-indigo-600" /> Registered Courses
                                </h3>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Course
                                </button>
                            </div>

                            <div className="space-y-3">
                                {selectedStudent.registeredCourses.length > 0 ? (
                                    selectedStudent.registeredCourses.map((course, idx) => (
                                        <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">{course.code}</span>
                                                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Sec {course.section}</span>
                                                </div>
                                                <p className="font-bold text-gray-900">{course.name}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-bold text-gray-500">{course.credits} Cr</span>
                                                <button
                                                    onClick={() => handleRemoveCourse(selectedStudent.id, course.code)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove Course"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 border-dashed rounded-xl">
                                        No courses registered yet. Click "Add Course" to enroll.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-white border-t border-gray-200 shrink-0 text-right">
                            <button onClick={() => setSelectedStudent(null)} className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 👇 ADD COURSE MODAL 👇 */}
            {showAddModal && selectedStudent && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">Add Course to {selectedStudent.name}</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>

                        {showSuccess ? (
                            <div className="p-8 text-center animate-in zoom-in-95">
                                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-gray-900">Course Added!</h3>
                            </div>
                        ) : (
                            <form onSubmit={handleAddCourse} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Select Course</label>
                                    <select
                                        value={newCourse.code}
                                        onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                                        required
                                    >
                                        <option value="">-- Choose Course --</option>
                                        {availableCourses.map(c => (
                                            <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Select Section</label>
                                    <select
                                        value={newCourse.section}
                                        onChange={(e) => setNewCourse({ ...newCourse, section: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                                        required
                                        disabled={!newCourse.code}
                                    >
                                        <option value="">-- Choose Section --</option>
                                        {newCourse.code && availableCourses.find(c => c.code === newCourse.code)?.sections.map(sec => (
                                            <option key={sec} value={sec}>Section {sec}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md">Enroll Student</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default StudentRegistrations;