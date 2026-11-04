import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';

// Super Admin
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import DepartmentsLayout from './pages/superadmin/departments/DepartmentsLayout';
import EducationDepartments from './pages/superadmin/departments/EducationDepartments';
import BusinessDepartments from './pages/superadmin/departments/BusinessDepartments';
import UsersLayout from './pages/superadmin/users/UsersLayout';
import AllUsers from './pages/superadmin/users/AllUsers';
import AllStudents from './pages/superadmin/users/AllStudents';
import AllTeachers from './pages/superadmin/users/AllTeachers';
import AllAdmins from './pages/superadmin/users/AllAdmins';
import AllHods from './pages/superadmin/users/AllHods';
import AllChairmen from './pages/superadmin/users/AllChairmen';
import AllDeans from './pages/superadmin/users/AllDeans';
import AnnouncementsLayout from './pages/shared/AnnouncementsLayout';
import AddAnnouncementTab from './pages/shared/AddAnnouncementTab';
import ManageAnnouncementsTab from './pages/shared/ManageAnnouncementsTab';
import CoursesLayout from './pages/superadmin/courses/CoursesLayout';
import CreateCourse from './pages/superadmin/courses/CreateCourse';
import ManageCourses from './pages/superadmin/courses/ManageCourses';
import SuperAdminAssignCourses from './pages/superadmin/courses/AssignCourses';

// System Admin
import SystemAdminLayout from './pages/systemadmin/SystemAdminLayout';
import SystemAdminDashboard from './pages/systemadmin/Dashboard';
import ManageAdmins from './pages/systemadmin/users/ManageAdmins';
import ManageStudents from './pages/systemadmin/users/ManageStudents';
import ManageTeachers from './pages/systemadmin/users/ManageTeachers';
import ManageRegistration from './pages/systemadmin/registration/ManageRegistration';
import FirstSemesterRegistration from './pages/systemadmin/registration/FirstSemesterRegistration';
import StudentRegistrations from './pages/systemadmin/registration/StudentRegistrations';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import Teachers from './pages/admin/Teachers';

import StudentsLayout from './pages/admin/students/StudentsLayout';
import ActiveStudents from './pages/admin/students/ActiveStudents';
import AcademicRecords from './pages/admin/students/AcademicRecords';

import AssignCourses from './pages/admin/AssignCourses';
import ManageTimetable from './pages/admin/ManageTimetable';
import ManageRooms from './pages/admin/ManageRooms';

// Student
import StudentDashboard from './pages/student/Dashboard';
import Courses from './pages/student/courses/Courses';
import Attendance from './pages/student/general/Attendance';
import Timetable from './pages/student/general/Timetable';
import Roadmap from './pages/student/general/Roadmap';
import CourseInfo from './pages/student/courses/CourseInfo';
import Registration from './pages/student/onlineregistration/Registration';
import AdmitCard from './pages/student/exam/AdmitCard';
import Results from './pages/student/exam/Results';
import OnlineExam from './pages/student/exam/OnlineExam';
import FeeVoucher from './pages/student/fee/FeeVoucher';
import AttendanceDetails from './pages/student/general/AttendanceDetails';
import Announcements from './pages/student/general/Announcements';
import AssessmentResult from './pages/student/exam/AssessmentResult';

// Teacher
import TeacherDashboard from './pages/teacher/Dashboard';
import Classes from './pages/teacher/Classes';
import TeacherAttendance from './pages/teacher/Attendance';
import Assessments from './pages/teacher/Assessments';

// Admission
import AdmissionsLayout from './pages/admission/AdmissionsLayout';
import AdmissionsDashboard from './pages/admission/Dashboard';
import AdmissionsStudentsLayout from './pages/admission/students/StudentsLayout';
import AdmissionsAllStudents from './pages/admission/students/AllStudents';
import AdmissionsAddStudent from './pages/admission/students/AddStudent';
import AdmissionTeachers from './pages/admission/Teachers';
// Finance
import FinanceLayout from './pages/finance/FinanceLayout';
import FinanceDashboard from './pages/finance/Dashboard';
import FeeManagement from './pages/finance/FeeManagement';
import FeeRates from './pages/finance/FeeRates';

// Examination
import ExaminationLayout from './pages/examination/ExaminationLayout';
import ExaminationDashboard from './pages/examination/Dashboard';
import DomainSelection from './pages/examination/timetable/DomainSelection';
import DomainTimetable from './pages/examination/timetable/DomainTimetable';
import CheckResults from './pages/examination/Results'

// Protected Route component
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" replace />;
    if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
    return children;
};

function App() {
    return (
            <BrowserRouter>
        <AuthProvider>
                <Routes>
                    <Route path="/" element={<Login />} />

                    {/* Super Admin Routes */}
                    <Route
                        path="/superadmin/dashboard"
                        element={<ProtectedRoute allowedRole="superadmin"><SuperAdminDashboard /></ProtectedRoute>}
                    />

                    <Route path="/superadmin/departments" element={<ProtectedRoute allowedRole="superadmin"><DepartmentsLayout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="education" replace />} />
                        <Route path="education" element={<EducationDepartments />} />
                        <Route path="business" element={<BusinessDepartments />} />
                    </Route>

                    <Route path="/superadmin/users" element={<ProtectedRoute allowedRole="superadmin"><UsersLayout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="all" replace />} />
                        <Route path="all" element={<AllUsers />} />
                        <Route path="students" element={<AllStudents />} />
                        <Route path="teachers" element={<AllTeachers />} />
                        <Route path="admins" element={<AllAdmins />} />
                        <Route path="hods" element={<AllHods />} />
                        <Route path="chairmen" element={<AllChairmen />} />
                        <Route path="deans" element={<AllDeans />} />
                    </Route>

                    {/* Super Admin Announcements */}
                    <Route path="/superadmin/announcements" element={<ProtectedRoute allowedRole="superadmin"><AnnouncementsLayout rolePrefix="superadmin" /></ProtectedRoute>}>
                        <Route index element={<Navigate to="add" replace />} />
                        <Route path="add" element={<AddAnnouncementTab targetRoles={['admin', 'teacher', 'student']} />} />
                        <Route path="manage" element={<ManageAnnouncementsTab />} />
                    </Route>

                    {/* Admin Announcements */}
                    <Route path="/admin/announcements" element={<ProtectedRoute allowedRole="admin"><AnnouncementsLayout rolePrefix="admin" /></ProtectedRoute>}>
                        <Route index element={<Navigate to="add" replace />} />
                        <Route path="add" element={<AddAnnouncementTab targetRoles={['teacher', 'student']} />} />
                        <Route path="manage" element={<ManageAnnouncementsTab />} />
                    </Route>

                    <Route path="/superadmin/courses" element={<ProtectedRoute allowedRole="superadmin"><CoursesLayout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="create" replace />} />
                        <Route path="create" element={<CreateCourse />} />
                        <Route path="assign" element={<SuperAdminAssignCourses />} />
                        <Route path="manage" element={<ManageCourses />} />
                    </Route>


                    {/* Admin Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>}
                    />
                    <Route
                        path="/admin/teachers"
                        element={<ProtectedRoute allowedRole="admin"><Teachers /></ProtectedRoute>}
                    />
                    <Route path="/admin/students" element={<ProtectedRoute allowedRole="admin"><StudentsLayout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="active" replace />} />
                        <Route path="active" element={<ActiveStudents />} />
                        <Route path="records" element={<AcademicRecords />} />
                    </Route>

                    <Route path="/admin/assign-courses" element={<ProtectedRoute allowedRole="admin"><AssignCourses /></ProtectedRoute>} />
                    <Route path="/admin/timetable" element={<ProtectedRoute allowedRole="admin"><ManageTimetable /></ProtectedRoute>} />
                    <Route path="/admin/rooms" element={<ProtectedRoute allowedRole="admin"><ManageRooms /></ProtectedRoute>} />

                    {/* Student Routes */}
                    <Route path="/student/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
                    <Route path="/student/attendance" element={<ProtectedRoute allowedRole="student"><Attendance /></ProtectedRoute>} />
                    <Route path="/student/timetable" element={<ProtectedRoute allowedRole="student"><Timetable /></ProtectedRoute>} />
                    <Route path="/student/roadmap" element={<ProtectedRoute allowedRole="student"><Roadmap /></ProtectedRoute>} />
                    <Route path="/student/announcements" element={<ProtectedRoute allowedRole="student"><Announcements /></ProtectedRoute>} />
                    <Route path="/student/courses" element={<ProtectedRoute allowedRole="student"><Courses /></ProtectedRoute>} />
                    <Route path="/student/course-info" element={<ProtectedRoute allowedRole="student"><CourseInfo /></ProtectedRoute>} />
                    <Route path="/student/registration" element={<ProtectedRoute allowedRole="student"><Registration /></ProtectedRoute>} />
                    <Route path="/student/admit-card" element={<ProtectedRoute allowedRole="student"><AdmitCard /></ProtectedRoute>} />
                    <Route path="/student/results" element={<ProtectedRoute allowedRole="student"><Results /></ProtectedRoute>} />
                    <Route path="/student/online-exam" element={<ProtectedRoute allowedRole="student"><OnlineExam /></ProtectedRoute>} />
                    <Route path="/student/fee-voucher" element={<ProtectedRoute allowedRole="student"><FeeVoucher /></ProtectedRoute>} />
                    <Route path="/student/attendance-details" element={<ProtectedRoute allowedRole="student"><AttendanceDetails /></ProtectedRoute>} />
                    <Route path="/student/assessment-result" element={<ProtectedRoute allowedRole="student"><AssessmentResult /></ProtectedRoute>} />

                    {/* Teacher Routes */}
                    <Route
                        path="/teacher/dashboard"
                        element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>}
                    />
                    <Route
                        path="/teacher/classes"
                        element={<ProtectedRoute allowedRole="teacher"><Classes /></ProtectedRoute>}
                    />
                    <Route
                        path="/teacher/attendance"
                        element={<ProtectedRoute allowedRole="teacher"><TeacherAttendance /></ProtectedRoute>}
                    />
                    <Route
                        path="/teacher/Assessments"
                        element={<ProtectedRoute allowedRole="teacher"><Assessments /></ProtectedRoute>}
                    />


                    {/* 👇 ADMISSIONS ROUTES 👇 */}
                    <Route path="/admissions" element={<ProtectedRoute allowedRole="admissions"><AdmissionsLayout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdmissionsDashboard />} />

                        <Route path="students" element={<AdmissionsStudentsLayout />}>
                            <Route index element={<Navigate to="all" replace />} />
                            <Route path="all" element={<AdmissionsAllStudents />} />
                            <Route path="add" element={<AdmissionsAddStudent />} />
                        </Route>
                        <Route path="teachers" element={<AdmissionTeachers />} />
                    </Route>

                    <Route path="/finance" element={<ProtectedRoute allowedRole="finance"><FinanceLayout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<FinanceDashboard />} />
                        <Route path="fees" element={<FeeManagement />} />
                        <Route path="rates" element={<FeeRates />} />
                    </Route>

                    <Route path="/examination" element={<ProtectedRoute allowedRole="examination"><ExaminationLayout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<ExaminationDashboard />} />
                        <Route path="/examination/timetable" element={<DomainSelection />} />
                        <Route path="/examination/timetable/:domainId" element={<DomainTimetable />} />
                        <Route path="results" element={<CheckResults />} />
                    </Route>

                    <Route path="/systemadmin" element={<ProtectedRoute allowedRole="systemadmin"><SystemAdminLayout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<SystemAdminDashboard />} />

                        <Route path="users/students" element={<ManageStudents />} />
                        <Route path="users/teachers" element={<ManageTeachers />} />
                        <Route path="users/admins" element={<ManageAdmins />} />

                        {/* 👇 New Separate Routes 👇 */}
                        <Route path="registration/manage" element={<ManageRegistration />} />
                        <Route path="registration/first-semester" element={<FirstSemesterRegistration />} />
                        <Route path="registration/students" element={<StudentRegistrations />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
        </AuthProvider>
            </BrowserRouter>
    );
}

export default App;