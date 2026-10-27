import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BookOpen, GraduationCap } from 'lucide-react';

const PortalSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Admin Portal Card */}
                <button onClick={() => navigate('/login/admin')} className="bg-white p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-6">
                        <Shield className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Portal</h2>
                    <p className="text-slate-500 text-sm">For Super Admins, System Admins, and Department Admins.</p>
                </button>

                {/* Teacher Portal Card */}
                <button onClick={() => navigate('/login/teacher')} className="bg-white p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-6">
                        <BookOpen className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Teacher Portal</h2>
                    <p className="text-slate-500 text-sm">For faculty members to manage their classes.</p>
                </button>

                {/* Student Portal Card */}
                <button onClick={() => navigate('/login/student')} className="bg-white p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-6">
                        <GraduationCap className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Student Portal</h2>
                    <p className="text-slate-500 text-sm">For students to view courses, results, and fees.</p>
                </button>

            </div>
        </div>
    );
};

export default PortalSelection;