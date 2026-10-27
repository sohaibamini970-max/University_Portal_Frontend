import React, { useState, useEffect } from 'react';
import { Loader2, Edit2, CheckCircle, X, Settings } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const ManageFirstSemester = () => {
    const [programs, setPrograms] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');

    const [savedSections, setSavedSections] = useState([]);
    const [assignedCourses, setAssignedCourses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    // Edit Modal State
    const [editingSection, setEditingSection] = useState(null);
    const [editSeats, setEditSeats] = useState(50);
    const [editIsActive, setEditIsActive] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [progRes, batchRes] = await Promise.all([
                    api.get('/programs'), api.get('/batches')
                ]);
                setPrograms(progRes.data);
                setBatches(batchRes.data);
                if (progRes.data.length > 0) setSelectedProgram(progRes.data[0].id);
                if (batchRes.data.length > 0) setSelectedBatch(batchRes.data[0].id);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDropdowns();
    }, []);

    // Fetch saved config when dropdowns change
    useEffect(() => {
        const fetchConfig = async () => {
            if (!selectedProgram || !selectedBatch) return;
            setIsFetching(true);
            try {
                // 1. Get the saved sections for this batch
                const semRes = await api.get('/semesters');
                const firstSem = semRes.data.find(s => s.name.includes('1'));
                if (!firstSem) return;

                const configRes = await api.get(`/first-semester/config?programId=${selectedProgram}&batchId=${selectedBatch}&semesterId=${firstSem.id}`);
                setSavedSections(configRes.data);

                // 2. Get the courses assigned by super admin for context
                const courseRes = await api.get(`/program-courses/filter?programId=${selectedProgram}&batchId=${selectedBatch}&semesterId=${firstSem.id}`);
                setAssignedCourses(courseRes.data);

            } catch (error) {
                console.error(error);
                setSavedSections([]);
            } finally {
                setIsFetching(false);
            }
        };
        fetchConfig();
    }, [selectedProgram, selectedBatch]);

    const openEditModal = (section) => {
        setEditingSection(section);
        setEditSeats(section.maxSeats);
        setEditIsActive(section.isActive);
    };

    const handleSaveEdit = async () => {
        setIsSaving(true);
        try {
            const semRes = await api.get('/semesters');
            const firstSem = semRes.data.find(s => s.name.includes('1'));

            // Rebuild the sections list with the updated one
            const updatedSections = savedSections.map(s =>
                s.name === editingSection.name
                    ? { ...s, maxSeats: parseInt(editSeats), isActive: editIsActive }
                    : s
            );

            await api.post('/first-semester/assign', {
                programId: parseInt(selectedProgram),
                batchId: parseInt(selectedBatch),
                semesterId: firstSem.id,
                sessionId: 1,
                sections: updatedSections.filter(s => s.isActive) // only send active ones to sync
            });

            // Update local state
            setSavedSections(updatedSections);
            setEditingSection(null);
        } catch (error) {
            alert("Failed to update section.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" /></div>;

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Program</label>
                    <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                        {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch</label>
                    <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                        {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Config View */}
            {isFetching ? (
                <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" /></div>
            ) : savedSections.length === 0 ? (
                <div className="p-10 text-center bg-white border border-gray-200 rounded-2xl text-gray-500">
                    No configuration found for this Program and Batch. Use the "Create Configuration" tab.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Courses Context */}
                    <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-max">
                        <div className="bg-slate-800 p-4 text-white">
                            <h3 className="font-bold text-sm">Assigned Courses ({assignedCourses.length})</h3>
                        </div>
                        <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
                            {assignedCourses.map(c => (
                                <div key={c.id} className="text-sm border-b border-gray-100 pb-2">
                                    <p className="font-bold text-gray-800">{c.courseCode}</p>
                                    <p className="text-xs text-gray-500">{c.courseName}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Saved Sections */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-emerald-600" /> Active Sections
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {savedSections.map(section => (
                                <div key={section.name} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${section.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {section.name}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Section {section.name}</p>
                                            <p className="text-sm font-semibold text-gray-500">
                                                {section.maxSeats} Seats
                                                {section.isActive ? ' • Active' : ' • Inactive'}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => openEditModal(section)} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingSection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">Edit Section {editingSection.name}</h3>
                            <button onClick={() => setEditingSection(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Max Seats</label>
                                <input type="number" value={editSeats} onChange={e => setEditSeats(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                <select value={editIsActive.toString()} onChange={e => setEditIsActive(e.target.value === 'true')} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-semibold">
                                    <option value="true">Active (Open for Registration)</option>
                                    <option value="false">Inactive (Closed)</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex gap-3">
                            <button onClick={() => setEditingSection(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl">Cancel</button>
                            <button onClick={handleSaveEdit} disabled={isSaving} className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl flex justify-center items-center gap-2">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFirstSemester;