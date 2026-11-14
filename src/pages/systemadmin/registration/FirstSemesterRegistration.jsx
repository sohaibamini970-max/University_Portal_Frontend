import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { BookOpen, CheckCircle, Users, Loader2, Save, Settings2 } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const FirstSemesterRegistration = () => {
    const [programs, setPrograms] = useState([]);
    const [batches, setBatches] = useState([]);
    const [semesters, setSemesters] = useState([]);

    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    const [assignedCourses, setAssignedCourses] = useState([]);

    // 👇 New State for Sections with Seats 👇
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

    // Fetch Courses & Existing Section Config when dropdowns change
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

                // Merge existing DB config with default A-F options
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

    // Toggle Section ON/OFF
    const toggleSection = (index) => {
        const updated = [...sectionsConfig];
        updated[index].isActive = !updated[index].isActive;
        setSectionsConfig(updated);
    };

    // Change Seats
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
                sessionId: 1, // Update this if you have dynamic sessions
                sections: activeSections // Send full section objects
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
=======
import { BookOpen, CheckCircle, Users, UserPlus, AlertCircle, Layers, UserCheck, GraduationCap } from 'lucide-react';

const SECTIONS = ['A', 'B', 'C', 'D'];
const ALL_SECTIONS = 'ALL';

const FirstSemesterRegistration = () => {
    const [selectedProgram, setSelectedProgram] = useState('BS Computer Science');
    const [selectedSection, setSelectedSection] = useState('A');
    const [assignMode, setAssignMode] = useState('all'); // 'all' | 'new' | 'batch'
    const [selectedBatch, setSelectedBatch] = useState('2024');
    const [showSuccess, setShowSuccess] = useState(false);

    const [sectionLimits, setSectionLimits] = useState({
        'BS Computer Science': { A: 45, B: 40, C: 35, D: 30 },
        'BS Software Engineering': { A: 40, B: 40, C: 30, D: 30 },
        'BS Business Admin': { A: 50, B: 45, C: 40, D: 35 },
    });

    const [enrollment] = useState({
        'BS Computer Science': { A: 32, B: 28, C: 20, D: 15 },
        'BS Software Engineering': { A: 30, B: 25, C: 18, D: 12 },
        'BS Business Admin': { A: 40, B: 35, C: 28, D: 20 },
    });

    // Mock batches available per program
    const availableBatches = ['2024', '2023', '2022', '2021'];

    const firstSemesterCourses = [
        { code: 'CS-101', name: 'Introduction to Computing', credits: 3 },
        { code: 'MATH-101', name: 'Calculus I', credits: 3 },
        { code: 'ENG-101', name: 'English Composition', credits: 3 },
        { code: 'PHY-101', name: 'Applied Physics', credits: 4 },
        { code: 'CS-102', name: 'Programming Fundamentals', credits: 4 },
    ];

    const isAllSections = selectedSection === ALL_SECTIONS;

    const activeSections = isAllSections
        ? SECTIONS.filter(sec => sectionLimits[selectedProgram]?.[sec] !== undefined)
        : [selectedSection];

    // ---- Per-section derived values ----
    const perSection = (sec) => {
        const limit = sectionLimits[selectedProgram]?.[sec] ?? 0;
        const enrolled = enrollment[selectedProgram]?.[sec] ?? 0;
        return { limit, enrolled, available: limit - enrolled, over: enrolled > limit };
    };

    const currentLimit = activeSections.reduce((sum, sec) => sum + perSection(sec).limit, 0);
    const currentEnrolled = activeSections.reduce((sum, sec) => sum + perSection(sec).enrolled, 0);
    const availableSeats = currentLimit - currentEnrolled;

    // ---- Draft inputs: one per section ----
    const [limitInputs, setLimitInputs] = useState({});
    const [limitErrors, setLimitErrors] = useState({});

    const MIN_LIMIT = 1;
    const MAX_LIMIT = 200;

    useEffect(() => {
        const nextInputs = {};
        const nextErrors = {};
        activeSections.forEach(sec => {
            nextInputs[sec] = String(sectionLimits[selectedProgram]?.[sec] ?? '');
            nextErrors[sec] = '';
        });
        setLimitInputs(nextInputs);
        setLimitErrors(nextErrors);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProgram, selectedSection, sectionLimits]);

    const validateLimit = (raw, enrolled) => {
        const trimmed = String(raw).trim();
        if (trimmed === '') return 'Limit is required.';
        if (!/^\d+$/.test(trimmed)) return 'Only whole numbers allowed.';
        if (trimmed.length > 1 && trimmed.startsWith('0')) {
            return `"${trimmed}" is invalid. Did you mean ${parseInt(trimmed, 10)}?`;
        }
        const value = parseInt(trimmed, 10);
        if (value < MIN_LIMIT) return `Min ${MIN_LIMIT}.`;
        if (value > MAX_LIMIT) return `Max ${MAX_LIMIT}.`;
        if (value < enrolled) return `Below enrollment (${enrolled}).`;
        return '';
    };

    const handleLimitChange = (sec, raw) => {
        setLimitInputs(prev => ({ ...prev, [sec]: raw }));

        const enrolled = enrollment[selectedProgram]?.[sec] ?? 0;
        const error = validateLimit(raw, enrolled);
        setLimitErrors(prev => ({ ...prev, [sec]: error }));

        if (!error) {
            const value = parseInt(String(raw).trim(), 10);
            setSectionLimits(prev => ({
                ...prev,
                [selectedProgram]: {
                    ...prev[selectedProgram],
                    [sec]: value,
                },
            }));
        }
    };

    const handleLimitBlur = (sec) => {
        if (limitErrors[sec]) {
            setLimitInputs(prev => ({
                ...prev,
                [sec]: String(sectionLimits[selectedProgram]?.[sec] ?? ''),
            }));
        }
    };

    const isLimitValid = activeSections.every(sec => !limitErrors[sec] && String(limitInputs[sec] ?? '').trim() !== '');
    const hasOvercapacity = currentEnrolled > currentLimit;

    const handleAssign = () => {
        if (!isLimitValid || hasOvercapacity) return;
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const sectionLabel = isAllSections ? 'All Sections' : `Section ${selectedSection}`;

    const assignLabel =
        assignMode === 'all'
            ? 'All Students'
            : assignMode === 'new'
                ? 'New Students Only'
                : `Batch ${selectedBatch}`;

    // Reusable single-limit input renderer
    const renderLimitInput = (sec) => {
        const { enrolled } = perSection(sec);
        const error = limitErrors[sec] || '';
        return (
            <div key={sec}>
                <div className="relative">
                    <UserPlus className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                    <input
                        type="text"
                        inputMode="numeric"
                        value={limitInputs[sec] ?? ''}
                        onChange={e => handleLimitChange(sec, e.target.value)}
                        onBlur={() => handleLimitBlur(sec)}
                        aria-invalid={!!error}
                        aria-label={`Section ${sec} student limit`}
                        className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-semibold outline-none transition-colors ${
                            error
                                ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                                : 'border-gray-300 focus:ring-2 focus:ring-emerald-500'
                        }`}
                    />
                </div>
                {error ? (
                    <p className="flex items-start gap-1 text-xs text-red-600 font-semibold mt-1">
                        <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        {error}
                    </p>
                ) : (
                    <p className="text-xs text-gray-500 mt-1">
                        {enrolled} enrolled · {perSection(sec).available} seat{perSection(sec).available === 1 ? '' : 's'} available
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
>>>>>>> 48ee14e4b0486ed9bbb0f38b00f1d40965b2e1da
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">1st Semester Configuration</h2>
                        <p className="text-sm text-gray-500">Manage sections and seats for new batches.</p>
                    </div>
                </div>

<<<<<<< HEAD
                {/* Dropdowns */}
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
=======
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Select Program</label>
                        <select
                            value={selectedProgram}
                            onChange={e => setSelectedProgram(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            <option>BS Computer Science</option>
                            <option>BS Software Engineering</option>
                            <option>BS Business Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Select Section</label>
                        <select
                            value={selectedSection}
                            onChange={e => setSelectedSection(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            <option value={ALL_SECTIONS}>All Sections</option>
                            {SECTIONS.map(sec => (
                                <option key={sec} value={sec}>Section {sec}</option>
                            ))}
>>>>>>> 48ee14e4b0486ed9bbb0f38b00f1d40965b2e1da
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Assign To</label>
                        <select
                            value={assignMode}
                            onChange={e => setAssignMode(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            <option value="all">All Students</option>
                            <option value="new">New Students Only</option>
                            <option value="batch">Specific Batch</option>
                        </select>
                    </div>

                    {/* Batch selector — only shown when "Specific Batch" is chosen */}
                    {assignMode === 'batch' ? (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Select Batch</label>
                            <div className="relative">
                                <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <select
                                    value={selectedBatch}
                                    onChange={e => setSelectedBatch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    {availableBatches.map(batch => (
                                        <option key={batch} value={batch}>Batch {batch}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Students of this batch will be enrolled</p>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Section Student Limit</label>
                            {isAllSections ? (
                                <>
                                    <div className="relative">
                                        <Layers className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <div className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">
                                            Editing {activeSections.length} sections below
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Combined: {currentEnrolled} / {currentLimit} enrolled
                                    </p>
                                </>
                            ) : (
                                renderLimitInput(selectedSection)
                            )}
                        </div>
                    )}
                </div>

<<<<<<< HEAD
                {/* Courses List */}
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
=======
                {/* When in batch mode, section limit input still needed in its own row */}
                {assignMode === 'batch' && (
                    <div className="mb-8 max-w-xs">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Section Student Limit</label>
                        {isAllSections ? (
                            <>
                                <div className="relative">
                                    <Layers className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <div className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">
                                        Editing {activeSections.length} sections below
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Combined: {currentEnrolled} / {currentLimit} enrolled
                                </p>
                            </>
                        ) : (
                            renderLimitInput(selectedSection)
                        )}
                    </div>
                )}

                {/* Per-section limit grid when All Sections is selected */}
                {isAllSections && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <Layers className="w-4 h-4 text-gray-500" />
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Per-Section Limits
                            </h3>
                            <span className="ml-auto text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                                Total: {currentEnrolled} / {currentLimit}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {activeSections.map(sec => {
                                const p = perSection(sec);
                                return (
                                    <div
                                        key={sec}
                                        className={`p-4 rounded-xl border ${
                                            p.over ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[11px] uppercase tracking-wider font-bold text-gray-600">
                                                Section {sec}
                                            </p>
                                            <span className={`text-[10px] font-bold ${p.over ? 'text-red-600' : 'text-gray-500'}`}>
                                                {p.enrolled} enrolled
                                            </span>
                                        </div>
                                        {renderLimitInput(sec)}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Capacity Warning */}
                {hasOvercapacity && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-semibold">
                        ⚠ Current enrollment ({currentEnrolled}) exceeds the configured limit ({currentLimit})
                        {isAllSections ? ' across all sections' : ''}.
                    </div>
                )}

                {/* Preview Courses */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
                        <h3 className="font-bold text-sm uppercase tracking-wider">1st Semester Core Courses</h3>
                        <span className="bg-white/20 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {currentEnrolled} / {currentLimit} Students
                        </span>
                    </div>
                    <div className="divide-y divide-gray-100 bg-white">
                        {firstSemesterCourses.map(course => (
                            <div key={course.code} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-gray-900">{course.name}</p>
                                    <p className="text-xs font-semibold text-emerald-600">{course.code}</p>
>>>>>>> 48ee14e4b0486ed9bbb0f38b00f1d40965b2e1da
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm font-semibold">
                            No courses assigned by Super Admin for this selection.
                        </div>
                    )}
                </div>

                {/* 👇 Section Seats Configuration 👇 */}
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

<<<<<<< HEAD
                {/* Save Button */}
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
=======
                {/* Action Button */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4 mt-6">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5" />
                        Assigning to: <span className="font-bold text-gray-700">{assignLabel}</span>
                    </p>
                    <button
                        onClick={handleAssign}
                        disabled={!isLimitValid || hasOvercapacity}
                        title={
                            !isLimitValid
                                ? 'Fix invalid section limits first'
                                : hasOvercapacity
                                    ? 'Capacity exceeded'
                                    : undefined
                        }
                        className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle className="w-5 h-5" /> Auto-Assign to {selectedProgram} {sectionLabel}
>>>>>>> 48ee14e4b0486ed9bbb0f38b00f1d40965b2e1da
                    </button>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm text-center p-6 animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
<<<<<<< HEAD
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuration Saved!</h2>
                        <p className="text-sm text-gray-500 mb-6">Seat limits and sections have been successfully updated.</p>
=======
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Courses Assigned!</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            {assignLabel} in {selectedProgram} ({sectionLabel}) have been enrolled.
                            {isAllSections
                                ? ` Total: ${currentEnrolled} students across ${activeSections.length} sections.`
                                : ` Section limit: ${currentLimit}.`}
                        </p>
>>>>>>> 48ee14e4b0486ed9bbb0f38b00f1d40965b2e1da
                    </div>
                </div>
            )}
        </div>
    );
};

export default FirstSemesterRegistration;
