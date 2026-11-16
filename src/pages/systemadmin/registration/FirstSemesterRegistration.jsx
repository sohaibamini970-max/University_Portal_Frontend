import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Loader2, Save, Settings2 } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const FirstSemesterRegistration = () => {
    const [programs, setPrograms] = useState([]);
    const [batches, setBatches] = useState([]);
    const [semesters, setSemesters] = useState([]);

    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    const [assignedCourses, setAssignedCourses] = useState([]);
    const [sectionsConfig, setSectionsConfig] = useState([]);

    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const allSections = ['A', 'B', 'C', 'D', 'E', 'F'];

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [progRes, batchRes, semRes] = await Promise.all([
                    api.get('/programs'), api.get('/batches'), api.get('/semesters')
                ]);
                setPrograms(progRes.data);
                setBatches(batchRes.data);
                setSemesters(semRes.data);

                if (progRes.data.length > 0) setSelectedProgram(progRes.data[0].id);
                if (batchRes.data.length > 0) setSelectedBatch(batchRes.data[0].id);
                const firstSem = semRes.data.find(s => s.name.includes('1'));
                if (firstSem) setSelectedSemester(firstSem.id);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedProgram || !selectedBatch || !selectedSemester) return;
            setIsFetching(true);
            try {
                const [courseRes, configRes] = await Promise.all([
                    api.get(`/program-courses/filter?programId=${selectedProgram}&batchId=${selectedBatch}&semesterId=${selectedSemester}`),
                    api.get(`/first-semester/config?programId=${selectedProgram}&batchId=${selectedBatch}&semesterId=${selectedSemester}`)
                ]);

                setAssignedCourses(courseRes.data);

                const savedSections = configRes.data;
                const mergedConfig = allSections.map(sec => {
                    const saved = savedSections.find(s => s.name === sec);
                    return {
                        name: sec,
                        isActive: saved ? saved.isActive : false,
                        maxSeats: saved ? saved.maxSeats : 50
                    };
                });
                setSectionsConfig(mergedConfig);

            } catch (error) {
                console.error(error);
                setAssignedCourses([]);
            } finally {
                setIsFetching(false);
            }
        };
        fetchData();
    }, [selectedProgram, selectedBatch, selectedSemester]);

    const toggleSection = (index) => {
        const updated = [...sectionsConfig];
        updated[index].isActive = !updated[index].isActive;
        setSectionsConfig(updated);
    };

    const handleSeatChange = (index, value) => {
        const updated = [...sectionsConfig];
        updated[index].maxSeats = parseInt(value) || 0;
        setSectionsConfig(updated);
    };

    const handleSave = async () => {
        const activeSections = sectionsConfig.filter(s => s.isActive);
        if (activeSections.length === 0) return alert("Please activate at least one section.");
        if (assignedCourses.length === 0) return alert("No courses assigned by Super Admin yet.");

        setIsSubmitting(true);
        try {
            await api.post('/first-semester/assign', {
                programId: parseInt(selectedProgram),
                batchId: parseInt(selectedBatch),
                semesterId: parseInt(selectedSemester),
                sessionId: 1,
                sections: activeSections
            });

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to save configuration.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" /></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-10">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">1st Semester Configuration</h2>
                        <p className="text-sm text-gray-500">Manage sections and seats for new batches.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Select Program</label>
                        <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                            {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Target Batch</label>
                        <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                            {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.startYear})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Semester</label>
                        <select value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Courses Assigned by Super Admin</label>
                    {isFetching ? (
                        <div className="p-6 text-center bg-gray-50 rounded-xl border border-gray-200">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                        </div>
                    ) : assignedCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {assignedCourses.map(course => (
                                <div key={course.id} className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                    <div>
                                        <p className="font-bold text-emerald-900">{course.courseName}</p>
                                        <p className="text-xs font-semibold text-emerald-600">{course.courseCode}</p>
                                    </div>
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm font-semibold">
                            No courses assigned by Super Admin for this selection.
                        </div>
                    )}
                </div>

                <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
                    <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
                        <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                            <Settings2 className="w-4 h-4" /> Section & Seat Configuration
                        </h3>
                    </div>
                    <div className="p-6 bg-white grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {sectionsConfig.map((sec, idx) => (
                            <div
                                key={sec.name}
                                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${sec.isActive
                                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                                    : 'border-gray-200 bg-gray-50 opacity-60'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleSection(idx)}
                                    className={`w-12 h-12 rounded-lg text-xl font-bold mb-3 transition-colors ${sec.isActive ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {sec.name}
                                </button>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">Seats</label>
                                <input
                                    type="number"
                                    value={sec.maxSeats}
                                    onChange={(e) => handleSeatChange(idx, e.target.value)}
                                    disabled={!sec.isActive}
                                    className="w-full text-center px-2 py-1.5 border border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end mt-6">
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting || assignedCourses.length === 0}
                        className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="w-5 h-5" /> Save Configuration</>
                        )}
                    </button>
                </div>
            </div>

            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm text-center p-6 animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuration Saved!</h2>
                        <p className="text-sm text-gray-500 mb-6">Seat limits and sections have been successfully updated.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FirstSemesterRegistration;