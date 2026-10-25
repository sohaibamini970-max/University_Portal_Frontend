import React, { useState } from 'react';
import { BookOpen, CheckCircle, Users } from 'lucide-react';

const FirstSemesterRegistration = () => {
    const [selectedProgram, setSelectedProgram] = useState('BS Computer Science');
    const [selectedSection, setSelectedSection] = useState('A');
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock Data: Courses for 1st Semester
    const firstSemesterCourses = [
        { code: 'CS-101', name: 'Introduction to Computing', credits: 3 },
        { code: 'MATH-101', name: 'Calculus I', credits: 3 },
        { code: 'ENG-101', name: 'English Composition', credits: 3 },
        { code: 'PHY-101', name: 'Applied Physics', credits: 4 },
        { code: 'CS-102', name: 'Programming Fundamentals', credits: 4 },
    ];

    const totalStudents = 45; // In a real app, fetch this based on Program + Section

    const handleAssign = () => {
        // API Call to assign these courses to all students in this program/section
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">1st Semester Course Auto-Assignment</h2>
                        <p className="text-sm text-gray-500">Automatically enroll all new students into their core foundational courses.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Select Program</label>
                        <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none">
                            <option>BS Computer Science</option>
                            <option>BS Software Engineering</option>
                            <option>BS Business Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Select Section</label>
                        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none">
                            {['A', 'B', 'C', 'D'].map(sec => <option key={sec}>Section {sec}</option>)}
                        </select>
                    </div>
                </div>

                {/* Preview Courses */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
                        <h3 className="font-bold text-sm uppercase tracking-wider">1st Semester Core Courses</h3>
                        <span className="bg-white/20 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {totalStudents} Students
                        </span>
                    </div>
                    <div className="divide-y divide-gray-100 bg-white">
                        {firstSemesterCourses.map(course => (
                            <div key={course.code} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-gray-900">{course.name}</p>
                                    <p className="text-xs font-semibold text-emerald-600">{course.code}</p>
                                </div>
                                <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                                    {course.credits} Credits
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-6 border-t border-gray-100 flex justify-end mt-6">
                    <button onClick={handleAssign} className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition-colors">
                        <CheckCircle className="w-5 h-5" /> Auto-Assign to All {selectedProgram} {selectedSection} Students
                    </button>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm text-center p-6 animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Courses Assigned!</h2>
                        <p className="text-sm text-gray-500 mb-6">All 1st semester students in {selectedProgram} (Section {selectedSection}) have been enrolled in these courses.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FirstSemesterRegistration;