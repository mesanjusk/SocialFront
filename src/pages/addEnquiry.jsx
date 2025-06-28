import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';
import { fetchMetadata } from '../utils/api';

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
  const [enquiries, setEnquiries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [educations, setEducations] = useState([]);
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [search, setSearch] = useState('');
  const institute_uuid = localStorage.getItem('institute_uuid');
  const themeColor = localStorage.getItem('theme_color') || '#10B981';

  // Calculate followUpDate in UTC based on today's IST
const todayIST = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
const istMidnight = new Date(todayIST);
istMidnight.setHours(0, 0, 0, 0); // set to 00:00 IST



  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/record/org/${institute_uuid}?type=enquiry`);
      setEnquiries(res.data || []);
    } catch {
      toast.error('Failed to fetch enquiries');
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!institute_uuid) return toast.error("Missing institute UUID");
      
  const payload = {
    ...form,
    institute_uuid: institute_uuid,
    type: 'enquiry',
    followUpDate: new Date(form.followUpDate)

  };


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
      fetchEnquiries();
    } catch {
      toast.error('Error submitting enquiry');
    }
  };


  
  useEffect(() => {
    fetchEnquiries();
    fetchMeta();
  }, []);

  
 return (
  <div className="min-h-screen p-4" style={{ backgroundColor: themeColor }}>
    <Toaster />
    <div className="bg-white p-6 rounded max-w-3xl mx-auto shadow-md">
      <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Enquiry' : 'Add Enquiry'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input value={form.firstName} onChange={handleChange('firstName')} placeholder="First Name" className="border p-2" />
        <input value={form.lastName} onChange={handleChange('lastName')} placeholder="Last Name" className="border p-2" />
        <input
          value={form.mobileSelf}
          onChange={handleChange('mobileSelf')}
          placeholder="Mobile"
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          className="border p-2"
        />
        <select value={form.course} onChange={handleChange('course')} className="border p-2">
          <option value="">Select Course</option>
          {Array.isArray(courses) && courses.map(c => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium">Follow-Up</label>
          <input
            type="date"
            value={form.followUpDate?.substring(0, 10)}
            onChange={handleChange('followUpDate')}
            className="border p-2 flex-1"
            required
          />
        </div>

        <input
          value={form.remarks}
          onChange={handleChange('remarks')}
          placeholder="Remark"
          className="border p-2"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setForm(initialForm);
              setEditingId(null);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingId ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default AddEnquiry;
