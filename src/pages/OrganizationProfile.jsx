import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';

const OrganizationProfile = () => {
  const organization_id = localStorage.getItem('organization_id');
  const themeColor = localStorage.getItem('theme_color') || '#10B981';
  const [data, setData] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/organize/${organization_id}`);
      setData(res.data.result);
      setLogoPreview(res.data.result.organization_logo);
    } catch (err) {
      toast.error('Failed to load profile');
      console.error(err);
    }
  };

  const handleChange = (field) => (e) => {
    setData({ ...data, [field]: e.target.value });
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    const formData = new FormData();
    formData.append('file', logoFile);
    try {
      const res = await axios.post(`${BASE_URL}/upload`, formData);
      return res.data.url;
    } catch (err) {
      toast.error('Logo upload failed');
      return null;
    }
  };

  const handleSave = async () => {
    const confirm = window.confirm("Are you sure you want to save these changes?");
    if (!confirm) return;

    try {
      let logoUrl = logoPreview;
      if (logoFile) {
        const uploaded = await handleLogoUpload();
        if (!uploaded) return;
        logoUrl = uploaded;
      }

      const updated = { ...data, organization_logo: logoUrl };
      await axios.put(`${BASE_URL}/api/organize/update/${organization_id}`, updated);
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
      <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
        <Toaster position="top-center" />
        <h2 className="text-2xl font-bold mb-6">Organization Profile</h2>

        <div className="flex flex-col gap-4">
          <Field label="Organization Title" value={data.organization_title} onChange={handleChange('organization_title')} />
          <Field label="Organization Type" value={data.organization_type} onChange={handleChange('organization_type')} />
          <Field label="Center Code" value={data.center_code} onChange={handleChange('center_code')} />
          <Field label="Call Number" value={data.organization_call_number} onChange={handleChange('organization_call_number')} inputMode="numeric" />
          <Field label="Center Head Name" value={data.center_head_name || ''} onChange={handleChange('center_head_name')} />
          <Field label="Address" value={data.address || ''} onChange={handleChange('address')} />
          <Field label="Email" value={data.email || ''} onChange={handleChange('email')} type="email" />

          <div className="flex flex-col">
            <label className="font-medium">Theme Color</label>
            <input
              type="color"
              value={data.theme_color}
              onChange={handleChange('theme_color')}
              className="w-16 h-10 p-1 rounded border"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Profile Picture / Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setLogoFile(e.target.files[0]);
                setLogoPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
            {logoPreview && (
              <img src={logoPreview} alt="Logo" className="h-24 w-auto mt-2 rounded border" />
            )}
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable Field Component
const Field = ({ label, value, onChange, ...rest }) => (
  <div className="flex flex-col">
    <label className="font-medium">{label}</label>
    <input
      value={value}
      onChange={onChange}
      className="border p-2 rounded"
      {...rest}
    />
  </div>
);

export default OrganizationProfile;
