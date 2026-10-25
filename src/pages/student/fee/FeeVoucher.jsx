import React, { useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import {
    DollarSign, Download, Eye, EyeOff, CheckCircle, Clock, AlertCircle,
    Building2, CreditCard, Landmark, ReceiptText
} from 'lucide-react';

const FeeVoucher = () => {
    const [showPreview, setShowPreview] = useState(false);

    const vouchers = [
        { semester: 'Spring 2025', amount: '45,000', due: 'Dec 15, 2025', status: 'Unpaid', invoice: 'INV-2025-001' },
        { semester: 'Fall 2024', amount: '42,000', due: 'Sep 10, 2024', status: 'Paid', invoice: 'INV-2024-098' },
        { semester: 'Spring 2024', amount: '40,000', due: 'Feb 05, 2024', status: 'Paid', invoice: 'INV-2024-012' },
    ];

    const studentInfo = {
        name: 'Muhammad Suhaib',
        rollNo: '5950/BCS/2024F',
        program: 'BS Computer Science',
        session: 'Fall 2024 - Spring 2028',
        section: 'C',
        semester: '5th'
    };

    // Breakdown of the fees for the Preview
    const feeDetails = [
        { title: 'Tuition Fee', amount: 35000 },
        { title: 'University Services Fee', amount: 5000 },
        { title: 'Library & Lab Charges', amount: 3000 },
        { title: 'Student Activity Fund', amount: 2000 },
    ];

    const totalAmount = feeDetails.reduce((sum, item) => sum + item.amount, 0);

    const statusStyle = (s) => {
        if (s === 'Paid') return { bg: 'bg-green-100 text-green-700', icon: CheckCircle };
        if (s === 'Unpaid') return { bg: 'bg-red-100 text-red-700', icon: AlertCircle };
        return { bg: 'bg-orange-100 text-orange-700', icon: Clock };
    };

    const handleDownload = () => {
        window.print();
    };

    return (
        <Layout title="Fee Voucher" subtitle="Download and manage your fee vouchers">
            <div className="space-y-6 pb-8">

                {/* Control Panel Container */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg">
                            <DollarSign className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Spring 2025 Fee Challan</h2>
                            <p className="text-sm text-gray-500 mt-1">Total due: <strong className="text-red-600">PKR {totalAmount.toLocaleString()}</strong> (Due by Dec 15, 2025)</p>
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

                {/* 👇 FEE VOUCHER PREVIEW SECTION 👇 */}
                {showPreview && (
                    <div className="bg-white border border-gray-300 rounded-xl shadow-xl overflow-hidden print:border-0 print:shadow-none print:block animate-in fade-in slide-in-from-top-4 duration-300">
                        {/* Print-only CSS styles */}
                        <style type="text/css" media="print">
                            {`
                                @page { size: portrait; margin: 10mm; }
                                body * { visibility: hidden; }
                                .printable-area, .printable-area * { visibility: visible; }
                                .printable-area { position: absolute; left: 0; top: 0; width: 100%; }
                                .no-print { display: none !important; }
                            `}
                        </style>

                        <div className="printable-area p-6 md:p-10">

                            {/* Voucher Header */}
                            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
                                <div className="text-left">
                                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wide">University of Technology</h1>
                                    <p className="text-sm font-semibold text-slate-600 mt-1">Fee Payment Challan</p>
                                    <p className="text-xs font-bold text-slate-500 mt-0.5">Spring 2025 Semester</p>
                                </div>
                                <div className="text-right bg-slate-100 p-3 rounded-lg border border-slate-200">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Challan No</p>
                                    <p className="text-lg font-black text-red-600">INV-2025-001</p>
                                    <p className="text-xs font-bold text-red-500 mt-1">DUE: Dec 15, 2025</p>
                                </div>
                            </div>

                            {/* Student Information */}
                            <div className="mb-6">
                                <h3 className="bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-800 uppercase mb-3 border-l-4 border-orange-500">
                                    Student Information
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Name</p>
                                        <p className="font-semibold text-slate-900">{studentInfo.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Registration No</p>
                                        <p className="font-semibold text-slate-900">{studentInfo.rollNo}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Program</p>
                                        <p className="font-semibold text-slate-900">{studentInfo.program}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Section & Semester</p>
                                        <p className="font-semibold text-slate-900">Section {studentInfo.section} • Sem {studentInfo.semester}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Session</p>
                                        <p className="font-semibold text-slate-900">{studentInfo.session}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Fee Calculation Table */}
                            <div className="mb-6">
                                <h3 className="bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-800 uppercase mb-3 border-l-4 border-orange-500 flex items-center gap-2">
                                    <ReceiptText className="w-4 h-4" /> Fee Breakdown & Calculation
                                </h3>
                                <table className="w-full border-collapse border border-slate-300 text-sm">
                                    <thead>
                                        <tr className="bg-slate-800 text-white">
                                            <th className="border border-slate-700 px-4 py-2 text-left">Description</th>
                                            <th className="border border-slate-700 px-4 py-2 text-right w-40">Amount (PKR)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feeDetails.map((fee, idx) => (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                <td className="border border-slate-300 px-4 py-2 font-medium">{fee.title}</td>
                                                <td className="border border-slate-300 px-4 py-2 text-right font-semibold">{fee.amount.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-orange-50 border-t-2 border-orange-500">
                                            <td className="border border-orange-300 px-4 py-3 text-right font-bold text-slate-800 uppercase">Total Payable Amount:</td>
                                            <td className="border border-orange-300 px-4 py-3 text-right font-black text-lg text-orange-700">
                                                {totalAmount.toLocaleString()}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Bank Details */}
                            <div className="mb-8">
                                <h3 className="bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-800 uppercase mb-3 border-l-4 border-orange-500 flex items-center gap-2">
                                    <Landmark className="w-4 h-4" /> Bank Account Details
                                </h3>
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Bank Name</p>
                                        <p className="font-semibold text-slate-900">Habib Bank Limited (HBL)</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Account Title</p>
                                        <p className="font-semibold text-slate-900">University of Technology</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Account Number</p>
                                        <p className="font-mono font-bold text-indigo-700">0123-4567890-01</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Branch Code</p>
                                        <p className="font-semibold text-slate-900">0042</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">IBAN Number</p>
                                        <p className="font-mono font-bold text-indigo-700 truncate">PK36HABB0001234567890001</p>
                                    </div>
                                </div>
                            </div>

                            {/* Important Instructions */}
                            <div className="mb-10">
                                <h3 className="text-sm font-bold text-slate-800 uppercase mb-2">Important Instructions</h3>
                                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                                    <li>Please pay the fee on or before the due date to avoid a late fee fine of PKR 1,000.</li>
                                    <li>After payment, upload the paid challan slip on the student portal to confirm your registration.</li>
                                    <li>This challan is not valid for payment after the expiry date.</li>
                                </ul>
                            </div>

                            {/* Signatures */}
                            <div className="flex justify-between items-end mt-12 pt-6 border-t border-slate-300">
                                <div className="text-center">
                                    <div className="w-40 border-b border-slate-800 mb-2"></div>
                                    <p className="text-xs font-bold text-slate-700">Student Signature</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-40 border-b border-slate-800 mb-2"></div>
                                    <p className="text-xs font-bold text-slate-700">Finance Officer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default FeeVoucher;