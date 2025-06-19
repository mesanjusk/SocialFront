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
    mobile_number: '',
    center_head_name: '',
    theme_color: '#10B981'
  });

  const [orgTypes, setOrgTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

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

    const {
      organization_title,
      organization_type,
      center_code,
      mobile_number,
      center_head_name
    } = form;

    if (!organization_title || !organization_type || !center_code || !mobile_number || !center_head_name) {
      toast.error('All fields are required');
      return;
    }

    const payload = {
      ...form,
      organization_call_number: mobile_number,
      plan_type: 'trial' // ✅ Explicit plan_type (optional, but safe)
    };

    try {
      const res = await axios.post(`${BASE_URL}/api/organize/add`, payload);
      const data = res.data;

      if (data.message === 'exist') {
        toast.error('Center code already registered');
      } else if (data.message === 'duplicate_call_number') {
        toast.error('Mobile number already registered');
      } else if (data.message === 'success') {
        toast.success('Signup successful. You are now on a 14-day trial.');

        localStorage.setItem('name', data.center_code);
        localStorage.setItem('organization_title', data.organization_title);
        localStorage.setItem('organization_id', data.organization_id);
        localStorage.setItem('center_code', data.center_code);
        localStorage.setItem('type', 'admin');
        localStorage.setItem('theme_color', data.theme_color || '#10B981');

        document.documentElement.style.setProperty('--theme-color', data.theme_color || '#10B981');

        setTimeout(() => navigate('/dashboard', { state: { id: data.organization_id } }), 1000);
      } else {
        toast.error('Unexpected server response');
      }
    } catch (err) {
      console.error('Signup Error:', err);
      toast.error(err.response?.data?.message || 'Server error during signup');
    }
  };

  const themeColor = form.theme_color;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: themeColor }}
    >
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
            className="w-full px-3 py-2 border rounded-md shadow-sm"
            style={{ boxShadow: `0 0 0 1.5px ${themeColor}` }}
            required
          />

          <select
            value={form.organization_type}
            onChange={handleChange('organization_type')}
            className="w-full px-3 py-2 border rounded-md shadow-sm"
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
            className="w-full px-3 py-2 border rounded-md shadow-sm"
            style={{ boxShadow: `0 0 0 1.5px ${themeColor}` }}
            required
          />

          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            value={form.mobile_number}
            onChange={handleChange('mobile_number')}
            placeholder="Mobile Number (Login & Contact)"
            className="w-full px-3 py-2 border rounded-md shadow-sm"
            style={{ boxShadow: `0 0 0 1.5px ${themeColor}` }}
            required
          />

          <input
            type="text"
            value={form.center_head_name}
            onChange={handleChange('center_head_name')}
            placeholder="Center Head Name"
            className="w-full px-3 py-2 border rounded-md shadow-sm"
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
