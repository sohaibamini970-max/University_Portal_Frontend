import React, { useState } from 'react';
import { Briefcase, Users, BookOpen, Eye, Edit2, Trash2, X } from 'lucide-react';

const BusinessDepartments = () => {
    const [selectedDept, setSelectedDept] = useState(null);

    const departments = [
        { id: 5, name: 'Finance & Accounts', code: 'FIN', admin: 'Mr. Ahmed', head: 'Ms. S. Khan', chairman: 'Vice Chancellor', staff: 15, courses: 0, students: 0, teachers: 0, color: 'emerald', icon: Briefcase, email: 'finance@university.edu', desc: 'Handles university finances, fee collection, and payroll.' },
        { id: 6, name: 'Admissions', code: 'ADM', admin: 'Ms. Fatima', head: 'Mr. T. Hussain', chairman: 'Vice Chancellor', staff: 12, courses: 0, students: 0, teachers: 0, color: 'orange', icon: Users, email: 'admissions@university.edu', desc: 'Manages student enrollment, verification, and records.' },
        { id: 7, name: 'Examination', code: 'EXM', admin: 'Dr. Raza', head: 'Dr. K. Mahmood', chairman: 'Vice Chancellor', staff: 20, courses: 0, students: 0, teachers: 0, color: 'rose', icon: BookOpen, email: 'exams@university.edu', desc: 'Responsible for conducting exams, grading, and results.' },
    ];

    const getColorClasses = (color) => {
        const colors = {
            emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-600' },
            orange: { bg: 'bg-orange-50', text: 'text-orange-600', gradient: 'from-orange-500 to-red-500' },
            rose: { bg: 'bg-rose-50', text: 'text-rose-600', gradient: 'from-rose-500 to-red-600' },
        };
        return colors[color] || colors.emerald;
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

                            <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[32px]">{dept.desc}</p>

                            <div className="mt-auto pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Staff Members</p>
                                    <p className="text-sm font-bold text-gray-800">{dept.staff}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Head</p>
                                    <p className="text-sm font-bold text-gray-800 truncate">{dept.head}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Modal for Business Departments */}
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
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                                <p className="text-lg font-bold">{selectedDept.staff}</p>
                                <p className="text-[10px] text-gray-500 uppercase">Total Staff Members</p>
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

export default BusinessDepartments;