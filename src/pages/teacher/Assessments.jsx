import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { Save, Search, Loader2, AlertCircle, Scissors, Plus, Trash2 } from 'lucide-react';
import { api } from '../../context/AuthContext';

const TeacherAssessments = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [assessmentConfig, setAssessmentConfig] = useState([]);
    const [selectedType, setSelectedType] = useState('');

    // Splits State
    const [splits, setSplits] = useState([]);
    const [selectedSplitId, setSelectedSplitId] = useState(null);
    const [showSplitModal, setShowSplitModal] = useState(false);
    const [newSplits, setNewSplits] = useState([{ partName: 'Part A', maxMarks: 15 }]);

    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');

    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingConfig, setLoadingConfig] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [saving, setSaving] = useState(false);

    // 1. Load Courses
    useEffect(() => {
        api.get('/assessments/teacher/courses').then(res => {
            setCourses(res.data || []);
            if (res.data?.length > 0) setSelectedCourse(res.data[0]);
        }).finally(() => setLoadingCourses(false));
    }, []);

    // 2. Load Config and Splits when Course changes
    useEffect(() => {
        if (!selectedCourse) return;
        setLoadingConfig(true);
        setAssessmentConfig([]);
        setSelectedType('');
        setSplits([]);
        setSelectedSplitId(null);

        api.get(`/assessment-types/course/${selectedCourse.programCourseId}`).then(res => {
            const enabled = (res.data || []).filter(c => c.isEnabled);
            setAssessmentConfig(enabled);
            if (enabled.length > 0) setSelectedType(enabled[0].id);
        }).finally(() => setLoadingConfig(false));
    }, [selectedCourse]);

    // 3. Load Splits when Assessment Type changes
    useEffect(() => {
        if (!selectedCourse || !selectedType) return;

        const currentType = assessmentConfig.find(c => c.id === Number(selectedType));
        if (currentType?.isSplitAllowed || currentType?.category === 'Lab') {
            api.get(`/assessments/splits?programCourseId=${selectedCourse.programCourseId}&assessmentTypeId=${selectedType}`)
                .then(res => {
                    setSplits(res.data || []);
                    if (res.data?.length > 0) {
                        setSelectedSplitId(res.data[0].id);
                    } else {
                        setSelectedSplitId(null);
                    }
                });
        } else {
            setSplits([]);
            setSelectedSplitId(null);
        }
    }, [selectedType, selectedCourse, assessmentConfig]);

    // 4. Load Students and Marks
    useEffect(() => {
        if (!selectedCourse || !selectedType) return;
        setLoadingStudents(true);

        const fetchData = async () => {
            try {
                const [studentsRes, marksRes] = await Promise.all([
                    api.get(`/assessments/teacher/students?programCourseId=${selectedCourse.programCourseId}&sectionName=${selectedCourse.sectionName}`),
                    api.get(`/assessments/teacher/marks-with-splits?programCourseId=${selectedCourse.programCourseId}&assessmentTypeId=${selectedType}&sectionName=${selectedCourse.sectionName}`)
                ]);

                const marksMap = {};
                (marksRes.data || []).forEach(m => {
                    // Group marks by student and split (if exists)
                    const key = m.splitId ? `${m.studentProfileId}_${m.splitId}` : m.studentProfileId;
                    marksMap[key] = m.obtainedMarks;
                });

                const merged = (studentsRes.data || []).map(s => {
                    const key = selectedSplitId ? `${s.studentProfileId}_${selectedSplitId}` : s.studentProfileId;
                    return {
                        ...s,
                        marks: marksMap[key] ?? ''
                    };
                });
                setStudents(merged);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingStudents(false);
            }
        };
        fetchData();
    }, [selectedCourse, selectedType, selectedSplitId]);

    // Helpers
    const currentAssessment = assessmentConfig.find(c => c.id === Number(selectedType));
    const isLab = currentAssessment?.category === 'Lab';
    const needsSplit = currentAssessment?.isSplitAllowed || isLab;

    const currentMax = selectedSplitId
        ? splits.find(s => s.id === selectedSplitId)?.maxMarks
        : currentAssessment?.customTotalMarks || 100;

    const handleMarkChange = (id, val) => {
        if (val !== '' && (Number(val) < 0 || Number(val) > currentMax)) return;
        setStudents(prev => prev.map(s => s.studentProfileId === id ? { ...s, marks: val } : s));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('/assessments/teacher/save-with-splits', {
                programCourseId: selectedCourse.programCourseId,
                assessmentTypeId: Number(selectedType),
                sectionName: selectedCourse.sectionName,
                splitId: selectedSplitId ? Number(selectedSplitId) : null,
                marks: students.filter(s => s.marks !== '').map(s => ({
                    studentProfileId: s.studentProfileId,
                    obtainedMarks: Number(s.marks)
                }))
            });
            alert('Marks saved successfully!');
        } catch (err) {
            alert('Failed to save marks.');
        } finally {
            setSaving(false);
        }
    };

    // Splits Modal Handlers
    const handleAddSplitPart = () => setNewSplits(prev => [...prev, { partName: `Part ${String.fromCharCode(65 + prev.length)}`, maxMarks: 10 }]);
    const handleRemoveSplitPart = (index) => setNewSplits(prev => prev.filter((_, i) => i !== index));
    const handleSplitChange = (index, field, val) => {
        const updated = [...newSplits];
        updated[index][field] = val;
        setNewSplits(updated);
    };

    const handleSaveSplits = async () => {
        const total = newSplits.reduce((sum, s) => sum + Number(s.maxMarks), 0);
        if (total !== currentAssessment.customTotalMarks) {
            alert(`Total split marks (${total}) must equal the assessment total (${currentAssessment.customTotalMarks}).`);
            return;
        }
        try {
            await api.post('/assessments/splits', {
                programCourseId: selectedCourse.programCourseId,
                assessmentTypeId: Number(selectedType),
                splits: newSplits
            });
            setShowSplitModal(false);
            // Reload splits
            const res = await api.get(`/assessments/splits?programCourseId=${selectedCourse.programCourseId}&assessmentTypeId=${selectedType}`);
            setSplits(res.data || []);
            setSelectedSplitId(res.data?.[0]?.id || null);
        } catch (err) {
            alert('Failed to save splits.');
        }
    };

    const filtered = students.filter(s =>
        s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
        s.fullName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout title="Assessments" subtitle="Enter student marks">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header Controls */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold text-gray-600 mb-1 block">My Courses</label>
                            <select
                                value={selectedCourse?.teacherAssignmentId || ''}
                                onChange={e => setSelectedCourse(courses.find(x => x.teacherAssignmentId === Number(e.target.value)))}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-semibold text-sm"
                            >
                                {courses.map(c => <option key={c.teacherAssignmentId} value={c.teacherAssignmentId}>{c.courseCode} - {c.courseName} ({c.sectionName})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-600 mb-1 block">Assessment Type</label>
                            <select
                                value={selectedType}
                                onChange={e => { setSelectedType(e.target.value); setSelectedSplitId(null); }}
                                className="w-full px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl font-bold text-sm"
                            >
                                {assessmentConfig.map(c => <option key={c.id} value={c.id}>{c.name} ({c.customTotalMarks} Marks)</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Splits / Lab Breakdown */}
                    {needsSplit && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mt-2">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                                    <Scissors className="w-4 h-4" />
                                    {isLab ? 'Lab Breakdown' : 'Split Assessment Parts'}
                                </h4>
                                <button onClick={() => { setNewSplits(splits.length > 0 ? splits.map(s => ({ partName: s.partName, maxMarks: s.maxMarks })) : [{ partName: 'Part A', maxMarks: 15 }, { partName: 'Part B', maxMarks: 15 }, { partName: 'Part C', maxMarks: 20 }]); setShowSplitModal(true); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                                    Edit Parts
                                </button>
                            </div>

                            {splits.length === 0 ? (
                                <p className="text-xs text-indigo-600 font-medium">No parts configured yet. Click "Edit Parts" to set them up.</p>
                            ) : (
                                <div className="flex gap-2 flex-wrap">
                                    {splits.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => setSelectedSplitId(s.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${selectedSplitId === s.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            {s.partName} ({s.maxMarks})
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Student List */}
                {selectedCourse && selectedType && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                            <div className="relative w-64">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <p className="text-sm font-bold text-gray-500">
                                {selectedSplitId ? `Editing: ${splits.find(s => s.id === selectedSplitId)?.partName}` : 'Total'} Marks (/ {currentMax})
                            </p>
                        </div>

                        {loadingStudents ? (
                            <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
                        ) : filtered.length === 0 ? (
                            <div className="p-10 text-center text-gray-500 text-sm">No students found.</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filtered.map(s => (
                                    <div key={s.studentProfileId} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">{s.fullName.charAt(0)}</div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{s.fullName}</p>
                                                <p className="text-xs text-gray-500">{s.rollNo}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-400">/ {currentMax}</span>
                                            <input
                                                type="number"
                                                value={s.marks}
                                                onChange={e => handleMarkChange(s.studentProfileId, e.target.value)}
                                                placeholder="--"
                                                className="w-20 px-3 py-2 text-center font-bold border border-gray-300 rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                            <button onClick={handleSave} disabled={saving || students.length === 0} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Marks
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Split Modal */}
            {showSplitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Configure {currentAssessment?.name} Parts</h3>
                        <p className="text-xs text-gray-500 mb-4">Total marks must equal {currentAssessment?.customTotalMarks}.</p>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {newSplits.map((s, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input type="text" value={s.partName} onChange={e => handleSplitChange(i, 'partName', e.target.value)} placeholder="Part Name" className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                                    <input type="number" value={s.maxMarks} onChange={e => handleSplitChange(i, 'maxMarks', e.target.value)} placeholder="Marks" className="w-20 px-3 py-2 border rounded-lg text-sm text-center" />
                                    <button onClick={() => handleRemoveSplitPart(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>

                        <button onClick={handleAddSplitPart} className="mt-3 text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800"><Plus className="w-3 h-3" /> Add Part</button>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowSplitModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                            <button onClick={handleSaveSplits} className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Save Parts</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};
export default TeacherAssessments;