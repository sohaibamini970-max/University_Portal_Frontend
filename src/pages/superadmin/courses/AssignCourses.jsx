import React, { useState } from 'react';
import { Layers, CheckCircle, BookOpen } from 'lucide-react';

const AssignCourses = () => {
    // Mock Data: Courses ready to be assigned
    const [courses, setCourses] = useState([
        {
            id: 1, code: 'CS-301', name: 'Data Structures', type: 'Core', credits: 4,
            // Notice how semester and sections are now nested inside the department object
            departments: [
                { name: 'Computer Science', semester: '3rd', sections: ['A', 'B'] }
            ]
        },
        {
            id: 2, code: 'SE-401', name: 'Software Architecture', type: 'Core', credits: 3,
            departments: [] // Not assigned anywhere yet
        }
    ]);

    const allDepartments = ['Computer Science', 'Software Engineering', 'Information Technology', 'Mathematics'];
    const allSections = ['A', 'B', 'C', 'D', 'E', 'F'];
    const allSemesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

    // Toggle Department Assignment
    const handleDepartmentToggle = (courseId, deptName) => {
        setCourses(prev => prev.map(course => {
            if (course.id === courseId) {
                const isAssigned = course.departments.some(d => d.name === deptName);
                if (isAssigned) {
                    // Remove department
                    return { ...course, departments: course.departments.filter(d => d.name !== deptName) };
                } else {
                    // Add department with default semester and no sections
                    return {
                        ...course,
                        departments: [...course.departments, { name: deptName, semester: '1st', sections: [] }]
                    };
                }
            }
            return course;
        }));
    };

    // Update Semester for a specific department
    const handleSemesterChange = (courseId, deptName, semester) => {
        setCourses(prev => prev.map(course => {
            if (course.id === courseId) {
                return {
                    ...course,
                    departments: course.departments.map(d =>
                        d.name === deptName ? { ...d, semester } : d
                    )
                };
            }
            return course;
        }));
    };

    // Toggle Section for a specific department
    const handleSectionToggle = (courseId, deptName, section) => {
        setCourses(prev => prev.map(course => {
            if (course.id === courseId) {
                return {
                    ...course,
                    departments: course.departments.map(d => {
                        if (d.name === deptName) {
                            const hasSection = d.sections.includes(section);
                            return {
                                ...d,
                                sections: hasSection ? d.sections.filter(s => s !== section) : [...d.sections, section]
                            };
                        }
                        return d;
                    })
                };
            }
            return course;
        }));
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Assign Courses to Departments & Semesters</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">

                        {/* Course Header */}
                        <div className="p-5 border-b border-gray-100 bg-slate-800 text-white">
                            <span className="font-bold bg-white/20 px-2.5 py-1 rounded-md text-xs">{course.code}</span>
                            <h3 className="font-bold text-lg mt-2">{course.name}</h3>
                            <p className="text-sm text-slate-300">{course.type} • {course.credits} Credits</p>
                        </div>

                        {/* Departments List */}
                        <div className="p-5 space-y-3 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Layers className="w-4 h-4 text-indigo-500" />
                                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Assign to Departments</p>
                            </div>

                            {allDepartments.map(deptName => {
                                const assignment = course.departments.find(d => d.name === deptName);
                                const isAssigned = !!assignment;

                                return (
                                    <div key={deptName} className={`border rounded-xl transition-all overflow-hidden ${isAssigned ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 bg-white'
                                        }`}>
                                        {/* Department Checkbox */}
                                        <label className={`flex items-center justify-between p-4 cursor-pointer ${isAssigned ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}>
                                            <span className={`text-sm font-bold ${isAssigned ? 'text-emerald-800' : 'text-gray-700'}`}>{deptName}</span>
                                            <input
                                                type="checkbox"
                                                checked={isAssigned}
                                                onChange={() => handleDepartmentToggle(course.id, deptName)}
                                                className="w-5 h-5 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
                                            />
                                        </label>

                                        {/* Expanded Details (Semester & Sections) if Assigned */}
                                        {isAssigned && (
                                            <div className="p-4 border-t border-emerald-100 space-y-4 animate-in slide-in-from-top-2">
                                                {/* Semester Selector */}
                                                <div>
                                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Assign Semester</label>
                                                    <select
                                                        value={assignment.semester}
                                                        onChange={(e) => handleSemesterChange(course.id, deptName, e.target.value)}
                                                        className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                                    >
                                                        {allSemesters.map(sem => (
                                                            <option key={sem} value={sem}>{sem} Semester</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Sections Selector */}
                                                <div>
                                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Available Sections</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {allSections.map(sec => {
                                                            const isSelected = assignment.sections.includes(sec);
                                                            return (
                                                                <label key={sec} className={`w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer font-bold text-xs transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                                                                    }`}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="hidden"
                                                                        checked={isSelected}
                                                                        onChange={() => handleSectionToggle(course.id, deptName, sec)}
                                                                    />
                                                                    {sec}
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignCourses;