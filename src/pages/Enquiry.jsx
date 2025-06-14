// AddEnquiry.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const AddEnquiry = ({ themeColor = 'bg-blue-600' }) => {
  const initialForm = {
    branchCode: '44210066', enquiryDate: '', firstName: '', middleName: '',
    lastName: '', dob: '', gender: '', mobileSelf: '', mobileSelfWhatsapp: false,
    mobileParent: '', mobileParentWhatsapp: false, address: '', education: '',
    schoolName: '', referredBy: '', followUpDate: '', remarks: '', course: ''
  };

  const [form, setForm] = useState(initialForm);
  const [enquiries, setEnquiries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [courses, setCourses] = useState([]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        if (!window.confirm('Are you sure you want to update this enquiry?')) return;
        await axios.put(`https://socialbackend-iucy.onrender.com/api/enquiry/${editingId}`, form);
        toast.success('Enquiry updated successfully');
      } else {
        await axios.post('https://socialbackend-iucy.onrender.com/api/enquiry', form);
        toast.success('Enquiry added successfully');
      }
      setForm(initialForm);
      setShowModal(false);
      setEditingId(null);
      fetchEnquiries();
    } catch (error) {
      console.error(error);
      toast.error('Error submitting enquiry');
    }
  };

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get('https://socialbackend-iucy.onrender.com/api/enquiry');
      setEnquiries(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch enquiries');
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('https://socialbackend-iucy.onrender.com/api/courses');
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (enq) => {
    setForm({ ...enq });
    setEditingId(enq._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await axios.delete(`https://socialbackend-iucy.onrender.com/api/enquiry/${id}`);
      toast.success('Enquiry deleted');
      fetchEnquiries();
    } catch (err) {
      toast.error('Failed to delete enquiry');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'Mobile', 'Course']],
      body: filteredEnquiries.map(e => [`${e.firstName} ${e.lastName}`, e.mobileSelf, e.course]),
    });
    doc.save('enquiries.pdf');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEnquiries.map(e => ({
      Name: `${e.firstName} ${e.lastName}`,
      Mobile: e.mobileSelf,
      Course: e.course,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Enquiries');
    XLSX.writeFile(workbook, 'enquiries.xlsx');
  };

  useEffect(() => {
    fetchEnquiries();
    fetchCourses();
  }, []);

  const filteredEnquiries = enquiries.filter(e => {
    const matchSearch = e.firstName?.toLowerCase().includes(search.toLowerCase()) || e.mobileSelf?.includes(search);
    const enquiryDate = new Date(e.enquiryDate);
    const inDateRange = (!startDate || enquiryDate >= new Date(startDate)) && (!endDate || enquiryDate <= new Date(endDate));
    return matchSearch && inDateRange;
  });

  return (
    <div className="p-4">
      <Toaster />
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="flex gap-2">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded" />
          <input type="text" placeholder="Search by name or number" value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded" />
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded">Export PDF</button>
          <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded">Export Excel</button>
          <button onClick={() => { setForm(initialForm); setEditingId(null); setShowModal(true); }} className={`${themeColor} text-white px-4 py-2 rounded`}>+ Enquiry</button>
        </div>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Mobile</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEnquiries.map((enq, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{enq.firstName} {enq.lastName}</td>
              <td className="border p-2">{enq.mobileSelf}</td>
              <td className="border p-2">{enq.course}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(enq)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(enq._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className={`text-2xl font-bold mb-4 ${themeColor.replace('bg-', 'text-')}`}>
              {editingId ? 'Edit Enquiry' : 'Add New Enquiry'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input value={form.enquiryDate} type="date" onChange={handleChange('enquiryDate')} className="border p-2" required />
              <input value={form.firstName} placeholder="First Name" onChange={handleChange('firstName')} className="border p-2" required />
              <input value={form.middleName} placeholder="Middle Name" onChange={handleChange('middleName')} className="border p-2" />
              <input value={form.lastName} placeholder="Last Name" onChange={handleChange('lastName')} className="border p-2" />
              <input value={form.dob} type="date" onChange={handleChange('dob')} className="border p-2" required />

              <div className="flex items-center gap-2">
                <label><input type="radio" name="gender" value="Male" checked={form.gender === 'Male'} onChange={handleChange('gender')} /> Male</label>
                <label><input type="radio" name="gender" value="Female" checked={form.gender === 'Female'} onChange={handleChange('gender')} /> Female</label>
              </div>

              <div>
                <input value={form.mobileSelf} placeholder="Mobile No. (Self)" onChange={handleChange('mobileSelf')} className="border p-2 w-full" />
                <label><input type="checkbox" checked={form.mobileSelfWhatsapp} onChange={handleChange('mobileSelfWhatsapp')} /> WhatsApp</label>
              </div>

              <div>
                <input value={form.mobileParent} placeholder="Mobile No. (Parent)" onChange={handleChange('mobileParent')} className="border p-2 w-full" />
                <label><input type="checkbox" checked={form.mobileParentWhatsapp} onChange={handleChange('mobileParentWhatsapp')} /> WhatsApp</label>
              </div>

              <input value={form.address} placeholder="Address" onChange={handleChange('address')} className="border p-2 col-span-2" />
              <input value={form.education} placeholder="Education" onChange={handleChange('education')} className="border p-2" />
              <input value={form.schoolName} placeholder="School Name" onChange={handleChange('schoolName')} className="border p-2" />
              <input value={form.referredBy} placeholder="Referred By" onChange={handleChange('referredBy')} className="border p-2" />
              <input value={form.followUpDate} type="date" onChange={handleChange('followUpDate')} className="border p-2" />
              <textarea value={form.remarks} placeholder="Remarks" onChange={handleChange('remarks')} className="border p-2 col-span-2" />
              <select value={form.course} onChange={handleChange('course')} className="border p-2 col-span-2">
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course.name}>{course.name}</option>
                ))}
              </select>
              <div className="col-span-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className={`${themeColor} text-white px-4 py-2 rounded`}>
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEnquiry;
