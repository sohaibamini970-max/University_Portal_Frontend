import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, Save, Loader2, FileSpreadsheet } from 'lucide-react';
import ExcelUploadStudents from './ExcelUploadStudents';
import { api } from '../../../context/AuthContext';

const AddStudent = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showExcelUpload, setShowExcelUpload] = useState(false);

    // Dropdown Data
    const [programs, setPrograms] = useState([]);
    const [batches, setBatches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState([]);

    const emptyForm = {
        firstName: '', lastName: '', fatherName: '', email: '', phone: '',
        departmentId: '', programId: '', batchId: '', section: '', sequenceNo: '',
        rollNo: '', cnic: '', dob: '', address: '', password: '12345678'
    };

    const [formData, setFormData] = useState(emptyForm);

    // 1. Fetch Dropdown Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [progRes, batchRes, deptRes] = await Promise.all([
                    api.get('/programs'), api.get('/batches'), api.get('/departments')
                ]);
                setPrograms(progRes.data);
                setBatches(batchRes.data);
                setDepartments(deptRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    // 2. Fetch Sections when Program/Batch changes
    useEffect(() => {
        const fetchSections = async () => {
            if (!formData.programId || !formData.batchId) {
                setSections([]);
                return;
            }
            try {
                const res = await api.get(
                    `/first-semester/config?programId=${formData.programId}&batchId=${formData.batchId}&semesterId=1`
                );
                setSections(res.data);
                // Reset section to first available or empty
                setFormData(prev => ({
                    ...prev,
                    section: res.data.length > 0 ? res.data[0].name : ''
                }));
            } catch (error) {
                console.error("Failed to fetch sections", error);
                setSections([]);
            }
        };
        fetchSections();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.programId, formData.batchId]);

    // 3. Generate Roll No
    const generateRollNo = (batchYear, programCode, sequenceNo) => {
        return `${batchYear}F-${programCode}-${sequenceNo}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const prog = programs.find(p => p.id === parseInt(formData.programId));
            const batch = batches.find(b => b.id === parseInt(formData.batchId));

            const batchYear = batch ? batch.startYear : 2024;
            const programCode = prog ? prog.code : 'BSCS';
            const generatedRollNo = generateRollNo(
                batchYear,
                programCode,
                Math.floor(Math.random() * 900) + 100
            );

            await api.post('/students/register-admission', {
                ...formData,
                fullName: `${formData.firstName} ${formData.lastName}`,
                rollNo: generatedRollNo,
                programId: parseInt(formData.programId),
                sequenceNo: formData.sequenceNo,
                batchId: parseInt(formData.batchId),
                departmentId: parseInt(formData.departmentId)
            });

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setFormData(emptyForm);
                setSections([]);
            }, 2000);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to register student");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 text-white flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <UserPlus className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Register New Student</h2>
                    <p className="text-slate-300 text-sm mt-0.5">Enter student details to generate their Roll No and portal access.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                {/* Personal Info */}
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                            <input required type="text" value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                            <input required type="text" value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Father's Name</label>
                            <input required type="text" value={formData.fatherName}
                                onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                            <input required type="email" value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                            <input required type="text" value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">CNIC / B-Form</label>
                            <input required type="text" value={formData.cnic}
                                onChange={e => setFormData({ ...formData, cnic: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Sequence No (e.g., 001)</label>
                            <input required type="text" value={formData.sequenceNo}
                                onChange={e => setFormData({ ...formData, sequenceNo: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="001"
                                maxLength={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Academic Info */}
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 mt-6">Academic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                            <select required value={formData.departmentId}
                                onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                <option value="">-- Select Department --</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Program</label>
                            <select required value={formData.programId}
                                onChange={e => setFormData({ ...formData, programId: e.target.value, section: '' })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                <option value="">-- Select Program --</option>
                                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Batch</label>
                            <select required value={formData.batchId}
                                onChange={e => setFormData({ ...formData, batchId: e.target.value, section: '' })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                <option value="">-- Select Batch --</option>
                                {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.startYear})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Section</label>
                            <select required value={formData.section}
                                onChange={e => setFormData({ ...formData, section: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                                <option value="">-- Select Section --</option>
                                {sections.map(s => (
                                    <option key={s.name} value={s.name}>
                                        Section {s.name} ({s.maxSeats} Seats)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                    <button
                        type="button"
                        onClick={() => setShowExcelUpload(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-colors"
                    >
                        <FileSpreadsheet className="w-5 h-5" />
                        Bulk Upload via Excel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isSubmitting ? 'Registering...' : 'Register Student'}
                    </button>
                </div>
            </form>

            {/* Excel Upload Modal */}
            {showExcelUpload && (
                <ExcelUploadStudents
                    onClose={() => setShowExcelUpload(false)}
                    onSuccess={() => { /* optional refresh */ }}
                />
            )}

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm text-center p-6">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Registered!</h2>
                        <p className="text-sm text-gray-500 mb-6">Portal access is currently inactive. The System Admin must activate it.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddStudent;