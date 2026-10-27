import React, { useState, useEffect } from 'react';
import { Plus, Search, GraduationCap, Trash2, Edit2, X, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const Programs = () => {
    const [programs, setPrograms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '', code: '', departmentId: '', degreeLevel: 'Bachelor', durationYears: 4, totalCreditHours: 130, description: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [progRes, deptRes] = await Promise.all([
                api.get('/programs'),
                api.get('/departments')
            ]);
            setPrograms(progRes.data);
            setDepartments(deptRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (program = null) => {
        if (program) {
            setEditingId(program.id);
            setFormData({
                name: program.name,
                code: program.code,
                departmentId: program.departmentId,
                degreeLevel: program.degreeLevel,
                durationYears: program.durationYears,
                totalCreditHours: program.totalCreditHours,
                description: program.description || ''
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '', code: '', departmentId: '', degreeLevel: 'Bachelor', durationYears: 4, totalCreditHours: 130, description: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { ...formData, departmentId: parseInt(formData.departmentId) };

            if (editingId) {
                await api.put(`/programs/${editingId}`, payload);
            } else {
                await api.post('/programs', payload);
            }

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setShowModal(false);
                fetchData();
            }, 1500);
        } catch (error) {
            alert(error.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} program`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this program?")) return;
        try {
            await api.delete(`/programs/${id}`);
            setPrograms(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert("Failed to delete program.");
        }
    };

    const filteredData = programs.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.department?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="text-center py-10 text-gray-500">Loading programs...</div>;

    return (
        <div className="space-y-6 pb-8 max-w-7xl mx-auto">
            {/* Control Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80 p-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by program name, code, or dept..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <button
                    onClick={() => openModal()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Program
                </button>
            </div>

            {/* Programs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredData.length === 0 && (
                    <div className="col-span-full py-10 text-center text-gray-500">No programs found.</div>
                )}

                {filteredData.map((prog) => (
                    <div key={prog.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight">{prog.name}</h3>
                                        <p className="text-xs font-semibold text-gray-500 mt-0.5">{prog.code}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openModal(prog)} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(prog.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 uppercase">
                                    {prog.department?.name || 'Unassigned'}
                                </span>
                            </div>

                            <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[32px]">{prog.description || 'No description provided.'}</p>

                            <div className="mt-auto pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Level</p>
                                    <p className="text-xs font-bold text-gray-800">{prog.degreeLevel}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Duration</p>
                                    <p className="text-xs font-bold text-gray-800">{prog.durationYears} Yrs</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Credits</p>
                                    <p className="text-xs font-bold text-gray-800">{prog.totalCreditHours}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE / EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                        <div className="bg-slate-800 p-5 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-lg font-bold">{editingId ? 'Update Program' : 'Add New Program'}</h2>
                                <p className="text-slate-300 text-xs mt-0.5">{editingId ? 'Modify program details.' : 'Create a new degree program under a department.'}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                        </div>

                        {showSuccess ? (
                            <div className="p-8 text-center animate-in zoom-in-95">
                                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900">Program {editingId ? 'Updated' : 'Created'}!</h3>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Select Department</label>
                                    <select required value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                        <option value="">-- Select Department --</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Program Name</label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="e.g., BS Computer Science" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Program Code</label>
                                        <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm uppercase" placeholder="e.g., BSCS" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Degree Level</label>
                                        <select value={formData.degreeLevel} onChange={e => setFormData({ ...formData, degreeLevel: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm">
                                            <option>Bachelor</option>
                                            <option>Master</option>
                                            <option>PhD</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Duration (Yrs)</label>
                                        <input required type="number" value={formData.durationYears} onChange={e => setFormData({ ...formData, durationYears: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Credit Hours</label>
                                        <input required type="number" value={formData.totalCreditHours} onChange={e => setFormData({ ...formData, totalCreditHours: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
                                    <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="Short description..." />
                                </div>
                                <div className="pt-4 flex gap-3 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200" disabled={isSubmitting}>Cancel</button>
                                    <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2 disabled:opacity-70">
                                        {isSubmitting ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                        ) : (
                                            <><CheckCircle className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Create Program'}</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Programs;