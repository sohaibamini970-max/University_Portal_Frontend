import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { Calendar, CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const AttendanceDetails = () => {
    const [searchParams] = useSearchParams();
    const courseCode = searchParams.get('courseCode');
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            if (!courseCode) return;
            try {
                const res = await api.get(`/attendance/details?courseCode=${courseCode}`);
                setDetails(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [courseCode]);

    if (loading) return <Layout title="Attendance Details"><div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div></Layout>;

    return (
        <Layout title="Attendance Details" subtitle={`Detailed logs for ${courseCode}`}>
            <div className="max-w-4xl mx-auto space-y-6 pb-8">
                <button onClick={() => navigate('/student/attendance')} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800">
                    <ArrowLeft className="w-4 h-4" /> Back to Summary
                </button>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-bold text-gray-800">Daily Log</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {details.length > 0 ? details.map((log, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <p className="font-bold text-gray-900">{new Date(log.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                    {log.remarks && <p className="text-xs text-gray-500 mt-1 italic">"{log.remarks}"</p>}
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${log.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {log.status === 'Present' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                    {log.status}
                                </div>
                            </div>
                        )) : (
                            <div className="p-10 text-center text-gray-500">No attendance records found for this course.</div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AttendanceDetails;