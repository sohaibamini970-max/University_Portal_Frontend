import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, api } from '../context/AuthContext'; // 👈 Import api and useAuth
import { BookOpen, User, Lock, ArrowRight, Loader2 } from 'lucide-react';

const TeacherLogin = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 👇 Get loginWithToken from context
    const { loginWithToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await api.post('/auth/teacher-login', { employeeId, password });

            // 👇 Update context and local storage instantly
            loginWithToken(res.data.user, res.data.token);

            // 👇 Navigate without reloading the page
            navigate('/teacher/dashboard');

        } catch (err) {
            setError(err.response?.data?.message || "Invalid Employee ID or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4">
            {/* ... Keep your JSX exactly the same ... */}
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4 shadow-lg">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Teacher Portal</h2>
                    <p className="text-sm text-slate-500">Sign in with your Employee ID.</p>
                </div>

                {error && (
                    <div className="mb-4 text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Employee ID (e.g., INS-001)"
                            value={employeeId}
                            onChange={e => setEmployeeId(e.target.value)}
                            required
                            disabled={isLoading}
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
                            disabled={isLoading}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
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

export default TeacherLogin;