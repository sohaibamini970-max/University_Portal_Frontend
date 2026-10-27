import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';

const StudentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (user.role === 'student') {
                navigate('/student/dashboard');
            } else {
                setError("This portal is for students only.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Student Portal</h2>
                    <p className="text-sm text-slate-500">Sign in with your university email.</p>
                </div>
                {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="email" placeholder="student@university.edu" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2">
                        Sign In <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentLogin;