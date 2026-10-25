import React from 'react';
import DataTable from '../../../components/common/DataTable';

const AllTeachers = () => {
    const data = [
        { id: 1, name: 'John Doe', email: 'john@uni.edu', department: 'Computer Science', designation: 'Lecturer', status: 'Active' },
        { id: 2, name: 'Sarah Wilson', email: 'sarah@uni.edu', department: 'Software Engineering', designation: 'Assistant Professor', status: 'Active' },
        { id: 3, name: 'Mike Chen', email: 'mike@uni.edu', department: 'Computer Science', designation: 'Professor', status: 'Active' },
    ];

    const columns = [
        { key: 'name', label: 'Teacher Name' },
        { key: 'email', label: 'Email Address' },
        { key: 'department', label: 'Department' },
        { key: 'designation', label: 'Designation' },
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

export default AllTeachers;