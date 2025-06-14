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

export default function App() {
  return (
    <Routes>
      {/* Show Login page as default */}
      <Route path="/" element={<Login />} />

      {/* Other public routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/upload" element={<ImageUploader />} />
      

      {/* Protected or dashboard routes go here */}
        <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Owner />} />
        <Route path="user" element={<User />} />
        <Route path="Enquiry" element={<Enquiry />} />
        <Route path="Admission" element={<Admission />} />
        <Route path="Courses" element={<Courses />} />
        <Route path="admin" element={<Admin />} />
        <Route path="superadmin" element={<Superadmin />} />
        <Route path="brand" element={<Brand />} />
        <Route path="student" element={<Student />} />
        <Route path="reseller" element={<Reseller />} />
        <Route path="faculty" element={<Faculty />} />
      </Route>
    </Routes>
  );
}
