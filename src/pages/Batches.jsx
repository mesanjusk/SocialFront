import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({ name: '', timing: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const organization_id = localStorage.getItem('organization_id');

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/batches`);
      setBatches(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch batches');
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!organization_id) return toast.error('Missing organization ID');

    const payload = { ...form, organization_id };

    try {
      if (editingId) {
        if (!window.confirm('Update this batch?')) return;
        await axios.put(`${BASE_URL}/api/batches/${editingId}`, payload);
        toast.success('Batch updated');
      } else {
        await axios.post(`${BASE_URL}/api/batches`, payload);
        toast.success('Batch added');
      }
      setForm({ name: '', timing: '' });
      setEditingId(null);
      setShowModal(false);
      fetchBatches();
    } catch (err) {
      toast.error('Failed to submit');
    }
  };

  const handleEdit = (batch) => {
    setForm({ name: batch.name, timing: batch.timing });
    setEditingId(batch._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this batch?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/batches/${id}`);
      toast.success('Deleted');
      fetchBatches();
    } catch {
      toast.error('Failed to delete');
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const filtered = batches.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4">
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <input
          placeholder="Search batch"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={() => { setForm({ name: '', timing: '' }); setEditingId(null); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Batch
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Timing</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((b, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{b.name}</td>
              <td className="border p-2">{b.timing}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(b)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(b._id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Batch' : 'Add New Batch'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" value={form.name} onChange={handleChange('name')} className="border p-2 w-full" placeholder="Batch Name" required />
              <input type="text" value={form.timing} onChange={handleChange('timing')} className="border p-2 w-full" placeholder="Timing (e.g., 10AM–12PM)" />
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

export default Batches;
