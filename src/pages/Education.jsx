import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';
import { getThemeColor } from '../utils/storageUtils';

const Education = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ education: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const themeColor = getThemeColor();

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/education`);
      setList(res.data || []);
    } catch {
      toast.error('Failed to fetch data');
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.education) return toast.error('Education is required');
    setLoading(true);

    try {
      if (editingId) {
        if (!window.confirm('Update this entry?')) return;
        await axios.put(`${BASE_URL}/api/education/${editingId}`, form);
        toast.success('Updated');
      } else {
        await axios.post(`${BASE_URL}/api/education`, form);
        toast.success('Added');
      }
      setForm({ education: '', description: '' });
      setEditingId(null);
      setShowModal(false);
      fetchData();
    } catch {
      toast.error('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ education: item.education, description: item.description });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/education/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (showModal && inputRef.current) inputRef.current.focus();
  }, [showModal]);

  const filtered = list.filter(item =>
    item.education.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: themeColor }}>
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <input
          placeholder="Search education"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => {
            setForm({ education: '', description: '' });
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Education
        </button>
      </div>

      <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Education</th>
            <th className="p-2 border hidden md:table-cell">Description</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-500">No entries found</td>
            </tr>
          ) : (
            filtered.map(item => (
              <tr key={item._id} className="text-center hover:bg-gray-100 transition">
                <td className="border p-2 truncate">{item.education}</td>
                <td className="border p-2 truncate hidden md:table-cell">{item.description}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Education' : 'Add New Education'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                ref={inputRef}
                type="text"
                value={form.education}
                onChange={handleChange('education')}
                className="border p-2 w-full"
                placeholder="Education"
                required
              />
              <textarea
                value={form.description}
                onChange={handleChange('description')}
                className="border p-2 w-full"
                placeholder="Description (optional)"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-green-600 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;
