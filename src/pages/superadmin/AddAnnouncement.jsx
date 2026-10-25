import React from 'react';
import Layout from '../../components/Layout/Layout';
import CreateAnnouncementForm from '../../components/common/CreateAnnouncementForm';

const SuperAdminAddAnnouncement = () => {
    // Define who the Super Admin can send to
    const allowedRoles = ['superadmin', 'admin', 'teacher', 'student'];

    return (
        <Layout title="Announcements" subtitle="Broadcast messages to the entire university">
            <CreateAnnouncementForm targetRoles={allowedRoles} />
        </Layout>
    );
};

export default SuperAdminAddAnnouncement;