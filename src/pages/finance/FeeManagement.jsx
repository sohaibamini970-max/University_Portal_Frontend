import React, { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import {
    Search, DollarSign, X, CheckCircle, Receipt,
    Ticket, ShieldCheck, ShieldAlert
} from 'lucide-react';

const FeeManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock Data: Added 'admitCardEnabled' boolean
    const [students] = useState([
        {
            id: 1, name: 'Ali Raza', rollNo: 'ADM-2025-001', program: 'BS Computer Science',
            baseFee: 120000, discount: 0, reason: '', status: 'Unpaid', admitCardEnabled: false
        },
        {
            id: 2, name: 'Sara Khan', rollNo: 'ADM-2025-002', program: 'BS Software Engineering',
            baseFee: 110000, discount: 25000, reason: 'Merit Scholarship', status: 'Paid', admitCardEnabled: true
        },
        {
            id: 3, name: 'Usman Ahmed', rollNo: 'ADM-2025-003', program: 'BS Business Admin',
            baseFee: 90000, discount: 10000, reason: 'Need-Based Grant', status: 'Unpaid', admitCardEnabled: false
        },
    ]);

    // Form State
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountReason, setDiscountReason] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('Unpaid');
    const [admitCardEnabled, setAdmitCardEnabled] = useState(false);

    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        setDiscountAmount(student.discount);
        setDiscountReason(student.reason);
        setPaymentStatus(student.status);
        setAdmitCardEnabled(student.admitCardEnabled);
    };

    const handleSave = (e) => {
        e.preventDefault();
        // API call to update fee, status, and admitCardEnabled
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setSelectedStudent(null);
        }, 1500);
    };

    const filteredData = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            key: 'name',
            label: 'Student Info',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {row.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.rollNo}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'fee',
            label: 'Payable Amount',
            render: (row) => {
                const finalFee = row.baseFee - row.discount;
                return (
                    <div>
                        <p className="font-bold text-gray-900">PKR {finalFee.toLocaleString()}</p>
                        {row.discount > 0 && (
                            <p className="text-xs text-red-500 line-through">PKR {row.baseFee.toLocaleString()}</p>
                        )}
                    </div>
                );
            }
        },
        {
            key: 'status',
            label: 'Fee Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            key: 'admitCard',
            label: 'Admit Card',
            render: (row) => (
                <div className="flex items-center gap-1.5">
                    {row.admitCardEnabled ? (
                        <>
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-700">Enabled</span>
                        </>
                    ) : (
                        <>
                            <ShieldAlert className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-bold text-gray-500">Disabled</span>
                        </>
                    )}
                </div>
            )
        },
        {
            key: 'action',
            label: 'Action',
            render: (row) => (
                <button
                    onClick={() => handleOpenModal(row)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition-colors"
                >
                    <DollarSign className="w-3.5 h-3.5" />
                    Manage Fee
                </button>
            )
        }
    ];

    return (
        <div className="space-y-4">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
                <div className="relative w-full sm:w-80 p-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search student..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            <DataTable columns={columns} data={filteredData} itemsPerPage={5} />

            {/* 👇 MANAGE FEE MODAL 👇 */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">

                        <div className="bg-slate-800 p-5 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-lg font-bold">Manage Fee</h2>
                                <p className="text-slate-300 text-xs mt-0.5">{selectedStudent.name} • {selectedStudent.rollNo}</p>
                            </div>
                            <button onClick={() => setSelectedStudent(null)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {showSuccess ? (
                            <div className="p-8 text-center animate-in zoom-in-95">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Saved!</h3>
                                <p className="text-sm text-gray-500 mt-1">Fee details and Admit Card status updated.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">

                                {/* Base Fee */}
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                                        <Receipt className="w-4 h-4" /> Base Fee
                                    </div>
                                    <div className="font-bold text-gray-900">PKR {selectedStudent.baseFee.toLocaleString()}</div>
                                </div>

                                {/* Discount Input */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Discount / Scholarship (PKR)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            max={selectedStudent.baseFee}
                                            value={discountAmount}
                                            onChange={(e) => setDiscountAmount(Number(e.target.value))}
                                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Reason */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Reason</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Merit Scholarship"
                                        value={discountReason}
                                        onChange={(e) => setDiscountReason(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>

                                {/* Payment Status */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Payment Status</label>
                                    <select
                                        value={paymentStatus}
                                        onChange={(e) => {
                                            setPaymentStatus(e.target.value);
                                            // Auto-disable admit card if marked unpaid
                                            if (e.target.value === 'Unpaid') setAdmitCardEnabled(false);
                                        }}
                                        className={`w-full px-3 py-2.5 border rounded-xl text-sm font-bold outline-none cursor-pointer ${paymentStatus === 'Paid'
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                : 'bg-red-50 border-red-200 text-red-700'
                                            }`}
                                    >
                                        <option value="Unpaid">Unpaid</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                </div>

                                {/* 👇 NEW: Admit Card Toggle 👇 */}
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${admitCardEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'
                                                }`}>
                                                <Ticket className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Admit Card</p>
                                                <p className="text-[11px] font-medium text-gray-500">
                                                    {admitCardEnabled ? 'Student can download' : 'Blocked for student'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Custom Toggle Switch */}
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={admitCardEnabled}
                                                onChange={(e) => setAdmitCardEnabled(e.target.checked)}
                                                disabled={paymentStatus === 'Unpaid'}
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
                                        </label>
                                    </div>
                                    {paymentStatus === 'Unpaid' && (
                                        <p className="text-[10px] text-red-500 font-bold mt-2 text-right">
                                            * Mark fee as Paid to enable
                                        </p>
                                    )}
                                </div>

                                {/* Live Calculation */}
                                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex justify-between items-center">
                                    <div className="text-sm font-bold text-indigo-800">Final Payable:</div>
                                    <div className="text-xl font-black text-indigo-700">
                                        PKR {Math.max(0, selectedStudent.baseFee - discountAmount).toLocaleString()}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setSelectedStudent(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md">Save Updates</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeManagement;