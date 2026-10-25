import React, { useState } from 'react';
import { Send, ShieldCheck, X, Megaphone } from 'lucide-react';

const CreateAnnouncementForm = ({ targetRoles }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    // Toggle role selection
    const handleRoleToggle = (role) => {
        setSelectedRoles(prev =>
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !message || selectedRoles.length === 0) return;

        // API logic goes here (axios.post)
        console.log("Sending:", { title, message, targets: selectedRoles });

        setShowSuccess(true);
        setTitle('');
        setMessage('');
        setSelectedRoles([]);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                {/* Header */}
                <div className="bg-slate-800 p-6 text-white flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Megaphone className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Create Announcement</h2>
                        <p className="text-slate-300 text-sm mt-0.5">Send a notice to specific groups.</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Announcement Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Mid-term exam schedule released"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                    </div>

                    {/* Message Body */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write the details of your announcement here..."
                            rows="4"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            required
                        ></textarea>
                    </div>

                    {/* Target Roles (Checkboxes) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Send To (Select Roles)</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {targetRoles.map(role => {
                                const isSelected = selectedRoles.includes(role);
                                return (
                                    <label
                                        key={role}
                                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 border-indigo-300 text-indigo-800' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleRoleToggle(role)}
                                            className="w-4 h-4 text-indigo-600 rounded"
                                        />
                                        <span className="text-sm font-semibold capitalize">{role}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                        >
                            <Send className="w-4 h-4" /> Publish Announcement
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 text-center p-6">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Published!</h2>
                        <p className="text-sm text-gray-500 mb-6">Your announcement has been sent to the selected roles successfully.</p>
                        <button onClick={() => setShowSuccess(false)} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateAnnouncementForm;