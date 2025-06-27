import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';

const Followup = () => {
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
  const [actionModal, setActionModal] = useState(null);
  const institute_uuid = localStorage.getItem('institute_uuid');
  const themeColor = localStorage.getItem('theme_color') || '#10B981';

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleAdmissionChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    let updated = { ...admissionForm, [field]: value };

    const fees = Number(field === 'fees' ? value : updated.fees || 0);
    const discount = Number(field === 'discount' ? value : updated.discount || 0);
    const feePaid = Number(field === 'feePaid' ? value : updated.feePaid || 0);

    updated.total = fees - discount;
    updated.balance = updated.total - feePaid;

    setAdmissionForm(updated);
  };

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/record/${institute_uuid}?type=enquiry`);
      setEnquiries(res.data || []);
    } catch {
      toast.error('Failed to fetch enquiries');
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/courses?institute_uuid=${institute_uuid}`);
      setCourses(res.data || []);
    } catch {
      toast.error('Failed to load courses');
    }
  };

  const fetchEducations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/education`);
      setEducations(res.data || []);
    } catch {
      toast.error('Failed to load education options');
    }
  };

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/exams`);
      setExams(res.data || []);
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
      setPaymentModes(res.data || []);
    } catch {
      toast.error('Failed to load payment modes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!institute_uuid) return toast.error("Missing institute UUID");
    const payload = {
  ...form,
  institute_uuid: institute_uuid,
  type: 'enquiry'
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
    const fill = {
      ...admissionTemplate,
      ...e,
      admissionDate: new Date().toISOString().split('T')[0]
    };
    setAdmissionForm(fill);
    setEnquiryToDeleteId(e.uuid); 
    setShowAdmission(true);
  };

  const submitAdmission = async (e) => {
    e.preventDefault();
    if (!institute_uuid)return toast.error("Missing institute ID");

    const payload = {
      institute_uuid: institute_uuid,
      admissionData: {
        admissionDate: admissionForm.admissionDate,
        course: admissionForm.course,
        batchTime: admissionForm.batchTime,
        examEvent: admissionForm.examEvent,
        installment: admissionForm.installment,
        fees: Number(admissionForm.fees || 0),
        discount: Number(admissionForm.discount || 0),
        total: Number(admissionForm.total || 0),
        feePaid: Number(admissionForm.feePaid || 0),
        paidBy: admissionForm.paidBy,
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
    } catch (err) {
      toast.error('Failed to convert to admission');
    }
  };

  useEffect(() => {
    fetchEnquiries();
    fetchCourses();
    fetchEducations();
    fetchExams();
    fetchBatches();
    fetchPaymentModes();
  }, []);

  const filtered = enquiries.filter(e =>
    e.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    e.mobileSelf?.includes(search)
  );
  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: themeColor }}>
      <Toaster />
      <div className="flex gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" className="border p-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((e) => (
          <div
            key={e._id}
            className="bg-white p-4 rounded shadow cursor-pointer hover:ring hover:ring-blue-400"
            onClick={() => setActionModal(e)}
          >
            <div className="font-semibold text-lg">
              {e.firstName} {e.lastName}
            </div>
            <div className="text-gray-600 text-sm">📞 {e.mobileSelf}</div>
            <div className="text-gray-500 text-xs">
              {e.course || 'No course selected'}
            </div>
          </div>
        ))}
      </div>

      {/* Admission Convert Modal */}
      {showAdmission && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow max-w-xl w-full max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Convert to Admission</h2>
      <form onSubmit={submitAdmission} className="flex flex-col gap-3">

        <input type="date" value={admissionForm.admissionDate} onChange={handleAdmissionChange('admissionDate')} className="border p-2" />

        <input value={admissionForm.firstName} onChange={handleAdmissionChange('firstName')} placeholder="First Name" className="border p-2" />
        <input value={admissionForm.middleName} onChange={handleAdmissionChange('middleName')} placeholder="Middle Name" className="border p-2" />
        <input value={admissionForm.lastName} onChange={handleAdmissionChange('lastName')} placeholder="Last Name" className="border p-2" />

        <input type="date" value={admissionForm.dob?.substring(0, 10)} onChange={handleAdmissionChange('dob')} className="border p-2" />
        
        <div className="flex gap-4">
          <label><input type="radio" name="gender" value="Male" checked={admissionForm.gender === 'Male'} onChange={handleAdmissionChange('gender')} /> Male</label>
          <label><input type="radio" name="gender" value="Female" checked={admissionForm.gender === 'Female'} onChange={handleAdmissionChange('gender')} /> Female</label>
        </div>

        <input
          placeholder="Mobile (Self)"
          value={admissionForm.mobileSelf}
          onChange={handleAdmissionChange('mobileSelf')}
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          className="border p-2"
        />
        <input
          placeholder="Mobile (Parent)"
          value={admissionForm.mobileParent}
          onChange={handleAdmissionChange('mobileParent')}
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          className="border p-2"
        />
        <input placeholder="Address" value={admissionForm.address} onChange={handleAdmissionChange('address')} className="border p-2" />

        <select value={admissionForm.education} onChange={handleAdmissionChange('education')} className="border p-2">
          <option value="">-- Select Education --</option>
          {educations.map(e => <option key={e._id} value={e.education}>{e.education}</option>)}
        </select>

        <select
          value={admissionForm.course}
          onChange={(e) => {
            const selectedCourse = courses.find(c => c.name === e.target.value);
            const courseFee = Number(selectedCourse?.courseFees || 0);
            const discount = Number(admissionForm.discount || 0);
            const feePaid = Number(admissionForm.feePaid || 0);
            const total = courseFee - discount;
            const balance = total - feePaid;

            setAdmissionForm(prev => ({
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
          {courses.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select>

        <select value={admissionForm.batchTime} onChange={handleAdmissionChange('batchTime')} className="border p-2">
          <option value="">-- Select Batch --</option>
          {batches.map(b => (
            <option key={b._id} value={b.time || b.batchTime || b.name || ''}>
              {b.time || b.batchTime || b.name || 'Unnamed Batch'}
            </option>
          ))}
        </select>

        <select value={admissionForm.examEvent} onChange={handleAdmissionChange('examEvent')} className="border p-2">
          <option value="">-- Select Exam --</option>
          {exams.map(e => <option key={e._id} value={e.exam}>{e.exam}</option>)}
        </select>

        <input placeholder="Installment" value={admissionForm.installment} onChange={handleAdmissionChange('installment')} className="border p-2" />
        <input placeholder="Fees" value={admissionForm.fees} type="number" className="border p-2" readOnly />
        <input placeholder="Discount" value={admissionForm.discount} type="number" onChange={handleAdmissionChange('discount')} className="border p-2" />
        <input placeholder="Total" value={admissionForm.total} type="number" className="border p-2" readOnly />
        <input placeholder="Fee Paid" value={admissionForm.feePaid} type="number" onChange={handleAdmissionChange('feePaid')} className="border p-2" />

        <select value={admissionForm.paidBy} onChange={handleAdmissionChange('paidBy')} className="border p-2">
          <option value="">-- Select Payment Mode --</option>
          {paymentModes.map(p => <option key={p._id} value={p.mode}>{p.mode}</option>)}
        </select>

        <input placeholder="Balance" value={admissionForm.balance} type="number" className="border p-2" readOnly />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setShowAdmission(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  </div>
  )}

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-sm w-full">
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
                onClick={() => {
                  handleConvert(actionModal);
                  setActionModal(null);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm"
              >
                Convert
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

export default Followup;
