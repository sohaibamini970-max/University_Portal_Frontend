import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import {
    DollarSign, Download, Eye, EyeOff, CheckCircle, Clock, AlertCircle,
    Landmark, ReceiptText, Loader2, Scissors, User, Building
} from 'lucide-react';
import { api } from '../../../context/AuthContext';

// Safely formats "YYYY-MM-DD" (or ISO string) to "15 Jan 2026" without timezone shift
const formatDeadline = (value) => {
    if (!value) return null;
    const str = String(value);
    const m = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) {
        const d = new Date(value);
        if (isNaN(d.getTime())) return null;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    const [, y, mo, da] = m.map(Number);
    const date = new Date(y, mo - 1, da); // local midnight — no UTC shift
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const FeeVoucher = () => {
    const [showPreview, setShowPreview] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFee = async () => {
            try {
                const res = await api.get('/student-fees/my');
                setData(res.data);
                setShowPreview(true);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError(err.response?.data?.message || 'No fee voucher has been generated for your account yet.');
                } else {
                    setError(err.response?.data?.message || 'Failed to load fee voucher.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchFee();
    }, []);

    const handleDownload = () => {
        if (!data) return;
        window.print();
    };

    const statusStyle = (s) => {
        if (s === 'Paid') return { bg: 'bg-emerald-100 text-emerald-700', icon: CheckCircle };
        if (s === 'Partial') return { bg: 'bg-amber-100 text-amber-700', icon: Clock };
        return { bg: 'bg-red-100 text-red-700', icon: AlertCircle };
    };

    if (loading) {
        return (
            <Layout title="Fee Voucher" subtitle="Download and manage your fee vouchers">
                <div className="p-10 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            </Layout>
        );
    }

    if (error || !data) {
        return (
            <Layout title="Fee Voucher" subtitle="Download and manage your fee vouchers">
                <div className="max-w-lg mx-auto mt-10 bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-gray-900 mb-2">No Fee Voucher Available</h2>
                    <p className="text-sm text-gray-500">{error || 'Please contact the finance office.'}</p>
                </div>
            </Layout>
        );
    }

    const { student, fee, installments } = data;
    const status = statusStyle(fee.paymentStatus);
    const StatusIcon = status.icon;

    // Safe deadline formatting (no UTC shift)
    const formattedDeadline = formatDeadline(fee.feeDueDate);

    // Calculate what they need to pay RIGHT NOW
    const unpaidInstallments = installments?.filter(i => i.status !== 'Paid') || [];
    const nextInstallment = unpaidInstallments.length > 0 ? unpaidInstallments[0] : null;

    const currentPayableAmount = nextInstallment ? Number(nextInstallment.amount) : Number(fee.netPayable || 0);
    const currentPayableLabel = nextInstallment ? `Installment ${nextInstallment.installmentNumber} of ${installments.length}` : 'Full Semester Fee';

    // Build the line items that actually have a non-zero amount
    const feeLines = [
        {
            title: `Tuition Fee (${fee.creditHoursTaken || 0} credit hours × PKR ${Number(fee.creditHourFee || 0).toLocaleString()})`,
            amount: fee.creditHoursTotal || 0
        },
        fee.admissionFee > 0 && { title: 'Admission Fee (1st semester)', amount: fee.admissionFee },
        fee.registrationFee > 0 && { title: 'Registration Fee', amount: fee.registrationFee },
        fee.labFee > 0 && { title: 'Lab / Equipment Fee', amount: fee.labFee },
        fee.activityFee > 0 && { title: 'Student Activity Fee', amount: fee.activityFee },
        fee.examFee > 0 && { title: 'Examination Fee', amount: fee.examFee },
        fee.otherFee > 0 && { title: 'Other Charges', amount: fee.otherFee }
    ].filter(Boolean);

    return (
        <Layout title="Fee Voucher" subtitle="Download and manage your fee vouchers">
            <div className="space-y-6 pb-8">

                {/* Control panel (hidden on print) */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg">
                            <DollarSign className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {fee.semesterName} Fee Challan
                            </h2>

                            <p className="text-sm font-semibold text-gray-500 mt-1">
                                {currentPayableLabel}:
                            </p>
                            <p className="text-2xl font-black text-red-600 mt-0.5">
                                PKR {currentPayableAmount.toLocaleString()}
                            </p>
                            {formattedDeadline && (
                                <p className="text-xs font-bold text-red-500 mt-1">
                                    Due Date: {formattedDeadline}
                                </p>
                            )}

                            <span className={`inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded text-xs font-bold ${status.bg}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                Semester Status: {fee.paymentStatus}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-xl font-bold text-sm transition-colors"
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showPreview ? 'Hide Preview' : 'Preview Voucher'}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-orange-600 text-white hover:bg-orange-700 rounded-xl font-bold text-sm shadow-md transition-colors"
                        >
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>
                </div>

                {showPreview && (
                    <div className="bg-white border border-gray-300 rounded-xl shadow-xl overflow-hidden print:border-0 print:shadow-none print:block animate-in fade-in slide-in-from-top-4 duration-300">

                        {/* PRINT STYLES: Force A4, hide non-voucher UI, preserve colors */}
                        <style type="text/css" media="print">
                            {`
                                @page { 
                                    size: A4 portrait; 
                                    margin: 5mm;
                                }
                                body * { visibility: hidden; }
                                .printable-area, .printable-area * { visibility: visible; }
                                .printable-area { 
                                    position: absolute; 
                                    left: 0; 
                                    top: 0; 
                                    width: 100%;
                                    padding: 0 !important;
                                    -webkit-print-color-adjust: exact !important;
                                    print-color-adjust: exact !important;
                                }
                                .no-print { display: none !important; }
                                .voucher-copy { 
                                    page-break-inside: avoid; 
                                    break-inside: avoid; 
                                }
                                .cut-line { margin: 4px 0 !important; }
                            `}
                        </style>

                        <div className="printable-area p-4 md:p-8 space-y-4">

                            {/* ===================== 1. BANK COPY ===================== */}
                            <div className="voucher-copy border border-slate-400 rounded-md p-3 relative">
                                <div className="absolute -top-[1px] -right-[1px] bg-slate-200 text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded-bl-md border-b border-l border-slate-400 flex items-center gap-1">
                                    <Landmark className="w-2.5 h-2.5" /> BANK COPY
                                </div>
                                <VoucherContent
                                    fee={fee}
                                    student={student}
                                    feeLines={feeLines}
                                    formattedDeadline={formattedDeadline}
                                    currentPayableAmount={currentPayableAmount}
                                    currentPayableLabel={currentPayableLabel}
                                />
                            </div>

                            <div className="cut-line flex items-center justify-center gap-2 text-slate-400 my-2">
                                <Scissors className="w-3 h-3" /> <span className="text-[9px] tracking-widest uppercase font-bold">Cut Here</span> <Scissors className="w-3 h-3" />
                            </div>

                            {/* ===================== 2. STUDENT COPY ===================== */}
                            <div className="voucher-copy border border-slate-400 rounded-md p-3 relative">
                                <div className="absolute -top-[1px] -right-[1px] bg-slate-200 text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded-bl-md border-b border-l border-slate-400 flex items-center gap-1">
                                    <User className="w-2.5 h-2.5" /> STUDENT COPY
                                </div>
                                <VoucherContent
                                    fee={fee}
                                    student={student}
                                    feeLines={feeLines}
                                    formattedDeadline={formattedDeadline}
                                    currentPayableAmount={currentPayableAmount}
                                    currentPayableLabel={currentPayableLabel}
                                />
                            </div>

                            <div className="cut-line flex items-center justify-center gap-2 text-slate-400 my-2">
                                <Scissors className="w-3 h-3" /> <span className="text-[9px] tracking-widest uppercase font-bold">Cut Here</span> <Scissors className="w-3 h-3" />
                            </div>

                            {/* ===================== 3. UNIVERSITY COPY ===================== */}
                            <div className="voucher-copy border border-slate-400 rounded-md p-3 relative">
                                <div className="absolute -top-[1px] -right-[1px] bg-slate-200 text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded-bl-md border-b border-l border-slate-400 flex items-center gap-1">
                                    <Building className="w-2.5 h-2.5" /> UNIVERSITY COPY
                                </div>
                                <VoucherContent
                                    fee={fee}
                                    student={student}
                                    feeLines={feeLines}
                                    formattedDeadline={formattedDeadline}
                                    currentPayableAmount={currentPayableAmount}
                                    currentPayableLabel={currentPayableLabel}
                                />
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

const VoucherContent = ({ fee, student, feeLines, formattedDeadline, currentPayableAmount, currentPayableLabel }) => (
    <div>
        {/* 🔴 PROMINENT DEADLINE BANNER — visible on every copy */}
        {formattedDeadline && (
            <div className="mb-2 flex items-center justify-between rounded-md bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1.5 shadow-sm border border-red-700">
                <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                        Payment Deadline
                    </span>
                </div>
                <span className="text-xs font-black tracking-wide">
                    {formattedDeadline}
                </span>
            </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-2">
            <div className="text-left">
                <h1 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    University of Technology
                </h1>
                <p className="text-[10px] font-bold text-slate-600">Fee Payment Challan</p>
                <p className="text-[9px] font-bold text-slate-500">{fee.semesterName} Semester</p>
            </div>
            <div className="text-right">
                <p className="text-[8px] font-bold text-slate-500 uppercase">Challan No</p>
                <p className="text-xs font-black text-red-600">INV-{String(fee.id).padStart(6, '0')}</p>
                {!formattedDeadline && (
                    <p className="text-[9px] font-bold text-slate-500">
                        Generated: {formatDeadline(fee.generatedAt) || '—'}
                    </p>
                )}
            </div>
        </div>

        {/* Student Info (Compact Flex Layout) */}
        <div className="flex justify-between items-center text-[10px] mb-2 bg-slate-50 p-1.5 rounded border border-slate-200">
            <div>
                <span className="font-bold text-slate-500 uppercase text-[8px] mr-1">Name:</span>
                <span className="font-semibold text-slate-900">{student.fullName}</span>
            </div>
            <div>
                <span className="font-bold text-slate-500 uppercase text-[8px] mr-1">Reg No:</span>
                <span className="font-semibold text-slate-900">{student.rollNo || '—'}</span>
            </div>
            <div>
                <span className="font-bold text-slate-500 uppercase text-[8px] mr-1">Program:</span>
                <span className="font-semibold text-slate-900">{student.programName || '—'}</span>
            </div>
            <div>
                <span className="font-bold text-slate-500 uppercase text-[8px] mr-1">Sec:</span>
                <span className="font-semibold text-slate-900">{student.section || '—'}</span>
            </div>
        </div>

        {/* Fee Breakdown Table (Compact) */}
        <div className="mb-2">
            <table className="w-full border-collapse border border-slate-300 text-[10px]">
                <thead>
                    <tr className="bg-slate-100 text-slate-800">
                        <th className="border border-slate-300 px-1 py-0.5 text-left font-bold">Description</th>
                        <th className="border border-slate-300 px-1 py-0.5 text-right font-bold w-20">Amount (PKR)</th>
                    </tr>
                </thead>
                <tbody>
                    {feeLines.map((line, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="border border-slate-300 px-1 py-0.5 truncate">{line.title}</td>
                            <td className="border border-slate-300 px-1 py-0.5 text-right">
                                {Number(line.amount).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-slate-50 border-t border-slate-300">
                        <td className="border border-slate-300 px-1 py-0.5 text-right font-bold text-slate-700">Gross Total:</td>
                        <td className="border border-slate-300 px-1 py-0.5 text-right font-bold text-slate-700">
                            {Number(fee.grossTotal || 0).toLocaleString()}
                        </td>
                    </tr>
                    {fee.discountAmount > 0 && (
                        <tr className="bg-emerald-50">
                            <td className="border border-slate-300 px-1 py-0.5 text-right font-bold text-emerald-800">
                                Discount {fee.discountReason ? `(${fee.discountReason})` : ''}:
                            </td>
                            <td className="border border-slate-300 px-1 py-0.5 text-right font-bold text-emerald-700">
                                − {Number(fee.discountAmount).toLocaleString()}
                            </td>
                        </tr>
                    )}
                    <tr className="bg-slate-100">
                        <td className="border border-slate-300 px-1 py-0.5 text-right font-bold text-slate-700">
                            Net Semester Fee:
                        </td>
                        <td className="border border-slate-300 px-1 py-0.5 text-right font-bold text-slate-700">
                            {Number(fee.netPayable || 0).toLocaleString()}
                        </td>
                    </tr>
                    <tr className="bg-orange-50 border-t border-orange-400">
                        <td className="border border-slate-300 px-1 py-1 text-right font-black text-slate-800 uppercase text-[9px]">
                            Payable Now ({currentPayableLabel}):
                        </td>
                        <td className="border border-slate-300 px-1 py-1 text-right font-black text-xs text-orange-700">
                            {currentPayableAmount.toLocaleString()}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>

        {/* Bank Details & Signatures (Compact Flex) */}
        <div className="flex justify-between items-end mt-2">
            <div className="text-[8px] text-slate-600 leading-tight">
                <p className="font-bold text-slate-800 uppercase mb-0.5">Bank Details</p>
                <p><span className="font-semibold">Bank:</span> Habib Bank Limited (HBL)</p>
                <p><span className="font-semibold">Title:</span> University of Technology</p>
                <p><span className="font-semibold">A/C No:</span> 0123-4567890-01</p>
                <p><span className="font-semibold">IBAN:</span> PK36HABB0001234567890001</p>
            </div>
            <div className="text-center">
                <div className="w-24 border-b border-slate-400 mb-0.5"></div>
                <p className="text-[8px] font-bold text-slate-600">Authorized Signature</p>
            </div>
        </div>
    </div>
);

export default FeeVoucher;