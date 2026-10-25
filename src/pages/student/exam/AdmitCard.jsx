import React, { useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { Ticket, Download, GraduationCap, Calendar, MapPin, Eye, EyeOff, Printer, CheckCircle, Info } from 'lucide-react';

const AdmitCard = () => {
    const [showPreview, setShowPreview] = useState(false);

    const studentInfo = {
        name: 'Muhammad Suhaib',
        rollNo: '5950/BCS/2024F',
        email: 'sohaibamini970@gmail.com',
        phone: '+92 300 1234567',
        session: 'Fall 2024 - Spring 2028',
        section: 'C',
        program: 'BS Computer Science'
    };

    const exams = [
        { code: 'CS-301', name: 'Data Structures', date: 'Dec 10, 2025', time: '09:00 AM - 12:00 PM', venue: 'Block A, Room 201', seat: 'A-045' },
        { code: 'CS-302', name: 'Web Development', date: 'Dec 12, 2025', time: '09:00 AM - 12:00 PM', venue: 'Block B, Lab 3', seat: 'B-112' },
        { code: 'CS-303', name: 'Algorithms', date: 'Dec 15, 2025', time: '02:00 PM - 05:00 PM', venue: 'Block A, Hall 1', seat: 'A-078' },
    ];

    const handleDownload = () => {
        // Trigger the browser's print dialog (Save as PDF)
        window.print();
    };

    return (
        <Layout title="Exam Admit Card" subtitle="Download your admit card for upcoming exams">
            <div className="space-y-6 pb-8">

                {/* Control Panel Container */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
                            <Ticket className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Spring 2025 Final Exams</h2>
                            <p className="text-sm text-gray-500 mt-1">Your admit card is ready to preview and download.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold text-sm transition-colors"
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showPreview ? 'Hide Preview' : 'Preview Admit Card'}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold text-sm shadow-md transition-colors"
                        >
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>
                </div>

                {/* 👇 PREVIEW SECTION (PRINTABLE) 👇 */}
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
                            {/* Admit Card Header */}
                            <div className="text-center border-b-2 border-slate-800 pb-6 mb-6">
                                <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                    <GraduationCap className="w-8 h-8" />
                                </div>
                                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wide">University of Technology</h1>
                                <p className="text-sm font-semibold text-slate-600 mt-1">Examination Admit Card - Spring 2025</p>
                            </div>

                            {/* Student Info Table */}
                            <div className="mb-6">
                                <h3 className="bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-800 uppercase mb-3 border-l-4 border-indigo-600">
                                    Student Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <p><span className="font-bold text-slate-500 inline-block w-24">Name:</span> <span className="font-semibold text-slate-900">{studentInfo.name}</span></p>
                                        <p><span className="font-bold text-slate-500 inline-block w-24">Roll No:</span> <span className="font-semibold text-slate-900">{studentInfo.rollNo}</span></p>
                                        <p><span className="font-bold text-slate-500 inline-block w-24">Program:</span> <span className="font-semibold text-slate-900">{studentInfo.program}</span></p>
                                    </div>
                                    <div className="space-y-2">
                                        <p><span className="font-bold text-slate-500 inline-block w-24">Session:</span> <span className="font-semibold text-slate-900">{studentInfo.session}</span></p>
                                        <p><span className="font-bold text-slate-500 inline-block w-24">Section:</span> <span className="font-semibold text-slate-900">{studentInfo.section}</span></p>
                                        <p><span className="font-bold text-slate-500 inline-block w-24">Contact:</span> <span className="font-semibold text-slate-900">{studentInfo.phone}</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Exam Schedule Table */}
                            <div className="mb-6">
                                <h3 className="bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-800 uppercase mb-3 border-l-4 border-indigo-600">
                                    Examination Schedule
                                </h3>
                                <table className="w-full border-collapse border border-slate-300 text-sm">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-700">
                                            <th className="border border-slate-300 px-3 py-2 text-left">Code</th>
                                            <th className="border border-slate-300 px-3 py-2 text-left">Subject</th>
                                            <th className="border border-slate-300 px-3 py-2 text-left">Date & Time</th>
                                            <th className="border border-slate-300 px-3 py-2 text-left">Venue (Block & Room)</th>
                                            <th className="border border-slate-300 px-3 py-2 text-center">Seat</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exams.map((exam, idx) => (
                                            <tr key={idx} className="bg-white">
                                                <td className="border border-slate-300 px-3 py-2 font-bold">{exam.code}</td>
                                                <td className="border border-slate-300 px-3 py-2 font-medium">{exam.name}</td>
                                                <td className="border border-slate-300 px-3 py-2">
                                                    {exam.date} <br /> <span className="text-xs text-slate-500">{exam.time}</span>
                                                </td>
                                                <td className="border border-slate-300 px-3 py-2 font-medium">{exam.venue}</td>
                                                <td className="border border-slate-300 px-3 py-2 text-center font-black">{exam.seat}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Instructions */}
                            <div className="mb-10">
                                <h3 className="bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-800 uppercase mb-3 border-l-4 border-indigo-600">
                                    Important Instructions
                                </h3>
                                <ul className="list-disc pl-6 text-xs text-slate-700 space-y-1.5">
                                    <li>Please bring a printed copy of this admit card to the examination hall.</li>
                                    <li>A valid University ID Card is mandatory for entry. Without ID, entry will be denied.</li>
                                    <li>Mobile phones, smart watches, and any electronic devices are strictly prohibited.</li>
                                    <li>Students must report to the examination hall 15 minutes before the start time.</li>
                                    <li>Any attempt to use unfair means will result in disqualification from the exam.</li>
                                </ul>
                            </div>

                            {/* Signatures */}
                            <div className="flex justify-between items-end mt-16 pt-6 border-t border-slate-300">
                                <div className="text-center">
                                    <div className="w-40 border-b border-slate-800 mb-2"></div>
                                    <p className="text-xs font-bold text-slate-700">Student Signature</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-40 border-b border-slate-800 mb-2"></div>
                                    <p className="text-xs font-bold text-slate-700">Controller of Examinations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default AdmitCard;