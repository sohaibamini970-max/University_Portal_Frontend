import React from 'react';
import DataTable from '../../../components/common/DataTable';

const AllHods = () => {
    const data = [
        { id: 1, name: 'Dr. A. K. Khan', department: 'Computer Science', email: 'hod.cs@uni.edu', since: '2018' },
        { id: 2, name: 'Dr. S. Ali', department: 'Information Technology', email: 'hod.it@uni.edu', since: '2020' },
        { id: 3, name: 'Dr. M. Hassan', department: 'Software Engineering', email: 'hod.se@uni.edu', since: '2019' },
    ];

    const columns = [
        { key: 'name', label: 'HOD Name' },
        { key: 'department', label: 'Department' },
        { key: 'email', label: 'Email Address' },
        { key: 'since', label: 'Serving Since' },
    ];

    return <DataTable columns={columns} data={data} itemsPerPage={5} />;
};

export default AllHods;