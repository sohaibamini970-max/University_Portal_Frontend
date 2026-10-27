import React, { useState } from 'react';
import DataTable from '../../../components/common/DataTable';
import { Search, Eye, X, Award, TrendingUp, Edit2, Check } from 'lucide-react';

const StudentResults = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Editing state
    const [editingCell, setEditingCell] = useState(null); // { courseCode, field }
    const [editValue, setEditValue] = useState('');

    // Mock Data
    const [students, setStudents] = useState([
        {
            id: 1, name: 'Ali Raza', rollNo: '5950/BCS/2024F', program: 'BCS', batch: '2023-2027', semester: '3rd',
            cgpa: '3.85', lastGpa: '3.90', status: 'Passed',
            assessments: [
                { code: 'CS-301', name: 'Data Structures', credits: 4, quiz: 18, assignment: 20, mid: 28, final: 42, total: 108, maxTotal: 120, grade: 'A' },
                { code: 'CS-303', name: 'Algorithms', credits: 4, quiz: 15, assignment: 18, mid: 25, final: 38, total: 96, maxTotal: 120, grade: 'B+' },
            ]
        },
        {
            id: 2, name: 'Sara Khan', rollNo: '5951/BCS/2024F', program: 'BCS', batch: '2023-2027', semester: '3rd',
            cgpa: '3.92', lastGpa: '3.95', status: 'Passed',
            assessments: [
                { code: 'CS-301', name: 'Data Structures', credits: 4, quiz: 20, assignment: 20, mid: 30, final: 45, total: 115, maxTotal: 120, grade: 'A+' },
            ]
        },
    ]);

    const filteredData = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Helper: Calculate Grade
    const calculateGrade = (total, maxTotal) => {
        const percentage = (total / maxTotal) * 100;
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C';
        return 'F';
    };

    // Handle Inline Edit Start
    const startEdit = (courseCode, field, currentValue) => {
        setEditingCell({ courseCode, field });
        setEditValue(currentValue);
    };

    // Handle Inline Edit Save
    const saveEdit = (studentId, courseCode, field) => {
        const numericValue = Number(editValue);
        if (isNaN(numericValue)) return; // Prevent saving non-numbers

        setStudents(prevStudents => prevStudents.map(student => {
            if (student.id === studentId) {
                return {
                    ...student,
                    assessments: student.assessments.map(course => {
                        if (course.code === courseCode) {
                            // Update the specific field
                            const updatedCourse = { ...course, [field]: numericValue };
                            // Recalculate total and grade
                            const newTotal = updatedCourse.quiz + updatedCourse.assignment + updatedCourse.mid + updatedCourse.final;
                            updatedCourse.total = newTotal;
                            updatedCourse.grade = calculateGrade(newTotal, updatedCourse.maxTotal);
                            return updatedCourse;
                        }
                        return course;
                    })
                };
            }
            return student;
        }));

        // Also update the currently opened modal so it reflects immediately
        setSelectedStudent(prev => {
            if (!prev) return null;
            return {
                ...prev,
                assessments: prev.assessments.map(course => {
                    if (course.code === courseCode) {
                        const updatedCourse = { ...course, [field]: numericValue };
                        const newTotal = updatedCourse.quiz + updatedCourse.assignment + updatedCourse.mid + updatedCourse.final;
                        updatedCourse.total = newTotal;
                        updatedCourse.grade = calculateGrade(newTotal, updatedCourse.maxTotal);
                        return updatedCourse;
                    }
                    return course;
                })
            };
        });

        setEditingCell(null);
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
        { key: 'program', label: 'Program' },
        {
            key: 'batch',
            label: 'Batch / Sem',
            render: (row) => <span className="text-sm font-semibold text-gray-700">{row.batch} ({row.semester})</span>
        },
        {
            key: 'cgpa',
            label: 'CGPA / GPA',
            render: (row) => (
                <div className="text-center">
                    <p className="font-bold text-indigo-700 text-sm">{row.cgpa} CGPA</p>
                    <p className="text-xs text-gray-500 font-medium">{row.lastGpa} GPA</p>
                </div>
            )
        },
        {
            key: 'action',
            label: 'Action',
            render: (row) => (
                <button
                    onClick={() => setSelectedStudent(row)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition-colors"
                >
                    <Eye className="w-3.5 h-3.5" /> View Marks
                </button>
            )
        }
    ];

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
                <div className="relative w-full sm:w-80 p-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text" placeholder="Search student by name or roll no..."
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            <DataTable columns={columns} data={filteredData} itemsPerPage={5} />

            {/* 👇 STUDENT MARKS DETAIL MODAL 👇 */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    {/* Added mt-10 to push modal down away from header */}
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh] mt-10">

                        {/* Header */}
                        <div className="bg-slate-800 p-6 text-white relative shrink-0">
                            <button onClick={() => setSelectedStudent(null)} className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
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

                        {/* Summary Stats */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 grid grid-cols-2 gap-4 shrink-0">
                            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Current CGPA</p>
                                    <p className="text-xl font-bold text-gray-900 leading-tight">{selectedStudent.cgpa}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Current GPA</p>
                                    <p className="text-xl font-bold text-gray-900 leading-tight">{selectedStudent.lastGpa}</p>
                                </div>
                            </div>
                        </div>

                        {/* Marks Table */}
                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Assessment Breakdown</h3>
                                <p className="text-xs text-indigo-600 font-bold">Click a mark to edit</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead>
                                            <tr className="bg-indigo-600 text-slate-100 text-xs font-bold uppercase tracking-wider">
                                                <th className="px-4 py-3">Course</th>
                                                <th className="px-4 py-3 text-center">Quiz (20)</th>
                                                <th className="px-4 py-3 text-center">Assign (20)</th>
                                                <th className="px-4 py-3 text-center">Mid (30)</th>
                                                <th className="px-4 py-3 text-center">Final (50)</th>
                                                <th className="px-4 py-3 text-center">Total</th>
                                                <th className="px-4 py-3 text-center">Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {selectedStudent.assessments.map(course => (
                                                <tr key={course.code} className="hover:bg-gray-50 group">
                                                    <td className="px-4 py-3">
                                                        <p className="font-bold text-gray-900 text-sm">{course.name}</p>
                                                        <p className="text-xs text-indigo-600 font-semibold">{course.code}</p>
                                                    </td>

                                                    {/* Editable Cells */}
                                                    {['quiz', 'assignment', 'mid', 'final'].map(field => (
                                                        <td key={field} className="px-4 py-3 text-center relative">
                                                            {editingCell?.courseCode === course.code && editingCell?.field === field ? (
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <input
                                                                        type="number"
                                                                        value={editValue}
                                                                        onChange={(e) => setEditValue(e.target.value)}
                                                                        onBlur={() => saveEdit(selectedStudent.id, course.code, field)}
                                                                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(selectedStudent.id, course.code, field)}
                                                                        autoFocus
                                                                        className="w-14 px-1 py-1 text-center border border-indigo-400 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                                    />
                                                                    <button onClick={() => saveEdit(selectedStudent.id, course.code, field)} className="text-emerald-600 hover:text-emerald-700">
                                                                        <Check className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    onClick={() => startEdit(course.code, field, course[field])}
                                                                    className="flex items-center justify-center gap-1 cursor-pointer hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                                                                >
                                                                    <span className="text-sm text-gray-700 font-medium">{course[field]}</span>
                                                                    <Edit2 className="w-3 h-3 text-gray-300 group-hover:text-indigo-500" />
                                                                </div>
                                                            )}
                                                        </td>
                                                    ))}

                                                    <td className="px-4 py-3 text-center font-bold text-gray-900">
                                                        {course.total} <span className="text-xs text-gray-400">/{course.maxTotal}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${course.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                                                                course.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-orange-100 text-orange-700'
                                                            }`}>
                                                            {course.grade}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-white border-t border-gray-200 shrink-0 text-right">
                            <button onClick={() => setSelectedStudent(null)} className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentResults;