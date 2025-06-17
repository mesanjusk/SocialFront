import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    organization_title: '',
    organization_type: '',
    center_code: '',
    organization_call_number: '',
    theme_color: '#10B981' // ✅ default saved silently
  });

  const [orgTypes, setOrgTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const themeColor = form.theme_color;

  useEffect(() => {
    axios.get(`${BASE_URL}/api/org-categories`)
      .then(res => {
        setOrgTypes(res.data);
        setLoadingTypes(false);
      })
      .catch(err => {
        console.error('Failed to fetch organization types:', err);
        toast.error('Failed to load organization types');
        setLoadingTypes(false);
      });
  }, []);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { organization_title, organization_type, center_code, organization_call_number } = form;

    if (!organization_title || !organization_type || !center_code || !organization_call_number) {
      toast.error('All fields are required');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value?.trim()) formData.append(key, value);
    });

    try {
      const res = await axios.post(`${BASE_URL}/api/organize/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = res.data;

      if (data.message === 'exist') {
        toast.error('Center code already registered');
      } else if (data.message === 'success') {
        toast.success('Signup successful. Logging you in...');

        localStorage.setItem('name', data.center_code);
        localStorage.setItem('organization_title', data.organization_title);
        localStorage.setItem('organization_id', data.organization_id);
        localStorage.setItem('center_code', data.center_code);
        localStorage.setItem('type', 'organization');
        localStorage.setItem('theme_color', data.theme_color || '#10B981');

        document.documentElement.style.setProperty('--theme-color', data.theme_color || '#10B981');

        setTimeout(() => navigate('/dashboard', { state: { id: data.organization_id } }), 1000);
      } else {
        toast.error('Unexpected server response');
      }
    } catch (err) {
      if (err.response?.data?.message === 'duplicate_call_number') {
        toast.error('Call number already exists');
      } else {
        console.error('Signup Error:', err);
        toast.error('Server error during signup');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <Toaster position="top-center" />
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center text-theme mb-6">Register Organization</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={form.organization_title}
            onChange={handleChange('organization_title')}
            placeholder="Organization Title"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
            style={{ boxShadow: `0 0 0 1.5px ${themeColor}` }}
            required
          />

          <select
            value={form.organization_type}
            onChange={handleChange('organization_type')}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
            style={{ boxShadow: `0 0 0 1.5px ${themeColor}` }}
            required
          >
            <option value="">Select Organization Type</option>
            {loadingTypes ? (
              <option disabled>Loading...</option>
            ) : (
              orgTypes.map((type) => (
                <option key={type._id} value={type.category}>{type.category}</option>
              ))
            )}
          </select>

          <input
            type="text"
            value={form.center_code}
            onChange={handleChange('center_code')}
            placeholder="Center Code (Login ID & Password)"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
            style={{ boxShadow: `0 0 0 1.5px ${themeColor}` }}
            required
          />

          <input
            type="number"
            value={form.organization_call_number}
            onChange={handleChange('organization_call_number')}
            placeholder="Mobile Number"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
            style={{ boxShadow: `0 0 0 1.5px ${themeColor}` }}
            required
          />

          <button
            type="submit"
            className="w-full bg-theme text-white py-2 rounded-md transition hover:opacity-90"
          >
            Register & Login
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          Already have an account?
          <button
            onClick={() => navigate('/')}
            className="ml-1 text-blue-600 hover:underline font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
