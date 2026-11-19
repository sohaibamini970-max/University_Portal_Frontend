import React, { useState, useEffect } from 'react';
import {
    Search, Loader2, ShieldCheck, Mail, User,
    ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, CheckCircle2
} from 'lucide-react';
import { api } from '../../../context/AuthContext';

const ITEMS_PER_PAGE = 10;

const AllStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Status toggling state
    const [togglingId, setTogglingId] = useState(null);
    // Bulk activation state
    const [bulkActivating, setBulkActivating] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1); // Reset to page 1 on new search
            fetchStudents(1, searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch on page change
    useEffect(() => {
        fetchStudents(currentPage, searchQuery);
    }, [currentPage]);

    const fetchStudents = async (page, search) => {
        setLoading(true);
        try {
            const res = await api.get(`/students/admin`, {
                params: {
                    page,
                    pageSize: ITEMS_PER_PAGE,
                    search: search || undefined
                }
            });
            setStudents(res.data.items || []);
            setTotalPages(res.data.totalPages || 1);
            setTotalItems(res.data.total || 0);
        } catch (err) {
            console.error('Failed to fetch students:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (student) => {
        if (!student.isActive) {
            // Just turn it on (no confirm needed)
        } else {
            // Confirm before deactivating
            if (!window.confirm(`Deactivate access for ${student.fullName}?\n\nThey will no longer be able to log into the portal.`)) {
                return;
            }
        }

        setTogglingId(student.id);

        // Optimistic Update
        setStudents(prev => prev.map(s =>
            s.id === student.id ? { ...s, isActive: !s.isActive } : s
        ));

        try {
            await api.put(`/students/${student.id}/toggle-status`, {
                isActive: !student.isActive
            });
        } catch (err) {
            // Rollback on failure
            setStudents(prev => prev.map(s =>
                s.id === student.id ? { ...s, isActive: student.isActive } : s
            ));
            alert(err.response?.data?.message || 'Failed to update student status.');
        } finally {
            setTogglingId(null);
        }
    };

    const handleBulkActivate = async () => {
        if (!window.confirm('Activate ALL inactive students matching the current search?\n\nThis will grant portal access to everyone.')) return;

        setBulkActivating(true);
        try {
            const res = await api.post('/students/admin/bulk-activate', {
                search: searchQuery
            });
            alert(res.data.message);
            fetchStudents(1, searchQuery); // refresh
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to bulk activate students.');
        } finally {
            setBulkActivating(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, roll no, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleBulkActivate}
                        disabled={bulkActivating || loading}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-sm rounded-xl hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                        {bulkActivating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        Bulk Activate Inactive
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-800 text-slate-100 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Roll No</th>
                                <th className="px-6 py-4">Program / Batch</th>
                                <th className="px-6 py-4 text-center">Section</th>
                                <th className="px-6 py-4 text-center">Portal Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                                        <p className="text-gray-500 mt-2 text-sm font-semibold">Loading students...</p>
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => {
                                    const isBusy = togglingId === student.id;
                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            {/* Name & Email */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                                                        {student.fullName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{student.fullName}</p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                            <Mail className="w-3 h-3" /> {student.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Roll No */}
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                                                    {student.rollNo || 'N/A'}
                                                </span>
                                            </td>

                                            {/* Program & Batch */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-800">{student.programCode}</p>
                                                <p className="text-xs text-gray-500">{student.batchName}</p>
                                            </td>

                                            {/* Section */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-sm">
                                                    {student.section || '—'}
                                                </span>
                                            </td>

                                            {/* Status Toggle */}
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => !isBusy && handleToggleStatus(student)}
                                                        disabled={isBusy}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${student.isActive
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                                : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                                                            } ${isBusy ? 'opacity-60 cursor-wait' : ''}`}
                                                        title={student.isActive ? 'Click to deactivate' : 'Click to activate'}
                                                    >
                                                        {isBusy ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : student.isActive ? (
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        ) : (
                                                            <ShieldCheck className="w-4 h-4" />
                                                        )}
                                                        <span className="w-14 text-left">
                                                            {student.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                        {!isBusy && (student.isActive ? (
                                                            <ToggleRight className="w-4 h-4" />
                                                        ) : (
                                                            <ToggleLeft className="w-4 h-4" />
                                                        ))}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalItems > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Showing <strong className="text-gray-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to <strong className="text-gray-800">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</strong> of <strong className="text-gray-800">{totalItems}</strong> students
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1 || loading}
                                className="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-semibold text-gray-700 px-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || loading}
                                className="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllStudents;