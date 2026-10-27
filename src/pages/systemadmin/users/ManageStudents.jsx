import React, { useState } from 'react';
import DataTable from '../../../components/common/DataTable';
import { Search, Filter, GraduationCap } from 'lucide-react';

const ManageStudents = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [batchFilter, setBatchFilter] = useState('All');
    const [semesterFilter, setSemesterFilter] = useState('All');

    // Mock Data: Added batch and semester
    const students = [
        { id: 1, name: 'Ali Raza', rollNo: '5950/BCS/2024F', program: 'BCS', batch: '2024-2028', semester: '1st', status: 'Active' },
        { id: 2, name: 'Sara Khan', rollNo: '5951/BCS/2024F', program: 'BCS', batch: '2024-2028', semester: '1st', status: 'Active' },
        { id: 3, name: 'Usman Ahmed', rollNo: '5800/BCS/2023F', program: 'BCS', batch: '2023-2027', semester: '3rd', status: 'Active' },
        { id: 4, name: 'Hina Ali', rollNo: '5720/BSE/2022F', program: 'BSE', batch: '2022-2026', semester: '5th', status: 'Inactive' },
    ];

    // Filter Logic
    const filteredData = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBatch = batchFilter === 'All' || student.batch === batchFilter;
        const matchesSemester = semesterFilter === 'All' || student.semester === semesterFilter;

        return matchesSearch && matchesBatch && matchesSemester;
    });

    const columns = [
        {
            key: 'name',
            label: 'Student Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {row.name.charAt(0)}
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{row.name}</p>
                </div>
            )
        },
        {
            key: 'rollNo',
            label: 'Roll Number',
            render: (row) => <span className="font-semibold text-indigo-600 text-sm">{row.rollNo}</span>
        },
        { key: 'program', label: 'Program' },
        {
            key: 'batch',
            label: 'Batch',
            render: (row) => <span className="font-medium text-gray-700">{row.batch}</span>
        },
        {
            key: 'semester',
            label: 'Semester',
            render: (row) => (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold border border-slate-200">
                    {row.semester}
                </span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {row.status}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-4">
            {/* Control Bar with Search & Filters */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 flex flex-col lg:flex-row items-center gap-3">

                {/* Search */}
                <div className="relative w-full lg:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or roll no..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <Filter className="w-4 h-4" /> Filters:
                    </div>

                    <select
                        value={batchFilter}
                        onChange={(e) => setBatchFilter(e.target.value)}
                        className="flex-1 lg:flex-none px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    >
                        <option value="All">All Batches</option>
                        <option value="2024-2028">2024-2028</option>
                        <option value="2023-2027">2023-2027</option>
                        <option value="2022-2026">2022-2026</option>
                    </select>

                    <select
                        value={semesterFilter}
                        onChange={(e) => setSemesterFilter(e.target.value)}
                        className="flex-1 lg:flex-none px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    >
                        <option value="All">All Semesters</option>
                        {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(sem => (
                            <option key={sem} value={sem}>{sem} Semester</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Data Table */}o
            <DataTable columns={columns} data={filteredData} itemsPerPage={5} />
        </div>
    );
};

export default ManageStudents;