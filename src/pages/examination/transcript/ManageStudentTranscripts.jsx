import React, { useState } from 'react';
import { Search, FileText, Download, X, Edit2, Check, AlertCircle } from 'lucide-react';

const ManageStudentTranscripts = () => {
    const [rollNoInput, setRollNoInput] = useState('');
    const [student, setStudent] = useState(null);
    const [error, setError] = useState('');

    // Print Modal State
    const [showTranscript, setShowTranscript] = useState(false);

    // Inline Edit State
    const [editingCell, setEditingCell] = useState(null); // { courseCode }
    const [editValue, setEditValue] = useState('');

    // Mock Database
    const database = {
        '5950/BCS/2024F': {
            name: 'Ali Raza', program: 'BS Computer Science', batch: '2021-2025', cgpa: '3.85',
            courses: [
                { code: 'CS-301', name: 'Data Structures', credits: 4, semester: '1st', grade: 'B' },
                { code: 'CS-303', name: 'Algorithms', credits: 4, semester: '1st', grade: 'B+' },
                { code: 'MATH-101', name: 'Calculus I', credits: 3, semester: '2nd', grade: 'A' },
            ]
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setError('');
        setStudent(null);

        const found = database[rollNoInput.trim()];
        if (found) {
            setStudent({ rollNo: rollNoInput.trim(), ...found });
        } else {
            setError('Student with this roll number not found.');
        }
    };

    const startEdit = (courseCode, currentGrade) => {
        setEditingCell({ courseCode });
        setEditValue(currentGrade);
    };

    const saveEdit = (courseCode) => {
        setStudent(prev => ({
            ...prev,
            courses: prev.courses.map(c =>
                c.code === courseCode ? { ...c, grade: editValue } : c
            )
        }));
        setEditingCell(null);
        // In a real app, fire API call here to update the grade
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Search Header */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Manage Student Transcripts</h2>
                        <p className="text-sm text-gray-500">Search a student, correct any errors in their grades, and generate their transcript.</p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text" placeholder="Enter Roll Number (e.g., 5950/BCS/2024F)"
                            value={rollNoInput} onChange={(e) => setRollNoInput(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <button type="submit" className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">
                        Search Student
                    </button>
                </form>
                {error && <p className="text-red-500 text-sm font-bold mt-3">{error}</p>}
            </div>

            {/* Student Details & Grades */}
            {student && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">

                    {/* Top Bar */}
                    <div className="bg-slate-50 p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="font-bold text-xl text-gray-900">{student.name}</h3>
                            <p className="text-sm text-gray-500">{student.rollNo} • {student.program} • Batch {student.batch}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase">Current CGPA</p>
                                <p className="text-xl font-black text-indigo-700">{student.cgpa}</p>
                            </div>
                            <button
                                onClick={() => setShowTranscript(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                            >
                                <FileText className="w-4 h-4" /> Generate Transcript
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" /> Edit Grades (Click Grade to change)
                        </h4>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-4 py-3">Course</th>
                                    <th className="px-4 py-3 text-center">Credits</th>
                                    <th className="px-4 py-3 text-center">Semester</th>
                                    <th className="px-4 py-3 text-center">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {student.courses.map(course => (
                                    <tr key={course.code} className="hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <p className="font-bold text-gray-900 text-sm">{course.name}</p>
                                            <p className="text-xs text-indigo-600 font-semibold">{course.code}</p>
                                        </td>
                                        <td className="px-4 py-4 text-center font-bold text-gray-600">{course.credits}</td>
                                        <td className="px-4 py-4 text-center">{course.semester}</td>
                                        <td className="px-4 py-4 text-center">
                                            {editingCell?.courseCode === course.code ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <select
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="px-2 py-1 border border-indigo-300 rounded text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    >
                                                        {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'].map(g => (
                                                            <option key={g} value={g}>{g}</option>
                                                        ))}
                                                    </select>
                                                    <button onClick={() => saveEdit(course.code)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => startEdit(course.code, course.grade)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors group"
                                                >
                                                    <span className="font-bold text-gray-800">{course.grade}</span>
                                                    <Edit2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-600" />
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 👇 PRINTABLE TRANSCRIPT MODAL 👇 */}
            {showTranscript && student && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                        {/* Modal Toolbar (Not Printed) */}
                        <div className="bg-slate-800 p-4 text-white flex justify-between items-center shrink-0 print:hidden">
                            <h2 className="font-bold">Transcript Preview</h2>
                            <div className="flex gap-2">
                                <button onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                                    <Download className="w-4 h-4" /> Print / Save PDF
                                </button>
                                <button onClick={() => setShowTranscript(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* The Printable Paper */}
                        <div className="p-8 md:p-12 overflow-y-auto bg-white printable-area">

                            {/* Header (In real app, fetch from Transcript Design Page) */}
                            <div className="text-center border-b-2 border-slate-800 pb-6 mb-6">
                                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-wide">University of Technology</h1>
                                <p className="text-sm font-semibold text-slate-600 mt-1">Main Campus, Lahore</p>
                                <p className="text-xs text-slate-500 mt-1">Official Academic Transcript</p>
                            </div>

                            {/* Student Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm mb-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Name</p>
                                    <p className="font-semibold text-slate-900">{student.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Registration No</p>
                                    <p className="font-semibold text-slate-900">{student.rollNo}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Program</p>
                                    <p className="font-semibold text-slate-900">{student.program}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Batch</p>
                                    <p className="font-semibold text-slate-900">{student.batch}</p>
                                </div>
                            </div>

                            {/* Results Table */}
                            <table className="w-full text-sm text-left border-collapse border border-slate-200 mb-8">
                                <thead className="bg-slate-800 text-white">
                                    <tr>
                                        <th className="border border-slate-700 p-2">Code</th>
                                        <th className="border border-slate-700 p-2">Course Name</th>
                                        <th className="border border-slate-700 p-2 text-center">Credits</th>
                                        <th className="border border-slate-700 p-2 text-center">Semester</th>
                                        <th className="border border-slate-700 p-2 text-center">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {student.courses.map((course, idx) => (
                                        <tr key={course.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="border border-slate-200 p-2 font-bold">{course.code}</td>
                                            <td className="border border-slate-200 p-2">{course.name}</td>
                                            <td className="border border-slate-200 p-2 text-center">{course.credits}</td>
                                            <td className="border border-slate-200 p-2 text-center">{course.semester}</td>
                                            <td className="border border-slate-200 p-2 text-center font-bold text-indigo-700">{course.grade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Footer Signatures */}
                            <div className="mt-16 flex justify-between items-end border-t border-slate-300 pt-6">
                                <div>
                                    <p className="text-sm font-bold">Cumulative CGPA: <span className="text-indigo-700">{student.cgpa}</span></p>
                                </div>
                                <div className="text-center">
                                    <div className="w-40 border-b border-slate-800 mb-2"></div>
                                    <p className="text-xs font-bold text-slate-800">Dr. Sarah Ali</p>
                                    <p className="text-[10px] text-slate-500 uppercase mt-0.5">Controller of Examinations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStudentTranscripts;