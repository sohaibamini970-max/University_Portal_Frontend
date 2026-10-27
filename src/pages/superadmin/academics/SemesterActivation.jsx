import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Loader2, Lock, Unlock, Plus } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const SemesterActivation = () => {
    const [programs, setPrograms] = useState([]);
    const [batches, setBatches] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [semesters, setSemesters] = useState([]);

    const [programId, setProgramId] = useState('');
    const [batchId, setBatchId] = useState('');
    const [sessionId, setSessionId] = useState('');

    const [configs, setConfigs] = useState([]); // ProgramSessionSemester rows
    const [isLoading, setIsLoading] = useState(false);
    const [busyId, setBusyId] = useState(null);

    // Load lookups
    useEffect(() => {
        (async () => {
            try {
                const [p, b, s, sem] = await Promise.all([
                    api.get('/programs'),
                    api.get('/batches'),
                    api.get('/sessions'),
                    api.get('/semesters'),
                ]);
                setPrograms(p.data);
                setBatches(b.data);
                setSessions(s.data);
                setSemesters(sem.data);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    // Load configs when filters change
    useEffect(() => {
        if (!programId || !batchId || !sessionId) { setConfigs([]); return; }
        (async () => {
            setIsLoading(true);
            try {
                const res = await api.get('/program-session-semesters', {
                    params: { programId, batchId, sessionId },
                });
                setConfigs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [programId, batchId, sessionId]);

    const findConfig = (semesterId) =>
        configs.find((c) => c.semesterId === Number(semesterId));

    const handleAdd = async (semesterId) => {
        setBusyId(semesterId);
        try {
            await api.post('/program-session-semesters', {
                programId: Number(programId),
                batchId: Number(batchId),
                sessionId: Number(sessionId),
                semesterId: Number(semesterId),
                isActive: false,
            });
            const res = await api.get('/program-session-semesters', {
                params: { programId, batchId, sessionId },
            });
            setConfigs(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add');
        } finally {
            setBusyId(null);
        }
    };

    const handleActivate = async (configId) => {
        setBusyId(configId);
        try {
            await api.put(`/program-session-semesters/${configId}/activate`);
            const res = await api.get('/program-session-semesters', {
                params: { programId, batchId, sessionId },
            });
            setConfigs(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to activate');
        } finally {
            setBusyId(null);
        }
    };

    const handleDeactivate = async (configId) => {
        setBusyId(configId);
        try {
            await api.put(`/program-session-semesters/${configId}/deactivate`);
            const res = await api.get('/program-session-semesters', {
                params: { programId, batchId, sessionId },
            });
            setConfigs(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to deactivate');
        } finally {
            setBusyId(null);
        }
    };

    const handleRemove = async (configId) => {
        if (!window.confirm('Remove this semester from the batch?')) return;
        setBusyId(configId);
        try {
            await api.delete(`/program-session-semesters/${configId}`);
            setConfigs((prev) => prev.filter((c) => c.id !== configId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete');
        } finally {
            setBusyId(null);
        }
    };

    const ready = programId && batchId && sessionId;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Filters */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Program</label>
                    <select
                        value={programId}
                        onChange={(e) => setProgramId(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="">Select program</option>
                        {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Batch</label>
                    <select
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="">Select batch</option>
                        {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Session</label>
                    <select
                        value={sessionId}
                        onChange={(e) => setSessionId(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="">Select session</option>
                        {sessions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Semester Grid */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-bold text-gray-900">Semesters</h3>
                    <span className="text-xs text-gray-500">
                        Only one semester can be active at a time for a given program/batch/session.
                    </span>
                </div>

                {!ready ? (
                    <div className="p-10 text-center text-gray-500">
                        Select a program, batch, and session to configure semesters.
                    </div>
                ) : isLoading ? (
                    <div className="p-10 text-center text-gray-500 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                    </div>
                ) : semesters.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No semesters defined. Add them in Academic Calendar first.</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {semesters.map((sem) => {
                            const cfg = findConfig(sem.id);
                            const isBusy = busyId === sem.id || busyId === cfg?.id;
                            return (
                                <li key={sem.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cfg?.isActive
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                                : 'bg-slate-50 border-slate-200 text-slate-500'
                                            }`}>
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{sem.name}</p>
                                            <p className="text-xs font-medium text-gray-500">
                                                {cfg
                                                    ? cfg.isActive
                                                        ? 'Active — students of this batch are currently in this semester'
                                                        : 'Configured — not active'
                                                    : 'Not configured'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!cfg ? (
                                            <button
                                                onClick={() => handleAdd(sem.id)}
                                                disabled={isBusy}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg disabled:opacity-50"
                                            >
                                                {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                                                Enable
                                            </button>
                                        ) : (
                                            <>
                                                {cfg.isActive ? (
                                                    <button
                                                        onClick={() => handleDeactivate(cfg.id)}
                                                        disabled={isBusy}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg disabled:opacity-50"
                                                    >
                                                        {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Unlock className="w-3.5 h-3.5" />}
                                                        Deactivate
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleActivate(cfg.id)}
                                                        disabled={isBusy}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg disabled:opacity-50"
                                                    >
                                                        {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                                        Activate
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRemove(cfg.id)}
                                                    disabled={isBusy || cfg.isActive}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg disabled:opacity-40"
                                                    title={cfg.isActive ? 'Deactivate first' : 'Remove'}
                                                >
                                                    <Lock className="w-3.5 h-3.5" />
                                                    Remove
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SemesterActivation;