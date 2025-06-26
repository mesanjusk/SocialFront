import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';

const InstituteProfile = () => {
  const institute_id = localStorage.getItem('institute_uuid');
  const themeColor = localStorage.getItem('theme_color') || '#10B981';
  const [data, setData] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (institute_id) fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/institute/${institute_id}`);
      setData(res.data.result);
      setLogoPreview(res.data.result.institute_logo);
    } catch (err) {
      toast.error('Failed to load profile');
      console.error(err);
    }
  };

  const handleChange = (field) => (e) => {
    setData({ ...data, [field]: e.target.value });
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return null;
    const formData = new FormData();
    formData.append('file', logoFile);
    try {
      const res = await axios.post(`${BASE_URL}/api/upload`, formData);
      return res.data.url;
    } catch (err) {
      toast.error('Logo upload failed');
      console.error(err);
      return null;
    }
  };

  const handleSave = async () => {
    if (!data) return;
    if (!window.confirm('Are you sure you want to save these changes?')) return;

    try {
      let logoUrl = logoPreview;
      if (logoFile) {
        const uploadedUrl = await handleLogoUpload();
        if (!uploadedUrl) return;
        logoUrl = uploadedUrl;
      }

      const updated = { ...data, institute_logo: logoUrl };
      await axios.put(`http://localhost:5000/api/institude/update/${institute_id}`, updated);
      toast.success('Profile updated');
      fetchProfile();
    } catch (err) {
      toast.error('Update failed');
      console.error(err);
    }
  };

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: themeColor }}>
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded">
        <h2 className="text-2xl font-bold mb-6">Institute Profile</h2>

        <div className="space-y-4">
          <Field label="Institute Title" value={data.institute_title} onChange={handleChange('institute_title')} />
          <Field label="Institute Type" value={data.institute_type} onChange={handleChange('institute_type')} />
          <Field label="Center Code" value={data.center_code} onChange={handleChange('center_code')} />
          <Field label="Call Number" value={data.institute_call_number} onChange={handleChange('institute_call_number')} />
          <Field label="Center Head Name" value={data.center_head_name || ''} onChange={handleChange('center_head_name')} />
          <Field label="Address" value={data.address || ''} onChange={handleChange('address')} />
          <Field label="Email" type="email" value={data.email || ''} onChange={handleChange('email')} />

          <div>
            <label className="font-medium">Theme Color</label>
            <input
              type="color"
              value={data.theme_color}
              onChange={handleChange('theme_color')}
              className="w-20 h-10 border rounded"
            />
          </div>

          <div>
            <label className="font-medium">Institute Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setLogoFile(file);
                setLogoPreview(URL.createObjectURL(file));
              }}
            />
            {logoPreview && <img src={logoPreview} alt="Logo" className="h-24 mt-2 rounded border" />}
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, ...rest }) => (
  <div className="flex flex-col">
    <label className="font-medium">{label}</label>
    <input value={value} onChange={onChange} className="border p-2 rounded" {...rest} />
  </div>
);

export default InstituteProfile;
