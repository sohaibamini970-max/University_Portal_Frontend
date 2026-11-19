import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import {
    DollarSign, Search, Loader2, AlertCircle, Clock,
    CheckCircle2, FileText, ChevronRight, Download
} from 'lucide-react';
import { api } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentFeeStatus = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeeStatus = async () => {
            try {
                const res = await api.get('/student-fees/my');
                setData(res.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError(err.response?.data?.message || 'No fee record found for your account.');
                } else {
                    setError(err.response?.data?.message || 'Failed to load fee status.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchFeeStatus();
    }, []);

    if (loading) {
        return (
            <Layout title="Fee Status" subtitle="Track your semester fees and payments">
                <div className="p-10 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            </Layout>
        );
    }

    if (error || !data) {
        return (
            <Layout title="Fee Status" subtitle="Track your semester fees and payments">
                <div className="max-w-lg mx-auto mt-10 bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-gray-900 mb-2">No Fee Record</h2>
                    <p className="text-sm text-gray-500">{error}</p>
                </div>
            </Layout>
        );
    }

    const { student, fee, installments } = data;

    // Status styling helper
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Paid':
                return { bg: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Paid / Cleared' };
            case 'Partial':
                return { bg: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'Partially Paid' };
            default:
                return { bg: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle, label: 'Pending / Unpaid' };
        }
    };

    const statusInfo = getStatusBadge(fee.paymentStatus);
    const StatusIcon = statusInfo.icon;

    // Check if installments exist
    const hasInstallments = installments && installments.length > 0;

    return (
        <Layout title="Fee Status" subtitle="Track your semester fees and payments">
            <div className="max-w-5xl mx-auto space-y-6 pb-8">

                {/* --- OVERVIEW CARD --- */}
                <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="bg-slate-800 p-6 md:p-8 text-white">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <p className="text-slate-300 font-semibold mb-1">{student.programName} — {student.batchName}</p>
                                <h1 className="text-3xl font-black">{fee.semesterName} Fee Record</h1>
                                <p className="text-sm text-slate-400 mt-2">Roll No: {student.rollNo}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold ${statusInfo.bg}`}>
                                <StatusIcon className="w-5 h-5" />
                                {statusInfo.label}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/50">
                        {/* Net Payable */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Net Semester Fee</p>
                            <p className="text-2xl font-black text-gray-900">PKR {Number(fee.netPayable).toLocaleString()}</p>
                        </div>

                        {/* Amount Paid */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Amount Paid</p>
                            <p className="text-2xl font-black text-emerald-600">PKR {Number(fee.paidAmount).toLocaleString()}</p>
                        </div>

                        {/* Pending */}
                        <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-sm bg-red-50/30">
                            <p className="text-sm font-bold text-red-500 uppercase tracking-wide mb-1">Amount Pending</p>
                            <p className="text-2xl font-black text-red-600">PKR {Number(fee.pendingAmount || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* --- INSTALLMENTS / BREAKDOWN --- */}
                <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            Payment Breakdown
                        </h2>
                        <button
                            onClick={() => navigate('/student/fee-voucher')}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                            View Full Voucher <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {hasInstallments ? (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500 mb-4">Your fee has been split into {installments.length} installments.</p>
                            {installments.map((inst) => {
                                const instStatus = getStatusBadge(inst.status);
                                const InstIcon = instStatus.icon;
                                return (
                                    <div key={inst.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${instStatus.bg}`}>
                                                <InstIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Installment {inst.installmentNumber}</p>
                                                <p className="text-xs text-gray-500">
                                                    Due: {new Date(inst.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 sm:mt-0 text-right">
                                            <p className="font-black text-gray-900">PKR {Number(inst.amount).toLocaleString()}</p>
                                            <p className={`text-xs font-bold ${inst.status === 'Paid' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {inst.status === 'Paid' ? 'Payment Received' : 'Awaiting Payment'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">Your fee is to be paid in full (no installments generated).</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-bold">
                                <div className="flex items-center gap-2 text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200">
                                    <span>Total:</span> PKR {Number(fee.netPayable).toLocaleString()}
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${fee.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    <span>Status:</span> {fee.paymentStatus}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- ACTION BANNER --- */}
                {fee.pendingAmount > 0 && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-orange-800">Payment Pending</h3>
                            <p className="text-sm text-orange-700 mt-1">Please clear your dues to enable Admit Card generation and avoid late fees.</p>
                        </div>
                        <button
                            onClick={() => navigate('/student/fee-voucher')}
                            className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-md hover:bg-orange-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            <Download className="w-4 h-4" /> Download Challan
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default StudentFeeStatus;