import React, { useState, useEffect } from 'react';
import { Save, Loader2, Settings, AlertCircle } from 'lucide-react';
import { api } from '../../context/AuthContext';
import Layout from '../../components/Layout/Layout';

const ManageAssessment = () => {
    const [programs, setPrograms] = useState([]);
    const [batches, setBatches] = useState([]);

    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');

    const [configs, setConfigs] = useState([]);
    const [batchCourses, setBatchCourses] = useState([]); // To show how many courses will be updated
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // 1. Fetch dropdown data on mount
    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [progRes, batchRes] = await Promise.all([
                    api.get('/programs'),
                    api.get('/batches')
                ]);
                setPrograms(progRes.data || []);
                setBatches(batchRes.data || []);
            } catch (err) {
                console.error("Failed to load programs/batches", err);
            }
        };
        fetchDropdowns();
    }, []);

    // 2. When Program + Batch are selected, fetch the config and the courses
    useEffect(() => {
        if (!selectedProgram || !selectedBatch) {
            setConfigs([]);
            setBatchCourses([]);
            return;
        }

        const fetchConfigAndCourses = async () => {
            setLoading(true);
            try {
                // Fetch courses for this specific batch to know what we are updating
                const coursesRes = await api.get(`/program-courses/assignments?programId=${selectedProgram}&batchId=${selectedBatch}`);
                const courses = coursesRes.data || [];
                setBatchCourses(courses);

                if (courses.length === 0) {
                    setConfigs([]);
                    setLoading(false);
                    return;
                }

                // Fetch the assessment config using the FIRST course's ID
                // (assuming all courses in a batch start with the same default config)
                const primaryCourseId = courses[0].id;
                const configRes = await api.get(`/assessment-types/course/${primaryCourseId}`);
                setConfigs(configRes.data || []);

            } catch (err) {
                console.error("Failed to fetch data", err);
                alert("Failed to load configuration for this batch.");
            } finally {
                setLoading(false);
            }
        };
        fetchConfigAndCourses();
    }, [selectedProgram, selectedBatch]);

    // Handlers
    const handleToggle = (id) => {
        setConfigs(prev => prev.map(c =>
            c.id === id ? { ...c, isEnabled: !c.isEnabled } : c
        ));
    };

    const handleMarksChange = (id, val) => {
        setConfigs(prev => prev.map(c =>
            c.id === id ? { ...c, customTotalMarks: val } : c
        ));
    };

    const handleSave = async () => {
        if (batchCourses.length === 0) return;
        setSaving(true);

        try {
            // Loop over EVERY course in this program/batch and save the config
            const promises = batchCourses.map(course => {
                return api.post('/assessment-types/course/config', {
                    programCourseId: course.id,
                    configs: configs.map(c => ({
                        assessmentTypeId: c.id,
                        customTotalMarks: Number(c.customTotalMarks),
                        isEnabled: c.isEnabled
                    }))
                });
            });

            await Promise.all(promises);
            alert(`Configuration saved successfully for ${batchCourses.length} courses!`);
        } catch (err) {
            alert('Failed to save configuration for some courses.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Layout title="Manage Assessments" subtitle="Enable or configure assessment types for an entire batch">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* 1. Program & Batch Selection */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-indigo-600" /> Batch-Wide Assessment Rules
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Program</label>
                            <select
                                value={selectedProgram}
                                onChange={e => { setSelectedProgram(e.target.value); setSelectedBatch(''); }}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-semibold text-sm"
                            >
                                <option value="">Select Program</option>
                                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch</label>
                            <select
                                value={selectedBatch}
                                onChange={e => setSelectedBatch(e.target.value)}
                                disabled={!selectedProgram}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-semibold text-sm disabled:opacity-50"
                            >
                                <option value="">Select Batch</option>
                                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Configuration Panel */}
                {selectedProgram && selectedBatch && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                        {loading ? (
                            <div className="p-10 flex justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                            </div>
                        ) : batchCourses.length === 0 ? (
                            <div className="p-10 text-center flex flex-col items-center">
                                <AlertCircle className="w-10 h-10 text-amber-500 mb-2" />
                                <p className="font-bold text-gray-800">No courses assigned</p>
                                <p className="text-sm text-gray-500">You must assign courses to this Program/Batch before configuring assessments.</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-indigo-50 px-6 py-3 border-b border-indigo-100 flex items-center justify-between">
                                    <p className="text-sm font-bold text-indigo-800">
                                        Applying rules to <strong>{batchCourses.length}</strong> courses in this batch.
                                    </p>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {configs.map(c => (
                                        <div key={c.id} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${c.isEnabled ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="checkbox"
                                                    checked={c.isEnabled}
                                                    onChange={() => handleToggle(c.id)}
                                                    className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
                                                />
                                                <div>
                                                    <p className="font-bold text-gray-900">{c.name}</p>
                                                    <p className="text-xs text-gray-500">{c.category}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 pl-9 sm:pl-0">
                                                <span className="text-sm font-semibold text-gray-500">Total Marks:</span>
                                                <input
                                                    type="number"
                                                    value={c.customTotalMarks}
                                                    disabled={c.isFixed || !c.isEnabled}
                                                    onChange={(e) => handleMarksChange(c.id, e.target.value)}
                                                    className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-center font-bold disabled:bg-gray-200"
                                                />
                                                {c.isFixed && (
                                                    <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded">Fixed</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-gray-50 border-t flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-md transition-colors"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Apply to Entire Batch
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ManageAssessment;