import React, { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import { Search, CheckCircle, Clock, Eye } from 'lucide-react';

const CheckResults = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const [results] = useState([
        { id: 1, course: 'Data Structures', code: 'CS-301', teacher: 'Dr. Smith', submittedOn: 'Dec 16, 2025', status: 'Pending' },
        { id: 2, course: 'Web Development', code: 'CS-302', teacher: 'Sarah Wilson', submittedOn: 'Dec 18, 2025', status: 'Published' },
        { id: 3, course: 'Algorithms', code: 'CS-303', teacher: 'Mike Chen', submittedOn: 'Dec 17, 2025', status: 'Pending' },
    ]);

    const filteredData = results.filter(r =>
        r.course.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            key: 'course',
            label: 'Course',
            render: (row) => (
                <div>
                    <p className="font-bold text-gray-900 text-sm">{row.course}</p>
                    <p className="text-xs text-indigo-600 font-semibold">{row.code}</p>
                </div>
            )
        },
        { key: 'teacher', label: 'Submitted By' },
        { key: 'submittedOn', label: 'Submission Date' },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-max ${row.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                    }`}>
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
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100">
                        <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    {row.status === 'Pending' && (
                        <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700">
                            Publish
                        </button>
                    )}
                </div>
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
                        placeholder="Search results..."
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

export default CheckResults; 