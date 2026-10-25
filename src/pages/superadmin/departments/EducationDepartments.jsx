import React, { useState } from 'react';
import { GraduationCap, Users, Eye, Edit2, Trash2, X } from 'lucide-react';

const EducationDepartments = () => {
    const [selectedDept, setSelectedDept] = useState(null);

    const departments = [
        {
            id: 1, name: 'Computer Science', code: 'CS',
            admin: 'Dr. Smith', head: 'Dr. A. K. Khan', chairman: 'Dr. Zubair Ahmed',
            students: 450, teachers: 25, staff: 10, courses: 12,
            established: '2010', color: 'blue', icon: GraduationCap,
            email: 'cs.dept@university.edu',
            desc: 'Department of Computer Science offering BS, MS, and PhD programs.'
        },
        {
            id: 2, name: 'Information Technology', code: 'IT',
            admin: 'Dr. Johnson', head: 'Dr. S. Ali', chairman: 'Dr. Zubair Ahmed',
            students: 380, teachers: 20, staff: 8, courses: 10,
            established: '2012', color: 'indigo', icon: GraduationCap,
            email: 'it.dept@university.edu',
            desc: 'Focused on networking, cybersecurity, and IT infrastructure.'
        },
        {
            id: 3, name: 'Software Engineering', code: 'SE',
            admin: 'Dr. Williams', head: 'Dr. M. Hassan', chairman: 'Dr. Zubair Ahmed',
            students: 520, teachers: 30, staff: 12, courses: 15,
            established: '2015', color: 'purple', icon: GraduationCap,
            email: 'se.dept@university.edu',
            desc: 'Specializing in software development lifecycle and agile methodologies.'
        },
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: { bg: 'bg-blue-50', text: 'text-blue-600', gradient: 'from-blue-500 to-indigo-600' },
            indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', gradient: 'from-indigo-500 to-purple-600' },
            purple: { bg: 'bg-purple-50', text: 'text-purple-600', gradient: 'from-purple-500 to-pink-600' },
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {departments.map((dept) => {
                const colors = getColorClasses(dept.color);
                const Icon = dept.icon;

                return (
                    <div key={dept.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
                        <div className={`h-1.5 w-full bg-gradient-to-r ${colors.gradient}`} />
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight">{dept.name}</h3>
                                        <p className="text-xs font-semibold text-gray-500 mt-0.5">Code: {dept.code}</p>
                                    </div>
                                </div>

                                {/* 👇 Actions are now always visible 👇 */}
                                <div className="flex gap-1">
                                    <button onClick={() => setSelectedDept(dept)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4 text-sm text-gray-600">
                                <span className="font-medium text-gray-400 text-[10px] uppercase tracking-wider block mb-0.5">Department Admin</span>
                                {dept.admin}
                            </div>
                            <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[32px]">{dept.desc}</p>
                            <div className="mt-auto pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Students</p>
                                    <p className="text-sm font-bold text-gray-800">{dept.students}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Teachers</p>
                                    <p className="text-sm font-bold text-gray-800">{dept.teachers}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Modal for Educational Departments */}
            {selectedDept && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                        <div className={`p-6 text-white bg-gradient-to-r ${getColorClasses(selectedDept.color).gradient}`}>
                            <button onClick={() => setSelectedDept(null)} className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                            <h2 className="text-2xl font-bold">{selectedDept.name}</h2>
                            <p className="text-white/80">Code: {selectedDept.code}</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedDept.desc}</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs text-gray-400 uppercase">Chairman</p><p className="text-sm font-bold">{selectedDept.chairman}</p></div>
                                <div><p className="text-xs text-gray-400 uppercase">Head</p><p className="text-sm font-bold">{selectedDept.head}</p></div>
                                <div><p className="text-xs text-gray-400 uppercase">Admin</p><p className="text-sm font-bold">{selectedDept.admin}</p></div>
                                <div><p className="text-xs text-gray-400 uppercase">Email</p><p className="text-sm font-bold">{selectedDept.email}</p></div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                <div className="bg-gray-50 p-2 text-center rounded-lg"><p className="text-lg font-bold">{selectedDept.courses}</p><p className="text-[10px] text-gray-500">Courses</p></div>
                                <div className="bg-gray-50 p-2 text-center rounded-lg"><p className="text-lg font-bold">{selectedDept.students}</p><p className="text-[10px] text-gray-500">Students</p></div>
                                <div className="bg-gray-50 p-2 text-center rounded-lg"><p className="text-lg font-bold">{selectedDept.teachers}</p><p className="text-[10px] text-gray-500">Teachers</p></div>
                                <div className="bg-gray-50 p-2 text-center rounded-lg"><p className="text-lg font-bold">{selectedDept.staff}</p><p className="text-[10px] text-gray-500">Staff</p></div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 text-right">
                            <button onClick={() => setSelectedDept(null)} className="px-6 py-2 bg-slate-800 text-white rounded-lg">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EducationDepartments;