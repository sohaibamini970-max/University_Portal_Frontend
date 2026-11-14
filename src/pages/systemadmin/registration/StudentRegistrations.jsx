import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/common/DataTable';
import { Search, Plus, X, Trash2, CheckCircle, BookOpen, Loader2 } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const StudentRegistrations = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const res = await api.get('/students/registrations');
            setStudents(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRegistrations(); }, []);

    const filteredData = students.filter(s =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            key: 'name',
            label: 'Student Info',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {row.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.rollNo}</p>
                    </div>
                </div>
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
                    View Courses
                </button>
            )
        }
    ];

    return (
        <div className="space-y-4 max-w-7xl mx-auto">
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

            {loading ? (
                <div className="text-center py-10 text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /></div>
            ) : (
                <DataTable columns={columns} data={filteredData} itemsPerPage={5} />
            )}

            {/* VIEW COURSES MODAL */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
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
                                    <p className="text-slate-300 font-medium">{selectedStudent.rollNo}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <BookOpen className="w-4 h-4 text-indigo-600" /> Enrolled Courses
                            </h3>

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
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 border-dashed rounded-xl">
                                        No courses registered yet.
                                    </div>
                                )}
                            </div>
                        </div>

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

export default StudentRegistrations;