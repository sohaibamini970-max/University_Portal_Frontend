import React, { useState } from 'react';
import { X, CheckCircle, UserPlus } from 'lucide-react';
import { api } from '../../context/AuthContext';

const UserFormModal = ({ isOpen, onClose, onSuccess, roleType, title }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '', email: '', password: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // roleType will be 'department_admin', 'systemadmin', 'teacher' (for HOD/Dean), etc.
            await api.post('/auth/register-user', {
                ...formData,
                role: roleType
            });

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onSuccess();
                onClose();
                setFormData({ fullName: '', email: '', password: '' });
            }, 1500);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create user");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                <div className="bg-slate-800 p-5 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold">{title}</h2>
                        <p className="text-slate-300 text-xs mt-0.5">Create a new {roleType.replace('_', ' ')} account.</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                </div>

                {showSuccess ? (
                    <div className="p-8 text-center animate-in zoom-in-95">
                        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Account Created!</h3>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                            <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="Dr. John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="john@university.edu" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Temporary Password</label>
                            <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="Must be at least 6 characters" minLength={6} />
                        </div>
                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                            <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2">
                                <UserPlus className="w-4 h-4" /> Create Account
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserFormModal;