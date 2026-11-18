import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, Eye, Pencil, Trash2, Plus, X, Loader2, AlertTriangle,
    ChevronLeft, ChevronRight, ShieldCheck, ShieldAlert
} from 'lucide-react';
import { api, useAuth } from '../../../context/AuthContext';

const PAGE_SIZE = 10;
const FULL_ADMIN_ROLES = ['superadmin', 'systemadmin'];

const inputClass =
    'w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none';

const emptyForm = {
    fullName: '',
    email: '',
    password: '',
    phone: '',
    employeeId: '',
    designation: '',
    qualification: '',
    departmentId: '',
    isHod: false,
    isChairman: false,
    isDean: false
};

// 👇 UPDATED: renders below sticky header, sits above header z-index
const Modal = ({ title, subtitle, onClose, children, width = 'max-w-lg' }) => (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 pt-24">
            <div className={`bg-white rounded-2xl shadow-2xl w-full ${width} max-h-[calc(100vh-8rem)] overflow-y-auto`}>
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
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

const ManageTeachers = () => {
    const { user } = useAuth();
    const canChooseDepartment = FULL_ADMIN_ROLES.includes(user?.role);
    const canDelete = FULL_ADMIN_ROLES.includes(user?.role);

    // List state
    const [teachers, setTeachers] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState('');

    // Departments (for superadmin/systemadmin only)
    const [departments, setDepartments] = useState([]);

    // Modals
    const [viewing, setViewing] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    const [passwordOpen, setPasswordOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchTeachers = useCallback(async () => {
        setLoading(true);
        setPageError('');
        try {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(PAGE_SIZE),
                search
            });
            const res = await api.get(`/teachers/admin?${params.toString()}`);
            setTeachers(res.data.items);
            setTotal(res.data.total);
            setTotalPages(Math.max(1, res.data.totalPages));
        } catch (err) {
            setPageError(err.response?.data?.message || 'Failed to load teachers.');
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    useEffect(() => {
        if (!canChooseDepartment) return;
        api.get('/departments')
            .then((res) => setDepartments(res.data))
            .catch(() => setDepartments([]));
    }, [canChooseDepartment]);

    // READ
    const openView = async (teacher) => {
        setViewing({ teacher: null, assignments: [] });
        try {
            const res = await api.get(`/teachers/admin/${teacher.id}`);
            setViewing(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to load teacher details.');
            setViewing(null);
        }
    };

    // CREATE
    const openCreate = () => {
        setFormMode('create');
        setEditingId(null);
        setForm(emptyForm);
        setFormError('');
        setFormOpen(true);
        setPasswordOpen(false);
        setNewPassword('');
        setPasswordError('');
        setPasswordSuccess('');
    };

    const handleUpdatePassword = async () => {
        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
            return;
        }
        setPasswordSaving(true);
        setPasswordError('');
        setPasswordSuccess('');
        try {
            await api.put(`/teachers/admin/${editingId}/password`, {
                newPassword
            });
            setPasswordSuccess('Password updated successfully.');
            setNewPassword('');
            setTimeout(() => {
                setPasswordOpen(false);
                setPasswordSuccess('');
            }, 1500);
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to update password.');
        } finally {
            setPasswordSaving(false);
        }
    };

    // UPDATE
    const openEdit = (t) => {
        setFormMode('edit');
        setEditingId(t.id);
        setPasswordOpen(false);
        setNewPassword('');
        setPasswordError('');
        setPasswordSuccess('');
        setForm({
            ...emptyForm,
            fullName: t.fullName ?? '',
            email: t.email ?? '',
            phone: t.phone ?? '',
            employeeId: t.employeeId ?? '',
            designation: t.designation ?? '',
            qualification: t.qualification ?? '',
            departmentId: t.departmentId ? String(t.departmentId) : '',
            isHod: !!t.isHod,
            isChairman: !!t.isChairman,
            isDean: !!t.isDean,
            
        });
        setFormError('');
        setFormOpen(true);
    };

    const closeForm = () => {
        if (saving) return;
        setFormOpen(false);
        setFormError('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');

        const sharedFields = {
            fullName: form.fullName.trim(),
            employeeId: form.employeeId.trim(),
            designation: form.designation.trim(),
            qualification: form.qualification.trim(),
            isHod: form.isHod,
            isChairman: form.isChairman,
            isDean: form.isDean
        };

        try {
            if (formMode === 'create') {
                await api.post('/teachers', {
                    ...sharedFields,
                    email: form.email.trim(),
                    password: form.password,
                    departmentId: canChooseDepartment ? Number(form.departmentId) : 0
                });
            } else {
                await api.put(`/teachers/admin/${editingId}`, {
                    ...sharedFields,
                    phone: form.phone.trim() || null,
                    departmentId: canChooseDepartment ? Number(form.departmentId) : Number(form.departmentId || 0)
                });
            }
            setFormOpen(false);
            fetchTeachers();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to save teacher.');
        } finally {
            setSaving(false);
        }
    };

    // DELETE
    const openDelete = (t) => {
        setDeleteError('');
        setDeleteTarget(t);
    };

    const handleDelete = async () => {
        setDeleting(true);
        setDeleteError('');
        try {
            await api.delete(`/teachers/admin/${deleteTarget.id}`);
            const removedLastOnPage = teachers.length === 1 && page > 1;
            setDeleteTarget(null);
            if (removedLastOnPage) setPage((p) => p - 1);
            else fetchTeachers();
        } catch (err) {
            setDeleteError(err.response?.data?.message || 'Failed to delete teacher.');
        } finally {
            setDeleting(false);
        }
    };

    const update = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((f) => ({ ...f, [field]: value }));
    };

    const isCreate = formMode === 'create';

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or employee ID..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className={`${inputClass} pl-10 pr-4`}
                        />
                    </div>
                    <p className="text-sm text-gray-500">
                        {total} teacher{total !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 justify-center"
                >
                    <Plus className="w-4 h-4" /> Add Teacher
                </button>
            </div>

            {pageError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{pageError}</div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-indigo-600 text-xs font-bold text-white uppercase tracking-wider">
                                <th className="px-6 py-3">Teacher</th>
                                <th className="px-6 py-3">Employee ID</th>
                                <th className="px-6 py-3">Designation</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Roles</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-10 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                                    </td>
                                </tr>
                            ) : teachers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-10 text-center text-gray-500">
                                        No teachers found.
                                    </td>
                                </tr>
                            ) : (
                                teachers.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                                    {t.fullName?.charAt(0) ?? '?'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{t.fullName}</p>
                                                    <p className="text-xs text-gray-500">{t.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-blue-600">{t.employeeId || '—'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{t.designation || '—'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{t.departmentName || '—'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {t.isHod && <span className="px-2 py-0.5 rounded bg-violet-100 text-violet-700 text-[10px] font-bold">HOD</span>}
                                                {t.isChairman && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">Chairman</span>}
                                                {t.isDean && <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-700 text-[10px] font-bold">Dean</span>}
                                                {!t.isHod && !t.isChairman && !t.isDean && <span className="text-xs text-gray-400">—</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold w-max ${t.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {t.isActive ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                                                {t.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openView(t)} title="View" className="p-2 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => openEdit(t)} title="Edit" className="p-2 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                {canDelete && (
                                                    <button onClick={() => openDelete(t)} title="Delete" className="p-2 rounded-lg text-red-700 bg-red-50 hover:bg-red-100">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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

            {/* READ modal */}
            {viewing && (
                <Modal title="Teacher Details" onClose={() => setViewing(null)} width="max-w-2xl">
                    {!viewing.teacher ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Full Name" value={viewing.teacher.fullName} />
                                <Field label="Employee ID" value={viewing.teacher.employeeId} />
                                <Field label="Email" value={viewing.teacher.email} />
                                <Field label="Phone" value={viewing.teacher.phone} />
                                <Field label="Designation" value={viewing.teacher.designation} />
                                <Field label="Qualification" value={viewing.teacher.qualification} />
                                <Field label="Department" value={viewing.teacher.departmentName} />
                                <Field label="Status" value={viewing.teacher.isActive ? 'Active' : 'Inactive'} />
                                <Field label="Roles" value={[
                                    viewing.teacher.isHod && 'HOD',
                                    viewing.teacher.isChairman && 'Chairman',
                                    viewing.teacher.isDean && 'Dean'
                                ].filter(Boolean).join(', ') || 'None'} />
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                                    Assigned Courses
                                </h4>
                                {viewing.assignments.length === 0 ? (
                                    <p className="text-sm text-gray-500">No courses assigned.</p>
                                ) : (
                                    <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl">
                                        {viewing.assignments.map((a, i) => (
                                            <li key={i} className="flex justify-between px-4 py-2.5 text-sm">
                                                <span className="font-semibold text-gray-900">{a.code} - {a.name}</span>
                                                <span className="text-gray-500">
                                                    {a.program} · {a.batch} · Sec {a.section}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </Modal>
            )}

            {/* CREATE / UPDATE modal */}
            {formOpen && (
                <Modal
                    title={isCreate ? 'Add Teacher' : 'Edit Teacher'}
                    onClose={closeForm}
                    width="max-w-2xl"
                >
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

                            {!isCreate && (
                                <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-gray-600">Login Password</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Reset the teacher's Supabase login password.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPasswordOpen((o) => !o);
                                                setPasswordError('');
                                                setPasswordSuccess('');
                                                setNewPassword('');
                                            }}
                                            className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                                        >
                                            {passwordOpen ? 'Cancel' : 'Change Password'}
                                        </button>
                                    </div>

                                    {passwordOpen && (
                                        <div className="mt-3 space-y-2">
                                            <Label>New Password</Label>
                                            <input
                                                type="text"
                                                minLength={6}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Min 6 characters"
                                                className={inputClass}
                                            />

                                            {passwordError && (
                                                <div className="p-2 rounded-lg bg-red-50 text-red-700 text-xs">
                                                    {passwordError}
                                                </div>
                                            )}
                                            {passwordSuccess && (
                                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs">
                                                    {passwordSuccess}
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={handleUpdatePassword}
                                                disabled={passwordSaving || !newPassword}
                                                className="w-full px-3 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2"
                                            >
                                                {passwordSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                                Update Password
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!isCreate && (
                                <div>
                                    <Label>Phone</Label>
                                    <input value={form.phone} onChange={update('phone')} className={inputClass} />
                                </div>
                            )}

                            <div>
                                <Label>Designation</Label>
                                <input value={form.designation} onChange={update('designation')} className={inputClass} placeholder="e.g. Assistant Professor" />
                            </div>
                            <div>
                                <Label>Qualification</Label>
                                <input value={form.qualification} onChange={update('qualification')} className={inputClass} placeholder="e.g. PhD Computer Science" />
                            </div>

                            <div className="sm:col-span-2">
                                <Label>Department</Label>
                                {canChooseDepartment ? (
                                    <select required value={form.departmentId} onChange={update('departmentId')} className={inputClass}>
                                        <option value="">Select department</option>
                                        {departments.map((d) => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                                        Assigned to your department automatically
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label>Roles</Label>
                            <div className="flex flex-wrap gap-5 text-sm text-gray-700">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={form.isHod} onChange={update('isHod')} /> HOD
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={form.isChairman} onChange={update('isChairman')} /> Chairman
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={form.isDean} onChange={update('isDean')} /> Dean
                                </label>
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
                                {isCreate ? 'Create Teacher' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* DELETE confirmation */}
            {deleteTarget && (
                <Modal title="Delete Teacher" onClose={() => !deleting && setDeleteTarget(null)} width="max-w-md">
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
                                Delete Teacher
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ManageTeachers;