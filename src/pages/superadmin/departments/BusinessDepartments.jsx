import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Briefcase, Eye, Edit2, Trash2, X, MapPin } from 'lucide-react';
import { api } from '../../../context/AuthContext';
import DepartmentEditModal from '../../../components/common/DepartmentEditModal';

const BusinessDepartments = () => {
    const { searchQuery } = useOutletContext();
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);
     const [editingDept, setEditingDept] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments?type=business');
            setDepartments(response.data);
        } catch (error) {
            console.error("Failed to load departments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this department?")) return;
        try {
            await api.delete(`/departments/${id}`);
            setDepartments(prev => prev.filter(d => d.id !== id));
        } catch (error) {
            alert("Failed to delete department.");
        }
    };

    const filteredData = departments.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getColorClasses = (color) => {
        const colors = {
            emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-600' },
            orange: { bg: 'bg-orange-50', text: 'text-orange-600', gradient: 'from-orange-500 to-red-500' },
            rose: { bg: 'bg-rose-50', text: 'text-rose-600', gradient: 'from-rose-500 to-red-600' },
        };
        return colors[color] || colors.emerald;
    };

    if (loading) return <div className="text-center py-10 text-gray-500">Loading business departments...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredData.length === 0 && (
                <div className="col-span-full py-10 text-center text-gray-500">No business departments found.</div>
            )}

            {filteredData.map((dept) => {
                const colorKey = dept.id % 2 === 0 ? 'orange' : 'emerald';
                const colors = getColorClasses(colorKey);
                const Icon = Briefcase;

                return (
                    <div key={dept.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
                        <div className={`h-1.5 w-full bg-gradient-to-r ${colors.gradient}`} />
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight">{dept.name}</h3>
                                        <p className="text-xs font-semibold text-gray-500 mt-0.5">Code: {dept.code}</p>
                                    </div>
                                </div>

                                <div className="flex gap-1">
                                    <button onClick={() => setSelectedDept(dept)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setEditingDept(dept)} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(dept.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[32px]">{dept.description || 'No description provided.'}</p>

                            <div className="mt-auto pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Block</p>
                                    <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                        {dept.building || dept.location || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Head</p>
                                    <p className="text-sm font-bold text-gray-800 truncate">{dept.headId ? 'Assigned' : 'Not Assigned'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* View Modal */}
            {selectedDept && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                        <div className={`p-6 text-white bg-gradient-to-r from-emerald-500 to-teal-600`}>
                            <button onClick={() => setSelectedDept(null)} className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                            <h2 className="text-2xl font-bold">{selectedDept.name}</h2>
                            <p className="text-white/80">Code: {selectedDept.code}</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedDept.description}</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs text-gray-400 uppercase">Email</p><p className="text-sm font-bold">{selectedDept.email}</p></div>
                                <div><p className="text-xs text-gray-400 uppercase">Location</p><p className="text-sm font-bold">{selectedDept.location}</p></div>
                                <div><p className="text-xs text-gray-400 uppercase">Block / Building</p><p className="text-sm font-bold">{selectedDept.building || 'N/A'}</p></div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 text-right">
                            <button onClick={() => setSelectedDept(null)} className="px-6 py-2 bg-slate-800 text-white rounded-lg">Close</button>
                        </div>
                    </div>
                </div>
            )}
            {editingDept && (
                <DepartmentEditModal
                    department={editingDept}
                    onClose={() => setEditingDept(null)}
                    onSaved={fetchDepartments}
                />
            )}
        </div>
    );
};

export default BusinessDepartments;