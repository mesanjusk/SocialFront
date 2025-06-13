import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AddEnquiry = ({ themeColor = 'bg-blue-600' }) => {
  const [form, setForm] = useState({
    branchCode: '44210066',
    enquiryDate: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '',
    mobileSelf: '',
    mobileSelfWhatsapp: false,
    mobileParent: '',
    mobileParentWhatsapp: false,
    address: '',
    education: '',
    schoolName: '',
    referredBy: '',
    followUpDate: '',
    remarks: '',
    course: '',
  });

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://socialbackend-iucy.onrender.com/api/enquiry', form);
      toast.success('Enquiry added successfully');
      setForm({ ...form, firstName: '', middleName: '', lastName: '', mobileSelf: '' }); 
    } catch (error) {
      console.error(error);
      toast.error('Error submitting enquiry');
    }
  };

  return (
    <div className="p-4">
      <Toaster />
      <h2 className={`text-2xl font-bold mb-4 ${themeColor.replace('bg-', 'text-')}`}>
        Add New Enquiry
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input value={form.enquiryDate} type="date" onChange={handleChange('enquiryDate')} className="border p-2" required />
        <input value={form.firstName} placeholder="First Name" onChange={handleChange('firstName')} className="border p-2" required />
        <input value={form.middleName} placeholder="Middle Name" onChange={handleChange('middleName')} className="border p-2" />
        <input value={form.lastName} placeholder="Last Name" onChange={handleChange('lastName')} className="border p-2" />
        <input value={form.dob} type="date" onChange={handleChange('dob')} className="border p-2" required />

        <div className="flex items-center gap-2">
          <label><input type="radio" name="gender" value="Male" onChange={handleChange('gender')} /> Male</label>
          <label><input type="radio" name="gender" value="Female" onChange={handleChange('gender')} /> Female</label>
        </div>

        <div>
          <input value={form.mobileSelf} placeholder="Mobile No. (Self)" onChange={handleChange('mobileSelf')} className="border p-2 w-full" />
          <label><input type="checkbox" checked={form.mobileSelfWhatsapp} onChange={handleChange('mobileSelfWhatsapp')} /> WhatsApp</label>
        </div>

        <div>
          <input value={form.mobileParent} placeholder="Mobile No. (Parent)" onChange={handleChange('mobileParent')} className="border p-2 w-full" />
          <label><input type="checkbox" checked={form.mobileParentWhatsapp} onChange={handleChange('mobileParentWhatsapp')} /> WhatsApp</label>
        </div>

        <input value={form.address} placeholder="Address" onChange={handleChange('address')} className="border p-2" />
        <input value={form.education} placeholder="Education" onChange={handleChange('education')} className="border p-2" />
        <input value={form.schoolName} placeholder="School Name" onChange={handleChange('schoolName')} className="border p-2" />
        <input value={form.referredBy} placeholder="Referred By" onChange={handleChange('referredBy')} className="border p-2" />
        <input value={form.followUpDate} type="date" onChange={handleChange('followUpDate')} className="border p-2" />
        <textarea value={form.remarks} placeholder="Remarks" onChange={handleChange('remarks')} className="border p-2 col-span-2" />
        <select value={form.course} onChange={handleChange('course')} className="border p-2">
          <option value="">Select Course</option>
          <option value="MS-CIT">MS-CIT</option>
          <option value="Tally">KLiC Certificate in Tally Prime</option>
        </select>

        <button
          type="submit"
          className={`col-span-2 ${themeColor} text-white py-2 rounded hover:opacity-90 transition`}
        >
          Add Enquiry
        </button>
      </form>
    </div>
  );
};

export default AddEnquiry;
