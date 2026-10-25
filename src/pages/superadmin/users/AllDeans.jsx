import React from 'react';
import DataTable from '../../../components/common/DataTable';

const AllDeans = () => {
    const data = [
        { id: 1, name: 'Dr. Abdul Rehman', faculty: 'Faculty of Computing', email: 'dean.computing@uni.edu', office: 'Block A, 2nd Floor' },
        { id: 2, name: 'Dr. Shahid Iqbal', faculty: 'Faculty of Business', email: 'dean.business@uni.edu', office: 'Block C, 1st Floor' },
    ];

    const columns = [
        { key: 'name', label: 'Dean Name' },
        { key: 'faculty', label: 'Faculty' },
        { key: 'email', label: 'Email Address' },
        { key: 'office', label: 'Office Location' },
    ];

    return <DataTable columns={columns} data={data} itemsPerPage={5} />;
};

export default AllDeans;