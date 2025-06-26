import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Edit, Delete, Add, PictureAsPdf, FileDownload } from '@mui/icons-material';
import BASE_URL from '../config';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    courseFees: '',
    examFees: '',
    duration: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const institute_id = localStorage.getItem('institute_uuid');
  const themeColor = localStorage.getItem('theme_color') || '#10B981';

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/courses?institute_uuid=${institute_id}`);
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
    if (!institute_id) return toast.error('Missing institute ID');

    const payload = { ...form, institute_uuid: institute_id };


    try {
      if (editingId) {
        if (!window.confirm('Update this course?')) return;
        await axios.put(`${BASE_URL}/api/courses/${editingId}`, payload);
        toast.success('Course updated');
      } else {
        await axios.post(`${BASE_URL}/api/courses`, payload);
        toast.success('Course added');
      }
      setForm({ name: '', description: '', courseFees: '', examFees: '', duration: '' });
      setEditingId(null);
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      toast.error('Failed to submit');
    }
  };

  const handleEdit = (course) => {
    setForm({
      name: course.name,
      description: course.description,
      courseFees: course.courseFees || '',
      examFees: course.examFees || '',
      duration: course.duration || ''
    });
    setEditingId(course._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/courses/${id}`);
      toast.success('Deleted');
      fetchCourses();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Course Name', 'Description', 'Course Fees', 'Exam Fees', 'Duration']],
      body: filteredCourses.map(c => [
        c.name,
        c.description || '-',
        c.courseFees || '-',
        c.examFees || '-',
        c.duration || '-'
      ])
    });
    doc.save('courses.pdf');
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredCourses.map(c => ({
      'Course Name': c.name,
      Description: c.description,
      'Course Fees': c.courseFees,
      'Exam Fees': c.examFees,
      Duration: c.duration
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Courses');
    XLSX.writeFile(wb, 'courses.xlsx');
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 relative" style={{ backgroundColor: themeColor }}>
      <Toaster />
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <input
          placeholder="Search course"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-full max-w-sm"
        />
        <div className="flex gap-2">
          <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded" title="Export PDF">
            <PictureAsPdf fontSize="small" />
          </button>
          <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded" title="Export Excel">
            <FileDownload fontSize="small" />
          </button>
          <button onClick={() => { setForm({ name: '', description: '', courseFees: '', examFees: '', duration: '' }); setEditingId(null); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded" title="Add Course">
            <Add fontSize="small" />
          </button>
        </div>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Course Fees</th>
            <th className="p-2 border">Exam Fees</th>
            <th className="p-2 border">Duration</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((c, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.description}</td>
              <td className="border p-2">{c.courseFees}</td>
              <td className="border p-2">{c.examFees}</td>
              <td className="border p-2">{c.duration}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(c)} className="bg-yellow-500 text-white px-2 py-1 rounded" title="Edit">
                  <Edit fontSize="small" />
                </button>
                <button onClick={() => handleDelete(c._id)} className="bg-red-600 text-white px-2 py-1 rounded" title="Delete">
                  <Delete fontSize="small" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md max-h-[90vh] overflow-y-auto shadow">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Course' : 'Add New Course'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input type="text" value={form.name} onChange={handleChange('name')} className="border p-2 w-full" placeholder="Course Name" required />
              <textarea value={form.description} onChange={handleChange('description')} className="border p-2 w-full" placeholder="Description" rows={3} />
              <input type="number" value={form.courseFees} onChange={handleChange('courseFees')} className="border p-2 w-full" placeholder="Course Fees" />
              <input type="number" value={form.examFees} onChange={handleChange('examFees')} className="border p-2 w-full" placeholder="Exam Fees" />
              <input type="text" value={form.duration} onChange={handleChange('duration')} className="border p-2 w-full" placeholder="Duration (e.g., 6 months)" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
