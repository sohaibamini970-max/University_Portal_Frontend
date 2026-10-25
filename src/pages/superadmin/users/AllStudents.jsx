import React from 'react';
import DataTable from '../../../components/common/DataTable';

const AllStudents = () => {
    const data = [
        { id: 1, rollNo: '5950/BCS/2024F', name: 'Ali Hassan', semester: '5th', section: 'A', status: 'Active' },
        { id: 2, rollNo: '5951/BCS/2024F', name: 'Zainab Khan', semester: '5th', section: 'A', status: 'Active' },
        { id: 3, rollNo: '5952/BCS/2024F', name: 'Hamza Ahmed', semester: '3rd', section: 'B', status: 'Inactive' },
        { id: 4, rollNo: '5953/BCS/2024F', name: 'Fatima Noor', semester: '1st', section: 'A', status: 'Active' },
        { id: 1, rollNo: '5950/BCS/2024F', name: 'Ali Hassan', semester: '5th', section: 'A', status: 'Active' },
        { id: 2, rollNo: '5951/BCS/2024F', name: 'Zainab Khan', semester: '5th', section: 'A', status: 'Active' },
        { id: 3, rollNo: '5952/BCS/2024F', name: 'Hamza Ahmed', semester: '3rd', section: 'B', status: 'Inactive' },
        { id: 4, rollNo: '5953/BCS/2024F', name: 'Fatima Noor', semester: '1st', section: 'A', status: 'Active' },
    ];

    const columns = [
        { key: 'rollNo', label: 'Roll No' },
        { key: 'name', label: 'Student Name' },
        { key: 'semester', label: 'Semester' },
        { key: 'section', label: 'Section' },
        {
            key: 'status', label: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {row.status}
                </span>
            ),
        },
    ];

    return <DataTable columns={columns} data={data} itemsPerPage={5} />;
};

export default AllStudents;