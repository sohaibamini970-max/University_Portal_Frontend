import React, { useState, useEffect } from 'react';
import {
    Plus, CalendarDays, BookOpen, Edit2, Trash2,
    CheckCircle, X, Loader2, CalendarRange,
    Power, PowerOff
} from 'lucide-react';
import { api } from '../../../context/AuthContext';

const AcademicCalendar = () => {
    const [activeTab, setActiveTab] = useState('sessions');

    const [sessions, setSessions] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Session create form
    const [newName, setNewName] = useState('');
    const [newStart, setNewStart] = useState('');
    const [newEnd, setNewEnd] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editStart, setEditStart] = useState('');
    const [editEnd, setEditEnd] = useState('');

    // Toggle loading state (for semester activation)
    const [togglingId, setTogglingId] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [sessRes, semRes] = await Promise.all([
                api.get('/sessions'),
                api.get('/semesters'),
            ]);
            setSessions(sessRes.data);
            setSemesters(semRes.data);
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const resetForm = () => { setNewName(''); setNewStart(''); setNewEnd(''); };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return alert('Name is required');

        if (activeTab === 'sessions' && (!newStart || !newEnd))
            return alert('Start and end dates are required for a session.');

        setIsSubmitting(true);
        try {
            if (activeTab === 'sessions') {
                await api.post('/sessions', {
                    name: newName, startDate: newStart, endDate: newEnd,
                });
            } else {
                await api.post('/semesters', { name: newName });
            }
            resetForm();
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This might affect program assignments.')) return;
        try {
            const endpoint = activeTab === 'sessions' ? '/sessions' : '/semesters';
            await api.delete(`${endpoint}/${id}`);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete');
        }
    };

    const handleUpdate = async (id) => {
        if (!editName.trim()) return;
        try {
            const endpoint = activeTab === 'sessions' ? '/sessions' : '/semesters';
            const original = activeTab === 'sessions'
                ? sessions.find((s) => s.id === id)
                : semesters.find((s) => s.id === id);

            const payload = activeTab === 'sessions'
                ? { ...original, name: editName, startDate: editStart, endDate: editEnd }
                : { ...original, name: editName };

            await api.put(`${endpoint}/${id}`, payload);
            setEditingId(null);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update');
        }
    };

    // 👇 NEW: Toggle semester active/inactive status 👇
    const handleToggleSemesterStatus = async (semester) => {
        setTogglingId(semester.id);
        try {
            // Reuse the existing PUT /semesters/{id} endpoint
            await api.put(`/semesters/${semester.id}`, {
                ...semester,
                isActive: !semester.isActive,
            });
            // Optimistically update the list so the badge flips instantly
            setSemesters((prev) =>
                prev.map((s) =>
                    s.id === semester.id ? { ...s, isActive: !s.isActive } : s
                )
            );
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update status');
        } finally {
            setTogglingId(null);
        }
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditName(item.name);
        if (activeTab === 'sessions') {
            setEditStart(item.startDate?.slice(0, 10) || '');
            setEditEnd(item.endDate?.slice(0, 10) || '');
        }
    };

    const currentList = activeTab === 'sessions' ? sessions : semesters;

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    return (
        <div className="space-y-6 max-w-4xl mx-auto">

            {/* Tabs */}
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 w-max">
                <button
                    onClick={() => { setActiveTab('sessions'); setEditingId(null); }}
                    className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'sessions' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <CalendarDays className="w-4 h-4" /> Sessions
                </button>
                <button
                    onClick={() => { setActiveTab('semesters'); setEditingId(null); }}
                    className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'semesters' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <BookOpen className="w-4 h-4" /> Semesters
                </button>
            </div>

            {/* Create Form */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder={activeTab === 'sessions' ? 'Session name (e.g., Fall 2025)' : 'Semester name (e.g., 9th)'}
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        disabled={isSubmitting}
                    />

                    {activeTab === 'sessions' && (
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-3">
                            <CalendarRange className="w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                value={newStart}
                                onChange={(e) => setNewStart(e.target.value)}
                                className="py-2.5 bg-transparent text-sm outline-none"
                                disabled={isSubmitting}
                                title="Start date"
                            />
                            <span className="text-gray-400 text-xs">→</span>
                            <input
                                type="date"
                                value={newEnd}
                                onChange={(e) => setNewEnd(e.target.value)}
                                className="py-2.5 bg-transparent text-sm outline-none"
                                disabled={isSubmitting}
                                title="End date"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || !newName.trim()}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-10 text-center text-gray-500">Loading...</div>
                ) : currentList.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No {activeTab} found. Add one above.</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {currentList.map((item) => (
                            <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                {editingId === item.id ? (
                                    <div className="flex-1 flex flex-col md:flex-row gap-2 mr-4">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1 px-3 py-1.5 bg-white border border-indigo-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            autoFocus
                                        />
                                        {activeTab === 'sessions' && (
                                            <div className="flex items-center gap-2 border border-indigo-300 rounded-lg px-3 bg-white">
                                                <input type="date" value={editStart} onChange={(e) => setEditStart(e.target.value)} className="py-1.5 text-sm outline-none bg-transparent" />
                                                <span className="text-gray-400 text-xs">→</span>
                                                <input type="date" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} className="py-1.5 text-sm outline-none bg-transparent" />
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button onClick={() => handleUpdate(item.id)} className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg">
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.isActive
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                                : 'bg-slate-50 border-slate-200 text-slate-500'
                                            }`}>
                                            {activeTab === 'sessions' ? <CalendarDays className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{item.name}</p>
                                            {activeTab === 'sessions' ? (
                                                <p className="text-xs text-gray-500 font-medium">
                                                    {formatDate(item.startDate)} → {formatDate(item.endDate)}
                                                </p>
                                            ) : null}
                                            <p className={`text-xs font-bold ${item.isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {item.isActive ? 'Active' : 'Inactive'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {editingId !== item.id && (
                                    <div className="flex items-center gap-2">
                                        {/* 👇 NEW: Toggle button — only for Semesters tab 👇 */}
                                        {activeTab === 'semesters' && (
                                            <button
                                                onClick={() => handleToggleSemesterStatus(item)}
                                                disabled={togglingId === item.id}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 ${item.isActive
                                                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                    }`}
                                                title={item.isActive ? 'Deactivate semester' : 'Activate semester'}
                                            >
                                                {togglingId === item.id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : item.isActive ? (
                                                    <PowerOff className="w-3.5 h-3.5" />
                                                ) : (
                                                    <Power className="w-3.5 h-3.5" />
                                                )}
                                                {item.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => startEdit(item)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AcademicCalendar;