import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
  const [form, setForm] = useState({
    organization_title: '',
    organization_call_number: '',
    organization_type: '',
    center_code: '',
    organization_whatsapp_number: ''
  });

  const [logo, setLogo] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { organization_title, organization_call_number, organization_type, center_code } = form;

    if (!organization_title || !organization_call_number || !organization_type || !center_code) {
      toast.error('All fields are required');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'organization_whatsapp_number' && !value?.trim()) return;
      formData.append(key, value);
    });

    if (logo) formData.append('image', logo);

    try {
      const res = await axios.post('https://socialbackend-iucy.onrender.com/api/organize/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data === 'exist') {
        toast.error('Center code already registered');
      } else if (res.data === 'notexist') {
        toast.success('Signup successful. Logging you in...');
        localStorage.setItem('name', center_code);
        localStorage.setItem('type', 'owner');
        localStorage.setItem('organization_title', form.organization_title);
        localStorage.setItem('organization_id', res.data.organization_id); // if backend sends it
        setTimeout(() => navigate('/dashboard', { state: { id: center_code } }), 1000);
      } else {
        toast.error('Unexpected server response');
      }
    } catch (err) {
      console.error('Signup Error:', err);
      toast.error('Server error during signup');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <Toaster position="top-center" />
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Register Organization</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={form.organization_title}
            onChange={handleChange('organization_title')}
            placeholder="Organization Title"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            value={form.organization_call_number}
            onChange={handleChange('organization_call_number')}
            placeholder="Call Number"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            value={form.organization_type}
            onChange={handleChange('organization_type')}
            placeholder="Organization Type (e.g., School, Coaching)"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            value={form.center_code}
            onChange={handleChange('center_code')}
            placeholder="Center Code (Login ID & Password)"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            value={form.organization_whatsapp_number}
            onChange={handleChange('organization_whatsapp_number')}
            placeholder="WhatsApp Number (optional)"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register & Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
