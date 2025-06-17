import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import User from './pages/User';
import Login from './components/Login';
import ImageUploader from './components/ImageUploader';
import Register from './components/Register';
import Owner from './pages/Owner';
import Admin from './pages/Admin';
import Superadmin from './pages/Superadmin';
import Brand from './pages/Brand';
import Student from './pages/Student';
import Reseller from './pages/Reseller';
import Faculty from './pages/Faculty';
import Enquiry from './pages/Enquiry';
import Courses from './pages/Courses';
import Admission from './pages/Admission';
import Batches from './pages/Batches';
import Signup from './components/Signup';
import OrgCategories from './pages/OrgCategories';
import Education from './pages/Education';
import Exam from './pages/Exam';
import PaymentMode from './pages/PaymentMode';





export default function App() {
  useEffect(() => {
    const themeColor = localStorage.getItem('theme_color') || '#10B981'; // Default: green-500
    document.documentElement.style.setProperty('--theme-color', themeColor);
  }, []);

  return (
    <Routes>
      {/* Show Login page as default */}
      <Route path="/" element={<Login />} />

      {/* Public routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/upload" element={<ImageUploader />} />

      {/* Dashboard routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Owner />} />
        <Route path="user" element={<User />} />
        <Route path="batches" element={<Batches />} />
        <Route path="enquiry" element={<Enquiry />} />
        <Route path="admission" element={<Admission />} />
        <Route path="courses" element={<Courses />} />
        <Route path="admin" element={<Admin />} />
        <Route path="superadmin" element={<Superadmin />} />
        <Route path="brand" element={<Brand />} />
        <Route path="student" element={<Student />} />
        <Route path="reseller" element={<Reseller />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="orgcategories" element={<OrgCategories />} />
        <Route path="education" element={<Education />} />
        <Route path="exam" element={<Exam />} />
        <Route path="paymentmode" element={<PaymentMode />} />




      </Route>
    </Routes>
  );
}
