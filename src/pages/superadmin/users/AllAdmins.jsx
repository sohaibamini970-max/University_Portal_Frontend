import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/common/DataTable';
import { Plus, X, CheckCircle, Shield, Building2 } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const AllAdmins = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'systemadmin', // Default
        departmentId: ''
    });

    // 👇 STRICT ADMIN TYPES: Only System Admin and Dept Admin are allowed here
    const adminTypes = [
        { value: 'systemadmin', label: 'System Admin', icon: Shield, color: 'text-purple-600' },
        { value: 'department_admin', label: 'Department Admin', icon: Building2, color: 'text-blue-600' },
    ];

    const fetchData = async () => {
        try {
            const [usersRes, deptsRes] = await Promise.all([
                api.get('/auth/users'),
                api.get('/departments')
            ]);

            // Filter only systemadmins and department_admins for the table
            const admins = usersRes.data.filter(u =>
                ['systemadmin', 'department_admin'].includes(u.role)
            );

            setUsers(admins);
            setDepartments(deptsRes.data); // Fetch all departments (Education + Business)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure departmentId is only sent if the role is department_admin
            const payload = {
                ...formData,
                departmentId: formData.role === 'department_admin' && formData.departmentId
                    ? parseInt(formData.departmentId)
                    : null
            };

            await api.post('/auth/register-user', payload);

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setIsModalOpen(false);
                setFormData({ fullName: '', email: '', password: '', role: 'systemadmin', departmentId: '' });
                fetchData(); // Refresh table
            }, 1500);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create admin");
        }
    };

    const columns = [
        {
            key: 'fullName',
            label: 'Admin Name',
            render: (row) => (
                <div>
                    <p className="font-bold text-gray-900 text-sm">{row.fullName}</p>
                    <p className="text-xs text-gray-500">{row.email}</p>
                </div>
            )
        },
        {
            key: 'role',
            label: 'Admin Type',
            render: (row) => {
                const type = adminTypes.find(t => t.value === row.role) || { label: row.role, color: 'text-gray-600' };
                const Icon = type.icon || Shield;
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-50 border border-gray-200 ${type.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {type.label}
                    </span>
                );
            }
        },
        {
            key: 'department',
            label: 'Assigned Department',
            render: (row) => (
                <span className="text-sm font-medium text-gray-700">
                    {row.department ? (
                        <span className="flex items-center gap-2">
                            {row.department.name}
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${row.department.type === 'education'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-orange-50 text-orange-700 border-orange-200'
                                }`}>
                                {row.department.type}
                            </span>
                        </span>
                    ) : (
                        'Global Access'
                    )}
                </span>
            )
        },
    ];

    if (loading) return <div className="text-center py-10 text-gray-500">Loading admins...</div>;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Administrators</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Create and manage System and Department Admins.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add New Admin
                </button>
            </div>

            {/* Table */}
            <DataTable columns={columns} data={users} itemsPerPage={5} />

            {/* CREATE ADMIN MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">

                        <div className="bg-slate-800 p-5 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold">Create Admin Account</h2>
                                <p className="text-slate-300 text-xs mt-0.5">Select the admin type and fill in the details.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                        </div>

                        {showSuccess ? (
                            <div className="p-8 text-center animate-in zoom-in-95">
                                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900">Admin Created!</h3>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">

                                {/* Admin Type Dropdown (Restricted) */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Admin Type</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value, departmentId: '' })}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold"
                                    >
                                        {adminTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Department Dropdown (Only for Dept Admin) */}
                                {formData.role === 'department_admin' && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Assign Department</label>
                                        <select
                                            required
                                            value={formData.departmentId}
                                            onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                                            className="w-full px-3 py-2 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-sm font-semibold"
                                        >
                                            <option value="">-- Select Department --</option>
                                            {departments.map(d => (
                                                <option key={d.id} value={d.id}>
                                                    {d.name} ({d.type === 'education' ? 'Education' : 'Business'})
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-[11px] text-gray-500 mt-1">Shows all dynamically created Education and Business departments.</p>
                                    </div>
                                )}

                                <hr className="border-gray-100" />

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                    <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="e.g., Dr. Sarah Khan" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="admin@university.edu" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Temporary Password</label>
                                    <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="Must be at least 6 characters" minLength={6} />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md">Create Admin</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllAdmins;