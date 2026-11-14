import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/common/DataTable';
import { Search, Filter, ShieldCheck, ShieldAlert, Key, Loader2 } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const ManageStudents = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State for Password Reset
    const [passwordModal, setPasswordModal] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [isResetting, setIsResetting] = useState(false);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await api.get('/students/all');
            setStudents(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStudents(); }, []);

    const toggleStatus = async (id, currentStatus) => {
        try {
            await api.put(`/students/${id}/toggle-status`, { isActive: !currentStatus });
            fetchStudents();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setIsResetting(true);
        try {
            await api.put(`/students/${passwordModal.profileId}/reset-password`, { password: newPassword });
            setPasswordModal(null);
            setNewPassword('');
            alert("Password updated successfully.");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update password");
        } finally {
            setIsResetting(false);
        }
    };

    const filteredData = students.filter(s =>
        s.profile?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.profile?.rollNo?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            key: 'name',
            label: 'Student Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {row.profile?.fullName?.charAt(0) || 'S'}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{row.profile?.fullName}</p>
                        <p className="text-xs text-gray-500">{row.profile?.rollNo}</p>
                    </div>
                </div>
            )
        },
        { key: 'program', label: 'Program', render: (row) => row.program?.code },
        { key: 'batch', label: 'Batch', render: (row) => row.batch?.name },
        {
            key: 'section', label: 'Section', render: (row) => (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold border border-slate-200">
                    {row.section}
                </span>
            )
        },
        {
            key: 'status',
            label: 'Portal Status',
            render: (row) => (
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold w-max ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {row.isActive ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                    {row.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: 'action',
            label: 'Actions',
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => toggleStatus(row.id, row.isActive)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${row.isActive
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            }`}
                    >
                        {row.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                        onClick={() => setPasswordModal(row)}
                        className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
                        title="Reset Password"
                    >
                        <Key className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 flex flex-col lg:flex-row items-center gap-3">
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
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" /></div>
            ) : (
                <DataTable columns={columns} data={filteredData} itemsPerPage={5} />
            )}

            {/* Password Reset Modal */}
            {passwordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">Set New Password</h2>
                            <p className="text-xs text-gray-500">{passwordModal.profile?.fullName} ({passwordModal.profile?.rollNo})</p>
                        </div>
                        <form onSubmit={handlePasswordReset} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                                <input
                                    required
                                    type="text"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setPasswordModal(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl">Cancel</button>
                                <button type="submit" disabled={isResetting} className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md flex justify-center items-center gap-2 disabled:opacity-50">
                                    {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStudents;