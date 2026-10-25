import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle, XCircle, TrendingUp, ChevronRight, Filter } from 'lucide-react';

const AcademicRecords = () => {
    const { searchQuery } = useOutletContext();
    const [selectedStudent, setSelectedStudent] = useState(null);

    // State for dropdown filters
    const [batchFilter, setBatchFilter] = useState('All');
    const [semesterFilter, setSemesterFilter] = useState('All');

    // Mock Data for Academic Records (Added batch and semester for filtering)
    const records = [
        { id: 1, name: 'Emma Davis', roll: 'CS-2021-045', batch: '2021-2025', semester: '7th', cgpa: '3.85', lastGpa: '3.90', passed: 32, failed: 0, attendance: '95%' },
        { id: 2, name: 'James Miller', roll: 'CS-2022-112', batch: '2022-2026', semester: '5th', cgpa: '3.40', lastGpa: '3.20', passed: 20, failed: 1, attendance: '78%' },
        { id: 3, name: 'Olivia Taylor', roll: 'CS-2020-089', batch: '2020-2024', semester: '8th', cgpa: '3.92', lastGpa: '3.95', passed: 45, failed: 0, attendance: '98%' },
        { id: 4, name: 'Noah Anderson', roll: 'CS-2023-201', batch: '2023-2027', semester: '3rd', cgpa: '3.10', lastGpa: '3.10', passed: 10, failed: 0, attendance: '85%' },
    ];

    // Dynamic filter logic combining search + both dropdowns
    const filteredData = records.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBatch = batchFilter === 'All' || s.batch === batchFilter;
        const matchesSemester = semesterFilter === 'All' || s.semester === semesterFilter;
        return matchesSearch && matchesBatch && matchesSemester;
    });

    return (
        <>
            <div className="space-y-4">

                {/* Filter Bar */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                        <Filter className="w-4 h-4" /> Filters:
                    </div>

                    {/* Batch Dropdown */}
                    <select
                        value={batchFilter}
                        onChange={(e) => setBatchFilter(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="All">All Batches</option>
                        <option value="2021-2025">2021-2025</option>
                        <option value="2022-2026">2022-2026</option>
                        <option value="2020-2024">2020-2024</option>
                        <option value="2023-2027">2023-2027</option>
                    </select>

                    {/* Semester Dropdown */}
                    <select
                        value={semesterFilter}
                        onChange={(e) => setSemesterFilter(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="All">All Semesters</option>
                        {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(sem => (
                            <option key={sem} value={sem}>{sem} Semester</option>
                        ))}
                    </select>
                </div>

                {/* Data Table */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-indigo-600 text-gray-100 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4 text-center">Current CGPA</th>
                                    <th className="px-6 py-4 text-center">Last GPA</th>
                                    <th className="px-6 py-4 text-center">Courses Passed</th>
                                    <th className="px-6 py-4 text-center">Courses Failed</th>
                                    <th className="px-6 py-4 text-center">Attendance</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredData.length > 0 ? filteredData.map((student, idx) => (
                                    <tr key={student.id} className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-slate-50 hover:bg-gray-100'}>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                                            <p className="text-xs text-gray-500">{student.roll} • Batch {student.batch}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                                {student.cgpa}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-bold text-gray-600">{student.lastGpa}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-bold text-sm">
                                                <CheckCircle className="w-4 h-4" /> {student.passed}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className={`flex items-center justify-center gap-1.5 font-bold text-sm ${student.failed > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                                <XCircle className="w-4 h-4" /> {student.failed}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <TrendingUp className={`w-4 h-4 ${parseInt(student.attendance) >= 75 ? 'text-emerald-500' : 'text-red-500'}`} />
                                                <span className={`text-sm font-bold ${parseInt(student.attendance) >= 75 ? 'text-gray-800' : 'text-red-600'}`}>
                                                    {student.attendance}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => setSelectedStudent(student)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors">
                                                Details <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            No records found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL for Detailed Academic Record */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                        <div className="bg-indigo-600 p-6 text-white text-center relative">
                            <button onClick={() => setSelectedStudent(null)} className="absolute top-4 right-4 text-white/70 hover:text-white">Close</button>
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                                {selectedStudent.name.charAt(0)}
                            </div>
                            <h2 className="text-xl font-bold">{selectedStudent.name}</h2>
                            <p className="text-indigo-100 text-sm">{selectedStudent.roll} • Batch {selectedStudent.batch}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">CGPA</p>
                                    <p className="text-xl font-black text-indigo-700">{selectedStudent.cgpa}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Attendance</p>
                                    <p className="text-xl font-black text-emerald-600">{selectedStudent.attendance}</p>
                                </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <p className="text-sm font-bold text-blue-800 mb-1">Summary</p>
                                <p className="text-xs text-blue-700">This student has passed <strong>{selectedStudent.passed}</strong> courses and failed <strong>{selectedStudent.failed}</strong> courses.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AcademicRecords;