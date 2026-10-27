import React, { useEffect, useState } from 'react';
import { X, Save, CheckCircle, Loader2, UserCircle2 } from 'lucide-react';
import { api } from '../../context/AuthContext';

const DepartmentEditModal = ({ department, onClose, onSaved }) => {
    const [formData, setFormData] = useState({});
    const [candidates, setCandidates] = useState([]);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loadingCandidates, setLoadingCandidates] = useState(true);

    // Seed the form with the current department
    useEffect(() => {
        if (department) {
            setFormData({
                name: department.name || '',
                code: department.code || '',
                type: department.type || 'education',
                description: department.description || '',
                location: department.location || '',
                building: department.building || '',
                email: department.email || '',
                phone: department.phone || '',
                establishedYear: department.establishedYear || '',
                headId: department.headId || '',
                adminId: department.adminId || '',
                isActive: department.isActive ?? true,
            });
        }
    }, [department]);

    // Load eligible admins
    useEffect(() => {
        const loadCandidates = async () => {
            if (!department) return;
            setLoadingCandidates(true);
            try {
                const res = await api.get(`/departments/${department.id}/admin-candidates`);
                setCandidates(res.data);
            } catch (err) {
                console.error('Failed to load admin candidates', err);
                setCandidates([]);
            } finally {
                setLoadingCandidates(false);
            }
        };
        loadCandidates();
    }, [department]);

    if (!department) return null;

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                establishedYear: formData.establishedYear
                    ? parseInt(formData.establishedYear)
                    : null,
                headId: formData.headId || null,
                adminId: formData.adminId || null,
            };
            await api.put(`/departments/${department.id}`, payload);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onSaved && onSaved();
                onClose();
            }, 1200);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update department');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-slate-800 p-5 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-lg font-bold">Edit Department</h2>
                        <p className="text-slate-300 text-xs mt-0.5">{department.code} • {department.name}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {success ? (
                    <div className="p-10 text-center">
                        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Department Updated</h3>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                <input required type="text" value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Code</label>
                                <input required type="text" value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm uppercase" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                            <textarea value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                                <input type="text" value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Building</label>
                                <input type="text" value={formData.building}
                                    onChange={e => setFormData({ ...formData, building: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                <input type="email" value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                                <input type="text" value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Established Year</label>
                                <input type="number" value={formData.establishedYear}
                                    onChange={e => setFormData({ ...formData, establishedYear: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                <select value={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm">
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* 👇 Admin Selection — the core of this task 👇 */}
                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <UserCircle2 className="w-4 h-4 text-indigo-600" />
                                <label className="block text-xs font-bold text-indigo-700 uppercase">
                                    Department Admin
                                </label>
                            </div>
                            <p className="text-[11px] text-indigo-600 mb-2">
                                Assign someone to manage this department's portal. Students cannot be admins.
                            </p>
                                <select
                                    value={formData.adminId || ''}
                                    onChange={e => setFormData({ ...formData, adminId: e.target.value })}
                                    disabled={loadingCandidates}
                                    className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="">
                                        {loadingCandidates ? 'Loading candidates...' : '— No admin assigned —'}
                                    </option>
                                    {candidates.map(c => {
                                        // Robust label fallback — works regardless of what the API calls the field
                                        const name =
                                            c.fullName ||
                                            c.displayName ||
                                            c.full_name ||
                                            c.name ||
                                            `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() ||
                                            c.email ||
                                            'Unnamed user';
                                        const suffix =
                                            c.departmentId && c.departmentId !== department?.id
                                                ? ' — current admin of another dept'
                                                : '';
                                        return (
                                            <option key={c.id} value={c.id}>
                                                {name} ({c.role}){suffix}
                                            </option>
                                        );
                                    })}
                                </select>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex gap-3">
                            <button type="button" onClick={onClose}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">
                                Cancel
                            </button>
                            <button type="submit" disabled={saving}
                                className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DepartmentEditModal;