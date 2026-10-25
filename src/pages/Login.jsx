import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, UserCircle, Briefcase, Shield, BookOpen, Users, DollarSign } from 'lucide-react';

const roles = [
    { id: 'superadmin', label: 'Super Admin', icon: Shield, color: 'bg-purple-100 text-purple-600 border-purple-300' },
    { id: 'admin', label: 'Department Admin', icon: Users, color: 'bg-blue-100 text-blue-600 border-blue-300' },
    { id: 'teacher', label: 'Teacher', icon: BookOpen, color: 'bg-green-100 text-green-600 border-green-300' },
    { id: 'student', label: 'Student', icon: GraduationCap, color: 'bg-orange-100 text-orange-600 border-orange-300' },
    { id: 'admissions', label: 'Admissions', icon: Briefcase, color: 'bg-emerald-100 text-emerald-600 border-emerald-300' },
    { id: 'finance', label: 'Finance', icon: DollarSign, color: 'bg-blue-100 text-blue-600 border-blue-300' },
    { id: 'examination', label: 'Examination', icon: DollarSign, color: 'bg-blue-100 text-blue-600 border-blue-300' },
    { id: 'systemadmin', label: 'System Admin', icon: Shield, color: 'bg-blue-100 text-blue-600 border-blue-300' },
];

const Login = () => {
    const [selectedRole, setSelectedRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("1. Form submitted");

        if (!email || !password) return;

        const userData = login(email, password, selectedRole);
        console.log("2. User logged in:", userData);

        const redirectMap = {
            superadmin: '/superadmin/dashboard',
            admin: '/admin/dashboard',
            admissions: '/admissions/dashboard',
            teacher: '/teacher/dashboard',
            student: '/student/dashboard',
            finance: '/finance/dashboard',
            systemadmin: '/systemadmin/dashboard',
            examination:'/examination/dashboard',
        };

        console.log("3. Navigating to:", redirectMap[selectedRole]);
        navigate(redirectMap[selectedRole]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
                        <GraduationCap className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">University Portal</h1>
                    <p className="text-gray-500 mt-2">Sign in to your account</p>
                </div>

                {/* Login Card */}
                <div className="card shadow-xl">
                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Your Role
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {roles.map((role) => {
                                const Icon = role.icon;
                                const isSelected = selectedRole === role.id;
                                return (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setSelectedRole(role.id)}
                                        className={`flex items-center gap-2 px-3 py-3 rounded-lg border-2 transition-all duration-200 ${isSelected
                                                ? `${role.color} border-current shadow-sm scale-[1.02]`
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 shrink-0" />
                                        <span className="text-sm font-medium">{role.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@university.edu"
                                    className="input-field pl-11"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-field pl-11"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-600">
                                <input type="checkbox" className="rounded text-primary-600" />
                                Remember me
                            </label>
                            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        <button type="submit" className="btn-primary w-full py-3">
                            Sign In
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{' '}
                        <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                            Contact Admin
                        </a>
                    </p>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    © 2024 University Portal. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;