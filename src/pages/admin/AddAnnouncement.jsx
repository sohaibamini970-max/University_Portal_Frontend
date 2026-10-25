import React from 'react';
import Layout from '../../components/Layout/Layout';
import CreateAnnouncementForm from '../../components/common/CreateAnnouncementForm';

const AdminAddAnnouncement = () => {
    // Admin cannot send to superadmins or other admins
    const allowedRoles = ['teacher', 'student'];

    return (
        <Layout title="Announcements" subtitle="Broadcast messages to your department">
            <CreateAnnouncementForm targetRoles={allowedRoles} />
        </Layout>
    );
};

export default AdminAddAnnouncement;