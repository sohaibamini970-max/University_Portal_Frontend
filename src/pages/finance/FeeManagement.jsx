import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '../../components/common/DataTable';
import {
    Search, DollarSign, X, CheckCircle,
    Ticket, ShieldCheck, ShieldAlert, Loader2,
    ChevronLeft, ChevronRight, Calculator, CreditCard
} from 'lucide-react';
import { api } from '../../context/AuthContext';

const PAGE_SIZE = 10;

const FeeManagement = () => {
    const [students, setStudents] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Modal State
    const [selectedFee, setSelectedFee] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountReason, setDiscountReason] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('Unpaid');
    const [admitCardEnabled, setAdmitCardEnabled] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Installments State
    const [installments, setInstallments] = useState([]);
    const [installmentCount, setInstallmentCount] = useState(2);
    const [generatingInstallments, setGeneratingInstallments] = useState(false);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => { setSearch(searchInput.trim()); setPage(1); }, 400);
        return () => clearTimeout(t);
    }, [searchInput]);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(PAGE_SIZE),
                search
            });
            const res = await api.get(`/student-fees?${params}`);
            setStudents(res.data.items ?? []);
            setTotal(res.data.total ?? 0);
            setTotalPages(Math.max(1, res.data.totalPages ?? 1));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load fee records.');
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    // 👇 Unified openModal that loads installments
    const openModal = async (row) => {
        setSelectedFee(row);
        setDiscountAmount(Number(row.discountAmount) || 0);
        setDiscountReason(row.discountReason || '');
        setPaymentStatus(row.paymentStatus);
        setAdmitCardEnabled(row.admitCardEnabled);
        setShowSuccess(false);
        setInstallments([]);

        try {
            const res = await api.get(`/fee-installments/student-fee/${row.id}`);
            setInstallments(res.data ?? []);
        } catch (err) {
            console.error('Failed to load installments:', err);
        }
    };

    const closeModal = () => {
        if (submitting) return;
        setSelectedFee(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!selectedFee || submitting) return;
        setSubmitting(true);
        try {
            await api.put(`/student-fees/${selectedFee.id}`, {
                discountAmount: Number(discountAmount),
                discountReason: discountReason.trim() || null,
                paymentStatus,
                admitCardEnabled: paymentStatus === 'Paid' ? admitCardEnabled : false
            });
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setSelectedFee(null);
                fetchStudents();
            }, 1200);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update fee.');
        } finally {
            setSubmitting(false);
        }
    };

    // Installments Handlers
    const handleGenerateInstallments = async () => {
        const n = parseInt(installmentCount);
        if (isNaN(n) || n < 2 || n > 6) {
            alert('Installment count must be between 2 and 6.');
            return;
        }
        setGeneratingInstallments(true);
        try {
            await api.post(`/fee-installments/student-fee/${selectedFee.id}/generate`, {
                count: n,
                firstDueDateOffsetDays: 30
            });
            const res = await api.get(`/fee-installments/student-fee/${selectedFee.id}`);
            setInstallments(res.data ?? []);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create installments.');
        } finally {
            setGeneratingInstallments(false);
        }
    };

    const handleMarkInstallmentPaid = async (inst, paid) => {
        try {
            await api.put(`/fee-installments/${inst.id}/mark-paid`, { paid });
            const res = await api.get(`/fee-installments/student-fee/${selectedFee.id}`);
            setInstallments(res.data ?? []);
            // Refresh the parent fee row to sync payment_status
            fetchStudents();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update installment.');
        }
    };

    const handleDeleteInstallments = async () => {
        if (!window.confirm('Delete all installments for this student? This cannot be undone.')) return;
        try {
            await api.delete(`/fee-installments/student-fee/${selectedFee.id}`);
            setInstallments([]);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete installments.');
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Student Info',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {(row.fullName || '?').charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{row.fullName}</p>
                        <p className="text-xs text-gray-500">{row.rollNo}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'fee',
            label: 'Payable Amount',
            render: (row) => (
                <div>
                    <p className="font-bold text-gray-900">PKR {Number(row.netPayable).toLocaleString()}</p>
                    {Number(row.discountAmount) > 0 && (
                        <p className="text-xs text-red-500 line-through">PKR {Number(row.grossTotal).toLocaleString()}</p>
                    )}
                </div>
            )
        },
        {
            key: 'status',
            label: 'Fee Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.paymentStatus === 'Paid'
                    ? 'bg-emerald-100 text-emerald-700'
                    : row.paymentStatus === 'Partial'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                    {row.paymentStatus}
                </span>
            )
        },
        {
            key: 'admitCard',
            label: 'Admit Card',
            render: (row) => (
                <div className="flex items-center gap-1.5">
                    {row.admitCardEnabled ? (
                        <><ShieldCheck className="w-4 h-4 text-emerald-600" /><span className="text-xs font-bold text-emerald-700">Enabled</span></>
                    ) : (
                        <><ShieldAlert className="w-4 h-4 text-gray-400" /><span className="text-xs font-bold text-gray-500">Disabled</span></>
                    )}
                </div>
            )
        },
        {
            key: 'action',
            label: 'Action',
            render: (row) => (
                <button
                    onClick={() => openModal(row)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900"
                >
                    <DollarSign className="w-3.5 h-3.5" /> Manage Fee
                </button>
            )
        }
    ];

    return (
        <div className="space-y-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, roll no, or email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <p className="text-sm text-gray-500">{total} record{total !== 1 ? 's' : ''}</p>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
                    ) : students.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">No fee records found.</div>
                    ) : (
                        <DataTable columns={columns} data={students} itemsPerPage={PAGE_SIZE} />
                    )}
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
                    <div className="flex gap-2">
                        <button disabled={page <= 1 || loading} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                        <button disabled={page >= totalPages || loading} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            {selectedFee && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-4 pt-24">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                            <div className="bg-slate-800 p-5 text-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold">Manage Fee</h2>
                                    <p className="text-slate-300 text-xs mt-0.5">{selectedFee.fullName} • {selectedFee.rollNo}</p>
                                </div>
                                <button onClick={closeModal} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                            </div>

                            {showSuccess ? (
                                <div className="p-8 text-center">
                                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900">Saved!</h3>
                                </div>
                            ) : (
                                <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-1.5 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-500">Credit Hours</span><span className="font-bold">{selectedFee.creditHoursTaken}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Credit Hour Fee</span><span className="font-semibold">PKR {Number(selectedFee.creditHourFee).toLocaleString()}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Admission Fee</span><span className="font-semibold">PKR {Number(selectedFee.admissionFee).toLocaleString()}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Registration / Lab / Activity / Exam / Other</span><span className="font-semibold">PKR {(Number(selectedFee.registrationFee) + Number(selectedFee.labFee) + Number(selectedFee.activityFee) + Number(selectedFee.examFee) + Number(selectedFee.otherFee)).toLocaleString()}</span></div>
                                        <div className="flex justify-between pt-1.5 border-t border-gray-200"><span className="font-bold text-gray-700">Gross Total</span><span className="font-black text-gray-900">PKR {Number(selectedFee.grossTotal).toLocaleString()}</span></div>
                                    </div>

                                    {/* 1. Discount */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Discount / Scholarship (PKR)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input type="number" min="0" max={selectedFee.grossTotal} value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Reason</label>
                                        <input type="text" placeholder="e.g., Merit Scholarship" value={discountReason} onChange={(e) => setDiscountReason(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                                    </div>

                                    {/* 2. Payment Status */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Payment Status</label>
                                        <select
                                            value={paymentStatus}
                                            onChange={(e) => {
                                                setPaymentStatus(e.target.value);
                                                if (e.target.value !== 'Paid') setAdmitCardEnabled(false);
                                            }}
                                            className={`w-full px-3 py-2.5 border rounded-xl text-sm font-bold ${paymentStatus === 'Paid'
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                : 'bg-red-50 border-red-200 text-red-700'
                                                }`}
                                        >
                                            <option value="Unpaid">Unpaid</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </div>

                                    {/* 3. Installments */}
                                    <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" /> Installments
                                            </h4>
                                            {installments.length > 0 && (
                                                <span className="text-xs font-bold text-gray-500">
                                                    {installments.filter(i => i.status === 'Paid').length}/{installments.length} paid
                                                </span>
                                            )}
                                        </div>

                                        {installments.length === 0 ? (
                                            <div className="space-y-2">
                                                <p className="text-xs text-gray-500">
                                                    No installments set. Split the final payable into parts below.
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="2"
                                                        max="6"
                                                        value={installmentCount}
                                                        onChange={(e) => setInstallmentCount(e.target.value)}
                                                        className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                                                        placeholder="2–6"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleGenerateInstallments}
                                                        disabled={generatingInstallments}
                                                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                                    >
                                                        {generatingInstallments ? 'Creating...' : `Create ${installmentCount} Installments`}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1.5">
                                                {installments.map((inst) => (
                                                    <div
                                                        key={inst.id}
                                                        className={`flex items-center justify-between p-2 rounded-lg border ${inst.status === 'Paid'
                                                            ? 'bg-emerald-50 border-emerald-200'
                                                            : 'bg-white border-gray-200'
                                                            }`}
                                                    >
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-800">
                                                                #{inst.installmentNumber} — PKR {Number(inst.amount).toLocaleString()}
                                                            </p>
                                                            <p className="text-[10px] text-gray-500">
                                                                Due: {new Date(inst.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                {inst.paidDate && ` · Paid: ${new Date(inst.paidDate).toLocaleDateString('en-GB')}`}
                                                            </p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={inst.status === 'Paid'}
                                                                onChange={(e) => handleMarkInstallmentPaid(inst, e.target.checked)}
                                                            />
                                                            <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                                        </label>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={handleDeleteInstallments}
                                                    className="text-xs text-red-600 font-bold hover:underline mt-2"
                                                >
                                                    Remove all installments
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* 4. Admit Card */}
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${admitCardEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                                                <Ticket className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Admit Card</p>
                                                <p className="text-[11px] text-gray-500">{admitCardEnabled ? 'Student can download' : 'Blocked for student'}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={admitCardEnabled} onChange={(e) => setAdmitCardEnabled(e.target.checked)} disabled={paymentStatus !== 'Paid'} />
                                            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
                                        </label>
                                    </div>

                                    {/* 5. Final Live Calculation */}
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-sm font-bold text-indigo-800"><Calculator className="w-4 h-4" /> Final Payable:</div>
                                        <div className="text-xl font-black text-indigo-700">
                                            PKR {Math.max(0, Number(selectedFee.grossTotal) - Number(discountAmount || 0)).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3 border-t border-gray-100">
                                        <button type="button" onClick={closeModal} disabled={submitting} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                        <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md disabled:opacity-60">
                                            {submitting ? 'Saving...' : 'Save Updates'}
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

export default FeeManagement;