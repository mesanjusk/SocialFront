import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import Navbar from '../components/Navbar';
import BASE_URL from '../config';
import Footer from '../components/Footer';
import FloatingButtons from "./floatingButton";
import admission from '../assets/payment.svg';
import enquiry from '../assets/reciept.svg';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const buttonsList = [
      { onClick: ()=> navigate('/dashboard/addEnquiry'), src: enquiry },
      { onClick: ()=> navigate('/dashboard/addAdmission'), src: admission },
    ];

  return (
    <>
    <div className="flex min-h-screen">
      {/* Sidebar (hidden on mobile, toggleable) */}
      <div className={`fixed z-40 inset-y-0 left-0 w-64 transform transition-transform duration-200 bg-white shadow-lg md:relative md:translate-x-0 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:block`}>
        <Sidebar />
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="flex flex-1 min-h-0">
          <main className="flex-1 p-4 overflow-y-auto">
            <Outlet />
          </main>

          {/* Right Sidebar (hidden on small screens) */}
          <div className="hidden lg:block w-64">
            <RightSidebar />
          </div>
        </div>
      </div>
      <FloatingButtons buttonType="bars" buttonsList={buttonsList} direction="up" />
    </div>
    <Footer />
    </>
  );
}
