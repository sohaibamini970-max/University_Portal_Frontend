import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/common/DataTable';
import { Plus, X, CheckCircle, Calendar, BookOpen } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const Batches = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear() + 4,
        isActive: true
    });

    const fetchBatches = async () => {
        try {
            const res = await api.get('/batches');
            setBatches(res.data);
        } catch (error) {
            console.error("Failed to fetch batches", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    const handleYearChange = (field, value) => {
        const year = parseInt(value) || 0;
        if (field === 'startYear') {
            setFormData({
                ...formData,
                startYear: year,
                endYear: year + 4,
                name: `${year}-${year + 4}`
            });
        } else {
            setFormData({
                ...formData,
                endYear: year,
                name: `${formData.startYear}-${year}`
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/batches', formData);

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setIsModalOpen(false);
                setFormData({
                    name: '',
                    startYear: new Date().getFullYear(),
                    endYear: new Date().getFullYear() + 4,
                    isActive: true
                });
                fetchBatches();
            }, 1500);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create batch");
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Batch Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{row.name}</p>
                        <p className="text-xs text-gray-500">Created: {new Date(row.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'duration',
            label: 'Duration',
            render: (row) => (
                <div className="text-sm font-medium text-gray-700">
                    {row.startYear} - {row.endYear}
                </div>
            )
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        }
    ];

    return (

            <div className="space-y-4 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Academic Batches</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Create batches and assign them to programs and courses.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Create Batch
                    </button>
                </div>

                {/* Table */}
                <DataTable columns={columns} data={batches} itemsPerPage={5} />

                {/* CREATE BATCH MODAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                            <div className="bg-slate-800 p-5 text-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold">Create New Batch</h2>
                                    <p className="text-slate-300 text-xs mt-0.5">Enter the batch details below.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                            </div>

                            {showSuccess ? (
                                <div className="p-8 text-center animate-in zoom-in-95">
                                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900">Batch Created!</h3>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Batch Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold"
                                            placeholder="e.g., 2024-2028"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Start Year</label>
                                            <input
                                                required
                                                type="number"
                                                value={formData.startYear}
                                                onChange={e => handleYearChange('startYear', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">End Year</label>
                                            <input
                                                required
                                                type="number"
                                                value={formData.endYear}
                                                onChange={e => handleYearChange('endYear', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                        <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md">Create Batch</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>

    );
};

export default Batches;