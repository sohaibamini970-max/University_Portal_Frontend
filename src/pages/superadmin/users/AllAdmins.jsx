import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/common/DataTable';
import { Plus, X, CheckCircle, Shield, Building2 } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const emptyForm = {
    fullName: '',
    email: '',
    password: '',
    employeeId: '',
    designation: '',
    phone: '',
    role: 'systemadmin',
    departmentId: ''
};

const AllAdmins = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Submit state — was missing, caused the crash
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState(emptyForm);

    const adminTypes = [
        { value: 'systemadmin', label: 'System Admin', icon: Shield, color: 'text-purple-600' },
        { value: 'department_admin', label: 'Department Admin', icon: Building2, color: 'text-blue-600' },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const [adminsRes, deptsRes] = await Promise.all([
                api.get('/admins'),
                api.get('/departments')
            ]);

            const rawAdmins = Array.isArray(adminsRes.data)
                ? adminsRes.data
                : (adminsRes.data?.items ?? []);

            const admins = rawAdmins.filter(u =>
                ['systemadmin', 'department_admin'].includes(u.role)
            );

            const rawDepts = Array.isArray(deptsRes.data)
                ? deptsRes.data
                : (deptsRes.data?.items ?? []);

            setUsers(admins);
            setDepartments(rawDepts);
        } catch (error) {
            console.error('[AllAdmins] fetch failed:', error?.response?.status, error?.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = () => {
        setFormData(emptyForm);
        setShowSuccess(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (submitting) return;
        setIsModalOpen(false);
        setShowSuccess(false);
        setFormData(emptyForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        try {
            const payload = {
                fullName: formData.fullName.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                employeeId: formData.employeeId.trim(),
                designation: formData.designation.trim(),
                phone: formData.phone.trim() || null,
                role: formData.role,
                departmentId:
                    formData.role === 'department_admin' && formData.departmentId
                        ? parseInt(formData.departmentId)
                        : null
            };

            await api.post('/admins', payload);

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setIsModalOpen(false);
                setFormData(emptyForm);
                fetchData();
            }, 1500);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create admin');
        } finally {
            setSubmitting(false);
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
                    {row.departmentName ? (
                        <span className="flex items-center gap-2">
                            {row.departmentName}
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${row.departmentType === 'education'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-orange-50 text-orange-700 border-orange-200'
                                }`}>
                                {row.departmentType}
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
                    onClick={openModal}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add New Admin
                </button>
            </div>

            {/* Table */}
            <DataTable columns={columns} data={users} itemsPerPage={5} />

            {/* Create modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-4 pt-24">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="bg-slate-800 p-5 text-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold">Create Admin Account</h2>
                                    <p className="text-slate-300 text-xs mt-0.5">Select the admin type and fill in the details.</p>
                                </div>
                                <button onClick={closeModal} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {showSuccess ? (
                                <div className="p-8 text-center">
                                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900">Admin Created!</h3>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                                    {/* Admin type */}
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

                                    {/* Department (only for dept_admin) */}
                                    {formData.role === 'department_admin' && (
                                        <div>
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
                                            <p className="text-[11px] text-gray-500 mt-1">
                                                Shows all dynamically created Education and Business departments.
                                            </p>
                                        </div>
                                    )}

                                    <hr className="border-gray-100" />

                                    {/* Missing fields — added back */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                                            placeholder="e.g., Dr. Sarah Khan"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                                            placeholder="admin@university.edu"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Temporary Password</label>
                                        <input
                                            required
                                            type="password"
                                            minLength={6}
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                                            placeholder="Must be at least 6 characters"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Employee ID</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.employeeId}
                                            onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                                            placeholder="e.g., EMP-1001"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Designation</label>
                                        <input
                                            type="text"
                                            value={formData.designation}
                                            onChange={e => setFormData({ ...formData, designation: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                                            placeholder="e.g., IT Manager"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Phone (optional)</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                                        />
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            disabled={submitting}
                                            className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md disabled:opacity-60"
                                        >
                                            {submitting ? 'Creating...' : 'Create Admin'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllAdmins;