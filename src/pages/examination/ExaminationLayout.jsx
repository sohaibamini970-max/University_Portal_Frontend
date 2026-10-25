import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';

const ExaminationLayout = () => {
    return (
        <Layout title="Examination Department" subtitle="Manage exams, results, and transcripts">
            <Outlet />
        </Layout>
    );
};

export default ExaminationLayout;