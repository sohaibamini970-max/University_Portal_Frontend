import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';

const SystemAdminLayout = () => {
    return (
        <Layout
            title="System Administration"
            subtitle="Manage university users and system configurations"
        >
            <Outlet />
        </Layout>
    );
};

export default SystemAdminLayout;