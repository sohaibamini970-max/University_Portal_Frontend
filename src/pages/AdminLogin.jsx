import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'; // 👈 Added Loader2

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // 👈 Added missing state

    const { login } = useAuth();
    const navigate = useNavigate();

    // Inside AdminLogin.jsx
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const userData = await login(email, password);

            let redirectPath = '/';

            if (userData.role === 'department_admin') {
                const deptCode = userData.departmentCode || userData.department?.code;
                if (deptCode === 'ADM') redirectPath = '/admissions/dashboard';
                else if (deptCode === 'FIN') redirectPath = '/finance/dashboard';
                else if (deptCode === 'EXM') redirectPath = '/examination/dashboard';
                else redirectPath = '/admin/dashboard';
            } else {
                const redirectMap = {
                    superadmin: '/superadmin/dashboard',
                    teacher: '/teacher/dashboard',
                    student: '/student/dashboard',
                    systemadmin: '/systemadmin/dashboard',
                };
                redirectPath = redirectMap[userData.role] || '/';
            }

            // 👇 FORCE HARD RELOAD
            window.location.href = redirectPath;

        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Admin Portal</h2>
                    <p className="text-sm text-slate-500">Sign in to manage the university.</p>
                </div>

                {error && (
                    <div className="mb-4 text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="email"
                            placeholder="admin@university.edu"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            disabled={isLoading} // 👈 Disable while loading
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl disabled:opacity-50"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            disabled={isLoading} // 👈 Disable while loading
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl disabled:opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Authenticating...
                            </>
                        ) : (
                            <>
                                Sign In <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;