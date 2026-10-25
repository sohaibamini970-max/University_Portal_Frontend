import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import {
    Search, BookOpen, Users, Layers, X, CheckCircle,
    AlertCircle, ChevronRight
} from 'lucide-react';

const AssignCourses = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('All');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [successSection, setSuccessSection] = useState(null);

    // Mock Data: Grouped by semester
    const [courses, setCourses] = useState([
        {
            id: 1, code: 'CS-301', name: 'Data Structures', semester: '3rd', credits: 4,
            sections: [
                { id: '1A', name: 'A', students: 45, teacher: 'Dr. Smith' },
                { id: '1B', name: 'B', students: 42, teacher: '' },
                { id: '1C', name: 'C', students: 40, teacher: '' },
            ]
        },
        {
            id: 3, code: 'CS-303', name: 'Algorithms', semester: '3rd', credits: 4,
            sections: [
                { id: '3A', name: 'A', students: 38, teacher: '' },
            ]
        },
        {
            id: 2, code: 'CS-302', name: 'Web Development', semester: '4th', credits: 3,
            sections: [
                { id: '2A', name: 'A', students: 40, teacher: 'Sarah Wilson' },
                { id: '2B', name: 'B', students: 38, teacher: '' },
            ]
        },
    ]);

    const availableTeachers = [
        { id: 1, name: 'Dr. Smith', designation: 'Professor' },
        { id: 2, name: 'John Doe', designation: 'Lecturer' },
        { id: 3, name: 'Sarah Wilson', designation: 'Assistant Professor' },
        { id: 4, name: 'Mike Chen', designation: 'Lecturer' },
        { id: 5, name: 'David Lee', designation: 'Professor' },
    ];

    // Filter Logic
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSemester = selectedSemester === 'All' || course.semester === selectedSemester;
        return matchesSearch && matchesSemester;
    });

    // Global Stats
    const totalSections = courses.reduce((acc, course) => acc + course.sections.length, 0);
    const unassignedSections = courses.reduce((acc, course) =>
        acc + course.sections.filter(sec => !sec.teacher).length, 0
    );

    const handleAssignInline = (courseId, sectionId, teacherName) => {
        setCourses(prevCourses =>
            prevCourses.map(course => {
                if (course.id === courseId) {
                    return {
                        ...course,
                        sections: course.sections.map(sec =>
                            sec.id === sectionId ? { ...sec, teacher: teacherName } : sec
                        )
                    };
                }
                return course;
            })
        );

        setSuccessSection(sectionId);
        setTimeout(() => setSuccessSection(null), 1500);

        setSelectedCourse(prev => {
            if (!prev) return null;
            return {
                ...prev,
                sections: prev.sections.map(sec =>
                    sec.id === sectionId ? { ...sec, teacher: teacherName } : sec
                )
            };
        });
    };

    return (
        <Layout title="Course Assignments" subtitle="Manage teacher assignments for specific course sections">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                {/* Control Bar: Search & Semester Filter */}
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="relative w-full md:w-96 p-2">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by course name or code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto p-2 md:p-0">
                        <label className="text-sm font-bold text-gray-700 whitespace-nowrap flex items-center gap-2">
                            <Layers className="w-4 h-4 text-gray-400" /> Filter Semester:
                        </label>
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="w-full md:w-40 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                        >
                            <option value="All">All Semesters</option>
                            {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(sem => (
                                <option key={sem} value={sem}>{sem} Semester</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* List View (Row by Row) */}
                <div className="space-y-4">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => {
                            const assignedCount = course.sections.filter(s => s.teacher).length;
                            const isFullyAssigned = assignedCount === course.sections.length;

                            return (
                                <div
                                    key={course.id}
                                    onClick={() => setSelectedCourse(course)}
                                    className="group cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between p-5 gap-4"
                                >
                                    {/* Left: Course Info */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${isFullyAssigned ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-orange-50 border-orange-200 text-orange-600'
                                            }`}>
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                                    {course.code}
                                                </span>
                                                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                    Sem {course.semester}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-lg">{course.name}</h3>
                                            <p className="text-sm text-gray-500">{course.credits} Credits</p>
                                        </div>
                                    </div>

                                    {/* Middle: Sections Overview */}
                                    <div className="flex-1 w-full md:w-auto">
                                        <div className="flex items-center justify-between md:justify-end gap-2 text-xs font-bold mb-2">
                                            <span className="text-gray-500 md:hidden">Sections:</span>
                                            <span className={isFullyAssigned ? 'text-emerald-600' : 'text-orange-500'}>
                                                {assignedCount} / {course.sections.length} Assigned
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap md:justify-end gap-2">
                                            {course.sections.map(sec => (
                                                <div
                                                    key={sec.id}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${sec.teacher
                                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                            : 'bg-orange-50 border-orange-200 text-orange-600 border-dashed'
                                                        }`}
                                                >
                                                    Sec {sec.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: Action Indicator */}
                                    <div className="hidden md:flex shrink-0 text-gray-400 group-hover:text-emerald-600 transition-colors pl-4 border-l border-gray-100">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-10 text-center text-gray-500 bg-white border border-gray-200 rounded-2xl">
                            No courses found for this semester or search query.
                        </div>
                    )}
                </div>
            </div>

            {/* 👇 COURSE DETAILS & ASSIGNMENT MODAL 👇 */}
            {selectedCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white relative shrink-0">
                            <button
                                onClick={() => setSelectedCourse(null)}
                                className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
                                    <p className="text-emerald-100 font-medium">
                                        {selectedCourse.code} • Semester {selectedCourse.semester} • {selectedCourse.credits} Credits
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    Section Assignments
                                </h3>
                                <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-md">
                                    {selectedCourse.sections.length} Sections Total
                                </span>
                            </div>

                            {selectedCourse.sections.map((section) => (
                                <div key={section.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-lg border border-emerald-100">
                                            {section.name}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Section {section.name}</p>
                                            <p className="text-xs text-gray-500">{section.students} Students enrolled</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 sm:max-w-xs w-full">
                                        {successSection === section.id ? (
                                            <div className="flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-lg border border-emerald-200 animate-in zoom-in-95">
                                                <CheckCircle className="w-4 h-4" /> Assigned!
                                            </div>
                                        ) : (
                                            <select
                                                value={section.teacher || ''}
                                                onChange={(e) => handleAssignInline(selectedCourse.id, section.id, e.target.value)}
                                                className={`w-full px-3 py-2.5 border rounded-lg text-sm font-semibold outline-none cursor-pointer transition-colors ${section.teacher
                                                        ? 'bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-emerald-500'
                                                        : 'bg-orange-50 border-orange-200 text-orange-800 focus:ring-2 focus:ring-orange-500'
                                                    }`}
                                            >
                                                <option value="" disabled>-- Assign Teacher --</option>
                                                {availableTeachers.map(teacher => (
                                                    <option key={teacher.id} value={teacher.name}>
                                                        {teacher.name} ({teacher.designation})
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-white border-t border-gray-200 shrink-0 text-right">
                            <button
                                onClick={() => setSelectedCourse(null)}
                                className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </Layout>
    );
};

export default AssignCourses;