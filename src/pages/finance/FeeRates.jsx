import React, { useState, useEffect } from 'react';
import {
    Search, X, CheckCircle, Calculator, Edit2, Trash2,
    ToggleLeft, ToggleRight, Eye, EyeOff, Loader2
} from 'lucide-react';
import { api } from '../../context/AuthContext';

const emptyForm = {
    creditHourFee: 0,
    admissionFee: 0,
    registrationFee: 0,
    labFee: 0,
    activityFee: 0,
    examFee: 0,
    otherFee: 0,
    feeDueDate: ''
};

const ITEMS_PER_PAGE = 8;

const FeeRates = () => {
    const [rates, setRates] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [formData, setFormData] = useState(emptyForm);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [togglingProgramId, setTogglingProgramId] = useState(null); // in-flight toggle

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [ratesRes, progRes, batchRes] = await Promise.all([
                api.get('/fee-structures'),
                api.get('/programs'),
                api.get('/batches')
            ]);
            setRates(ratesRes.data ?? []);
            setPrograms(progRes.data ?? []);
            setBatches(batchRes.data ?? []);
        } catch (err) {
            console.error('[FeeRates] fetch failed:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);
    useEffect(() => { setCurrentPage(1); }, [searchQuery]);

    const handleGenerate = async (row) => {
        if (!window.confirm(`Generate fee records for ${row.programName} / ${row.batchName}?`)) return;
        try {
            const res = await api.post('/student-fees/generate', {
                programId: row.programId,
                batchId: row.batchId,
                semesterId: 1
            });
            alert(res.data.message);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to generate fees.');
        }
    };

    const openModalForExisting = (row) => {
        setSelectedRow(row);
        setSelectedProgram(row.programId);
        setSelectedBatch(row.batchId);
        setFormData({
            creditHourFee: row.creditHourFee,
            admissionFee: row.admissionFee,
            registrationFee: row.registrationFee,
            labFee: row.labFee,
            activityFee: row.activityFee,
            examFee: row.examFee,
            otherFee: row.otherFee,
            feeDueDate: row.feeDueDate || '',
        });
    };

    // ---------- Voucher toggle (per program, confirmed) ----------
    const handleToggleVoucher = async (row, willEnable) => {
        const verb = willEnable ? 'ENABLE' : 'DISABLE';
        const msg = willEnable
            ? `Enable fee voucher for ${row.programName}?\n\nStudents in this program will now SEE the fee voucher on their portal.`
            : `Disable fee voucher for ${row.programName}?\n\nStudents will NO LONGER see the fee voucher on their portal.`;
        if (!window.confirm(`${verb} voucher — ${msg}`)) return;

        setTogglingProgramId(row.programId);

        // optimistic update
        setRates(prev => prev.map(r =>
            r.programId === row.programId ? { ...r, feeVoucherEnabled: willEnable } : r
        ));

        try {
            await api.put(`/programs/${row.programId}/fee-voucher`, { enabled: willEnable });
        } catch (err) {
            // rollback
            setRates(prev => prev.map(r =>
                r.programId === row.programId ? { ...r, feeVoucherEnabled: !willEnable } : r
            ));
            alert(err.response?.data?.message || 'Failed to update voucher visibility.');
        } finally {
            setTogglingProgramId(null);
        }
    };

    const handleDelete = async (row) => {
        if (!window.confirm(`Delete the fee structure for ${row.programName} / ${row.batchName}?\n\nThis will not delete existing student fee records.`)) return;
        try {
            await api.delete(`/fee-structures/${row.id}`);
            setRates(prev => prev.filter(r => r.id !== row.id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete fee structure.');
        }
    };

    const openModalForNew = () => {
        setSelectedRow({});
        setSelectedProgram(programs[0]?.id ?? '');
        setSelectedBatch(batches[0]?.id ?? '');
        setFormData(emptyForm);
    };

    const closeModal = () => {
        if (submitting) return;
        setSelectedRow(null);
        setShowSuccess(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            await api.post('/fee-structures', {
                programId: Number(selectedProgram),
                batchId: Number(selectedBatch),
                creditHourFee: Number(formData.creditHourFee),
                admissionFee: Number(formData.admissionFee),
                registrationFee: Number(formData.registrationFee),
                labFee: Number(formData.labFee),
                activityFee: Number(formData.activityFee),
                examFee: Number(formData.examFee),
                otherFee: Number(formData.otherFee),
                feeDueDate: formData.feeDueDate || null,
            });

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setSelectedRow(null);
                fetchAll();
            }, 1200);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save rates.');
        } finally {
            setSubmitting(false);
        }
    };

    // ---------- Filter + Pagination ----------
    const q = searchQuery.toLowerCase();
    const filteredData = rates.filter(r =>
        (r.programName ?? '').toLowerCase().includes(q) ||
        (r.programCode ?? '').toLowerCase().includes(q) ||
        (r.batchName ?? '').toLowerCase().includes(q)
    );

    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
    const pageRows = filteredData.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const livePerSemester =
        Number(formData.registrationFee) +
        Number(formData.labFee) +
        Number(formData.activityFee) +
        Number(formData.examFee) +
        Number(formData.otherFee);

    const fmtPKR = (n) => `PKR ${Number(n || 0).toLocaleString()}`;

    if (loading) return <div className="text-center py-10 text-gray-500">Loading fee rates...</div>;

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by program or batch..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <button
                    onClick={openModalForNew}
                    className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md"
                >
                    + Set New Program Rates
                </button>
            </div>

            {/* Table — trimmed to essential columns */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-800 text-slate-100 text-xs font-bold uppercase tracking-wider">
                                <th className="px-5 py-4">Program / Batch</th>
                                <th className="px-5 py-4 text-right">Credit Hour</th>
                                <th className="px-5 py-4 text-right">Admission</th>
                                <th className="px-5 py-4 text-center">Deadline</th>
                                <th className="px-5 py-4 text-center">Voucher Visibility</th>
                                <th className="px-5 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pageRows.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 text-sm">
                                        No fee structures found.
                                    </td>
                                </tr>
                            ) : (
                                pageRows.map((row, idx) => {
                                    const isEnabled = row.feeVoucherEnabled === true || row.feeVoucherEnabled === 1;
                                    const isBusy = togglingProgramId === row.programId;
                                    return (
                                        <tr key={row.id ?? idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            {/* Program / Batch */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                                                        {row.programCode}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-gray-900 text-sm truncate">{row.programName}</p>
                                                        <p className="text-xs text-gray-500 truncate">{row.batchName}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-right font-semibold text-gray-800">
                                                {fmtPKR(row.creditHourFee)}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-right text-gray-700">
                                                {fmtPKR(row.admissionFee)}
                                            </td>

                                            {/* Deadline */}
                                            <td className="px-5 py-4 text-center">
                                                {row.feeDueDate ? (
                                                    <span className="inline-block text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                                                        {new Date(row.feeDueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Not set</span>
                                                )}
                                            </td>

                                            {/* Voucher toggle — explicit ON/OFF with confirm */}
                                            <td className="px-5 py-4">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => !isBusy && handleToggleVoucher(row, !isEnabled)}
                                                        disabled={isBusy}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isEnabled
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                                : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                                            } ${isBusy ? 'opacity-60 cursor-wait' : ''}`}
                                                        title={isEnabled
                                                            ? 'Voucher is visible to students — click to hide'
                                                            : 'Voucher is hidden — click to show to students'}
                                                    >
                                                        {isBusy ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : isEnabled ? (
                                                            <Eye className="w-4 h-4" />
                                                        ) : (
                                                            <EyeOff className="w-4 h-4" />
                                                        )}
                                                        <span className="w-7 text-left">
                                                            {isEnabled ? 'ON' : 'OFF'}
                                                        </span>
                                                        {!isBusy && (isEnabled
                                                            ? <ToggleRight className="w-4 h-4" />
                                                            : <ToggleLeft className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4">
                                                <div className="flex justify-center gap-1.5">
                                                    <button
                                                        onClick={() => openModalForExisting(row)}
                                                        title="Manage rates"
                                                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" /> Manage
                                                    </button>
                                                    <button
                                                        onClick={() => handleGenerate(row)}
                                                        title="Generate student fee records"
                                                        className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
                                                    >
                                                        <Calculator className="w-3.5 h-3.5" /> Generate
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(row)}
                                                        title="Delete rate structure"
                                                        className="flex items-center gap-1 px-2.5 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredData.length > 0 && (
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Showing <strong>{startIdx + 1}</strong>–<strong>{Math.min(startIdx + ITEMS_PER_PAGE, filteredData.length)}</strong> of <strong>{filteredData.length}</strong>
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm font-semibold text-gray-700">
                                Page {safePage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={safePage === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedRow && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-4 pt-24">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                            <div className="bg-slate-800 p-5 text-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold">Fee Structure</h2>
                                    <p className="text-slate-300 text-xs mt-0.5">
                                        {selectedRow.programName || 'New program'} — {selectedRow.batchName || 'New batch'}
                                    </p>
                                </div>
                                <button onClick={closeModal} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {showSuccess ? (
                                <div className="p-8 text-center">
                                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900">Rates Saved!</h3>
                                </div>
                            ) : (
                                <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Program</label>
                                            <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)} required className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                                <option value="">Select program</option>
                                                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch</label>
                                            <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} required className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                                <option value="">Select batch</option>
                                                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Credit Hour Fee (PKR)</label>
                                        <input type="number" min="0" required value={formData.creditHourFee} onChange={e => setFormData({ ...formData, creditHourFee: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Admission Fee (1st semester only)</label>
                                        <input type="number" min="0" required value={formData.admissionFee} onChange={e => setFormData({ ...formData, admissionFee: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fee Deadline Date</label>
                                        <input type="date" value={formData.feeDueDate} onChange={e => setFormData({ ...formData, feeDueDate: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            ['registrationFee', 'Registration Fee'],
                                            ['labFee', 'Lab Fee'],
                                            ['activityFee', 'Activity Fee'],
                                            ['examFee', 'Exam Fee'],
                                            ['otherFee', 'Other Fee']
                                        ].map(([key, label]) => (
                                            <div key={key}>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
                                                <input type="number" min="0" required value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                                            <Calculator className="w-4 h-4" /> Flat fees per semester:
                                        </div>
                                        <div className="text-xl font-black text-emerald-700">PKR {livePerSemester.toLocaleString()}</div>
                                    </div>

                                    <div className="pt-4 flex gap-3 border-t border-gray-100">
                                        <button type="button" onClick={closeModal} disabled={submitting} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                        <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md disabled:opacity-60">
                                            {submitting ? 'Saving...' : 'Save Rates'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeRates;