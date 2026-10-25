import React, { useState } from 'react';
import { UserPlus, CheckCircle, Save } from 'lucide-react';

const AddStudent = () => {
    const [showSuccess, setShowSuccess] = useState(false);

    // Added semester to formData
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        program: 'BS Computer Science', batch: '2025-2029', semester: '1st'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // API Call to save student goes here
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setFormData({
                firstName: '', lastName: '', email: '', phone: '',
                program: 'BS Computer Science', batch: '2025-2029', semester: '1st'
            });
        }, 2000);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden max-w-3xl mx-auto">
            <div className="bg-slate-800 p-6 text-white flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <UserPlus className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Enroll New Student</h2>
                    <p className="text-slate-300 text-sm mt-0.5">Enter details to register a new applicant.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                        <input required type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g., Ali" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                        <input required type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g., Raza" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="student@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                        <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="+92 300 1234567" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Select Program</label>
                        <select value={formData.program} onChange={e => setFormData({ ...formData, program: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none">
                            <option>BS Computer Science</option>
                            <option>BS Software Engineering</option>
                            <option>BS Business Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Batch</label>
                        <input required type="text" value={formData.batch} onChange={e => setFormData({ ...formData, batch: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    {/* 👇 NEW: Semester Dropdown 👇 */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Semester</label>
                        <select value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none">
                            {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'].map(sem => (
                                <option key={sem} value={sem}>{sem} Semester</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition-colors">
                        <Save className="w-5 h-5" /> Save & Enroll Student
                    </button>
                </div>
            </form>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm text-center p-6 animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Enrolled!</h2>
                        <p className="text-sm text-gray-500 mb-6">The student has been successfully added to the {formData.semester} semester.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddStudent;