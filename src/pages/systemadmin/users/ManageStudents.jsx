import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, Eye, Pencil, Key, X, Loader2, ShieldCheck, ShieldAlert,
    ChevronLeft, ChevronRight, Zap, CheckCircle2
} from 'lucide-react';
import { api, useAuth } from '../../../context/AuthContext';

const PAGE_SIZE = 10;
const FULL_ADMIN_ROLES = ['superadmin', 'systemadmin'];

const inputClass =
    'w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none';

const Modal = ({ title, subtitle, onClose, children, width = 'max-w-lg' }) => (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        {/* Spacer that pushes the panel below the sticky header */}
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

const ManageStudents = () => {
    const { user } = useAuth(); // adjust to however your AuthContext exposes the logged-in user
    const canManageAccounts = FULL_ADMIN_ROLES.includes(user?.role);

    // List state
    const [students, setStudents] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState('');

    // Modal state
    const [viewing, setViewing] = useState(null);       // { student, registeredCourses }
    const [editing, setEditing] = useState(null);       // editable form state
    const [editError, setEditError] = useState('');
    const [saving, setSaving] = useState(false);
    const [passwordTarget, setPasswordTarget] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [resetting, setResetting] = useState(false);

    // Bulk activate state
    const [bulkActivating, setBulkActivating] = useState(false);
    const [confirmBulkActivate, setConfirmBulkActivate] = useState(false);
    const [bulkActivateResult, setBulkActivateResult] = useState(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // BULK ACTIVATE
    const handleBulkActivate = async () => {
        setBulkActivating(true);
        try {
            const res = await api.post('/students/admin/bulk-activate', {
                search: search || null
            });
            setConfirmBulkActivate(false);
            setBulkActivateResult(res.data);
            await fetchStudents();          // refresh the table
            // auto-dismiss the toast after 4s
            setTimeout(() => setBulkActivateResult(null), 4000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to bulk activate students.');
        } finally {
            setBulkActivating(false);
        }
    };

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        setPageError('');
        try {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(PAGE_SIZE),
                search
            });
            const res = await api.get(`/students/admin?${params.toString()}`);
            setStudents(res.data.items);
            setTotal(res.data.total);
            setTotalPages(Math.max(1, res.data.totalPages));
        } catch (err) {
            setPageError(err.response?.data?.message || 'Failed to load students.');
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // READ
    const openView = async (student) => {
        setViewing({ student: null, registeredCourses: [] });
        try {
            const res = await api.get(`/students/admin/${student.id}`);
            setViewing(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to load student details.');
            setViewing(null);
        }
    };

    // UPDATE
    const openEdit = (s) => {
        setEditError('');
        setEditing({
            id: s.id,
            rollNo: s.rollNo,
            email: s.email,
            fullName: s.fullName ?? '',
            fatherName: s.fatherName ?? '',
            phone: s.phone ?? '',
            section: s.section ?? ''
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setEditError('');
        try {
            await api.put(`/students/admin/${editing.id}`, {
                fullName: editing.fullName,
                fatherName: editing.fatherName,
                phone: editing.phone,
                section: editing.section
            });
            setEditing(null);
            fetchStudents();
        } catch (err) {
            setEditError(err.response?.data?.message || 'Failed to update student.');
        } finally {
            setSaving(false);
        }
    };

    // ACTIVATE / DEACTIVATE
    const handleToggleStatus = async (s) => {
        try {
            await api.put(`/students/${s.id}/toggle-status`, { isActive: !s.isActive });
            fetchStudents();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status.');
        }
    };

    // PASSWORD RESET
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setResetting(true);
        try {
            await api.put(`/students/${passwordTarget.profileId}/reset-password`, { password: newPassword });
            setPasswordTarget(null);
            setNewPassword('');
            alert('Password updated successfully.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update password.');
        } finally {
            setResetting(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, roll no, or email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className={`${inputClass} pl-10 pr-4`}
                    />
                </div>
                <p className="text-sm text-gray-500">
                    {total} student{total !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-500">
                        {total} student{total !== 1 ? 's' : ''}
                    </p>
                    {canManageAccounts && (
                        <button
                            onClick={() => setConfirmBulkActivate(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 shadow-sm transition-colors"
                        >
                            <Zap className="w-4 h-4" />
                            Activate All Inactive
                        </button>
                    )}
                </div>
            </div>

            {pageError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{pageError}</div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="" >
                            <tr className="bg-gray-100 bg-indigo-600 text-xs font-bold text-white uppercase tracking-wider">
                                <th className="px-6 py-3">Student</th>
                                <th className="px-6 py-3">Reg No.</th>
                                <th className="px-6 py-3">Program</th>
                                <th className="px-6 py-3">Batch</th>
                                <th className="px-6 py-3">Section</th>
                                <th className="px-6 py-3">Portal Status</th>
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
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-10 text-center text-gray-500">
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                students.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                                    {s.fullName?.charAt(0) ?? '?'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{s.fullName}</p>
                                                    <p className="text-xs text-gray-500">{s.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                                            {s.rollNo || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{s.programCode}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{s.batchName}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold border border-slate-200">
                                                {s.section}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold w-max ${s.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {s.isActive ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                                                {s.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openView(s)}
                                                    title="View"
                                                    className="p-2 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEdit(s)}
                                                    title="Edit"
                                                    className="p-2 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                {canManageAccounts && (
                                                    <>
                                                        <button
                                                            onClick={() => handleToggleStatus(s)}
                                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg ${s.isActive
                                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                                }`}
                                                        >
                                                            {s.isActive ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                        <button
                                                            onClick={() => { setPasswordTarget(s); setNewPassword(''); }}
                                                            title="Reset Password"
                                                            className="p-2 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100"
                                                        >
                                                            <Key className="w-4 h-4" />
                                                        </button>
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
                <Modal title="Student Details" onClose={() => setViewing(null)} width="max-w-2xl" className="mt-20" >
                    {!viewing.student ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Full Name" value={viewing.student.fullName} />
                                <Field label="Reg No." value={viewing.student.rollNo} />
                                <Field label="Email" value={viewing.student.email} />
                                <Field label="Phone" value={viewing.student.phone} />
                                <Field label="Father's Name" value={viewing.student.fatherName} />
                                <Field label="Portal Status" value={viewing.student.isActive ? 'Active' : 'Inactive'} />
                                <Field label="Program" value={viewing.student.programName} />
                                <Field label="Batch" value={viewing.student.batchName} />
                                <Field label="Department" value={viewing.student.departmentName} />
                                <Field label="Section" value={viewing.student.section} />
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                                    Registered Courses
                                </h4>
                                {viewing.registeredCourses.length === 0 ? (
                                    <p className="text-sm text-gray-500">No courses registered.</p>
                                ) : (
                                    <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl">
                                        {viewing.registeredCourses.map((c, i) => (
                                            <li key={i} className="flex justify-between px-4 py-2.5 text-sm">
                                                <span className="font-semibold text-gray-900">{c.code} - {c.name}</span>
                                                <span className="text-gray-500">{c.creditHours} cr · Sec {c.section}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </Modal>
            )}

            {/* UPDATE modal */}
            {editing && (
                <Modal title="Edit Student" onClose={() => setEditing(null)}>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-xl text-sm">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Reg No. (locked)</p>
                                <p className="font-semibold text-gray-700">{editing.rollNo || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Email (locked)</p>
                                <p className="font-semibold text-gray-700 truncate">{editing.email}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
                            <input
                                required
                                value={editing.fullName}
                                onChange={(e) => setEditing({ ...editing, fullName: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Father's Name</label>
                            <input
                                value={editing.fatherName}
                                onChange={(e) => setEditing({ ...editing, fatherName: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Phone</label>
                                <input
                                    value={editing.phone}
                                    onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Section</label>
                                <input
                                    required
                                    value={editing.section}
                                    onChange={(e) => setEditing({ ...editing, section: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {editError && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{editError}</div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setEditing(null)}
                                className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* PASSWORD RESET modal */}
            {passwordTarget && (
                <Modal
                    title="Set New Password"
                    subtitle={`${passwordTarget.fullName} (${passwordTarget.rollNo})`}
                    onClose={() => !resetting && setPasswordTarget(null)}
                    width="max-w-sm"
                >
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                            <input
                                required
                                type="text"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={inputClass}
                                placeholder="Enter new password"
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
            {/* BULK ACTIVATE CONFIRMATION */}
            {confirmBulkActivate && (
                <Modal
                    title="Activate All Inactive Students?"
                    subtitle={
                        search
                            ? `Only students matching "${search}" will be activated.`
                            : 'All inactive students in the system will be activated.'
                    }
                    onClose={() => !bulkActivating && setConfirmBulkActivate(false)}
                    width="max-w-md"
                >
                    <div className="space-y-4">
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800">
                                <p className="font-bold mb-1">This grants portal access immediately.</p>
                                <p>
                                    Every inactive student{search ? ' matching your search' : ''} will be able to log in and
                                    view their courses, timetable, and attendance.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmBulkActivate(false)}
                                disabled={bulkActivating}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleBulkActivate}
                                disabled={bulkActivating}
                                className="flex-1 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
                            >
                                {bulkActivating ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Activating...</>
                                ) : (
                                    <><Zap className="w-4 h-4" /> Yes, Activate All</>
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* SUCCESS TOAST */}
            {bulkActivateResult && (
                <div className="fixed bottom-6 right-6 z-[110] bg-white border border-emerald-200 rounded-2xl shadow-xl p-4 pr-10 max-w-sm animate-in fade-in slide-in-from-bottom-2">
                    <button
                        onClick={() => setBulkActivateResult(null)}
                        className="absolute top-2 right-2 p-1 rounded-lg hover:bg-gray-100"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-gray-900">
                                {bulkActivateResult.activatedCount > 0
                                    ? `${bulkActivateResult.activatedCount} student${bulkActivateResult.activatedCount === 1 ? '' : 's'} activated`
                                    : 'No inactive students'}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{bulkActivateResult.message}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStudents;