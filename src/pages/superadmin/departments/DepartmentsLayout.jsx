import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { GraduationCap, Briefcase, Plus, Search, X, CheckCircle } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const DepartmentsLayout = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // 👇 Determine the active tab based on the URL
    const location = useLocation();
    const isBusinessTab = location.pathname.includes('business');
    const currentType = isBusinessTab ? 'business' : 'education';

    const [formData, setFormData] = useState({
        name: '', code: '', description: '', location: '', building: '', email: ''
    });

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            // 👇 Automatically attach the currentType to the request
            const payload = { ...formData, type: currentType };
            await api.post('/departments', payload);

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setShowAddModal(false);
                setFormData({ name: '', code: '', description: '', location: '', building: '', email: '' });
                window.location.reload();
            }, 1500);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create department");
        }
    };

    return (
        <Layout title="Departments" subtitle="Manage university academic and administrative departments">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                {/* Top Bar: Tabs & Add Button */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
                    {/* Tabs */}
                    <div className="flex w-full lg:w-auto bg-gray-100/80 p-1 rounded-xl">
                        <NavLink
                            to="/superadmin/departments/education"
                            className={({ isActive }) =>
                                `flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`
                            }
                        >
                            <GraduationCap className="w-4 h-4" /> Educational
                        </NavLink>
                        <NavLink
                            to="/superadmin/departments/business"
                            className={({ isActive }) =>
                                `flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`
                            }
                        >
                            <Briefcase className="w-4 h-4" /> Business / Admin
                        </NavLink>
                    </div>

                    {/* Search & Add */}
                    <div className="flex items-center gap-3 w-full lg:w-auto px-2 lg:px-0">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search departments..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                </div>

                {/* Child Routes Render Here */}
                <Outlet context={{ searchQuery }} />
            </div>

            {/* ADD DEPARTMENT MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                        <div className="bg-slate-800 p-5 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold">Add {isBusinessTab ? 'Business' : 'Educational'} Department</h2>
                                <p className="text-slate-300 text-xs mt-0.5">Create a new department under this category.</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                        </div>

                        {showSuccess ? (
                            <div className="p-8 text-center animate-in zoom-in-95">
                                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900">Department Created!</h3>
                            </div>
                        ) : (
                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Department Name</label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="e.g., Computer Science" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Department Code</label>
                                        <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm uppercase" placeholder="e.g., CS" />
                                    </div>
                                </div>

                                {/* 👇 Read-only Type display 👇 */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Department Type</label>
                                    <div className={`w-full px-3 py-2 border rounded-xl text-sm font-semibold capitalize ${isBusinessTab ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-blue-50 border-blue-200 text-blue-700'
                                        }`}>
                                        {currentType}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                    <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="Short description..." />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Location (Campus)</label>
                                        <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="e.g., Main Campus" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Block / Building</label>
                                        <input type="text" value={formData.building} onChange={e => setFormData({ ...formData, building: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="e.g., A-Block" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="dept@university.edu" />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                    <button type="submit" className={`flex-1 py-2.5 text-white font-bold rounded-xl shadow-md transition-colors ${isBusinessTab ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
                                        }`}>
                                        Create {isBusinessTab ? 'Business' : 'Educational'} Dept
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default DepartmentsLayout; 