import React, { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import { Plus, Search, X, CheckCircle, BookOpen } from 'lucide-react';

const AdmissionTeachers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock Data for Teachers
    const [teachers] = useState([
        { id: 1, name: 'John Doe', email: 'john@uni.edu', phone: '+1 555-0101', department: 'Computer Science', designation: 'Lecturer', status: 'Active' },
        { id: 2, name: 'Sarah Wilson', email: 'sarah@uni.edu', phone: '+1 555-0102', department: 'Software Engineering', designation: 'Assistant Professor', status: 'Active' },
        { id: 3, name: 'Mike Chen', email: 'mike@uni.edu', phone: '+1 555-0103', department: 'Information Technology', designation: 'Professor', status: 'Inactive' },
    ]);

    const filteredData = teachers.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddTeacher = (e) => {
        e.preventDefault();
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setShowAddModal(false);
        }, 1500);
    };

    const columns = [
        {
            key: 'name',
            label: 'Teacher Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {row.name.charAt(0)}
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{row.name}</p>
                </div>
            )
        },
        { key: 'email', label: 'Email' },
        { key: 'department', label: 'Department' },
        { key: 'designation', label: 'Designation' },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {row.status}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-4">
            {/* Control Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80 p-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search teachers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Teacher
                </button>
            </div>

            {/* Table */}
            <DataTable columns={columns} data={filteredData} itemsPerPage={5} />

            {/* Add Teacher Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-800 p-5 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-lg font-bold">Add New Teacher</h2>
                                <p className="text-slate-300 text-xs mt-0.5">Enter the teacher's details below.</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {showSuccess ? (
                            <div className="p-8 text-center animate-in zoom-in-95">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Teacher Added!</h3>
                                <p className="text-sm text-gray-500 mt-1">The teacher has been successfully added to the system.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleAddTeacher} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                    <input required type="text" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g., John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                    <input required type="email" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="john@uni.edu" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                    <input required type="text" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="+1 555-0101" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                                    <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none">
                                        <option>Computer Science</option>
                                        <option>Software Engineering</option>
                                        <option>Information Technology</option>
                                        <option>Mathematics</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Designation</label>
                                    <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none">
                                        <option>Lecturer</option>
                                        <option>Assistant Professor</option>
                                        <option>Associate Professor</option>
                                        <option>Professor</option>
                                    </select>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md">Add Teacher</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdmissionTeachers;