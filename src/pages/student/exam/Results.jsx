import React, { useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { Trophy, Download, Eye, EyeOff, GraduationCap } from 'lucide-react';

const Results = () => {
    const [showPreview, setShowPreview] = useState(false);

    const studentInfo = {
        name: 'Muhammad Suhaib',
        rollNo: '5950/BCS/2024F',
        program: 'BS Computer Science',
        session: 'Fall 2022 - Spring 2026',
        batch: '2024F',
        section: 'C',
        cgpa: '3.81'
    };

    // Data grouped by semester
    const semesterResults = [
        {
            semester: '1st Semester',
            term: 'Fall 2022',
            totalMarks: 500,
            obtainedMarks: 460,
            totalCredits: 16, // Added total credits
            gpa: '3.85',
            cgpa: '3.85',
            courses: [
                { code: 'CS-101', name: 'Intro to Programming', credits: 4, total: 100, obtained: 92, grade: 'A' },
                { code: 'CS-102', name: 'Discrete Mathematics', credits: 3, total: 100, obtained: 88, grade: 'B+' },
                { code: 'CS-103', name: 'Applied Physics', credits: 3, total: 100, obtained: 95, grade: 'A' },
                { code: 'ENG-101', name: 'English Composition', credits: 3, total: 100, obtained: 85, grade: 'B+' },
                { code: 'MATH-101', name: 'Calculus I', credits: 3, total: 100, obtained: 100, grade: 'A+' },
            ]
        },
        {
            semester: '2nd Semester',
            term: 'Spring 2023',
            totalMarks: 500,
            obtainedMarks: 435,
            totalCredits: 17, // Added total credits
            gpa: '3.70',
            cgpa: '3.77',
            courses: [
                { code: 'CS-104', name: 'Object Oriented Prog', credits: 4, total: 100, obtained: 85, grade: 'B+' },
                { code: 'CS-105', name: 'Digital Logic Design', credits: 3, total: 100, obtained: 90, grade: 'A-' },
                { code: 'MATH-102', name: 'Calculus II', credits: 3, total: 100, obtained: 82, grade: 'B' },
                { code: 'CS-106', name: 'Data Structures', credits: 4, total: 100, obtained: 95, grade: 'A' },
                { code: 'ENG-102', name: 'Technical Writing', credits: 3, total: 100, obtained: 83, grade: 'B' },
            ]
        }
    ];

    const gradeColor = (g) => {
        if (g.startsWith('A')) return 'text-emerald-700 bg-emerald-100';
        if (g.startsWith('B')) return 'text-blue-700 bg-blue-100';
        if (g.startsWith('C')) return 'text-orange-700 bg-orange-100';
        return 'text-red-700 bg-red-100';
    };

    const handleDownload = () => {
        window.print();
    };

    return (
        <Layout title="Examination Results" subtitle="View and download your official transcript">
            <div className="space-y-6 pb-8">

                {/* Control Panel Container */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg">
                            <Trophy className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Official Transcript</h2>
                            <p className="text-sm text-gray-500 mt-1">Preview and download your semester results.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold text-sm transition-colors"
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showPreview ? 'Hide Preview' : 'Preview Transcript'}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold text-sm shadow-md transition-colors"
                        >
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>
                </div>

                {/* 👇 TRANSCRIPT PREVIEW SECTION 👇 */}
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

                            {/* Transcript Header */}
                            <div className="text-center border-b-2 border-slate-800 pb-6 mb-6">
                                <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                    <GraduationCap className="w-8 h-8" />
                                </div>
                                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wide">University of Technology</h1>
                                <p className="text-sm font-semibold text-slate-600 mt-1">Official Academic Transcript</p>
                            </div>

                            {/* Student Personal Info */}
                            <div className="mb-8">
                                <h3 className="bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-800 uppercase mb-3 border-l-4 border-indigo-600">
                                    Student Information
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
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
                                        <p className="text-xs font-bold text-slate-500 uppercase">Batch</p>
                                        <p className="font-semibold text-slate-900">{studentInfo.batch}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Section</p>
                                        <p className="font-semibold text-slate-900">{studentInfo.section}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Cumulative CGPA</p>
                                        <p className="font-bold text-indigo-600">{studentInfo.cgpa}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Semester Results Grid (2 per row) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {semesterResults.map((sem, index) => (
                                    <div key={index} className="border border-slate-300 rounded-lg overflow-hidden">

                                        {/* Semester Header */}
                                        <div className="bg-slate-800 text-white p-3">
                                            <h4 className="font-bold text-sm">{sem.semester}</h4>
                                            <p className="text-xs text-slate-300">{sem.term}</p>
                                        </div>

                                        {/* Courses Table */}
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-slate-100 border-b border-slate-300">
                                                <tr>
                                                    <th className="px-2 py-2 font-semibold text-slate-600">Code</th>
                                                    <th className="px-2 py-2 font-semibold text-slate-600">Course</th>
                                                    <th className="px-2 py-2 text-center font-semibold text-slate-600">Cr. Hrs</th> {/* Added Credit Column */}
                                                    <th className="px-2 py-2 text-center font-semibold text-slate-600">Total</th>
                                                    <th className="px-2 py-2 text-center font-semibold text-slate-600">Obt.</th>
                                                    <th className="px-2 py-2 text-center font-semibold text-slate-600">Grade</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {sem.courses.map((c, i) => (
                                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                        <td className="px-2 py-2 font-semibold">{c.code}</td>
                                                        <td className="px-2 py-2 truncate max-w-[120px]">{c.name}</td>
                                                        <td className="px-2 py-2 text-center font-bold text-slate-700">{c.credits}</td> {/* Rendered Credits */}
                                                        <td className="px-2 py-2 text-center">{c.total}</td>
                                                        <td className="px-2 py-2 text-center font-bold text-slate-800">{c.obtained}</td>
                                                        <td className="px-2 py-2 text-center">
                                                            <span className={`px-1.5 py-0.5 rounded font-bold ${gradeColor(c.grade)}`}>
                                                                {c.grade}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {/* Semester Totals & GPA/CGPA Footer */}
                                        <div className="bg-slate-50 border-t border-slate-300 p-2 flex flex-col gap-1.5 text-xs">
                                            <div className="flex justify-between items-center font-bold text-slate-700">
                                                <span>Semester Total:</span>
                                                <span>{sem.obtainedMarks} / {sem.totalMarks} Marks</span>
                                            </div>
                                            <div className="flex justify-between items-center font-bold text-slate-700">
                                                <span>Total Credit Hours:</span>
                                                <span>{sem.totalCredits}</span> {/* Rendered Total Credits */}
                                            </div>
                                            <div className="flex justify-between items-center text-slate-600 mt-1 pt-1 border-t border-slate-200">
                                                <span>GPA: <span className="font-bold text-slate-900">{sem.gpa}</span></span>
                                                <span>CGPA: <span className="font-bold text-slate-900">{sem.cgpa}</span></span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Signatures */}
                            <div className="flex justify-between items-end mt-16 pt-6 border-t border-slate-300">
                                <div className="text-center">
                                    <div className="w-40 border-b border-slate-800 mb-2"></div>
                                    <p className="text-xs font-bold text-slate-700">Controller of Examinations</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-40 border-b border-slate-800 mb-2"></div>
                                    <p className="text-xs font-bold text-slate-700">Registrar</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default Results;