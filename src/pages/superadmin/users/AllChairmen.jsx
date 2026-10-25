import React from 'react';
import DataTable from '../../../components/common/DataTable';

const AllChairmen = () => {
    const data = [
        { id: 1, name: 'Dr. Zubair Ahmed', faculty: 'Faculty of Computing', email: 'chairman.computing@uni.edu', status: 'Active' },
        { id: 2, name: 'Dr. Tariq Mahmood', faculty: 'Faculty of Engineering', email: 'chairman.eng@uni.edu', status: 'Active' },
    ];

    const columns = [
        { key: 'name', label: 'Chairman Name' },
        { key: 'faculty', label: 'Faculty' },
        { key: 'email', label: 'Email Address' },
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

export default AllChairmen;