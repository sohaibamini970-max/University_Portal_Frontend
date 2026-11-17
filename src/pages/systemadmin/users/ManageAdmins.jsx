import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, Eye, Pencil, Key, Trash2, Plus, X, Loader2, AlertTriangle,
    ChevronLeft, ChevronRight, ShieldCheck, ShieldAlert
} from 'lucide-react';
import { api, useAuth } from '../../../context/AuthContext';

const PAGE_SIZE = 10;

const TABS = [
    { key: 'all', label: 'All Admins', type: '' },
    { key: 'education', label: 'Education Depts', type: 'education' },
    { key: 'business', label: 'Business Depts', type: 'business' }
];

const ROLE_OPTIONS = [
    { value: 'department_admin', label: 'Department Admin' },
    { value: 'systemadmin', label: 'System Admin' },
    { value: 'superadmin', label: 'Super Admin' }
];

const ROLE_LABELS = Object.fromEntries(ROLE_OPTIONS.map((r) => [r.value, r.label]));

const ROLE_BADGE = {
    superadmin: 'bg-violet-100 text-violet-700',
    systemadmin: 'bg-sky-100 text-sky-700',
    department_admin: 'bg-amber-100 text-amber-700'
};

const inputClass =
    'w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none';

const emptyForm = {
    fullName: '',
    email: '',
    password: '',
    phone: '',
    employeeId: '',
    designation: '',
    role: 'department_admin',
    departmentId: ''
};

const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

