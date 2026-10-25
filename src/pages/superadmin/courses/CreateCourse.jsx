import React, { useState } from 'react';
import { BookOpen, CheckCircle, Save } from 'lucide-react';

const CreateCourse = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        code: '', name: '', credits: 3, type: 'Core', status: 'Active'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // API Call to save course goes here
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setFormData({ code: '', name: '', credits: 3, type: 'Core', status: 'Active' });
        }, 2000);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 text-white flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <BookOpen className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Create New Course</h2>
                    <p className="text-slate-300 text-sm mt-0.5">Add a course to the catalog. You will assign semesters and sections later.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Course Code</label>
                        <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., CS-301" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Course Name</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Data Structures" />
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Course Type</label>
                        <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option>Core</option>
                            <option>Elective</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Credit Hours</label>
                        <input required type="number" min="1" max="6" value={formData.credits} onChange={e => setFormData({ ...formData, credits: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                        <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors">
                        <Save className="w-5 h-5" /> Create Course
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Created!</h2>
                        <p className="text-sm text-gray-500 mb-6">You can now assign it to departments and semesters.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateCourse;