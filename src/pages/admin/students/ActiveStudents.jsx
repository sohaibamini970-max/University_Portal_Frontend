import React from 'react';
import { useOutletContext } from 'react-router-dom';

const ActiveStudents = () => {
    const { searchQuery } = useOutletContext();

    // Mock Data for Active Students
    const students = [
        { id: 1, name: 'Emma Davis', roll: 'CS-2021-045', batch: '2021-2025', semester: '7th', email: 'emma@uni.edu', section: 'A', status: 'Active', courses: ['Data Structures', 'Web Dev', 'Algorithms'] },
        { id: 2, name: 'James Miller', roll: 'CS-2022-112', batch: '2022-2026', semester: '5th', email: 'james@uni.edu', section: 'B', status: 'Active', courses: ['Data Structures', 'Databases', 'Networks'] },
        { id: 3, name: 'Olivia Taylor', roll: 'CS-2020-089', batch: '2020-2024', semester: '8th', email: 'olivia@uni.edu', section: 'A', status: 'Active', courses: ['Capstone Project', 'AI', 'Cloud Computing'] },
        { id: 4, name: 'Noah Anderson', roll: 'CS-2023-201', batch: '2023-2027', semester: '3rd', email: 'noah@uni.edu', section: 'C', status: 'Active', courses: ['Discrete Math', 'OOP', 'Digital Logic'] },
    ];

    const filteredData = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.roll.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-indigo-600 text-slate-200 text-xs font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4">Roll No / Batch</th>
                            <th className="px-6 py-4">Semester / Sec</th>
                            <th className="px-6 py-4">Enrolled Courses</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.map((student, idx) => (
                            <tr key={student.id} className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-slate-50 hover:bg-gray-100'}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                                            {student.name.charAt(0)}
                                        </div>
                                        <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-semibold text-gray-800">{student.roll}</p>
                                    <p className="text-xs text-gray-500">Batch: {student.batch}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                                        Sem {student.semester}
                                    </span>
                                    <span className="ml-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                                        {student.section}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {student.courses.map((c, i) => (
                                            <span key={i} className="text-[10px] font-semibold bg-gray-50 border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded truncate">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{student.email}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700">
                                        {student.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveStudents;