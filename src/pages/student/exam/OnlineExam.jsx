import React from 'react';
import Layout from '../../../components/Layout/Layout';
import { Laptop, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const OnlineExam = () => {
    const exams = [
        { name: 'Data Structures Quiz 2', course: 'CS-301', date: 'Nov 28, 2025', duration: '60 min', status: 'Available', available: true },
        { name: 'Web Development Midterm', course: 'CS-302', date: 'Dec 02, 2025', duration: '90 min', status: 'Upcoming', available: false },
        { name: 'Algorithms Lab Exam', course: 'CS-303', date: 'Dec 08, 2025', duration: '120 min', status: 'Upcoming', available: false },
    ];

    return (
        <Layout title="Online Exams" subtitle="Take available online assessments">
            <div className="card mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center text-white">
                        <Laptop className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Online Exam Portal</h2>
                        <p className="text-sm text-gray-500">Available assessments appear here</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OnlineExam;