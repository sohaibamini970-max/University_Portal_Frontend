import React, { useState } from 'react';
import DataTable from '../../../components/common/DataTable';
import { Search, CheckCircle, Clock, Eye, Send, X, User, Hash, BookOpen } from 'lucide-react';

const PublishResults = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [results, setResults] = useState([
        {
            id: 1, course: 'Data Structures', code: 'CS-301', teacher: 'Dr. Smith', teacherId: 'EMP-001', submittedOn: 'Dec 16, 2025', batch: '2023-2027', status: 'Pending',
            students: [
                { rollNo: '5950/BCS/2024F', name: 'Ali Raza', quiz: 18, assignment: 20, mid: 28, final: 42, total: 108, grade: 'A' },
                { rollNo: '5951/BCS/2024F', name: 'Sara Khan', quiz: 20, assignment: 20, mid: 30, final: 45, total: 115, grade: 'A+' },
            ]
        },
        {
            id: 2, course: 'Web Development', code: 'CS-302', teacher: 'Sarah Wilson', teacherId: 'EMP-042', submittedOn: 'Dec 18, 2025', batch: '2022-2026', status: 'Published',
            students: [
                { rollNo: '5800/BCS/2022F', name: 'Usman Ahmed', quiz: 15, assignment: 18, mid: 25, final: 38, total: 96, grade: 'B+' },
            ]
        },
        {
            id: 3, course: 'Algorithms', code: 'CS-303', teacher: 'Mike Chen', teacherId: 'EMP-089', submittedOn: 'Dec 17, 2025', batch: '2023-2027', status: 'Pending',
            students: [
                { rollNo: '5950/BCS/2024F', name: 'Ali Raza', quiz: 15, assignment: 18, mid: 25, final: 38, total: 96, grade: 'B+' },
                { rollNo: '5952/BCS/2024F', name: 'Hamza Ahmed', quiz: 17, assignment: 19, mid: 27, final: 40, total: 103, grade: 'A' },
            ]
        },
    ]);

    const filteredData = results.filter(r =>
        r.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePublish = (id) => {
        setResults(prev => prev.map(r => r.id === id ? { ...r, status: 'Published' } : r));
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setSelectedCourse(null);
        }, 1500);
    };

    const columns = [
        {
            key: 'course',
            label: 'Course Info',
            render: (row) => (
                <div>
                    <p className="font-bold text-gray-900 text-sm">{row.course}</p>
                    <p className="text-xs text-indigo-600 font-semibold">{row.code} • Batch {row.batch}</p>
                </div>
            )
        },
        {
            key: 'teacher',
            label: 'Submitted By',
            render: (row) => (
                <div>
                    <p className="text-sm font-semibold text-gray-800">{row.teacher}</p>
                    <p className="text-xs text-gray-500">{row.teacherId}</p>
                </div>
            )
        },
        {
            key: 'students',
            label: 'Total Students',
            render: (row) => (
                <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md w-max">
                    <User className="w-3.5 h-3.5 text-gray-400" /> {row.students.length}
                </div>
            )
        },
        { key: 'submittedOn', label: 'Submission Date' },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-max ${row.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    {row.status === 'Published' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {row.status}
                </span>
            )
        },
        {
            key: 'action',
            label: 'Action',
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedCourse(row)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Eye className="w-3.5 h-3.5" /> View Marks
                    </button>
                </div>
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
                        type="text"
                        placeholder="Search by course or teacher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            <DataTable columns={columns} data={filteredData} itemsPerPage={5} />

            {/* 👇 VIEW & PUBLISH MARKS MODAL 👇 */}
            {selectedCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] mt-10">

                        {/* Header */}
                        <div className="bg-slate-800 p-6 text-white relative shrink-0">
                            <button onClick={() => setSelectedCourse(null)} className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                                    <BookOpen className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedCourse.course}</h2>
                                    <p className="text-slate-300 font-medium">
                                        {selectedCourse.code} • Batch {selectedCourse.batch}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Teacher Info */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Submitted By</p>
                                <p className="text-sm font-bold text-gray-900">{selectedCourse.teacher}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Teacher ID</p>
                                <p className="text-sm font-semibold text-gray-700">{selectedCourse.teacherId}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Submission Date</p>
                                <p className="text-sm font-semibold text-gray-700">{selectedCourse.submittedOn}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${selectedCourse.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {selectedCourse.status}
                                </span>
                            </div>
                        </div>

                        {/* Student Marks Table */}
                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                        <thead>
                                            <tr className="bg-indigo-600 text-slate-100 text-xs font-bold uppercase tracking-wider">
                                                <th className="px-4 py-3">Roll No / Name</th>
                                                <th className="px-4 py-3 text-center">Quiz (20)</th>
                                                <th className="px-4 py-3 text-center">Assign (20)</th>
                                                <th className="px-4 py-3 text-center">Mid (30)</th>
                                                <th className="px-4 py-3 text-center">Final (50)</th>
                                                <th className="px-4 py-3 text-center">Total</th>
                                                <th className="px-4 py-3 text-center">Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {selectedCourse.students.map(student => (
                                                <tr key={student.rollNo} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                                                        <p className="text-xs text-indigo-600 font-semibold">{student.rollNo}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-700">{student.quiz}</td>
                                                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-700">{student.assignment}</td>
                                                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-700">{student.mid}</td>
                                                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-700">{student.final}</td>
                                                    <td className="px-4 py-3 text-center font-bold text-gray-900">{student.total} <span className="text-xs text-gray-400">/ 120</span></td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${student.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                                                                student.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-orange-100 text-orange-700'
                                                            }`}>
                                                            {student.grade}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex justify-between items-center">
                            <p className="text-xs font-semibold text-gray-500">
                                Review all marks carefully before publishing.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setSelectedCourse(null)} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                    Close
                                </button>
                                {selectedCourse.status === 'Pending' && !showSuccess && (
                                    <button
                                        onClick={() => handlePublish(selectedCourse.id)}
                                        className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" /> Publish Results
                                    </button>
                                )}
                                {showSuccess && (
                                    <div className="px-6 py-2.5 bg-emerald-100 text-emerald-700 font-bold rounded-xl flex items-center gap-2 animate-in zoom-in-95">
                                        <CheckCircle className="w-4 h-4" /> Published!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublishResults;