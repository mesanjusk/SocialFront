import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await axios.get('https://socialbackend-iucy.onrender.com/api/courses');
      setCourses(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch courses');
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        if (!window.confirm('Update this course?')) return;
        await axios.put(`https://socialbackend-iucy.onrender.com/api/courses/${editingId}`, form);
        toast.success('Course updated');
      } else {
        await axios.post('https://socialbackend-iucy.onrender.com/api/courses', form);
        toast.success('Course added');
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      toast.error('Failed to submit');
    }
  };

  const handleEdit = (course) => {
    setForm({ name: course.name, description: course.description });
    setEditingId(course._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await axios.delete(`https://socialbackend-iucy.onrender.com/api/courses/${id}`);
      toast.success('Deleted');
      fetchCourses();
    } catch {
      toast.error('Failed to delete');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4">
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <input
          placeholder="Search course"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={() => { setForm({ name: '', description: '' }); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Course
        </button>
      </div>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((c, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.description}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(c)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(c._id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Course' : 'Add New Course'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" value={form.name} onChange={handleChange('name')} className="border p-2 w-full" placeholder="Course Name" required />
              <textarea value={form.description} onChange={handleChange('description')} className="border p-2 w-full" placeholder="Description" />
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

export default Courses;