import React from 'react';

const TranscriptPaper = ({ studentData }) => {
    // Fallback data if no studentData is passed
    const data = studentData || {
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
        photoUrl: null // Add a URL if you have student photos
    };

    // Mock courses for the grid
    const courses = [
        { code: 'CS-101', title: 'Introduction to Computing', cr: 3, quiz: 18, assign: 19, mid: 25, final: 40, theory: 102, practical: 0, total: 102, grade: 'A' },
        { code: 'MATH-101', title: 'Calculus I', cr: 3, quiz: 15, assign: 18, mid: 22, final: 35, theory: 90, practical: 0, total: 90, grade: 'B+' },
        { code: 'ENG-101', title: 'English Composition', cr: 3, quiz: 20, assign: 20, mid: 28, final: 45, theory: 113, practical: 0, total: 113, grade: 'A+' },
        { code: 'PHY-101', title: 'Applied Physics', cr: 4, quiz: 16, assign: 17, mid: 24, final: 38, theory: 85, practical: 10, total: 95, grade: 'A' },
    ];

    return (
        <div className="bg-white p-6 md:p-8 text-[10px] md:text-xs text-black w-full max-w-[1000px] mx-auto printable-area font-sans" style={{ fontFamily: 'Arial, sans-serif' }}>

            {/* Header Section */}
            <div className="text-center font-bold text-lg md:text-xl mb-4">
                Transcript
            </div>
            <div className="text-center font-bold text-sm md:text-base mb-4">
                {data.program}
            </div>

            {/* Student Info Grid */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                    <table className="w-full max-w-[500px]">
                        <tbody>
                            <tr><td className="w-24 font-bold py-0.5">Name:</td><td className="uppercase">{data.name}</td></tr>
                            <tr><td className="font-bold py-0.5">Roll No:</td><td>{data.rollNo}</td></tr>
                            <tr><td className="font-bold py-0.5">Batch:</td><td>{data.batch}</td></tr>
                            <tr><td className="font-bold py-0.5">Regd. No:</td><td>{data.regNo}</td></tr>
                            <tr><td className="font-bold py-0.5">Status of Stay:</td><td>{data.status}</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex-1 px-4">
                    <table className="w-full max-w-[500px]">
                        <tbody>
                            <tr><td className="w-28 font-bold py-0.5">Father's Name:</td><td className="uppercase">{data.fatherName}</td></tr>
                            <tr><td className="font-bold py-0.5">Session:</td><td>{data.session}</td></tr>
                            <tr><td className="font-bold py-0.5">CNIC:</td><td>{data.cnic}</td></tr>
                            <tr><td className="font-bold py-0.5">Date of Admission:</td><td>{data.dateOfAdmission}</td></tr>
                            <tr><td className="font-bold py-0.5">Department:</td><td>{data.department}</td></tr>
                        </tbody>
                    </table>
                </div>
                {/* Photo Placeholder */}
                <div className="w-20 h-24 border border-gray-300 flex items-center justify-center text-center text-[8px] text-gray-500 shrink-0">
                    {data.photoUrl ? <img src={data.photoUrl} alt="Student" className="w-full h-full object-cover" /> : 'Photo'}
                </div>
            </div>

            {/* Semester Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Semester 1 */}
                <div>
                    <div className="font-bold mb-1">First Semester</div>
                    <table className="w-full border-collapse border border-black text-center">
                        <thead>
                            <tr className="bg-gray-100 border-b border-black">
                                <th className="border-r border-black p-1">Code</th>
                                <th className="border-r border-black p-1 text-left">Course Title</th>
                                <th className="border-r border-black p-1">Cr.</th>
                                <th className="border-r border-black p-1">Quiz</th>
                                <th className="border-r border-black p-1">Assg</th>
                                <th className="border-r border-black p-1">Mid</th>
                                <th className="border-r border-black p-1">Final</th>
                                <th className="border-r border-black p-1">Theory</th>
                                <th className="border-r border-black p-1">Prac</th>
                                <th className="border-r border-black p-1">Total</th>
                                <th className="border-r border-black p-1">Grd</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((c, i) => (
                                <tr key={i} className="border-b border-black">
                                    <td className="border-r border-black p-1">{c.code}</td>
                                    <td className="border-r border-black p-1 text-left">{c.title}</td>
                                    <td className="border-r border-black p-1">{c.cr}</td>
                                    <td className="border-r border-black p-1">{c.quiz}</td>
                                    <td className="border-r border-black p-1">{c.assign}</td>
                                    <td className="border-r border-black p-1">{c.mid}</td>
                                    <td className="border-r border-black p-1">{c.final}</td>
                                    <td className="border-r border-black p-1">{c.theory}</td>
                                    <td className="border-r border-black p-1">{c.practical}</td>
                                    <td className="border-r border-black p-1">{c.total}</td>
                                    <td className="border-r border-black p-1 font-bold">{c.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold border-t border-black bg-gray-100">
                                <td colSpan="2" className="border-r border-black p-1 text-right">Total</td>
                                <td className="border-r border-black p-1">13</td>
                                <td colSpan="7" className="border-r border-black p-1"></td>
                                <td className="p-1"></td>
                            </tr>
                        </tfoot>
                    </table>
                    <div className="flex justify-between font-bold mt-1">
                        <span>Semester GPA</span><span>3.85</span>
                        <span>Semester CGPA</span><span>3.85</span>
                    </div>
                </div>

                {/* Semester 2 (Mocked) */}
                <div>
                    <div className="font-bold mb-1">Second Semester</div>
                    <table className="w-full border-collapse border border-black text-center">
                        <thead>
                            <tr className="bg-gray-100 border-b border-black">
                                <th className="border-r border-black p-1">Code</th>
                                <th className="border-r border-black p-1 text-left">Course Title</th>
                                <th className="border-r border-black p-1">Cr.</th>
                                <th className="border-r border-black p-1">Quiz</th>
                                <th className="border-r border-black p-1">Assg</th>
                                <th className="border-r border-black p-1">Mid</th>
                                <th className="border-r border-black p-1">Final</th>
                                <th className="border-r border-black p-1">Theory</th>
                                <th className="border-r border-black p-1">Prac</th>
                                <th className="border-r border-black p-1">Total</th>
                                <th className="border-r border-black p-1">Grd</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((c, i) => (
                                <tr key={i} className="border-b border-black">
                                    <td className="border-r border-black p-1">{c.code}</td>
                                    <td className="border-r border-black p-1 text-left">{c.title}</td>
                                    <td className="border-r border-black p-1">{c.cr}</td>
                                    <td className="border-r border-black p-1">{c.quiz}</td>
                                    <td className="border-r border-black p-1">{c.assign}</td>
                                    <td className="border-r border-black p-1">{c.mid}</td>
                                    <td className="border-r border-black p-1">{c.final}</td>
                                    <td className="border-r border-black p-1">{c.theory}</td>
                                    <td className="border-r border-black p-1">{c.practical}</td>
                                    <td className="border-r border-black p-1">{c.total}</td>
                                    <td className="border-r border-black p-1 font-bold">{c.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold border-t border-black bg-gray-100">
                                <td colSpan="2" className="border-r border-black p-1 text-right">Total</td>
                                <td className="border-r border-black p-1">13</td>
                                <td colSpan="7" className="border-r border-black p-1"></td>
                                <td className="p-1"></td>
                            </tr>
                        </tfoot>
                    </table>
                    <div className="flex justify-between font-bold mt-1">
                        <span>Semester GPA</span><span>3.70</span>
                        <span>Semester CGPA</span><span>3.77</span>
                    </div>
                </div>
            </div>

            {/* Bottom Summary Table */}
            <div className="mt-6 border border-black">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-black font-bold">
                            <th className="border-r border-black p-1">Merit Position</th>
                            <th className="border-r border-black p-1">Failed Courses</th>
                            <th className="border-r border-black p-1">Probation / Warning</th>
                            <th className="border-r border-black p-1">Sem. GPA</th>
                            <th className="border-r border-black p-1">Sem. CGPA</th>
                            <th className="border-r border-black p-1">CGPA</th>
                            <th className="border-r border-black p-1">No. of Courses Passed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-r border-black p-1">-</td>
                            <td className="border-r border-black p-1">0</td>
                            <td className="border-r border-black p-1">-</td>
                            <td className="border-r border-black p-1">3.70</td>
                            <td className="border-r border-black p-1">3.77</td>
                            <td className="border-r border-black p-1">3.81</td>
                            <td className="border-r border-black p-1">8</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Signatures */}
            <div className="flex justify-between mt-12 mb-6 px-4">
                <div className="text-center">
                    <div className="w-32 border-b border-black mb-1"></div>
                    <p className="font-bold">Prepared By</p>
                </div>
                <div className="text-center">
                    <div className="w-32 border-b border-black mb-1"></div>
                    <p className="font-bold">Checked By</p>
                </div>
                <div className="text-center">
                    <div className="w-40 border-b border-black mb-1"></div>
                    <p className="font-bold">Controller of Examinations</p>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="border border-black p-3 mt-4">
                <div className="font-bold text-red-600 mb-2">DISCLAIMER/PROCLAMATION ⚠️</div>
                <p className="mb-2 text-justify">Error and omissions are expected. Any entry appearing therein does not in itself confer any right or privilege to a student for the grant of any semester mark sheet/transcript or Degree, which will be issued under the rules and regulations on the basis of original record of the SSUET.</p>
                <ol className="list-decimal pl-4 space-y-1 text-justify">
                    <li>The University reserves the right to correct, modify or change the results at any time on the basis of original record or in any manner if found to have been wrongly computed or compiled. Typographical error, if any, will not entitle anybody to interpret the result in his/her favor and to claim any advantage therefrom. The University reserves the right to correct such mistakes as and when they come to notice and no action shall lie against the University.</li>
                    <li>Every care has been taken to ensure that the results are accurate. The University, however, does not hold itself responsible for any omission or mistake of results notification.</li>
                    <li>Declaration by the Student: I understand that I am being allowed to appear in the above examinations on the condition that I have completed the attendance requirement. If my attendance is short or I have not fulfilled any other condition of appearing in examinations, my result may be cancelled.</li>
                    <li>Note: Ineligible candidates shall not claim any right for the announcement of their results if an admit card is issued to them inadvertently on the basis of incorrect/false information.</li>
                </ol>
            </div>
        </div>
    );
};

export default TranscriptPaper;