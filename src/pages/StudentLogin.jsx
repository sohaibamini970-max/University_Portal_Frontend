import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext'; // 👈 Import api
import { GraduationCap, User, Lock, ArrowRight, Loader2 } from 'lucide-react'; // 👈 Added User & Loader2

const StudentLogin = () => {
    const [rollNo, setRollNo] = useState(''); // 👈 Changed 'email' to 'rollNo'
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { loginWithToken } = useAuth(); // 👈 Use loginWithToken
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // 👇 Call the custom student login endpoint
            const res = await api.post('/auth/student-login', {
                rollNo: rollNo,
                password: password
            });

            // Save the token and user to context
            loginWithToken(res.data.user, res.data.token);

            // Navigate to dashboard
            navigate('/student/dashboard');
            window.location.reload(); // Force reload to ensure context is fully updated

        } catch (err) {
            setError(err.response?.data?.message || "Invalid Roll Number or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-blue-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Student Portal</h2>
                    <p className="text-sm text-slate-500">Sign in with your Roll Number.</p>
                </div>

                {error && (
                    <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="e.g., 2022F-BSCS-001"
                            value={rollNo}
                            onChange={e => setRollNo(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
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
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
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

                <div className="mt-6 text-center">
                    <button onClick={() => navigate('/')} className="text-sm text-slate-500 hover:text-slate-800">
                        ← Back to Portals
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;