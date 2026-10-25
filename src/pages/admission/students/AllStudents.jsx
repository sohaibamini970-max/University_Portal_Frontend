import React, { useState } from 'react';
import DataTable from '../../../components/common/DataTable';
import { Search } from 'lucide-react';

const AllStudents = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const [students] = useState([
        { id: 1, name: 'Ali Raza', rollNo: 'ADM-2025-001', program: 'BS Computer Science', email: 'ali@gmail.com', status: 'Enrolled' },
        { id: 2, name: 'Sara Khan', rollNo: 'ADM-2025-002', program: 'BS Software Engineering', email: 'sara@gmail.com', status: 'Enrolled' },
        { id: 3, name: 'Usman Ahmed', rollNo: 'ADM-2025-003', program: 'BS Business Admin', email: 'usman@gmail.com', status: 'Pending Fee' },
    ]);

    const filteredData = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            key: 'name',
            label: 'Student Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {row.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'rollNo',
            label: 'Reg No.',
            render: (row) => <span className="font-semibold text-indigo-600 text-sm">{row.rollNo}</span>
        },
        { key: 'program', label: 'Program' },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.status === 'Enrolled' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    {row.status}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-4">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
                <div className="relative w-full sm:w-80 p-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or reg no..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>
            <DataTable columns={columns} data={filteredData} itemsPerPage={5} />
        </div>
    );
};

export default AllStudents;