import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import BASE_URL from '../config';

const Admission = () => {
  const initialForm = {
    branchCode: '44210066',
    admissionDate: '', firstName: '', middleName: '', lastName: '',
    dob: '', gender: '', mobileSelf: '', mobileSelfWhatsapp: false,
    mobileParent: '', mobileParentWhatsapp: false, address: '', education: '',
    batchTime: '', examEvent: '', course: '', installment: '',
    fees: '', discount: '', total: '', feePaid: '', paidBy: '', balance: ''
  };

  const [form, setForm] = useState(initialForm);
  const [admissions, setAdmissions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const organization_id = localStorage.getItem("organization_id");

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/courses`);
      if (Array.isArray(res.data)) {
        setCourses(res.data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('Failed to fetch courses');
      setCourses([]);
      toast.error('Failed to load courses');
    }
  };

  const fetchAdmissions = async () => {
    try {
      if (!organization_id) return;
      const res = await axios.get(`${BASE_URL}/api/record/org/${organization_id}?type=admission`);
      setAdmissions(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch admissions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!organization_id) return toast.error("Missing organization ID");

    const payload = {
      ...form,
      organization_id,
      type: 'admission',
      fees: Number(form.fees || 0),
      discount: Number(form.discount || 0),
      total: Number(form.total || 0),
      feePaid: Number(form.feePaid || 0),
      balance: Number(form.balance || 0)
    };

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/record/${editingId}`, payload);
        toast.success('Updated successfully');
      } else {
        await axios.post(`${BASE_URL}/api/record`, payload);
        toast.success('Admission added');
      }
      setForm(initialForm);
      setEditingId(null);
      setShowModal(false);
      fetchAdmissions();
    } catch (err) {
      console.error(err);
      toast.error('Error saving admission');
    }
  };

  const handleEdit = (data) => {
    setForm(data);
    setEditingId(data._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this admission?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/record/${id}`);
      toast.success('Deleted');
      fetchAdmissions();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const exportPDF = () => {
    if (filteredAdmissions.length === 0) return toast.error("No data to export");
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'Mobile', 'Course']],
      body: filteredAdmissions.map(e => [`${e.firstName} ${e.lastName}`, e.mobileSelf, e.course]),
    });
    doc.save('admissions.pdf');
  };

  const exportExcel = () => {
    if (filteredAdmissions.length === 0) return toast.error("No data to export");
    const worksheet = XLSX.utils.json_to_sheet(filteredAdmissions.map(e => ({
      Name: `${e.firstName} ${e.lastName}`,
      Mobile: e.mobileSelf,
      Course: e.course,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Admissions');
    XLSX.writeFile(workbook, 'admissions.xlsx');
  };

  useEffect(() => {
    fetchCourses();
    fetchAdmissions();
  }, []);

  const filteredAdmissions = admissions.filter(e => {
    const matchSearch = e.firstName?.toLowerCase().includes(search.toLowerCase()) || e.mobileSelf?.includes(search);
    const admissionDate = new Date(e.admissionDate);
    const inDateRange = (!startDate || admissionDate >= new Date(startDate)) && (!endDate || admissionDate <= new Date(endDate));
    return matchSearch && inDateRange;
  });

  return (
    <div className="p-4">
      <Toaster />
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="flex gap-2">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded" />
          <input type="text" placeholder="Search by name or number" value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded" />
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded">Export PDF</button>
          <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded">Export Excel</button>
          <button onClick={() => { setForm(initialForm); setEditingId(null); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">+ Admission</button>
        </div>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Mobile</th>
            <th className="p-2 border">Course</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmissions.map((a, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{a.firstName} {a.lastName}</td>
              <td className="border p-2">{a.mobileSelf}</td>
              <td className="border p-2">{a.course}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(a)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(a._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Admission Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">{editingId ? 'Edit Admission' : 'Add New Admission'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="text" value={form.branchCode} disabled className="border p-2 bg-gray-100" />
              <input type="date" value={form.admissionDate} onChange={handleChange('admissionDate')} className="border p-2" required />
              <input placeholder="First Name" value={form.firstName} onChange={handleChange('firstName')} className="border p-2" required />
              <input placeholder="Middle Name" value={form.middleName} onChange={handleChange('middleName')} className="border p-2" />
              <input placeholder="Last Name" value={form.lastName} onChange={handleChange('lastName')} className="border p-2" />
              <input type="date" value={form.dob} onChange={handleChange('dob')} className="border p-2" required />

              <div className="flex gap-4">
                <label><input type="radio" name="gender" value="Male" checked={form.gender === 'Male'} onChange={handleChange('gender')} /> Male</label>
                <label><input type="radio" name="gender" value="Female" checked={form.gender === 'Female'} onChange={handleChange('gender')} /> Female</label>
              </div>

              <input placeholder="Mobile (Self)" value={form.mobileSelf} onChange={handleChange('mobileSelf')} className="border p-2" />
              <input placeholder="Mobile (Parent)" value={form.mobileParent} onChange={handleChange('mobileParent')} className="border p-2" />
              <input placeholder="Address" value={form.address} onChange={handleChange('address')} className="border p-2" />
              <input placeholder="Education" value={form.education} onChange={handleChange('education')} className="border p-2" />
              <input placeholder="Batch Time" value={form.batchTime} onChange={handleChange('batchTime')} className="border p-2" />
              <input placeholder="Exam Event" value={form.examEvent} onChange={handleChange('examEvent')} className="border p-2" />

              <select value={form.course} onChange={handleChange('course')} className="border p-2">
                <option value="">Select Course</option>
                {Array.isArray(courses) && courses.map(course => (
                  <option key={course._id} value={course.name}>{course.name}</option>
                ))}
              </select>

              <input placeholder="Installment" value={form.installment} onChange={handleChange('installment')} className="border p-2" />
              <input placeholder="Fees" value={form.fees} type="number" onChange={handleChange('fees')} className="border p-2" />
              <input placeholder="Discount" value={form.discount} type="number" onChange={handleChange('discount')} className="border p-2" />
              <input placeholder="Total" value={form.total} type="number" onChange={handleChange('total')} className="border p-2" />
              <input placeholder="Fee Paid" value={form.feePaid} type="number" onChange={handleChange('feePaid')} className="border p-2" />
              <input placeholder="Paid By" value={form.paidBy} onChange={handleChange('paidBy')} className="border p-2" />
              <input placeholder="Balance" value={form.balance} type="number" onChange={handleChange('balance')} className="border p-2" />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admission;
