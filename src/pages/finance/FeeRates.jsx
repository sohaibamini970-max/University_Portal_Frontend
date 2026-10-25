import React, { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import { Search, Edit2, X, CheckCircle, Calculator, BookOpen } from 'lucide-react';

const FeeRates = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock Data: Programs and their fee breakdowns
    const [programs] = useState([
        {
            id: 1, code: 'BCS', name: 'BS Computer Science',
            tuition: 80000, lab: 15000, library: 5000, exam: 5000
        },
        {
            id: 2, code: 'BSE', name: 'BS Software Engineering',
            tuition: 85000, lab: 15000, library: 5000, exam: 5000
        },
        {
            id: 3, code: 'BBA', name: 'BS Business Administration',
            tuition: 70000, lab: 0, library: 5000, exam: 5000
        },
        {
            id: 4, code: 'MCS', name: 'MS Computer Science',
            tuition: 95000, lab: 20000, library: 5000, exam: 5000
        },
    ]);

    // Form State
    const [formData, setFormData] = useState({ tuition: 0, lab: 0, library: 0, exam: 0 });

    const handleOpenModal = (prog) => {
        setSelectedProgram(prog);
        setFormData({ tuition: prog.tuition, lab: prog.lab, library: prog.library, exam: prog.exam });
    };

    const handleSave = (e) => {
        e.preventDefault();
        // API call to update rates goes here
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setSelectedProgram(null);
        }, 1500);
    };

    const filteredData = programs.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            key: 'program',
            label: 'Program',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                        {row.code}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{row.name}</p>
                        <p className="text-xs text-gray-500">Program Code: {row.code}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'tuition',
            label: 'Tuition Fee',
            render: (row) => <span className="font-semibold text-gray-700">PKR {row.tuition.toLocaleString()}</span>
        },
        {
            key: 'lab',
            label: 'Lab Charges',
            render: (row) => <span className="font-semibold text-gray-700">PKR {row.lab.toLocaleString()}</span>
        },
        {
            key: 'total',
            label: 'Total Per Semester',
            render: (row) => {
                const total = row.tuition + row.lab + row.library + row.exam;
                return <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">PKR {total.toLocaleString()}</span>;
            }
        },
        {
            key: 'action',
            label: 'Action',
            render: (row) => (
                <button
                    onClick={() => handleOpenModal(row)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition-colors"
                >
                    <Edit2 className="w-3.5 h-3.5" />
                    Update Rates
                </button>
            )
        }
    ];

    // Live total calculation for the modal
    const liveTotal = formData.tuition + formData.lab + formData.library + formData.exam;

    return (
        <div className="space-y-4">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80 p-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by program name or code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            <DataTable columns={columns} data={filteredData} itemsPerPage={5} />

            {/* 👇 UPDATE RATES MODAL 👇 */}
            {selectedProgram && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                        <div className="bg-slate-800 p-5 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-lg font-bold">Fee Structure</h2>
                                <p className="text-slate-300 text-xs mt-0.5">{selectedProgram.name}</p>
                            </div>
                            <button onClick={() => setSelectedProgram(null)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {showSuccess ? (
                            <div className="p-8 text-center animate-in zoom-in-95">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Rates Updated!</h3>
                                <p className="text-sm text-gray-500 mt-1">The fee structure for {selectedProgram.code} has been saved.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">

                                {/* Tuition */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tuition Fee (PKR)</label>
                                    <input type="number" required value={formData.tuition} onChange={e => setFormData({ ...formData, tuition: Number(e.target.value) })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>

                                {/* Lab */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Lab / Equipment Fee (PKR)</label>
                                    <input type="number" required value={formData.lab} onChange={e => setFormData({ ...formData, lab: Number(e.target.value) })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Library */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Library Fee</label>
                                        <input type="number" required value={formData.library} onChange={e => setFormData({ ...formData, library: Number(e.target.value) })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    {/* Exam */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Exam Fee</label>
                                        <input type="number" required value={formData.exam} onChange={e => setFormData({ ...formData, exam: Number(e.target.value) })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                </div>

                                {/* Live Total */}
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex justify-between items-center mt-6">
                                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                                        <Calculator className="w-4 h-4" /> Total Per Semester:
                                    </div>
                                    <div className="text-xl font-black text-emerald-700">
                                        PKR {liveTotal.toLocaleString()}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3 border-t border-gray-100">
                                    <button type="button" onClick={() => setSelectedProgram(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md">Save Rates</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeRates;