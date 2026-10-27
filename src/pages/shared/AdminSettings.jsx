import React from 'react';
import Layout from '../../components/Layout/Layout';
import PasswordSettings from './PasswordSettings';

const AdminSettings = () => {
    return (
        <Layout title="Account Settings" subtitle="Manage your password and security">
            <PasswordSettings />
        </Layout>
    );
};

export default AdminSettings;