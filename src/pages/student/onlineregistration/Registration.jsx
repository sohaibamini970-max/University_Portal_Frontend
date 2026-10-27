import React, { useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { FileText, CheckCircle, Clock, BookOpen, Save, X, User, Lock, Users } from 'lucide-react';

const Registration = () => {
    const [selectedSection, setSelectedSection] = useState('ALL');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // Updated courses with 'seats' property
    const sectionCourses = {
        A: [
            { id: 1, code: 'CS-401', name: 'Machine Learning', credits: 4, teacher: 'Dr. Khan', type: 'Core', seats: 12 },
            { id: 2, code: 'CS-402', name: 'Mobile App Development', credits: 3, teacher: 'Ms. Fatima', type: 'Elective', seats: 0 }, // FULL
            { id: 3, code: 'CS-403', name: 'Cloud Computing', credits: 3, teacher: 'Mr. Ahmed', type: 'Core', seats: 5 },
            { id: 4, code: 'CS-404', name: 'Cyber Security', credits: 4, teacher: 'Dr. Raza', type: 'Elective', seats: 20 },
        ],
        B: [
            { id: 5, code: 'CS-401', name: 'Machine Learning', credits: 4, teacher: 'Dr. Ali', type: 'Core', seats: 3 },
            { id: 6, code: 'CS-405', name: 'Data Science', credits: 3, teacher: 'Ms. Zara', type: 'Elective', seats: 0 }, // FULL
            { id: 7, code: 'CS-403', name: 'Cloud Computing', credits: 3, teacher: 'Mr. Bilal', type: 'Core', seats: 15 },
        ],
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

    const toggleCourse = (id, seats) => {
        if (seats === 0) return; // Prevent toggling if no seats
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
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

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
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Register Courses</h2>
                                <p className="text-sm text-gray-500">Select your courses for the upcoming semester.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-gray-700 whitespace-nowrap">Section:</label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer w-full sm:w-40"
                            >
                                <option value="ALL">All Sections</option>
                                {['A', 'B', 'C', 'D', 'E', 'F'].map(sec => (
                                    <option key={sec} value={sec}>Section {sec}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* DESKTOP VIEW (Table) */}
                    {/* ========================================================= */}
                    <div className="hidden md:block overflow-x-auto">
                        <div className="min-w-[800px]">
                            {/* Table Header with Seats Column */}
                            <div className="grid grid-cols-12 gap-4 bg-indigo-600 text-slate-200 text-sm font-bold uppercase tracking-wider p-4">
                                <div className="col-span-4 pl-2">Course Name</div>
                                <div className="col-span-1 text-center">Type</div>
                                <div className="col-span-1 text-center">Section</div>
                                <div className="col-span-2 text-center">Seats</div>
                                <div className="col-span-2 pl-2">Instructor</div>
                                <div className="col-span-1 text-center">Credits</div>
                                <div className="col-span-1 text-center">Action</div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {displayedCourses.map((course) => {
                                    const isFull = course.seats === 0;

                                    return (
                                        <div
                                            key={course.id}
                                            className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors ${isFull ? 'bg-gray-50 opacity-60' : course.selected ? 'bg-indigo-50/30' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="col-span-4 pl-2">
                                                <h3 className="font-bold text-gray-900 text-sm">{course.name}</h3>
                                                <p className="text-xs font-semibold text-indigo-600 mt-0.5">{course.code}</p>
                                            </div>

                                            <div className="col-span-1 text-center">
                                                <span className={`inline-block text-[12px] font-bold px-2 py-0.5 rounded-md ${course.type === 'Core' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                    {course.type}
                                                </span>
                                            </div>

                                            <div className="col-span-1 text-center">
                                                <span className="inline-block text-[12px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                                                    {course.section}
                                                </span>
                                            </div>

                                            {/* Seats Column */}
                                            <div className="col-span-2 text-center">
                                                {isFull ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                                                        <Users className="w-3 h-3" /> Full
                                                    </span>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${course.seats <= 5 ? 'text-orange-600 bg-orange-50' : 'text-emerald-600 bg-emerald-50'}`}>
                                                        <Users className="w-3 h-3" /> {course.seats} Left
                                                    </span>
                                                )}
                                            </div>

                                            <div className="col-span-2 pl-2">
                                                <p className="text-sm text-gray-600 font-bold truncate">{course.teacher}</p>
                                            </div>

                                            <div className="col-span-1 text-center">
                                                <span className="font-bold text-gray-800 text-sm">{course.credits}</span>
                                            </div>

                                            {/* Action Column (Checkbox or Lock) */}
                                            <div className="col-span-1 flex justify-center">
                                                {isFull ? (
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center" title="No seats available">
                                                        <Lock className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        checked={course.selected}
                                                        onChange={() => toggleCourse(course.id, course.seats)}
                                                        className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* MOBILE VIEW (Cards) */}
                    {/* ========================================================= */}
                    <div className="block md:hidden divide-y divide-gray-100">
                        {displayedCourses.map((course) => {
                            const isFull = course.seats === 0;
                            return (
                                <div
                                    key={course.id}
                                    onClick={() => toggleCourse(course.id, course.seats)}
                                    className={`p-4 transition-colors ${isFull ? 'bg-gray-50 opacity-60' : course.selected ? 'bg-indigo-50/50' : 'bg-white'
                                        } ${!isFull && 'cursor-pointer'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-base">{course.name}</h3>
                                            <p className="text-xs font-semibold text-indigo-600 mt-0.5">{course.code}</p>
                                        </div>

                                        {/* Checkbox or Lock */}
                                        {isFull ? (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <Lock className="w-4 h-4 text-gray-500" />
                                            </div>
                                        ) : (
                                            <input
                                                type="checkbox"
                                                checked={course.selected}
                                                readOnly
                                                className="w-6 h-6 mt-1 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${course.type === 'Core' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {course.type}
                                        </span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                                            Sec {course.section}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isFull ? 'bg-red-50 text-red-700' : course.seats <= 5 ? 'bg-orange-50 text-orange-700' : 'bg-emerald-50 text-emerald-700'
                                            }`}>
                                            {isFull ? 'Full' : `${course.seats} Seats Left`}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">{course.teacher}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer / Submit Button */}
                    <div className="p-5 md:p-6 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-center md:text-left">
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
                            className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 text-white font-bold rounded-xl shadow-md transition-colors ${currentSelectionCount > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
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
                        <button onClick={closePopup} className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Completed!</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            You have successfully registered for <strong className="text-indigo-600">{currentSelectionCount}</strong> course(s) for the Spring 2025 semester.
                        </p>
                        <button onClick={closePopup} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors">
                            Done
                        </button>
                    </div>
                </div>
            )}

        </Layout>
    );
};

export default Registration;