const Modal = ({ title, subtitle, onClose, children, width = 'max-w-lg' }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className={`bg-white rounded-2xl shadow-2xl w-full ${width} max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                </div>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-200">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>
            <div className="p-5">{children}</div>
        </div>
    </div>
);

const Field = ({ label, value }) => (
    <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-900 mt-0.5">{value || '—'}</p>
    </div>
);

const Label = ({ children }) => (
    <label className="block text-xs font-bold text-gray-600 mb-1">{children}</label>
);

const ManageAdmins = () => {
    const { user } = useAuth();
    const callerRole = user?.role;
    const isSuperadmin = callerRole === 'superadmin';
    const isSystemadmin = callerRole === 'systemadmin';
    const canManage = isSuperadmin || isSystemadmin;

    const [activeTab, setActiveTab] = useState('all');
    const activeType = TABS.find((t) => t.key === activeTab)?.type ?? '';

    const [admins, setAdmins] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState('');

    const [departments, setDepartments] = useState([]);

    const [viewing, setViewing] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [editingId, setEditingId] = useState(null);
    const [editingSelf, setEditingSelf] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);
    const [passwordTarget, setPasswordTarget] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [resetting, setResetting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        setPageError('');
        try {
            if (activeTab === 'all' && !roleFilter) {
                // Fetch System/Super Admins
                const sysAdminsRes = await api.get(`/admins?page=1&pageSize=100&search=${search}`);
                // Fetch Department Admins
                const deptAdminsRes = await api.get(`/admins?role=department_admin&page=1&pageSize=100&search=${search}`);

                const combined = [...sysAdminsRes.data.items, ...deptAdminsRes.data.items].sort((a, b) =>
                    a.fullName.localeCompare(b.fullName)
                );

                setAdmins(combined);
                setTotal(combined.length);
                setTotalPages(1);
                return;
            }

            // For specific tabs (Education/Business) or specific role filter
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(PAGE_SIZE),
                search
            });

            if (roleFilter) {
                params.set('role', roleFilter);
            } else if (activeType) {
                // If on a specific tab without a role filter, fetch department admins for that type
                params.set('role', 'department_admin');
            }

            if (activeType) params.set('departmentType', activeType);

            const res = await api.get(`/admins?${params.toString()}`);
            setAdmins(res.data.items);
            setTotal(res.data.total);
            setTotalPages(Math.max(1, res.data.totalPages));
        } catch (err) {
            setPageError(err.response?.data?.message || 'Failed to load admins.');
        } finally {
            setLoading(false);
        }
    }, [page, search, roleFilter, activeType, activeTab]);

    useEffect(() => {
        if (canManage) fetchAdmins();
    }, [canManage, fetchAdmins]);

    useEffect(() => {
        if (!canManage) return;
        api.get('/departments')
            .then((res) => setDepartments(res.data))
            .catch(() => setDepartments([]));
    }, [canManage]);

    const groupedDepartments = departments.reduce((acc, d) => {
        const key = (d.type || 'other').toLowerCase();
        (acc[key] ||= []).push(d);
        return acc;
    }, {});

    const changeTab = (key) => {
        if (key === activeTab) return;
        setActiveTab(key);
        setRoleFilter(''); // Reset role filter when changing tabs
        setPage(1);
    };

    const openView = async (admin) => {
        setViewing({ admin: null });
        try {
            const res = await api.get(`/admins/${admin.id}`);
            setViewing({ admin: res.data });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to load admin details.');
            setViewing(null);
        }
    };

    const openCreate = () => {
        setFormMode('create');
        setEditingId(null);
        setEditingSelf(false);
        setForm(emptyForm);
        setFormError('');
        setFormOpen(true);
    };

    const openEdit = (a) => {
        if (a.role === 'department_admin') {
            alert("To edit a Department Admin, please go to the Departments page and update the admin assigned there.");
            return;
        }
        setFormMode('edit');
        setEditingId(a.id);
        setEditingSelf(a.profileId === user?.id);
        setForm({
            ...emptyForm,
            fullName: a.fullName ?? '',
            email: a.email ?? '',
            phone: a.phone ?? '',
            employeeId: a.employeeId ?? '',
            designation: a.designation ?? '',
            role: a.role ?? 'department_admin',
            departmentId: a.departmentId ? String(a.departmentId) : ''
        });
        setFormError('');
        setFormOpen(true);
    };

    const closeForm = () => {
        if (saving) return;
        setFormOpen(false);
        setFormError('');
    };

    const update = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');

        const needsDepartment = form.role === 'department_admin';
        const payload = {
            fullName: form.fullName.trim(),
            phone: form.phone.trim() || null,
            employeeId: form.employeeId.trim(),
            designation: form.designation.trim(),
            role: form.role,
            departmentId: needsDepartment && form.departmentId ? Number(form.departmentId) : null
        };

        try {
            if (formMode === 'create') {
                await api.post('/admins', {
                    ...payload,
                    email: form.email.trim(),
                    password: form.password
                });
            } else {
                await api.put(`/admins/${editingId}`, payload);
            }
            setFormOpen(false);
            fetchAdmins();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to save admin.');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (a) => {
        if (a.role === 'department_admin') {
            alert("To change a Department Admin's status, please update the Department's active status.");
            return;
        }
        try {
            await api.put(`/admins/${a.id}/status`, { isActive: !a.isActive });
            fetchAdmins();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status.');
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (passwordTarget.role === 'department_admin') {
            alert("To reset a Department Admin's password, go to the Teachers page.");
            setPasswordTarget(null);
            return;
        }
        setResetting(true);
        try {
            await api.put(`/admins/${passwordTarget.id}/reset-password`, { password: newPassword });
            setPasswordTarget(null);
            setNewPassword('');
            alert('Password updated successfully.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update password.');
        } finally {
            setResetting(false);
        }
    };

    const handleDelete = async () => {
        if (deleteTarget.role === 'department_admin') {
            alert("To remove a Department Admin, go to the Departments page and unassign them.");
            setDeleteTarget(null);
            return;
        }
        setDeleting(true);
        setDeleteError('');
        try {
            await api.delete(`/admins/${deleteTarget.id}`);
            const removedLastOnPage = admins.length === 1 && page > 1;
            setDeleteTarget(null);
            if (removedLastOnPage) setPage((p) => p - 1);
            else fetchAdmins();
        } catch (err) {
            setDeleteError(err.response?.data?.message || 'Failed to delete admin.');
        } finally {
            setDeleting(false);
        }
    };

    const canEditRow = (a) => {
        if (a.role === 'department_admin') return false;
        if (isSuperadmin) return true;
        if (isSystemadmin) return a.role === 'department_admin';
        return false;
    };

    const canActOnRow = (a) => {
        if (a.role === 'department_admin') return false;
        return canEditRow(a) && a.profileId !== user?.id;
    };

    const isCreate = formMode === 'create';
    const formNeedsDepartment = form.role === 'department_admin';

    const assignableRoles = isSuperadmin
        ? ROLE_OPTIONS
        : ROLE_OPTIONS.filter((r) => r.value === 'department_admin');

    if (!canManage) {
        return (
            <div className="p-6 rounded-2xl bg-white border border-gray-200 text-sm text-gray-600">
                You don't have permission to manage admins.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-2 flex gap-1 overflow-x-auto">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => changeTab(t.key)}
                        className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === t.key
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or employee ID..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className={`${inputClass} pl-10 pr-4`}
                        />
                    </div>
                    {isSuperadmin && (
                        <select
                            value={roleFilter}
                            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                            className={`${inputClass} sm:w-48`}
                        >
                            <option value="">All roles</option>
                            {ROLE_OPTIONS.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    )}
                    <p className="text-sm text-gray-500">{total} admin{total !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={openCreate}
                    className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 justify-center"
                >
                    <Plus className="w-4 h-4" /> Add Admin
                </button>
            </div>

            {pageError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{pageError}</div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-3">Admin</th>
                                <th className="px-6 py-3">Employee ID</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                                    </td>
                                </tr>
                            ) : admins.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-gray-500">
                                        No admins found.
                                    </td>
                                </tr>
                            ) : (
                                admins.map((a) => (
                                    <tr key={a.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                                    {a.fullName?.charAt(0) ?? '?'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">
                                                        {a.fullName}
                                                        {a.profileId === user?.id && (
                                                            <span className="ml-2 text-[10px] font-bold text-gray-400">(you)</span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{a.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-blue-600">{a.employeeId || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${ROLE_BADGE[a.role] ?? 'bg-gray-100 text-gray-700'}`}>
                                                {ROLE_LABELS[a.role] ?? a.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-700">{a.departmentName || '—'}</p>
                                            {a.departmentType && (
                                                <p className="text-[11px] text-gray-400 uppercase font-bold">{capitalize(a.departmentType)}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold w-max ${a.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {a.isActive ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                                                {a.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openView(a)} title="View" className="p-2 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {canEditRow(a) && (
                                                    <button onClick={() => openEdit(a)} title="Edit" className="p-2 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {canActOnRow(a) && (
                                                    <>
                                                        <button
                                                            onClick={() => handleToggleStatus(a)}
                                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg ${a.isActive
                                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                                }`}
                                                        >
                                                            {a.isActive ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                        <button
                                                            onClick={() => { setPasswordTarget(a); setNewPassword(''); }}
                                                            title="Reset Password"
                                                            className="p-2 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100"
                                                        >
                                                            <Key className="w-4 h-4" />
                                                        </button>
                                                        {isSuperadmin && (
                                                            <button
                                                                onClick={() => { setDeleteError(''); setDeleteTarget(a); }}
                                                                title="Delete"
                                                                className="p-2 rounded-lg text-red-700 bg-red-50 hover:bg-red-100"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
                    <div className="flex gap-2">
                        <button
                            disabled={page <= 1 || loading}
                            onClick={() => setPage((p) => p - 1)}
                            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            disabled={page >= totalPages || loading}
                            onClick={() => setPage((p) => p + 1)}
                            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* READ MODAL */}
            {viewing && (
                <Modal title="Admin Details" onClose={() => setViewing(null)} width="max-w-2xl">
                    {!viewing.admin ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Full Name" value={viewing.admin.fullName} />
                            <Field label="Employee ID" value={viewing.admin.employeeId} />
                            <Field label="Email" value={viewing.admin.email} />
                            <Field label="Phone" value={viewing.admin.phone} />
                            <Field label="Role" value={ROLE_LABELS[viewing.admin.role] ?? viewing.admin.role} />
                            <Field label="Designation" value={viewing.admin.designation} />
                            <Field label="Department" value={viewing.admin.departmentName} />
                            <Field label="Department Type" value={viewing.admin.departmentType ? capitalize(viewing.admin.departmentType) : null} />
                            <Field label="Status" value={viewing.admin.isActive ? 'Active' : 'Inactive'} />
                            <Field label="Created" value={viewing.admin.createdAt ? new Date(viewing.admin.createdAt).toLocaleDateString() : null} />
                        </div>
                    )}
                </Modal>
            )}

            {/* CREATE / UPDATE MODAL */}
            {formOpen && (
                <Modal title={isCreate ? 'Add Admin' : 'Edit Admin'} onClose={closeForm} width="max-w-2xl">
                    <form onSubmit={handleSave} className="space-y-4">
                        {!isCreate && (
                            <div className="p-3 bg-gray-50 rounded-xl text-sm">
                                <p className="text-xs font-bold text-gray-500 uppercase">Email (locked)</p>
                                <p className="font-semibold text-gray-700">{form.email}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label>Full Name</Label>
                                <input required value={form.fullName} onChange={update('fullName')} className={inputClass} />
                            </div>
                            <div>
                                <Label>Employee ID</Label>
                                <input required value={form.employeeId} onChange={update('employeeId')} className={inputClass} />
                            </div>

                            {isCreate && (
                                <>
                                    <div>
                                        <Label>Email (login)</Label>
                                        <input type="email" required value={form.email} onChange={update('email')} className={inputClass} />
                                    </div>
                                    <div>
                                        <Label>Temporary Password</Label>
                                        <input type="text" required minLength={6} value={form.password} onChange={update('password')} className={inputClass} placeholder="Min 6 characters" />
                                    </div>
                                </>
                            )}

                            <div>
                                <Label>Phone</Label>
                                <input value={form.phone} onChange={update('phone')} className={inputClass} />
                            </div>
                            <div>
                                <Label>Designation</Label>
                                <input value={form.designation} onChange={update('designation')} className={inputClass} placeholder="e.g. Head of Admissions" />
                            </div>

                            <div>
                                <Label>Role</Label>
                                <select
                                    value={form.role}
                                    onChange={update('role')}
                                    disabled={!isCreate && (editingSelf || !isSuperadmin)}
                                    className={`${inputClass} disabled:opacity-60`}
                                >
                                    {assignableRoles.map((r) => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                                {editingSelf && (
                                    <p className="text-[11px] text-gray-500 mt-1">You can't change your own role.</p>
                                )}
                            </div>

                            <div>
                                <Label>Department</Label>
                                {formNeedsDepartment ? (
                                    <select
                                        required
                                        value={form.departmentId}
                                        onChange={update('departmentId')}
                                        className={inputClass}
                                    >
                                        <option value="">Select department</option>
                                        {Object.entries(groupedDepartments).map(([type, list]) => (
                                            <optgroup key={type} label={capitalize(type)}>
                                                {list.map((d) => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                                        Not required for this role
                                    </p>
                                )}
                            </div>
                        </div>

                        {formError && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{formError}</div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={closeForm} disabled={saving} className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                Cancel
                            </button>
                            <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isCreate ? 'Create Admin' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* PASSWORD RESET MODAL */}
            {passwordTarget && (
                <Modal
                    title="Set New Password"
                    subtitle={`${passwordTarget.fullName} (${passwordTarget.employeeId})`}
                    onClose={() => !resetting && setPasswordTarget(null)}
                    width="max-w-sm"
                >
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div>
                            <Label>New Password</Label>
                            <input
                                required
                                minLength={6}
                                type="text"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={inputClass}
                                placeholder="Min 6 characters"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setPasswordTarget(null)}
                                disabled={resetting}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={resetting}
                                className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
                            >
                                {resetting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Update
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* DELETE CONFIRMATION */}
            {deleteTarget && (
                <Modal title="Delete Admin" onClose={() => !deleting && setDeleteTarget(null)} width="max-w-md">
                    <div className="space-y-4">
                        <div className="flex gap-3 p-3 bg-red-50 rounded-xl text-red-700 text-sm">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <p>
                                This permanently deletes <strong>{deleteTarget.fullName}</strong> ({deleteTarget.employeeId})
                                and their login account. This cannot be undone.
                            </p>
                        </div>

                        {deleteError && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{deleteError}</div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 flex items-center gap-2"
                            >
                                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Delete Admin
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ManageAdmins;