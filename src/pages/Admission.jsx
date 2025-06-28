import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import BASE_URL from '../config';
import AdmissionForm from '../components/admission/AdmissionForm';
import AdmissionCard from '../components/admission/AdmissionCard';
import Modal from '../components/common/Modal';
import { fetchMetadata } from '../utils/api';

const Admission = () => {
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
  const [actionModal, setActionModal] = useState(null);
  const [courses, setCourses] = useState([]);
  const [educations, setEducations] = useState([]);
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const themeColor = localStorage.getItem('theme_color') || '#10B981';
  const [paymentModes, setPaymentModes] = useState([]);

  const institute_uuid = localStorage.getItem("institute_uuid");

  const fetchMeta = async () => {
    try {
      const data = await fetchMetadata(institute_uuid);
      setCourses(Array.isArray(data.courses) ? data.courses : []);
      setEducations(Array.isArray(data.educations) ? data.educations : []);
      setExams(Array.isArray(data.exams) ? data.exams : []);
      setBatches(Array.isArray(data.batches) ? data.batches : []);
      setPaymentModes(Array.isArray(data.paymentModes) ? data.paymentModes : []);
    } catch {
      toast.error('Failed to load form metadata');
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

  useEffect(() => {
    fetchMeta();
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
          <input type="text" placeholder="Search by name or number" value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded" />
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded">Export PDF</button>
          <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded">Export Excel</button>
          <button onClick={() => { setForm(initialForm); setEditingId(null); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">+ Admission</button>
        </div>
      </div>

      {/* Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredAdmissions.map((a) => (
          <AdmissionCard key={a._id} data={a} onClick={() => setActionModal(a)} />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <AdmissionForm
          form={form}
          editingId={editingId}
          educations={educations}
          courses={courses}
          exams={exams}
          batches={batches}
          paymentModes={paymentModes}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      )}

      {/* Action Modal */}
      {actionModal && (
        <Modal
          title={`${actionModal.firstName} ${actionModal.lastName}`}
          onClose={() => setActionModal(null)}
          actions={
            <>
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
            </>
          }
        >
          <p className="text-sm text-gray-600">Choose an action for this admission.</p>
        </Modal>
      )}
    </div>
  );
};

export default Admission;
