import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DataTable from '../../../components/common/DataTable';
import { Search, Plus, CalendarDays, X, CheckCircle, ArrowLeft, Clock, MapPin } from 'lucide-react';

const DomainTimetable = () => {
    const { domainId } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Format the domain ID for display
    const domainNames = { cs: 'Computer Science', it: 'Information Technology', se: 'Software Engineering', ai: 'Artificial Intelligence' };
    const currentDomainName = domainNames[domainId] || 'Unknown Domain';

    // Master Mock Data (Filtered by Domain)
    const allExams = [
        { id: 1, domain: 'cs', course: 'Data Structures', code: 'CS-301', date: 'Dec 10, 2025', time: '09:00 AM', duration: '3 Hours', room: 'Hall A', invigilator: 'Dr. Smith' },
        { id: 2, domain: 'cs', course: 'Web Development', code: 'CS-302', date: 'Dec 12, 2025', time: '09:00 AM', duration: '3 Hours', room: 'Hall B', invigilator: 'Sarah Wilson' },
        { id: 3, domain: 'it', course: 'Networking', code: 'IT-401', date: 'Dec 14, 2025', time: '02:00 PM', duration: '2 Hours', room: 'Hall A', invigilator: 'Mike Chen' },
        { id: 4, domain: 'se', course: 'Software Architecture', code: 'SE-501', date: 'Dec 16, 2025', time: '09:00 AM', duration: '3 Hours', room: 'Hall C', invigilator: 'Dr. Ali' },
    ];

    // Filter by current domain AND search query
    const domainExams = allExams.filter(e => e.domain === domainId);
    const filteredData = domainExams.filter(e =>
        e.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Available courses for the dropdown in the modal
    const availableCourses = {
        cs: ['CS-301: Data Structures', 'CS-302: Web Development', 'CS-303: Algorithms'],
        it: ['IT-401: Networking', 'IT-402: Cybersecurity'],
        se: ['SE-501: Software Architecture', 'SE-502: Agile Development'],
        ai: ['AI-601: Machine Learning', 'AI-602: Neural Networks']
    };
    const currentCourses = availableCourses[domainId] || [];

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
            label: 'Date & Time',
            render: (row) => (
                <div className="text-sm">
                    <p className="font-medium text-gray-800 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-gray-400" /> {row.date}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1"><Clock className="w-3.5 h-3.5 text-gray-400" /> {row.time} ({row.duration})</p>
                </div>
            )
        },
        {
            key: 'room',
            label: 'Exam Hall',
            render: (row) => (
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" /> {row.room}
                </div>
            )
        },
        { key: 'invigilator', label: 'Invigilator' },
    ];

    const handleSave = (e) => {
        e.preventDefault();
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setShowModal(false);
        }, 1500);
    };

    return (
        <div className="space-y-5">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={() => navigate('/examination/timetable')}
                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentDomainName} Exams</h2>
                    <p className="text-sm text-gray-500">Manage and schedule exams for the {currentDomainName} domain.</p>
                </div>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80 p-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search exams in this domain..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                >
                    <Plus className="w-4 h-4" /> Schedule Exam
                </button>
            </div>

            <DataTable columns={columns} data={filteredData} itemsPerPage={5} />

            {/* SCHEDULE EXAM MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-800 p-5 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold">Schedule Exam</h2>
                                <p className="text-slate-300 text-xs mt-0.5">{currentDomainName}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                        </div>

                        {showSuccess ? (
                            <div className="p-8 text-center animate-in zoom-in-95">
                                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                <h3 className="text-lg font-bold">Exam Scheduled!</h3>
                                <p className="text-sm text-gray-500 mt-1">The exam has been added to the timetable.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Select Course</label>
                                    <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                        {currentCourses.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                                        <input type="date" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Time</label>
                                        <input type="time" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Exam Hall</label>
                                    <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm">
                                        <option>Hall A</option>
                                        <option>Hall B</option>
                                        <option>Hall C</option>
                                    </select>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-gray-100 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">Save Exam</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DomainTimetable;