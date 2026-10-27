import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/common/DataTable';
import UserFormModal from '../../../components/common/UserFormModal';
import { Plus } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const AllHods = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            // In a real DB, you'd query WHERE role == 'teacher' AND is_hod == true
            setUsers(res.data.filter(u => u.role === 'teacher'));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        { key: 'fullName', label: 'HOD Name' },
        { key: 'email', label: 'Email Address' },
        {
            key: 'department',
            label: 'Department',
            render: (row) => row.department?.name || 'Not Assigned'
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">Manage HODs</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add HOD
                </button>
            </div>

            <DataTable columns={columns} data={users} itemsPerPage={5} />

            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchUsers}
                roleType="teacher" // HODs are teachers
                title="Add New Head of Department"
            />
        </div>
    );
};

export default AllHods;