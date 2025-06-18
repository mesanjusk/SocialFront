import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';

const OrganizationProfile = () => {
  const organization_id = localStorage.getItem('organization_id');
  const user_type = localStorage.getItem('type');
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const themeColor = localStorage.getItem('theme_color') || '#10B981';

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
      setEditing(false);
      fetchProfile();
    } catch (err) {
      toast.error('Update failed');
      console.error(err);
    }
  };

  const handlePasswordChange = async () => {
    const { current, newPass, confirm } = passwords;
    if (!current || !newPass || !confirm) {
      return toast.error('All password fields required');
    }
    if (newPass !== confirm) {
      return toast.error('New password and confirmation do not match');
    }

    try {
      const res = await axios.put(`${BASE_URL}/api/organize/change-password/${organization_id}`, {
        current_password: current,
        new_password: newPass,
      });

      if (res.data.success) {
        toast.success('Password changed successfully');
        localStorage.clear(); // Auto logout
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        toast.error(res.data.message || 'Password update failed');
      }
    } catch (err) {
      toast.error('Password change error');
      console.error(err);
    }
  };

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Organization Profile</h2>
        {user_type === 'admin' && (
          <button onClick={() => setEditing(!editing)} className="text-blue-600 hover:underline">
            {editing ? 'Cancel' : 'Edit'}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="font-medium">Organization Title</label>
          <input
            disabled={!editing}
            value={data.organization_title}
            onChange={handleChange('organization_title')}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Organization Type</label>
          <input
            disabled={!editing}
            value={data.organization_type}
            onChange={handleChange('organization_type')}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Center Code</label>
          <input
            disabled={!editing}
            value={data.center_code}
            onChange={handleChange('center_code')}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Call Number</label>
          <input
            disabled={!editing}
            value={data.organization_call_number}
            onChange={handleChange('organization_call_number')}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Theme Color</label>
          <input
            type="color"
            disabled={!editing}
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
            disabled={!editing}
            onChange={(e) => {
              setLogoFile(e.target.files[0]);
              setLogoPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
          {logoPreview && (
            <img src={logoPreview} alt="Logo" className="h-24 w-auto mt-2 rounded border" />
          )}
        </div>

        {editing && (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700"
          >
            Save Changes
          </button>
        )}

        <hr className="my-6" />

        <h3 className="text-xl font-semibold mb-2">Change Password</h3>
        <div className="grid grid-cols-1 gap-3">
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.newPass}
            onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            onClick={handlePasswordChange}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
