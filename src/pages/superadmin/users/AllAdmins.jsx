import React from 'react';
import DataTable from '../../../components/common/DataTable';

const AllAdmins = () => {
    const data = [
        { id: 1, name: 'Dr. Smith', email: 'smith@uni.edu', department: 'Computer Science', type: 'Department Admin', status: 'Active' },
        { id: 2, name: 'Dr. Johnson', email: 'johnson@uni.edu', department: 'Electrical Eng', type: 'Department Admin', status: 'Active' },
        { id: 3, name: 'Mr. Ahmed', email: 'ahmed@uni.edu', department: 'Finance', type: 'Business Admin', status: 'Active' },
    ];

    const columns = [
        { key: 'name', label: 'Admin Name' },
        { key: 'email', label: 'Email Address' },
        { key: 'department', label: 'Department' },
        { key: 'type', label: 'Role Type' },
        {
            key: 'status', label: 'Status',
            render: (row) => (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700">
                    {row.status}
                </span>
            ),
        },
    ];

    return <DataTable columns={columns} data={data} itemsPerPage={5} />;
};

export default AllAdmins;