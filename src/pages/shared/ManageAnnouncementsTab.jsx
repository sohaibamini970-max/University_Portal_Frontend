import React, { useState } from 'react';
import { Search, Eye, Edit2, Trash2, X, AlertTriangle, Megaphone } from 'lucide-react';

const ManageAnnouncementsTab = () => {
    const [search, setSearch] = useState('');

    // States for Modals
    const [selectedItem, setSelectedItem] = useState(null); // View
    const [editItem, setEditItem] = useState(null);         // Edit
    const [deleteItem, setDeleteItem] = useState(null);     // Delete
    const [editForm, setEditForm] = useState({});

    // Mock Data (Replace with API call)
    const [announcements, setAnnouncements] = useState([
        { id: 1, title: 'Mid-Term Exam Schedule Released', target: 'All Students & Teachers', date: 'Oct 28, 2025', status: 'Published', content: 'The mid-term examination schedule for the Fall 2024 semester has been published. Please check your portal.' },
        { id: 2, title: 'Spring 2025 Fee Voucher', target: 'Students', date: 'Oct 26, 2025', status: 'Published', content: 'Your fee voucher for the Spring 2025 semester is now available for download. Last date: Nov 15.' },
        { id: 3, title: 'Faculty Meeting', target: 'Teachers', date: 'Oct 20, 2025', status: 'Draft', content: 'There will be a mandatory faculty meeting in the main auditorium at 2:00 PM.' },
    ]);

    const filteredData = announcements.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase())
    );

    // Handlers
    const openEditModal = (item) => {
        setEditItem(item);
        setEditForm(item);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const saveEdit = (e) => {
        e.preventDefault();
        // API Call to update goes here
        setAnnouncements(prev => prev.map(a => a.id === editItem.id ? editForm : a));
        setEditItem(null);
    };

    const confirmDelete = () => {
        // API Call to delete goes here
        setAnnouncements(prev => prev.filter(a => a.id !== deleteItem.id));
        setDeleteItem(null);
    };

    return (
        <div className="space-y-4">

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="text-sm font-bold text-gray-500">
                    Total: {filteredData.length}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Target Audience</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.map((item, idx) => (
                                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.target}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${item.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => setSelectedItem(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md" title="View">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openEditModal(item)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md" title="Edit">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteItem(item)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= VIEW MODAL ================= */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white relative">
                            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                            <h2 className="text-xl font-bold pr-8">{selectedItem.title}</h2>
                            <p className="text-indigo-100 text-sm mt-1">{selectedItem.date}</p>
                        </div>
                        <div className="p-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Message</p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed border border-gray-100">
                                {selectedItem.content}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
                            <button onClick={() => setSelectedItem(null)} className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl text-sm">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= EDIT MODAL ================= */}
            {editItem && (
                <div className="fixed inset-0 z-50 mt-20 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                            <h2 className="text-lg font-bold text-gray-800">Edit Announcement</h2>
                            <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={saveEdit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 space-y-4 overflow-y-auto flex-1">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                    <input type="text" name="title" value={editForm.title} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Audience</label>
                                    <input type="text" name="target" value={editForm.target} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                    <select name="status" value={editForm.status} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="Published">Published</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                                    <textarea name="content" value={editForm.content} onChange={handleEditChange} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 border-t flex gap-3 shrink-0">
                                <button type="button" onClick={() => setEditItem(null)} className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl text-sm">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= DELETE MODAL ================= */}
            {deleteItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm text-center p-6 animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Announcement?</h2>
                        <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete <strong>{deleteItem.title}</strong>? This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteItem(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAnnouncementsTab;