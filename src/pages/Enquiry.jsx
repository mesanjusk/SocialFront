import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';

const AddEnquiry = () => {
  const initialForm = {
    enquiryDate: '', firstName: '', middleName: '',
    lastName: '', dob: '', gender: '', mobileSelf: '', mobileSelfWhatsapp: false,
    mobileParent: '', mobileParentWhatsapp: false, address: '', education: '',
    schoolName: '', referredBy: '', followUpDate: '', remarks: '', course: ''
  };

  const admissionTemplate = {
    ...initialForm,
    admissionDate: '', batchTime: '', examEvent: '',
    installment: '', fees: '', discount: '', total: '', feePaid: '',
    paidBy: '', balance: ''
  };

  const [form, setForm] = useState(initialForm);
  const [admissionForm, setAdmissionForm] = useState(admissionTemplate);
  const [enquiries, setEnquiries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAdmission, setShowAdmission] = useState(false);
  const [enquiryToDeleteId, setEnquiryToDeleteId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [educations, setEducations] = useState([]);
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [search, setSearch] = useState('');
  const institute_uuid = localStorage.getItem('institute_uuid');
  const themeColor = localStorage.getItem('theme_color') || '#10B981';

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAdmissionChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAdmissionForm(prev => {
      const updated = { ...prev, [field]: value };
      const fees = Number(updated.fees || 0);
      const discount = Number(updated.discount || 0);
      const feePaid = Number(updated.feePaid || 0);
      updated.total = fees - discount;
      updated.balance = updated.total - feePaid;
      return updated;
    });
  };

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/record/org/${institute_uuid}?type=enquiry`);
      setEnquiries(res.data || []);
    } catch {
      toast.error('Failed to fetch enquiries');
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [c, e, ex, b, p] = await Promise.all([
        axios.get(`${BASE_URL}/api/courses?institute_uuid=${institute_uuid}`),
        axios.get(`${BASE_URL}/api/education`),
        axios.get(`${BASE_URL}/api/exams`),
        axios.get(`${BASE_URL}/api/batches`),
        axios.get(`${BASE_URL}/api/paymentmode`),
      ]);
      setCourses(c.data || []);
      setEducations(e.data || []);
      setExams(ex.data || []);
      setBatches(b.data || []);
      setPaymentModes(p.data || []);
    } catch {
      toast.error('Failed to load dropdown data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!institute_uuid) return toast.error("Missing institute UUID");
    const payload = { ...form, institute_uuid, type: 'enquiry' };
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/record/${editingId}`, payload);
        toast.success('Enquiry updated');
      } else {
        await axios.post(`${BASE_URL}/api/record`, payload);
        toast.success('Enquiry added');
      }
      setForm(initialForm);
      setEditingId(null);
      setShowModal(false);
      fetchEnquiries();
    } catch {
      toast.error('Error submitting enquiry');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/enquiry/${id}`);
      toast.success('Deleted');
      fetchEnquiries();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (e) => {
    setForm({ ...e });
    setEditingId(e._id);
    setShowModal(true);
  };

  const handleConvert = (e) => {
    setAdmissionForm({ ...admissionTemplate, ...e, admissionDate: new Date().toISOString().split('T')[0] });
    setEnquiryToDeleteId(e.uuid);
    setShowAdmission(true);
  };

  const submitAdmission = async (e) => {
    e.preventDefault();
    if (!institute_uuid) return toast.error("Missing institute UUID");
    const payload = {
      institute_uuid,
      admissionData: {
        ...admissionForm,
        fees: Number(admissionForm.fees || 0),
        discount: Number(admissionForm.discount || 0),
        total: Number(admissionForm.total || 0),
        feePaid: Number(admissionForm.feePaid || 0),
        balance: Number(admissionForm.balance || 0),
        createdBy: localStorage.getItem('name') || 'admin'
      }
    };
    try {
      await axios.post(`${BASE_URL}/api/record/convert/${enquiryToDeleteId}`, payload);
      toast.success('Admission saved and enquiry updated');
      setAdmissionForm(admissionTemplate);
      setShowAdmission(false);
      fetchEnquiries();
    } catch {
      toast.error('Failed to convert to admission');
    }
  };

  useEffect(() => {
    fetchEnquiries();
    fetchDropdowns();
  }, []);

  const filtered = enquiries.filter(e => e.firstName?.toLowerCase().includes(search.toLowerCase()) || e.mobileSelf?.includes(search));

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: themeColor }}>
      <Toaster />
      <div className="flex gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" className="border p-2 w-full max-w-xs" />
        <button onClick={() => { setForm(initialForm); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">+ Enquiry</button>
      </div>

      {/* Table view for desktop */}
      <table className="w-full border hidden md:table">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Mobile</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{e.firstName} {e.lastName}</td>
              <td className="border p-2">{e.mobileSelf}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(e)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(e._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                <button onClick={() => handleConvert(e)} className="bg-green-600 text-white px-2 py-1 rounded">Convert</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Card view for mobile */}
      <div className="flex flex-col gap-2 md:hidden">
        {filtered.map((e, i) => (
          <div key={i} className="bg-white rounded shadow p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold text-lg">{e.firstName} {e.lastName}</div>
              <div className="text-gray-600 text-sm">{e.mobileSelf}</div>
              <div className="text-gray-500 text-xs">{e.course || 'No course selected'}</div>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => handleEdit(e)} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">✏️</button>
              <button onClick={() => handleDelete(e._id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">🗑️</button>
              <button onClick={() => handleConvert(e)} className="bg-green-600 text-white px-2 py-1 rounded text-sm">➡️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals remain unchanged for clean workflow */}

    </div>
  );
};

export default AddEnquiry;
