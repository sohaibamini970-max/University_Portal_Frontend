import React from 'react';
import DataTable from '../../../components/common/DataTable';
import { Search } from 'lucide-react';

const ManageAdmins = () => {
    const admins = [
        { id: 1, name: 'Dr. Smith', email: 'smith@uni.edu', role: 'Dept Admin', status: 'Active' },
        { id: 2, name: 'Mr. Ahmed', email: 'ahmed@uni.edu', role: 'Finance Admin', status: 'Active' },
    ];

    const columns = [
        { key: 'name', label: 'Admin Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'status', label: 'Status', render: (row) => <span className="text-emerald-600 font-bold">{row.status}</span> }
    ];

    return (
        <div className="space-y-4">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
                <div className="relative w-full sm:w-80 p-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search admins..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
            </div>
            <DataTable columns={columns} data={admins} itemsPerPage={5} />
        </div>
    );
};

export default ManageAdmins;