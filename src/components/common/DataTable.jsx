import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Edit2, Trash2, X, AlertTriangle, Save } from 'lucide-react';

const DataTable = ({ columns, data, itemsPerPage = 5 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null); // For View Modal
    const [deleteRow, setDeleteRow] = useState(null);     // For Delete Modal
    const [editRow, setEditRow] = useState(null);         // For Edit Modal
    const [editFormData, setEditFormData] = useState({}); // Form state for Edit

    // Pagination Logic
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Open Edit Modal and pre-fill the form
    const openEditModal = (row) => {
        setEditRow(row);
        setEditFormData(row); // Copy row data to form state
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const saveEdit = (e) => {
        e.preventDefault();
        console.log("Saving updated data:", editFormData);
        setEditRow(null);
    };

    const confirmDelete = () => {
        console.log("Deleting:", deleteRow);
        setDeleteRow(null);
    };

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider">
                                {columns.map((col, i) => (
                                    <th key={i} className="px-6 py-4">{col.label}</th>
                                ))}
                                <th className="px-6 py-4 text-center w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, rowIndex) => (
                                    <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-gray-50 transition-colors`}>
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex} className="px-6 py-4 text-sm text-gray-700">
                                                {col.render ? col.render(row) : row[col.key]}
                                            </td>
                                        ))}

                                        {/* Action Buttons */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => setSelectedRow(row)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View Details">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => openEditModal(row)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit User">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setDeleteRow(row)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete User">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + itemsPerPage, data.length)}</strong> of <strong>{data.length}</strong> entries
                        </span>
                        <div className="flex gap-1">
                            <button onClick={handlePrev} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={handleNext} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ================= VIEW DETAILS MODAL ================= */}
            {selectedRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white relative shrink-0">
                            <button onClick={() => setSelectedRow(null)} className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
                                    {selectedRow.name ? selectedRow.name.charAt(0) : 'U'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedRow.name}</h2>
                                    <p className="text-white/80 font-medium">{selectedRow.role || 'User Profile'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-3 overflow-y-auto">
                            {Object.entries(selectedRow).map(([key, value]) => {
                                if (key === 'id' || key === 'name' || key === 'role') return null;
                                return (
                                    <div key={key} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="text-sm font-semibold text-gray-800">{value}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-200 text-right shrink-0">
                            <button onClick={() => setSelectedRow(null)} className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= EDIT MODAL (FIXED) ================= */}
            {editRow && (
                <div className="fixed inset-0 z-50 mt-20 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">

                    {/* The modal is a flex-col with a max-height so it never pushes off-screen */}
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                        {/* Fixed Header */}
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                            <h2 className="text-lg font-bold text-gray-800">Edit User Details</h2>
                            <button onClick={() => setEditRow(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Form Body */}
                        <form onSubmit={saveEdit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 space-y-4 overflow-y-auto flex-1">
                                {Object.entries(editFormData).map(([key, value]) => {
                                    if (key === 'id') return null;
                                    return (
                                        <div key={key}>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </label>
                                            <input
                                                type="text"
                                                name={key}
                                                value={value}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Fixed Footer */}
                            <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3 shrink-0">
                                <button type="button" onClick={() => setEditRow(null)} className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors flex justify-center items-center gap-2">
                                    <Save className="w-4 h-4" /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= DELETE CONFIRMATION MODAL ================= */}
            {deleteRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 text-center p-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to delete <strong className="text-gray-800">{deleteRow.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteRow(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DataTable;