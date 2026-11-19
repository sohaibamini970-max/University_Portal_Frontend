import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const StudentAssessmentResult = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedType, setSelectedType] = useState('');

    useEffect(() => {
        api.get('/assessments/student')
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Derive unique courses and types for dropdowns based on available data
    const uniqueCourses = [...new Map(data.map(item => [item.courseCode, item])).values()];
    const uniqueTypes = [...new Map(data.map(item => [item.assessmentType, item])).values()];

    // 👇 ONLY filter if BOTH dropdowns are selected
    const filtered = (selectedCourse && selectedType)
        ? data.filter(d => d.courseCode === selectedCourse && d.assessmentType === selectedType)
        : [];

    return (
        <Layout title="Assessment Results" subtitle="Check your assessment marks and progress">
            <div className="space-y-6 pb-8">

                {/* Filters */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Course:</label>
                            <select
                                value={selectedCourse}
                                onChange={e => setSelectedCourse(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Select Course --</option>
                                {uniqueCourses.map(c => (
                                    <option key={c.courseCode} value={c.courseCode}>
                                        {c.courseCode} - {c.courseName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Type:</label>
                            <select
                                value={selectedType}
                                onChange={e => setSelectedType(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Select Assessment Type --</option>
                                {uniqueTypes.map(t => (
                                    <option key={t.assessmentType} value={t.assessmentType}>
                                        {t.assessmentType}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 text-xs font-semibold text-gray-500">
                        * Please select both a Course and an Assessment Type to view your results.
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-[#2B8EF6] text-white">
                                    <th className="px-4 py-3 text-xs font-bold uppercase border-r border-blue-400">Course</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase border-r border-blue-400">Assessment</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase border-r border-blue-400">Section</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase border-r border-blue-400">Total Marks</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase border-r border-blue-400">Obtained</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase">Percentage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="p-10">
                                            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-10 text-gray-500 font-medium">
                                            {selectedCourse && selectedType
                                                ? "No marks found for this specific assessment."
                                                : "Select options above to view marks."}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((row, idx) => {
                                        const pct = ((row.obtainedMarks / row.totalMarks) * 100).toFixed(1);
                                        return (
                                            <tr key={idx} className="hover:bg-gray-50 bg-white">
                                                <td className="px-4 py-3 text-sm text-gray-700 font-medium">{row.courseCode}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{row.assessmentType}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{row.section}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-800">{row.totalMarks}</td>
                                                <td className="px-4 py-3 text-sm font-bold text-blue-600">{row.obtainedMarks}</td>
                                                <td className={`px-4 py-3 text-sm font-bold ${Number(pct) >= 40 ? 'text-emerald-600' : 'text-red-600'}`}>{pct}%</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Disclaimer Box */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-sm text-gray-600 leading-relaxed">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-[#F13C51] font-bold text-lg uppercase tracking-wide">Disclaimer/PROCLAMATION</h3>
                        <AlertTriangle className="w-6 h-6 text-[#F13C51]" />
                    </div>
                    <p className="mb-4">
                        Error and omissions are expected. Any entry appearing therein does not in itself confer any right or privilege to a student for the grant of any semester mark sheet/transcript or Degree, which will be issued under the rules and regulations on the basis of original record of the SSUET.
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 text-justify">
                        <li>The University reserves the right to correct, modify or change the results at any time on the basis of original record or in any manner if found to have been wrongly computed or compiled. Typographical error, if any, will not entitle anybody to interpret the result in his/her favor and to claim any advantage therefrom.</li>
                        <li>Every care has been taken to ensure that the results are accurate. The University, however, does not hold itself responsible for any omission or mistake of results notification.</li>
                        <li>Declaration by the Student: I understand that I am being allowed to appear in the above examinations on the condition that I have completed the attendance requirement.</li>
                    </ol>
                </div>

            </div>
        </Layout>
    );
};

export default StudentAssessmentResult;