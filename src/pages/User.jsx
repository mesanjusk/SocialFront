import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';
import { useApp } from '../Context/AppContext';

const User = () => {
  const { user, institute, loading } = useApp();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    password: '',
    role: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const themeColor = institute?.theme_color || '#6fa8dc';

  // ✅ Prevent early redirect until loading is complete
  useEffect(() => {
    if (!loading && !institute?.institute_uuid) {
      toast.error("Institute not found. Please log in.");
      navigate('/');
    }
  }, [institute, loading]);

  // ✅ Fetch users once institute is ready
  useEffect(() => {
    if (institute?.institute_uuid) {
      fetchUsers();
    }
  }, [institute]);

  const fetchUsers = async () => {
    const orgId = institute?.institute_uuid;
    if (!orgId) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/auth/GetUserList/${orgId}`);
      if (res.data?.success) {
        setUsers(res.data.result);
      } else {
        toast.error('No users found');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching users');
    }
  };

  const handleInputChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const orgId = institute?.institute_uuid;
  if (!orgId) {
    toast.error('Institute ID missing.');
    return;
  }

  const dataToSend = { ...form, institute_uuid: orgId };

  try {
    if (editingId) {
      await axios.put(`${BASE_URL}/api/auth/${editingId}`, dataToSend);
      toast.success('User updated');
    } else {
      // Step 1: Register user
      const res = await axios.post(`${BASE_URL}/api/auth/register`, dataToSend);

      if (res.data === 'exist') {
        toast.error('User already exists');
        return;
      } else if (res.data === 'notexist') {
        toast.success('User added');

        // ✅ Step 2: Get "ACCOUNT" group UUID
        const groupRes = await axios.get(`${BASE_URL}/api/accountgroup/GetAccountgroupList`);
        const accountGroup = groupRes.data.result.find(g => g.Account_group === "ACCOUNT");

        if (!accountGroup) {
          toast.error('ACCOUNT group not found');
          return;
        }

        // ✅ Step 3: Create account linked to this user
        await axios.post(`${BASE_URL}/api/account/addAccount`, {
          Account_name: form.name,
          Mobile_number: form.mobile,
          Account_group: accountGroup.Account_group_uuid,
          institute_uuid: orgId
        });

        toast.success('Account also created');
      } else {
        toast.error('Unexpected user registration response');
        return;
      }
    }

    setShowModal(false);
    resetForm();
    fetchUsers();
  } catch (error) {
    console.error(error);
    toast.error('Failed to submit');
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this User?')) return;

    try {
      await axios.delete(`${BASE_URL}/api/auth/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      password: item.password || '',
      mobile: item.mobile || '',
      role: item.role || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', password: '', mobile: '', role: '' });
  };

  // ✅ Show loading screen if Context is still initializing
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: themeColor }}>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New User
        </button>
      </div>

      <table className="w-full border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Mobile</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr key={item._id} className="text-center">
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.mobile}</td>
              <td className="p-2 border">{item.role}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" value={form.name} onChange={handleInputChange('name')} className="w-full p-2 border rounded" placeholder="Name" required />
              <input type="text" value={form.password} onChange={handleInputChange('password')} className="w-full p-2 border rounded" placeholder="Password" required />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                value={form.mobile}
                onChange={handleInputChange('mobile')}
                className="w-full p-2 border rounded"
                placeholder="Mobile No."
                required
              />
              <select value={form.role} onChange={handleInputChange('role')} className="w-full p-2 border rounded" required>
                <option value="">-- Select Role --</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="owner">Owner</option>
              </select>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
