import React from 'react';
import Layout from '../../../components/Layout/Layout';
import TranscriptPaper from '../../../components/common/TranscriptPaper';
import { Download, FileText } from 'lucide-react';

const StudentTranscript = () => {
    // In a real app, fetch this from context/API based on the logged-in student
    const studentInfo = {
        name: 'MUHAMMAD SUHAIB',
        fatherName: 'MUHAMMAD YOUNAS',
        rollNo: '2024F-BCS-134',
        program: 'BS (Hons) Computer Science - MORNING',
        session: '2024-2028',
        batch: '2024-2028',
        cnic: '42101-1234567-1',
        regNo: '5950/BCS/2024F',
        department: 'CS & IT',
        dateOfAdmission: '01-09-2024',
        status: 'Regular',
    };

    return (
        <Layout title="Official Transcript" subtitle="View and download your academic transcript">
            <div className="space-y-6 max-w-5xl mx-auto pb-8">

                {/* Action Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Academic Transcript</h2>
                            <p className="text-sm text-gray-500">Your official academic record.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors w-full sm:w-auto justify-center"
                    >
                        <Download className="w-4 h-4" /> Print / Download PDF
                    </button>
                </div>

                {/* Transcript Container */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-4 md:p-8">
                    <TranscriptPaper studentData={studentInfo} />
                </div>

            </div>
        </Layout>
    );
};

export default StudentTranscript;