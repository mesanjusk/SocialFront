import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AddEnquiry = () => {
  const initialForm = {
    branchCode: '44210066', enquiryDate: '', firstName: '', middleName: '',
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
  const [search, setSearch] = useState('');

  const organization_id = localStorage.getItem('organization_id');

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
    const res = await axios.get(`https://socialbackend-iucy.onrender.com/api/record/org/${organization_id}?type=enquiry`);
    setEnquiries(res.data || []);
  } catch (err) {
    console.error(err);
    toast.error('Failed to fetch enquiries');
  }
};


  const fetchCourses = async () => {
    try {
      const res = await axios.get('https://socialbackend-iucy.onrender.com/api/courses');
      setCourses(res.data || []);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!organization_id) return toast.error("Missing organization ID");
    const payload = { ...form, organization_id, type: 'enquiry' };

    try {
      if (editingId) {
        await axios.put(`https://socialbackend-iucy.onrender.com/api/enquiry/${editingId}`, payload);
        toast.success('Enquiry updated');
      } else {
        await axios.post('https://socialbackend-iucy.onrender.com/api/enquiry', payload);
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
      await axios.delete(`https://socialbackend-iucy.onrender.com/api/enquiry/${id}`);
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
    const fill = {
      ...admissionTemplate,
      ...e,
      admissionDate: new Date().toISOString().split('T')[0]
    };
    setAdmissionForm(fill);
    setEnquiryToDeleteId(e._id);
    setShowAdmission(true);
  };

  const submitAdmission = async (e) => {
  e.preventDefault();
  if (!organization_id) return toast.error("Missing organization ID");

  const {
    _id, // 🔥 Remove _id to prevent MongoDB duplicate error
    ...rest
  } = admissionForm;

  const payload = {
    ...rest,
    organization_id,
    type: 'admission',
    _enquiryId: enquiryToDeleteId,
    fees: Number(admissionForm.fees || 0),
    discount: Number(admissionForm.discount || 0),
    total: Number(admissionForm.total || 0),
    feePaid: Number(admissionForm.feePaid || 0),
    balance: Number(admissionForm.balance || 0)
  };

  try {
    await axios.post('https://socialbackend-iucy.onrender.com/api/record', payload);
    await axios.delete(`https://socialbackend-iucy.onrender.com/api/enquiry/${enquiryToDeleteId}`);
    toast.success('Admission saved and enquiry removed');
    setShowAdmission(false);
    fetchEnquiries();
  } catch (err) {
    console.error(err.response?.data || err.message);
    toast.error('Failed to convert to admission');
  }
};


  useEffect(() => {
    fetchEnquiries();
    fetchCourses();
  }, []);

  const filtered = enquiries.filter(e =>
    e.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    e.mobileSelf?.includes(search)
  );

  return (
    <div className="p-4">
      <Toaster />
      {/* Search + Add */}
      <div className="flex gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" className="border p-2" />
        <button onClick={() => { setForm(initialForm); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">+ Enquiry</button>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Mobile</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{e.firstName} {e.lastName}</td>
              <td className="border p-2">{e.mobileSelf}</td>
              <td className="border p-2">{e.course}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(e)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(e._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                <button onClick={() => handleConvert(e)} className="bg-green-600 text-white px-2 py-1 rounded">Convert</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-lg w-full overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Enquiry' : 'Add Enquiry'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="date" value={form.enquiryDate} onChange={handleChange('enquiryDate')} className="border p-2" />
              <input value={form.firstName} onChange={handleChange('firstName')} placeholder="First Name" className="border p-2" />
              <input value={form.lastName} onChange={handleChange('lastName')} placeholder="Last Name" className="border p-2" />
              <input value={form.mobileSelf} onChange={handleChange('mobileSelf')} placeholder="Mobile" className="border p-2" />
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

      {showAdmission && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-lg w-full overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Convert to Admission</h2>
            <form onSubmit={submitAdmission} className="flex flex-col gap-3">
              <input type="date" value={admissionForm.admissionDate} onChange={handleAdmissionChange('admissionDate')} className="border p-2" />
              <input value={admissionForm.firstName} onChange={handleAdmissionChange('firstName')} placeholder="First Name" className="border p-2" />
              <input value={admissionForm.mobileSelf} onChange={handleAdmissionChange('mobileSelf')} placeholder="Mobile" className="border p-2" />
              <input value={admissionForm.course} onChange={handleAdmissionChange('course')} placeholder="Course" className="border p-2" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAdmission(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEnquiry;
