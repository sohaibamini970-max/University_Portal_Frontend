import React, { useState } from 'react';
import {
    Power, Layers, ArrowLeft, BookOpen, ChevronRight,
    GraduationCap, Users, CheckCircle, AlertTriangle
} from 'lucide-react';

const ManageRegistration = () => {
    const [selectedSemester, setSelectedSemester] = useState(null);

    // Mock Data: Semester -> Batch -> Department -> Courses with full details
    const [registrationData, setRegistrationData] = useState([
        {
            semester: '2nd',
            batches: [
                {
                    id: 'B1', name: '2024-2028', isOpen: true,
                    departments: [
                        {
                            name: 'Computer Science (BCS)',
                            courses: [
                                {
                                    code: 'CS-102', name: 'Programming Fundamentals', credits: 4, isOpen: true,
                                    sections: [
                                        { name: 'A', limit: 50, enrolled: 45 },
                                        { name: 'B', limit: 50, enrolled: 48 },
                                        { name: 'C', limit: 40, enrolled: 0 },
                                    ]
                                },
                                {
                                    code: 'MATH-102', name: 'Calculus II', credits: 3, isOpen: true,
                                    sections: [
                                        { name: 'A', limit: 60, enrolled: 55 },
                                    ]
                                }
                            ]
                        },
                    ]
                }
            ]
        },
        {
            semester: '3rd',
            batches: [
                {
                    id: 'B3', name: '2023-2027', isOpen: false,
                    departments: [
                        {
                            name: 'Software Engineering (BSE)',
                            courses: [
                                {
                                    code: 'SE-201', name: 'Data Structures', credits: 4, isOpen: false,
                                    sections: [
                                        { name: 'A', limit: 45, enrolled: 40 },
                                        { name: 'B', limit: 45, enrolled: 30 },
                                    ]
                                }
                            ]
                        }
                    ]
                },
            ]
        },
        { semester: '4th', batches: [] },
        { semester: '5th', batches: [] },
        { semester: '6th', batches: [] },
        { semester: '7th', batches: [] },
        { semester: '8th', batches: [] },
    ]);

    const allSemesters = ['2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

    // Toggle Registration for a whole Batch
    const handleToggleBatch = (semesterName, batchId) => {
        setRegistrationData(prev => prev.map(sem => {
            if (sem.semester === semesterName) {
                return {
                    ...sem,
                    batches: sem.batches.map(batch =>
                        batch.id === batchId ? { ...batch, isOpen: !batch.isOpen } : batch
                    )
                };
            }
            return sem;
        }));
    };

    // Toggle Registration for a specific Course
    const handleToggleCourse = (semesterName, batchId, deptName, courseCode) => {
        setRegistrationData(prev => prev.map(sem => {
            if (sem.semester === semesterName) {
                return {
                    ...sem,
                    batches: sem.batches.map(batch => {
                        if (batch.id === batchId) {
                            return {
                                ...batch,
                                departments: batch.departments.map(dept => {
                                    if (dept.name === deptName) {
                                        return {
                                            ...dept,
                                            courses: dept.courses.map(course =>
                                                course.code === courseCode ? { ...course, isOpen: !course.isOpen } : course
                                            )
                                        };
                                    }
                                    return dept;
                                })
                            };
                        }
                        return batch;
                    })
                };
            }
            return sem;
        }));
    };

    // Update Section Limit
    const handleUpdateLimit = (semesterName, batchId, deptName, courseCode, sectionName, newLimit) => {
        setRegistrationData(prev => prev.map(sem => {
            if (sem.semester === semesterName) {
                return {
                    ...sem,
                    batches: sem.batches.map(batch => {
                        if (batch.id === batchId) {
                            return {
                                ...batch,
                                departments: batch.departments.map(dept => {
                                    if (dept.name === deptName) {
                                        return {
                                            ...dept,
                                            courses: dept.courses.map(course => {
                                                if (course.code === courseCode) {
                                                    return {
                                                        ...course,
                                                        sections: course.sections.map(sec =>
                                                            sec.name === sectionName ? { ...sec, limit: Number(newLimit) } : sec
                                                        )
                                                    };
                                                }
                                                return course;
                                            })
                                        };
                                    }
                                    return dept;
                                })
                            };
                        }
                        return batch;
                    })
                };
            }
            return sem;
        }));
    };

    // ---------------------------------------------------------
    // VIEW 1: SEMESTER SELECTION
    // ---------------------------------------------------------
    if (!selectedSemester) {
        return (
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Power className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Manage Course Registration</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Select a semester to manage registration, courses, and section limits.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {allSemesters.map(sem => {
                        const semData = registrationData.find(d => d.semester === sem);
                        const activeBatches = semData?.batches.filter(b => b.isOpen).length || 0;

                        return (
                            <button
                                key={sem}
                                onClick={() => setSelectedSemester(sem)}
                                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-300 hover:-translate-y-1 transition-all text-left flex flex-col group"
                            >
                                <div className="flex justify-between items-center w-full mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{sem} Semester</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {activeBatches > 0
                                        ? `${activeBatches} batch(es) open for registration`
                                        : 'No active registrations'}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------
    // VIEW 2: BATCH, COURSE & SECTION MANAGEMENT
    // ---------------------------------------------------------
    const currentSemData = registrationData.find(d => d.semester === selectedSemester);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header & Back Button */}
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={() => setSelectedSemester(null)}
                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedSemester} Semester Management</h2>
                    <p className="text-sm text-gray-500">Manage batches, department courses, and section limits.</p>
                </div>
            </div>

            {/* Batches List */}
            <div className="space-y-6">
                {currentSemData?.batches.length > 0 ? (
                    currentSemData.batches.map(batch => (
                        <div key={batch.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                            {/* Batch Header */}
                            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Batch: {batch.name}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Toggle registration to allow students to enroll.</p>
                                </div>

                                {/* Toggle Switch */}
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${batch.isOpen ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {batch.isOpen ? 'Registration Open' : 'Registration Closed'}
                                    </span>
                                    <button
                                        onClick={() => handleToggleBatch(selectedSemester, batch.id)}
                                        className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors focus:outline-none ${batch.isOpen ? 'bg-emerald-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ${batch.isOpen ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>
                            </div>

                            {/* Departments & Courses Grid */}
                            <div className={`p-6 space-y-8 ${!batch.isOpen ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
                                {batch.departments.map(dept => (
                                    <div key={dept.name}>
                                        {/* Department Header */}
                                        <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                                            <GraduationCap className="w-5 h-5 text-indigo-600" />
                                            <h4 className="font-bold text-gray-800 text-lg">{dept.name}</h4>
                                        </div>

                                        {/* Courses List */}
                                        <div className="space-y-4">
                                            {dept.courses.map(course => (
                                                <div key={course.code} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">

                                                    {/* Course Info & Toggle */}
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs">{course.code}</span>
                                                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{course.credits} Credits</span>
                                                            </div>
                                                            <h5 className="font-bold text-gray-900 text-lg">{course.name}</h5>
                                                        </div>

                                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                                            <span className={`text-xs font-bold ${course.isOpen ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                                {course.isOpen ? 'Open' : 'Closed'}
                                                            </span>
                                                            <button
                                                                onClick={() => handleToggleCourse(selectedSemester, batch.id, dept.name, course.code)}
                                                                className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors ${course.isOpen ? 'bg-emerald-500' : 'bg-gray-300'
                                                                    }`}
                                                            >
                                                                <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${course.isOpen ? 'translate-x-4' : 'translate-x-1'
                                                                    }`} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Sections & Limits */}
                                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Layers className="w-4 h-4 text-gray-400" />
                                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Available Sections & Limits</p>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                            {course.sections.map(sec => (
                                                                <div key={sec.name} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between shadow-sm">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm ${sec.enrolled >= sec.limit
                                                                                ? 'bg-red-100 text-red-600'
                                                                                : 'bg-emerald-100 text-emerald-700'
                                                                            }`}>
                                                                            {sec.name}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-bold text-gray-500 uppercase">Enrolled</p>
                                                                            <p className="text-xs font-bold text-gray-800">{sec.enrolled} / {sec.limit}</p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Limit Input */}
                                                                    <div className="flex flex-col items-end">
                                                                        <label className="text-[9px] font-bold text-gray-400 uppercase mb-1">Max Limit</label>
                                                                        <input
                                                                            type="number"
                                                                            value={sec.limit}
                                                                            onChange={(e) => handleUpdateLimit(selectedSemester, batch.id, dept.name, course.code, sec.name, e.target.value)}
                                                                            className="w-16 px-2 py-1 text-center bg-gray-50 border border-gray-300 rounded text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!batch.isOpen && (
                                <div className="px-6 pb-6">
                                    <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" /> Turn on batch registration to manage courses and limits.
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="p-10 text-center bg-white border border-gray-200 rounded-2xl text-gray-500">
                        No batches found for {selectedSemester} Semester.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageRegistration;