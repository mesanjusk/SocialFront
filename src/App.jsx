import { Routes, Route } from 'react-router-dom';

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
import instituteProfile from './pages/instituteProfile';
import Owner from './pages/Owner';

export default function App() {
  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/upload" element={<ImageUploader />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id" element={<ResetPassword />} />

      {/* 🔐 Protected Routes (Nested in DashboardLayout) */}
      <Route path="/:username" element={<DashboardLayout />}>
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
        <Route path="instituteProfile" element={<instituteProfile />} />
        <Route path="Owner" element={<Owner />} />
      </Route>
    </Routes>
  );
}
