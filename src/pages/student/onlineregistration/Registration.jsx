import React, { useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { FileText, CheckCircle, Clock, BookOpen, Save, X } from 'lucide-react';

const Registration = () => {
    const [selectedSection, setSelectedSection] = useState('ALL');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const sectionCourses = {
        A: [
            { id: 1, code: 'CS-401', name: 'Machine Learning', credits: 4, teacher: 'Dr. Khan', type: 'Core' },
            { id: 2, code: 'CS-402', name: 'Mobile App Development', credits: 3, teacher: 'Ms. Fatima', type: 'Elective' },
            { id: 3, code: 'CS-403', name: 'Cloud Computing', credits: 3, teacher: 'Mr. Ahmed', type: 'Core' },
            { id: 4, code: 'CS-404', name: 'Cyber Security', credits: 4, teacher: 'Dr. Raza', type: 'Elective' },
        ],
        B: [
            { id: 5, code: 'CS-401', name: 'Machine Learning', credits: 4, teacher: 'Dr. Ali', type: 'Core' },
            { id: 6, code: 'CS-405', name: 'Data Science', credits: 3, teacher: 'Ms. Zara', type: 'Elective' },
            { id: 7, code: 'CS-403', name: 'Cloud Computing', credits: 3, teacher: 'Mr. Bilal', type: 'Core' },
        ],
        C: [
            { id: 8, code: 'CS-402', name: 'Mobile App Development', credits: 3, teacher: 'Ms. Ayesha', type: 'Elective' },
            { id: 9, code: 'CS-406', name: 'Blockchain Tech', credits: 3, teacher: 'Mr. Hamza', type: 'Core' },
            { id: 10, code: 'CS-404', name: 'Cyber Security', credits: 4, teacher: 'Dr. Usman', type: 'Elective' },
        ],
        D: [
            { id: 11, code: 'CS-401', name: 'Machine Learning', credits: 4, teacher: 'Dr. Tariq', type: 'Core' },
            { id: 12, code: 'CS-407', name: 'Software Engineering', credits: 3, teacher: 'Ms. Nadia', type: 'Core' },
        ],
        E: [
            { id: 13, code: 'CS-408', name: 'Artificial Intelligence', credits: 4, teacher: 'Dr. Sohail', type: 'Core' },
            { id: 14, code: 'CS-402', name: 'Mobile App Development', credits: 3, teacher: 'Ms. Hina', type: 'Elective' },
        ],
        F: [
            { id: 15, code: 'CS-409', name: 'Game Development', credits: 3, teacher: 'Mr. Faisal', type: 'Elective' },
            { id: 16, code: 'CS-403', name: 'Cloud Computing', credits: 3, teacher: 'Mr. Zain', type: 'Core' },
        ]
    };

    const [allCourses, setAllCourses] = useState(() => {
        let flat = [];
        Object.keys(sectionCourses).forEach((sec) => {
            sectionCourses[sec].forEach(course => {
                flat.push({ ...course, section: sec, selected: false });
            });
        });
        return flat;
    });

    const displayedCourses = allCourses.filter(course =>
        selectedSection === 'ALL' ? true : course.section === selectedSection
    );

    const registeredCount = 3;
    const obtainedCredits = 11;
    const currentSelectionCredits = displayedCourses
        .filter(c => c.selected)
        .reduce((sum, c) => sum + c.credits, 0);
    const currentSelectionCount = displayedCourses.filter(c => c.selected).length;

    const toggleCourse = (id) => {
        setAllCourses(prev =>
            prev.map(course =>
                course.id === id ? { ...course, selected: !course.selected } : course
            )
        );
    };

    const handleSubmit = () => {
        if (currentSelectionCount === 0) return;
        setShowSuccessPopup(true);
    };

    const closePopup = () => {
        setShowSuccessPopup(false);
    };

    return (
        <Layout title="Course Registration" subtitle="Spring 2025 Semester Registration">
            <div className="space-y-6 pb-8">

                {/* 1. Top Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Registered Courses</p>
                            <p className="text-3xl font-bold mt-1 text-gray-900">{registeredCount}</p>
                            <p className="text-sm text-indigo-600 mt-1">For current semester</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-90">Maximum Credit Hours</p>
                                <p className="text-3xl font-bold mt-1">{obtainedCredits + currentSelectionCredits}</p>
                                <p className="text-sm opacity-75 mt-1">Including current selection</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Obtained Credit Hours</p>
                            <p className="text-3xl font-bold mt-1 text-gray-900">{obtainedCredits}</p>
                            <p className="text-sm text-emerald-600 mt-1">For Current semester</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* 2. Registration Container */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                    {/* Header & Section Dropdown */}
                    <div className="p-5 md:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Register Courses</h2>
                                <p className="text-sm text-gray-500">Select your courses for the upcoming semester.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-gray-700 whitespace-nowrap">Filter Section:</label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer w-40"
                            >
                                <option value="ALL">All Sections</option>
                                {['A', 'B', 'C', 'D', 'E', 'F'].map(sec => (
                                    <option key={sec} value={sec}>Section {sec}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table Header & Rows */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[700px]">

                            {/* Table Header Row */}
                            <div className="grid grid-cols-12 gap-4 bg-indigo-600 text-slate-200 text-sm font-bold uppercase tracking-wider p-4 rounded-t-none">
                                <div className="col-span-4 pl-2">Course Name</div>
                                <div className="col-span-1 text-center">Type</div>
                                <div className="col-span-1 text-center">Section</div>
                                <div className="col-span-3 pl-4">Instructor</div>
                                <div className="col-span-1 text-center">Credits</div>
                                <div className="col-span-2 text-center">Action</div>
                            </div>

                            {/* Course Rows */}
                            <div className="divide-y divide-gray-100">
                                {displayedCourses.length > 0 ? (
                                    displayedCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-gray-50 ${course.selected ? 'bg-indigo-50/30' : ''}`}
                                        >
                                            {/* Course Name */}
                                            <div className="col-span-4 pl-2">
                                                <h3 className="font-bold text-gray-900 text-sm">{course.name}</h3>
                                                <p className="text-xs font-semibold text-indigo-600 mt-0.5">{course.code}</p>
                                            </div>

                                            {/* Type (Core/Elective) */}
                                            <div className="col-span-1 text-center">
                                                <span className={`inline-block text-[12px] font-bold px-2 py-0.5 rounded-md ${course.type === 'Core' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                    {course.type}
                                                </span>
                                            </div>

                                            {/* Section */}
                                            <div className="col-span-1 text-center">
                                                <span className="inline-block text-[12px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                                                    {course.section}
                                                </span>
                                            </div>

                                            {/* Instructor */}
                                            <div className="col-span-3 pl-4">
                                                <p className="text-lg text-gray-600 font-bold truncate">{course.teacher}</p>
                                            </div>

                                            {/* Credits */}
                                            <div className="col-span-1 text-center">
                                                <span className="font-bold text-gray-800 text-sm">{course.credits}</span>
                                            </div>

                                            {/* Action (Checkbox) */}
                                            <div className="col-span-2 flex justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={course.selected}
                                                    onChange={() => toggleCourse(course.id)}
                                                    className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        No courses available for Section {selectedSection}.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer / Submit Button */}
                    <div className="p-5 md:p-6 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                You have selected <strong className="text-indigo-700 font-black">{currentSelectionCount}</strong> course(s).
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Total credit hours to add: <strong className="text-gray-900">{currentSelectionCredits}</strong>
                            </p>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={currentSelectionCount === 0}
                            className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 text-white font-bold rounded-xl shadow-md transition-colors ${currentSelectionCount > 0
                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Save className="w-4 h-4" /> Submit Registration
                        </button>
                    </div>
                </div>

            </div>

            {/* SUCCESS POPUP MODAL */}
            {showSuccessPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-300 text-center p-6">
                        <button
                            onClick={closePopup}
                            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Completed!</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            You have successfully registered for <strong className="text-indigo-600">{currentSelectionCount}</strong> course(s) for the Spring 2025 semester.
                        </p>
                        <button
                            onClick={closePopup}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

        </Layout>
    );
};

export default Registration;