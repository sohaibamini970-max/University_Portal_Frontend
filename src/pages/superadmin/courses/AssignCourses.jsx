import React, { useState, useEffect } from 'react';
import { CheckCircle, BookOpen, Plus, Loader2, Trash2, Save } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const AssignCourses = () => {
    const [batches, setBatches] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [allCourses, setAllCourses] = useState([]);

    // Dynamic states for dropdowns
    const [sessions, setSessions] = useState([]);
    const [semesters, setSemesters] = useState([]);

    const [assignedCourses, setAssignedCourses] = useState([]);
    const [pendingAssignments, setPendingAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form Selection State
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    useEffect(() => {
        // Fetch all data including sessions and semesters
        Promise.all([
            api.get('/batches'),
            api.get('/programs'),
            api.get('/courses'),
            api.get('/sessions'),
            api.get('/semesters')
        ]).then(([bRes, pRes, cRes, sRes, semRes]) => {
            setBatches(bRes.data);
            setPrograms(pRes.data);
            setAllCourses(cRes.data);
            setSessions(sRes.data);
            setSemesters(semRes.data);

            // Set default selections if data exists
            if (sRes.data.length > 0) setSelectedSession(sRes.data[0].id);
            if (semRes.data.length > 0) setSelectedSemester(semRes.data[0].id);
        }).catch(console.error);
    }, []);

    // Fetch existing assignments
    useEffect(() => {
        if (selectedBatch && selectedProgram) {
            // 👇 FIX 1: Added hyphen to 'program-courses'
            api.get(`/program-courses?batchId=${selectedBatch}&programId=${selectedProgram}`)
                .then(res => {
                    setAssignedCourses(res.data);
                    setPendingAssignments([]);
                })
                .catch(console.error);
        }
    }, [selectedBatch, selectedProgram]);

    const handleStageCourse = (course) => {
        if (!selectedBatch || !selectedProgram || !selectedSession || !selectedSemester) {
            return alert("Please select Batch, Program, Session, and Semester first.");
        }

        // Check if already assigned
        const isAlreadyAssigned = assignedCourses.some(a =>
            a.courseId === course.id &&
            a.semesterId === parseInt(selectedSemester) &&
            a.sessionId === parseInt(selectedSession)
        );

        const isAlreadyPending = pendingAssignments.some(p =>
            p.courseId === course.id
        );

        if (isAlreadyAssigned) return alert("Course already assigned for this semester and session.");
        if (isAlreadyPending) return alert("Course already added to the pending list.");

        // Push IDs instead of Text
        setPendingAssignments([...pendingAssignments, {
            programId: parseInt(selectedProgram),
            courseId: course.id,
            batchId: parseInt(selectedBatch),
            sessionId: parseInt(selectedSession),
            semesterId: parseInt(selectedSemester),
            sections: ['A', 'B'],
            courseData: course
        }]);
    };

    const handleRemovePending = (courseId) => {
        setPendingAssignments(pendingAssignments.filter(p => p.courseId !== courseId));
    };

    const handleConfirmSave = async () => {
        if (pendingAssignments.length === 0) return;
        setIsLoading(true);

        try {
            for (const assignment of pendingAssignments) {
                // 👇 FIX 2: Added hyphen to 'program-courses'
                await api.post('/program-courses', assignment);
            }

            // 👇 FIX 3: Added hyphen to 'program-courses'
            const res = await api.get(`/program-courses?batchId=${selectedBatch}&programId=${selectedProgram}`);
            setAssignedCourses(res.data);
            setPendingAssignments([]);

        } catch (error) {
            alert(error.response?.data?.message || "Failed to assign courses");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Configuration */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Assign Courses to Programs & Batches</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Batch</label>
                        <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold">
                            <option value="">-- Select Batch --</option>
                            {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Program</label>
                        <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold">
                            <option value="">-- Select Program --</option>
                            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Session</label>
                        <select value={selectedSession} onChange={e => setSelectedSession(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold">
                            {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Semester</label>
                        <select value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold">
                            {semesters.map(s => <option key={s.id} value={s.id}>{s.name} Semester</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Courses */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" /> Available Courses
                    </h3>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                        {allCourses.map(course => (
                            <div key={course.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{course.code} - {course.name}</p>
                                    <p className="text-xs text-gray-500">{course.creditHours} Credits {course.prerequisite ? `• Prereq: ${course.prerequisite.code}` : ''}</p>
                                </div>
                                <button onClick={() => handleStageCourse(course)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending & Assigned Courses */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" /> Pending & Assigned
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {/* Pending */}
                        {pendingAssignments.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-orange-500 uppercase mb-2">To be Saved</p>
                                <div className="space-y-2">
                                    {pendingAssignments.map(assign => {
                                        const sessionName = sessions.find(s => s.id === assign.sessionId)?.name;
                                        const semesterName = semesters.find(s => s.id === assign.semesterId)?.name;

                                        return (
                                            <div key={assign.courseId} className="flex justify-between items-center p-3 border border-orange-200 bg-orange-50 rounded-lg">
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900">{assign.courseData.code} - {assign.courseData.name}</p>
                                                    <p className="text-[11px] text-orange-700 font-semibold mt-0.5">
                                                        {sessionName} • {semesterName} Sem
                                                    </p>
                                                </div>
                                                <button onClick={() => handleRemovePending(assign.courseId)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-md">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Existing Assigned */}
                        {assignedCourses.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-emerald-500 uppercase mb-2 mt-4">Already Assigned</p>
                                <div className="space-y-2">
                                    {assignedCourses.map(assign => (
                                        <div key={assign.id} className="flex justify-between items-center p-3 border border-gray-100 bg-gray-50 rounded-lg opacity-75">
                                            <div>
                                                <p className="font-bold text-sm text-gray-900">{assign.course.code} - {assign.course.name}</p>
                                                <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
                                                    {assign.session?.name} • {assign.semester?.name} Sem
                                                </p>
                                            </div>
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {pendingAssignments.length === 0 && assignedCourses.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No courses selected yet.</p>
                        )}
                    </div>

                    {/* Confirm Button */}
                    {pendingAssignments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <button
                                onClick={handleConfirmSave}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Saving Assignments...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" /> Confirm & Save ({pendingAssignments.length})
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignCourses;