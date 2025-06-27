import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import User from './pages/User';
import Login from './components/Login';
import ImageUploader from './components/ImageUploader';
import Register from './components/Register';
import Enquiry from './pages/Enquiry';
import Courses from './pages/Courses';
import Admission from './pages/Admission';
import Batches from './pages/Batches';
import Signup from './components/Signup';
import OrgCategories from './pages/OrgCategories';
import Education from './pages/Education';
import Exam from './pages/Exam';
import PaymentMode from './pages/PaymentMode';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import InstituteProfile from './pages/instituteProfile';
import Owner from './pages/Owner';
import PrivateRoute from './components/PrivateRoute'; // ✅ Assuming this is implemented
import CoursesCategory from './pages/CoursesCategory';
import AllEnquiry from './Reports/allEnquiry';
import AllAdmission from './Reports/allAdmission';
import AddAdmission from './pages/addAdmission';
import AddEnquiry from './pages/addEnquiry';
import Followup from './pages/Followup';

export default function App() {
  return (
    <Routes>
      {/* 🌐 Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/upload" element={<ImageUploader />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id" element={<ResetPassword />} />
     

      {/* 🔐 Protected Routes under :username */}
      <Route
        path="/:username"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="user" element={<User />} />
        <Route path="batches" element={<Batches />} />
        <Route path="enquiry" element={<Enquiry />} />
        <Route path="admission" element={<Admission />} />
        <Route path="courses" element={<Courses />} />
        <Route path="orgcategories" element={<OrgCategories />} />
        <Route path="education" element={<Education />} />
        <Route path="exam" element={<Exam />} />
        <Route path="paymentmode" element={<PaymentMode />} />
        <Route path="instituteProfile" element={<InstituteProfile />} />
        <Route path="owner" element={<Owner />} />
        <Route path="coursesCategory" element={<CoursesCategory />} />
         <Route path="allEnquiry" element={<AllEnquiry />} />
         <Route path="allAdmission" element={<AllAdmission />} />
         <Route path="addAdmission" element={<AddAdmission />} />
         <Route path="addEnquiry" element={<AddEnquiry />} />
         <Route path="followup" element={<Followup />} />
      </Route>

      {/* 🧭 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
