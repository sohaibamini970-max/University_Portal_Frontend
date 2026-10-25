import React, { useState } from 'react';
import DataTable from '../../../components/common/DataTable';
import { X, User, Mail, Shield, Building } from 'lucide-react';

const AllUsers = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    const data = [
        { id: 1, name: 'Dr. Smith', email: 'smith@uni.edu', role: 'Admin', department: 'Computer Science', status: 'Active' },
        { id: 2, name: 'John Doe', email: 'john@uni.edu', role: 'Teacher', department: 'Computer Science', status: 'Active' },
        { id: 3, name: 'Jane Roe', email: 'jane@uni.edu', role: 'Student', department: 'Business Admin', status: 'Active' },
        { id: 4, name: 'Dr. Johnson', email: 'johnson@uni.edu', role: 'Admin', department: 'Electrical Eng', status: 'Active' },
        { id: 5, name: 'Alice Smith', email: 'alice@uni.edu', role: 'Student', department: 'Mathematics', status: 'Inactive' },
        { id: 6, name: 'Dr. Zubair', email: 'zubair@uni.edu', role: 'Chairman', department: 'Computer Science', status: 'Active' },
    ];

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'department', label: 'Department' },
        {
            key: 'status', label: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {row.status}
                </span>
            ),
        },
    ];

    return (
        <>
            {/* Pass the onView handler to open the modal */}
            <DataTable columns={columns} data={data} itemsPerPage={5} onView={(user) => setSelectedUser(user)} />

            {/* The Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">

                        <div className="bg-slate-800 p-6 text-white relative">
                            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                                    <p className="text-slate-300">{selectedUser.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                <Mail className="w-5 h-5 text-indigo-500" />
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Email</p>
                                    <p className="text-sm font-medium">{selectedUser.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                <Building className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Department</p>
                                    <p className="text-sm font-medium">{selectedUser.department}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                <Shield className="w-5 h-5 text-emerald-500" />
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Status</p>
                                    <p className={`text-sm font-medium ${selectedUser.status === 'Active' ? 'text-emerald-600' : 'text-gray-600'}`}>
                                        {selectedUser.status}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
                            <button onClick={() => setSelectedUser(null)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllUsers;