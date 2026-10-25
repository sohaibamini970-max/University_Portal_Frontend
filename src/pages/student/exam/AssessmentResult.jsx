import React, { useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { AlertTriangle, Info } from 'lucide-react';

const AssessmentResult = () => {
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    // Mock data for the table
    const resultsData = [
        {
            assessmentType: 'Quiz 1',
            assessment: 'Quiz 1',
            courseCode: 'CS-301',
            section: 'A',
            teacher: 'Dr. Sarah Wilson',
            totalMarks: 100,
            passingMarks: 40,
            obtainedMarks: 85,
        },
        {
            assessmentType: 'Assignment 1',
            assessment: 'Assignment 1',
            courseCode: 'CS-301',
            section: 'A',
            teacher: 'Dr. Sarah Wilson',
            totalMarks: 50,
            passingMarks: 20,
            obtainedMarks: 45,
        },
        {
            assessmentType: 'Mid Term',
            assessment: 'Mid Term Exam',
            courseCode: 'CS-302',
            section: 'A',
            teacher: 'Mr. Ahmed',
            totalMarks: 100,
            passingMarks: 40,
            obtainedMarks: 78,
        }
    ];

    return (
        <Layout title="Assessment Results" subtitle="Check your assessment marks and progress">
            <div className="space-y-6 pb-8">

                {/* 1. Filter Container */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                        {/* Session Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Session:</label>
                            <select
                                value={selectedSession}
                                onChange={(e) => setSelectedSession(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">-- Select --</option>
                                <option value="2023-2027">2023-2027</option>
                                <option value="2024-2028">2024-2028</option>
                            </select>
                        </div>

                        {/* Course Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Course:</label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">-- Select --</option>
                                <option value="CS-301">CS-301: Data Structures</option>
                                <option value="CS-302">CS-302: Web Development</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Table Container */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-[#2B8EF6] text-white">
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-blue-400 last:border-0">Assessment Type</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-blue-400 last:border-0">Assessment</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-blue-400 last:border-0">Course (Code)</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-blue-400 last:border-0">Section Code</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-blue-400 last:border-0">Teacher</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-blue-400 last:border-0">Total Marks</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-blue-400 last:border-0">Passing Marks</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Obtained Marks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {resultsData.length > 0 ? (
                                    resultsData.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 bg-white">
                                            <td className="px-4 py-3 text-sm text-gray-700 font-medium">{row.assessmentType}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{row.assessment}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{row.courseCode}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{row.section}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{row.teacher}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-800">{row.totalMarks}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-800">{row.passingMarks}</td>
                                            <td className="px-4 py-3 text-sm font-bold text-gray-900">{row.obtainedMarks}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-10 text-center text-sm text-gray-500 bg-gray-50">
                                            No records to display.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. Disclaimer Box */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-sm text-gray-600 leading-relaxed">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-[#F13C51] font-bold text-lg uppercase tracking-wide">Disclaimer/PROCLAMATION</h3>
                        <AlertTriangle className="w-6 h-6 text-[#F13C51]" />
                    </div>

                    <p className="mb-4">
                        Error and omissions are expected. Any entry appearing therein does not in itself confer any right or privilege to a student for the grant of any semester mark sheet/transcript or Degree, which will be issued under the rules and regulations on the basis of original record of the SSUET.
                    </p>

                    <ol className="list-decimal pl-5 space-y-2 text-justify">
                        <li>The University reserves the right to correct, modify or change the results at any time on the basis of original record or in any manner if found to have been wrongly computed or compiled. Typographical error, if any, will not entitle anybody to interpret the result in his/her favor and to claim any advantage therefrom. The University reserves the right to correct such mistakes as and when they come to notice and no action shall lie against the University.</li>
                        <li>Every care has been taken to ensure that the results are accurate. The University, however, does not hold itself responsible for any omission or mistake of results notification.</li>
                        <li>Declaration by the Student: I understand that I am being allowed to appear in the above examinations on the condition that I have completed the attendance requirement. If my attendance is short or I have not fulfilled any other condition of appearing in examinations, my result may be cancelled.</li>
                        <li>Note: Ineligible candidates shall not claim any right for the announcement of their results if an admit card is issued to them inadvertently on the basis of incorrect/false information.</li>
                    </ol>
                </div>

            </div>
        </Layout>
    );
};

export default AssessmentResult;