import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Lock, Save, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const PasswordSettings = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // API Call to update password goes here

        setShowSuccess(true);
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <Layout title="Change Password" subtitle="Update your account security">
            <div className="max-w-md mx-auto mt-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    <div className="bg-slate-800 p-6 text-white text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold">Change Password</h2>
                        <p className="text-slate-300 text-sm mt-1">Update your account security</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2 text-sm border border-red-100">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-colors"
                            >
                                <Save className="w-4 h-4" /> Update Password
                            </button>
                        </div>
                    </form>
                </div>

                {showSuccess && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm text-center p-6 animate-in zoom-in-95">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Password Updated!</h2>
                            <p className="text-sm text-gray-500">Your password has been changed successfully.</p>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PasswordSettings;