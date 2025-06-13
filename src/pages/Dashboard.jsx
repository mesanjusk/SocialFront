import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Owner = () => {
  const [organizations, setOrganizations] = useState([]);
  const [form, setForm] = useState({
    organization_title: '',
    organization_whatsapp_number: '',
    organization_call_number: '',
    organization_whatsapp_message: '',
    login_username: '',
    login_password: '',
    theme_color: '',
    domains: '',
    org_whatsapp_number: '',
    org_call_number: ''
  });
  const [logo, setLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await axios.get('https://socialbackend-iucy.onrender.com/api/organize/GetOrganizList');
         console.log('API response:', res.data);
        if (res.data?.success) {
          setOrganizations(res.data.result);
           console.log('Set organizations:', res.data.result);
        } else {
          toast.error('No organizations found');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error fetching organizations');
      }
    };
    fetchOrganizations();
  }, []);

  const handleInputChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (logo) formData.append('image', logo);

    try {
      const res = await axios.post('https://socialbackend-iucy.onrender.com/api/organize/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data === 'exist') {
        toast.error('Organization already exists');
      } else if (res.data === 'notexist') {
        toast.success('Organization added');
        setShowModal(false);
        fileInputRef.current.value = '';
        setForm({
          organization_title: '',
          organization_whatsapp_number: '',
          organization_call_number: '',
          organization_whatsapp_message: '',
          login_username: '',
          login_password: '',
          theme_color: '',
          domains: '',
          org_whatsapp_number: '',
          org_call_number: ''
        });
        setLogo(null);
        setPreviewLogo(null);

        const updated = await axios.get('https://socialbackend-iucy.onrender.com/api/organize/GetOrganizList');
        if (updated.data?.success) setOrganizations(updated.data.result);
      } else {
        toast.error('Unexpected error');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Organization </h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">+ New Organize</button>
      </div>

      <table className="w-full border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Logo</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Call Number</th>
            <th className="p-2 border">Username</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org, idx) => (
            <tr key={idx} className="text-center">
              <td className="p-2 border">
                {org.organization_logo ? (
                  <img src={org.organization_logo} alt="logo" className="w-16 h-16 object-cover rounded" />
                ) : 'No Logo'}
              </td>
              <td className="p-2 border">{org.organization_title}</td>
              <td className="p-2 border">{org.organization_call_number}</td>
              <td className="p-2 border">{org.login_username}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-xl w-full">
            <h2 className="text-xl font-semibold mb-4">Add New Organization</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" value={form.organization_title} onChange={handleInputChange('organization_title')} className="w-full p-2 border rounded" placeholder="Title" />
              <input type="text" value={form.organization_whatsapp_number} onChange={handleInputChange('organization_whatsapp_number')} className="w-full p-2 border rounded" placeholder="WhatsApp Number" />
              <input type="text" value={form.organization_call_number} onChange={handleInputChange('organization_call_number')} className="w-full p-2 border rounded" placeholder="Call Number"  />
              <input type="text" value={form.organization_whatsapp_message} onChange={handleInputChange('organization_whatsapp_message')} className="w-full p-2 border rounded" placeholder="WhatsApp Message" />
              <input type="text" value={form.login_username} onChange={handleInputChange('login_username')} className="w-full p-2 border rounded" placeholder="Login Username" />
              <input type="password" value={form.login_password} onChange={handleInputChange('login_password')} className="w-full p-2 border rounded" placeholder="Login Password"  />
              <input type="text" value={form.theme_color} onChange={handleInputChange('theme_color')} className="w-full p-2 border rounded" placeholder="Theme Color" />
              <input type="text" value={form.domains} onChange={handleInputChange('domains')} className="w-full p-2 border rounded" placeholder="Domains" />
              <input type="text" value={form.org_whatsapp_number} onChange={handleInputChange('org_whatsapp_number')} className="w-full p-2 border rounded" placeholder="Org WhatsApp Number" />
              <input type="text" value={form.org_call_number} onChange={handleInputChange('org_call_number')} className="w-full p-2 border rounded" placeholder="Org Call Number" />

              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="w-full p-2 border rounded" />
              {previewLogo && <img src={previewLogo} alt="Preview" className="w-24 h-24 object-cover rounded mt-2" />}

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Owner;
