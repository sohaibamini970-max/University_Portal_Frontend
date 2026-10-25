import React from 'react';
import Layout from '../../../components/Layout/Layout';
import { Info } from 'lucide-react';

const CourseInfo = () => (
    <Layout title="Course Information" subtitle="Detailed course descriptions and syllabus">
        <div className="card">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white">
                    <Info className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Course Info</h2>
            </div>
            <p className="text-gray-500">Detailed course information coming soon.</p>
        </div>
    </Layout>
);

export default CourseInfo;