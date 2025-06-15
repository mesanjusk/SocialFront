import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const AddEnquiry = () => {
  const initialForm = {
    branchCode: '44210066', enquiryDate: '', firstName: '', middleName: '',
    lastName: '', dob: '', gender: '', mobileSelf: '', mobileSelfWhatsapp: false,
    mobileParent: '', mobileParentWhatsapp: false, address: '', education: '',
    schoolName: '', referredBy: '', followUpDate: '', remarks: '', course: ''
  };

  const admissionFormTemplate = {
    branchCode: '44210066', admissionDate: '', firstName: '', middleName: '',
    lastName: '', dob: '', gender: '', mobileSelf: '', mobileSelfWhatsapp: false,
    mobileParent: '', mobileParentWhatsapp: false, address: '', education: '',
    batchTime: '', examEvent: '', course: '', installment: '', fees: '',
    discount: '', total: '', feePaid: '', paidBy: '', balance: ''
  };

  const [form, setForm] = useState(initialForm);
  const [enquiries, setEnquiries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [courses, setCourses] = useState([]);

  // Admission modal states
  const [showAdmission, setShowAdmission] = useState(false);
  const [admissionForm, setAdmissionForm] = useState(admissionFormTemplate);
  const [enquiryToDeleteId, setEnquiryToDeleteId] = useState(null);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleAdmissionChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAdmissionForm({ ...admissionForm, [field]: value });
  };

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get('https://socialbackend-iucy.onrender.com/api/enquiry');
      setEnquiries(res.data || []);
    } catch {
      toast.error('Failed to fetch enquiries');
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('https://socialbackend-iucy.onrender.com/api/courses');
      setCourses(res.data || []);
    } catch { }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        if (!window.confirm('Update this enquiry?')) return;
        await axios.put(`https://socialbackend-iucy.onrender.com/api/enquiry/${editingId}`, form);
        toast.success('Updated');
      } else {
        await axios.post('https://socialbackend-iucy.onrender.com/api/enquiry', form);
        toast.success('Added');
      }
      setForm(initialForm);
      setEditingId(null);
      setShowModal(false);
      fetchEnquiries();
    } catch {
      toast.error('Error submitting enquiry');
    }
  };

  const handleEdit = (enq) => {
    setForm({ ...enq });
    setEditingId(enq._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete enquiry?')) return;
    try {
      await axios.delete(`https://socialbackend-iucy.onrender.com/api/enquiry/${id}`);
      toast.success('Deleted');
      fetchEnquiries();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleConvert = (enq) => {
    setAdmissionForm({
      ...admissionFormTemplate,
      admissionDate: new Date().toISOString().slice(0, 10),
      firstName: enq.firstName,
      middleName: enq.middleName,
      lastName: enq.lastName,
      dob: enq.dob,
      gender: enq.gender,
      mobileSelf: enq.mobileSelf,
      mobileSelfWhatsapp: enq.mobileSelfWhatsapp,
      mobileParent: enq.mobileParent,
      mobileParentWhatsapp: enq.mobileParentWhatsapp,
      address: enq.address,
      education: enq.education,
      course: enq.course,
    });
    setEnquiryToDeleteId(enq._id);
    setShowAdmission(true);
  };

  const submitAdmission = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://socialbackend-iucy.onrender.com/api/admission', admissionForm);
      toast.success('Admission added');
      await axios.delete(`https://socialbackend-iucy.onrender.com/api/enquiry/${enquiryToDeleteId}`);
      setShowAdmission(false);
      fetchEnquiries();
    } catch {
      toast.error('Admission failed');
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
          <input type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded" />
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded">PDF</button>
          <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded">Excel</button>
          <button onClick={() => { setForm(initialForm); setEditingId(null); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">+ Enquiry</button>
        </div>
      </div>

      <table className="w-full border">
        <thead className="bg-theme">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Mobile</th>
            <th className="p-2 border">Course</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEnquiries.map((e, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{e.firstName} {e.lastName}</td>
              <td className="border p-2">{e.mobileSelf}</td>
              <td className="border p-2">{e.course}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(e)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(e._id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                <button onClick={() => handleConvert(e)} className="bg-indigo-600 text-white px-2 py-1 rounded">Convert</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Enquiry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Enquiry' : 'Add Enquiry'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="date" value={form.enquiryDate} onChange={handleChange('enquiryDate')} className="border p-2" required />
              <input value={form.firstName} placeholder="First Name" onChange={handleChange('firstName')} className="border p-2" />
              <input value={form.middleName} placeholder="Middle Name" onChange={handleChange('middleName')} className="border p-2" />
              <input value={form.lastName} placeholder="Last Name" onChange={handleChange('lastName')} className="border p-2" />
              <input type="date" value={form.dob} onChange={handleChange('dob')} className="border p-2" />
              <input value={form.mobileSelf} placeholder="Mobile Self" onChange={handleChange('mobileSelf')} className="border p-2" />
              <input value={form.mobileParent} placeholder="Mobile Parent" onChange={handleChange('mobileParent')} className="border p-2" />
              <select value={form.course} onChange={handleChange('course')} className="border p-2">
                <option value="">Select Course</option>
                {courses.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>

      )}

      {/* Admission Modal */}
      {showAdmission && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-lg w-full overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Convert to Admission</h2>
            <form onSubmit={submitAdmission} className="grid grid-cols-2 gap-4">
              <input type="date" value={admissionForm.admissionDate} onChange={handleAdmissionChange('admissionDate')} className="border p-2" required />
              <input value={admissionForm.firstName} placeholder="First Name" onChange={handleAdmissionChange('firstName')} className="border p-2" />
              <input value={admissionForm.middleName} placeholder="Middle Name" onChange={handleAdmissionChange('middleName')} className="border p-2" />
              <input value={admissionForm.lastName} placeholder="Last Name" onChange={handleAdmissionChange('lastName')} className="border p-2" />
              <input value={admissionForm.mobileSelf} placeholder="Mobile" onChange={handleAdmissionChange('mobileSelf')} className="border p-2" />
              <select value={admissionForm.course} onChange={handleAdmissionChange('course')} className="border p-2 col-span-2">
                <option value="">Select Course</option>
                {courses.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
              <div className="col-span-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAdmission(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save Admission</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEnquiry;
