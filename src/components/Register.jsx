import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const nameInputRef = useRef(null);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    const orgId = localStorage.getItem("organization_id");
    const userType = localStorage.getItem("type");

    if (!orgId || !["Admin", "SuperAdmin"].includes(userType)) {
      toast.error("Access denied");
      navigate('/');
    }

    nameInputRef.current?.focus();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const organization_id = localStorage.getItem("organization_id");

    try {
      const res = await axios.post("https://socialbackend-iucy.onrender.com/api/auth/register", {
        name: name.trim(),
        password: password.trim(),
        mobile: mobile.trim(),
        type,
        organization_id,
      });

      if (res.data === "exist") {
        toast.error("User already exists");
      } else if (res.data === "notexist") {
        toast.success("User added successfully");
        setTimeout(() => {
          navigate("/dashboard/user", { replace: true }); // or wherever your User page is
        }, 800);
      }
    } catch (e) {
      toast.error("Registration failed");
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme px-4">
      <Toaster position="top-center" />
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">User Registration</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Mobile</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">User Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Type</option>
              <option value="Owner">Owner</option>
              <option value="Reseller">Reseller</option>
              <option value="Brand">Brand</option>
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Faculties">Faculties</option>
              <option value="Student">Student</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
