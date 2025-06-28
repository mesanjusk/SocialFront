import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';


import { Add, PictureAsPdf, FileDownload } from '@mui/icons-material';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import BASE_URL from '../config';

const AllAdmission = () => {
  const initialForm = {
    branchCode: '',
    admissionDate: new Date().toISOString().substring(0, 10),
    firstName: '', middleName: '', lastName: '',
    dob: '', gender: '', mobileSelf: '', mobileSelfWhatsapp: false,
    mobileParent: '', mobileParentWhatsapp: false, address: '',
    education: '', examEvent: '', course: '', batchTime: '', installment: '',
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
  const [educations, setEducations] = useState([]);
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const themeColor = localStorage.getItem('theme_color') || '#10B981';
  const [paymentModes, setPaymentModes] = useState([]);
  const [actionModal, setActionModal] = useState(null);

  const institute_uuid = localStorage.getItem("institute_uuid");

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/courses`);
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load courses');
    }
  };

  const fetchEducations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/education`);
      setEducations(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load education options');
    }
  };

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/exams`);
      setExams(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load exam events');
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/batches`);
      setBatches(res.data || []);
    } catch {
      toast.error('Failed to load batches');
    }
  };

  const fetchPaymentModes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/paymentmode`);
      setPaymentModes(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load payment modes');
    }
  };

  const fetchAdmissions = async () => {
    if (!institute_uuid) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/record/org/${institute_uuid}?type=admission`);
      setAdmissions(res.data || []);
    } catch {
      toast.error('Failed to fetch admissions');
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    let updatedForm = { ...form, [field]: value };

    const fees = Number(field === 'fees' ? value : form.fees || 0);
    const discount = Number(field === 'discount' ? value : form.discount || 0);
    const feePaid = Number(field === 'feePaid' ? value : form.feePaid || 0);

    if (['fees', 'discount', 'feePaid'].includes(field)) {
      const total = fees - discount;
      const balance = total - feePaid;

      updatedForm.fees = fees;
      updatedForm.discount = discount;
      updatedForm.feePaid = feePaid;
      updatedForm.total = total;
      updatedForm.balance = balance;
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!institute_uuid) return toast.error("Missing institute ID");

    const payload = {
      ...form,
      institute_uuid,
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
    } catch {
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
    } catch {
      toast.error('Failed to delete');
    }
  };

  const exportPDF = () => {
    if (filteredAdmissions.length === 0) return toast.error("No data to export");
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'Mobile']],
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

  const handleAdd = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowModal(true);
  };

  useEffect(() => {
    fetchCourses();
    fetchEducations();
    fetchExams();
    fetchBatches();
    fetchPaymentModes();
    fetchAdmissions();
  }, []);

  const filteredAdmissions = admissions.filter(e => {
    const matchSearch = e.firstName?.toLowerCase().includes(search.toLowerCase()) || e.mobileSelf?.includes(search);
    const admissionDate = new Date(e.admissionDate);
    const inDateRange = (!startDate || admissionDate >= new Date(startDate)) && (!endDate || admissionDate <= new Date(endDate));
    return matchSearch && inDateRange;
  });

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: themeColor }}>
      <Toaster />
      {/* Search & Export */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="flex gap-2">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded" />
          <input type="text" placeholder="Search by name or number" value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded w-full max-w-xs" />
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded" title="Export PDF">
            <PictureAsPdf fontSize="small" />
          </button>
          <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded" title="Export Excel">
            <FileDownload fontSize="small" />
          </button>
          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded" title="Add Admission">
            <Add fontSize="small" />
          </button>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-8 gap-3">
        {filteredAdmissions.map((a) => (
          <div
            key={a._id}
            className="bg-white p-4 rounded shadow cursor-pointer hover:ring hover:ring-blue-400"
            onClick={() => setActionModal(a)}
          >
            <div className="font-semibold text-lg">{a.firstName} {a.lastName}</div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <a
                href={`tel:${a.mobileSelf}`}
                onClick={ev => ev.stopPropagation()}
                className="hover:text-blue-600 flex items-center"
              >
                <FaPhoneAlt className="mr-1 text-xl" />
                {a.mobileSelf}
              </a>
              <a
                href={`https://wa.me/${a.mobileSelf}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={ev => ev.stopPropagation()}
                className="text-green-600 text-2xl"
              >
                <FaWhatsapp />
              </a>

            </div>
            <div className="text-gray-500 text-xs">{a.course || 'No course selected'}</div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">{editingId ? 'Edit Admission' : 'Add New Admission'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input placeholder="First Name" value={form.firstName} onChange={handleChange('firstName')} className="border p-2" required />
              <input placeholder="Middle Name" value={form.middleName} onChange={handleChange('middleName')} className="border p-2" />
              <input placeholder="Last Name" value={form.lastName} onChange={handleChange('lastName')} className="border p-2" />
              <div className="flex items-center gap-4">

                <input type="date" value={form.dob?.substring(0, 10)} onChange={handleChange('dob')}
                  className="border p-2 flex-1"
                  required
                /> <label className="w-32 text-sm font-medium">Date of Birth</label>
              </div>


              <div className="flex gap-4">
                <label><input type="radio" name="gender" value="Male" checked={form.gender === 'Male'} onChange={handleChange('gender')} /> Male</label>
                <label><input type="radio" name="gender" value="Female" checked={form.gender === 'Female'} onChange={handleChange('gender')} /> Female</label>
              </div>
              <input
                placeholder="Mobile (Self)"
                value={form.mobileSelf}
                onChange={handleChange('mobileSelf')}
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                className="border p-2"
              />
              <input
                placeholder="Mobile (Parent)"
                value={form.mobileParent}
                onChange={handleChange('mobileParent')}
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                className="border p-2"
              />
              <input placeholder="Address" value={form.address} onChange={handleChange('address')} className="border p-2" />

              <select value={form.education} onChange={handleChange('education')} className="border p-2">
                <option value="">-- Select Education --</option>
                {educations.map(e => <option key={e._id} value={e.education}>{e.education}</option>)}
              </select>
              <select
                value={form.course}
                onChange={(e) => {
                  const selectedCourse = courses.find(c => c.name === e.target.value);
                  const courseFee = Number(selectedCourse?.courseFees || 0); // ✅ use courseFees
                  const discount = Number(form.discount || 0);
                  const feePaid = Number(form.feePaid || 0);
                  const total = courseFee - discount;
                  const balance = total - feePaid;

                  setForm(prev => ({
                    ...prev,
                    course: e.target.value,
                    fees: courseFee,
                    total,
                    balance
                  }));
                }}
                className="border p-2"
              >
                <option value="">-- Select Course --</option>
                {courses.map(c => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <select value={form.batchTime} onChange={handleChange('batchTime')} className="border p-2">
                <option value="">-- Select Batch --</option>
                {batches.map(b => (
                  <option key={b._id} value={b.time || b.batchTime || b.name || ''}>
                    {b.time || b.batchTime || b.name || 'Unnamed Batch'}
                  </option>
                ))}
              </select>

              <select value={form.examEvent} onChange={handleChange('examEvent')} className="border p-2">
                <option value="">-- Select Exam --</option>
                {exams.map(e => <option key={e._id} value={e.exam}>{e.exam}</option>)}
              </select>




              <input placeholder="Installment" value={form.installment} onChange={handleChange('installment')} className="border p-2" />
              <input placeholder="Fees" value={form.fees} type="number" className="border p-2" readOnly />
              <input placeholder="Discount" value={form.discount} type="number" onChange={handleChange('discount')} className="border p-2" />
              <input placeholder="Total" value={form.total} type="number" className="border p-2" readOnly />
              <input placeholder="Fee Paid" value={form.feePaid} type="number" onChange={handleChange('feePaid')} className="border p-2" />

              <select value={form.paidBy} onChange={handleChange('paidBy')} className="border p-2">
                <option value="">-- Select Payment Mode --</option>
                {paymentModes.map(p => <option key={p._id} value={p.mode}>{p.mode}</option>)}
              </select>

              <input placeholder="Balance" value={form.balance} type="number" className="border p-2" readOnly />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full h-full overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {actionModal.firstName} {actionModal.lastName}
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  handleEdit(actionModal);
                  setActionModal(null);
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  handleDelete(actionModal._id);
                  setActionModal(null);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setActionModal(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded text-sm ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAdmission;
