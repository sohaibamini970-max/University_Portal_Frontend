import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/common/DataTable';
import { Plus, X, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const AllTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Add Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    // Add Form State
    const [formData, setFormData] = useState({
        fullName: '', email: '', password: '', employeeId: '',
        designation: 'Lecturer', qualification: '', departmentId: '',
        isHod: false, isChairman: false, isDean: false
    });

    const fetchData = async () => {
        try {
            const [teachersRes, deptsRes] = await Promise.all([
                api.get('/teachers'),
                api.get('/departments')
            ]);
            setTeachers(teachersRes.data);
            setDepartments(deptsRes.data);
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
        setIsSubmitting(true);
        try {
            await api.post('/teachers', { ...formData, departmentId: parseInt(formData.departmentId) });
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setIsModalOpen(false);
                setFormData({
                    fullName: '', email: '', password: '', employeeId: '',
                    designation: 'Lecturer', qualification: '', departmentId: '',
                    isHod: false, isChairman: false, isDean: false
                });
                fetchData();
            }, 1500);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create teacher");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- OPEN EDIT MODAL (Triggered by DataTable) ---
    const openEditModal = (teacher) => {
        setEditingTeacher(teacher);
        setEditFormData({
            fullName: teacher.profile?.fullName || '',
            email: teacher.profile?.email || '',
            employeeId: teacher.employeeId || '',
            designation: teacher.designation || 'Lecturer',
            qualification: teacher.qualification || '',
            departmentId: teacher.departmentId || '',
            isHod: teacher.isHod || false,
            isChairman: teacher.isChairman || false,
            isDean: teacher.isDean || false
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.put(`/teachers/${editingTeacher.id}`, {
                ...editFormData,
                departmentId: parseInt(editFormData.departmentId)
            });
            setIsEditModalOpen(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update teacher");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 👇 Notice: NO 'action' column here anymore!
    const columns = [
        {
            key: 'profile',
            label: 'Teacher Name',
            render: (row) => (
                <div>
                    <p className="font-bold text-gray-900 text-sm">{row.profile?.fullName}</p>
                    <p className="text-xs text-gray-500">{row.profile?.email}</p>
                </div>
            )
        },
        {
            key: 'employeeId',
            label: 'Emp ID',
            render: (row) => <span className="font-semibold text-indigo-600">{row.employeeId}</span>
        },
        { key: 'designation', label: 'Designation' },
        {
            key: 'department',
            label: 'Department',
            render: (row) => <span className="text-sm text-gray-600">{row.department?.name || 'N/A'}</span>
        },
        {
            key: 'leadership',
            label: 'Roles',
            render: (row) => (
                <div className="flex gap-1">
                    {row.isHod && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">HOD</span>}
                    {row.isChairman && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">Chairman</span>}
                    {row.isDean && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">Dean</span>}
                    {!row.isHod && !row.isChairman && !row.isDean && <span className="text-lg text-gray-900">-</span>}
                </div>
            )
        }
    ];

    if (loading) return <div className="text-center py-10 text-gray-500">Loading teachers...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Teachers & Faculty</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Manage teaching staff and their leadership roles.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Teacher
                </button>
            </div>

            {/* 👇 PASS onEdit PROP HERE 👇 */}
            <DataTable
                columns={columns}
                data={teachers}
                itemsPerPage={5}
                onEdit={openEditModal}
            />

            {/* CREATE TEACHER MODAL */}
            {isModalOpen && (
                // ... your existing create modal code ...
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                        <div className="bg-slate-800 p-5 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-lg font-bold">Add New Teacher</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        {showSuccess ? (
                            <div className="p-8 text-center animate-in zoom-in-95">
                                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900">Teacher Created!</h3>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                                {/* Form fields... */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                        <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                        <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                                        <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Employee ID</label>
                                        <input required type="text" value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                                        <select required value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                            <option value="">-- Select Department --</option>
                                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Designation</label>
                                        <select value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                            <option>Lecturer</option>
                                            <option>Assistant Professor</option>
                                            <option>Associate Professor</option>
                                            <option>Professor</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3 border-t border-gray-100">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                    <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2">
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Teacher'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* 👇 YOUR CUSTOM EDIT MODAL (Opened via DataTable action icon) 👇 */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                        <div className="bg-indigo-900 p-5 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-lg font-bold">Edit Teacher</h2>
                                <p className="text-indigo-200 text-xs mt-0.5">Update {editFormData.fullName}'s details</p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                    <input required type="text" value={editFormData.fullName} onChange={e => setEditFormData({ ...editFormData, fullName: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                    <input required type="email" value={editFormData.email} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Employee ID</label>
                                    <input required type="text" value={editFormData.employeeId} onChange={e => setEditFormData({ ...editFormData, employeeId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                                    <select required value={editFormData.departmentId} onChange={e => setEditFormData({ ...editFormData, departmentId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                        <option value="">-- Select Department --</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Designation</label>
                                    <select value={editFormData.designation} onChange={e => setEditFormData({ ...editFormData, designation: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                        <option>Lecturer</option>
                                        <option>Assistant Professor</option>
                                        <option>Associate Professor</option>
                                        <option>Professor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Qualification</label>
                                    <input type="text" value={editFormData.qualification} onChange={e => setEditFormData({ ...editFormData, qualification: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3 border-t border-gray-100">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllTeachers;