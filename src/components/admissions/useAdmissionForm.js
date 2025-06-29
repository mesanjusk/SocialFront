// ✅ 1️⃣ useAdmissionForm.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from '../../config';


const useAdmissionForm = (onClose, setTab) => {
  const [form, setForm] = useState({
    branchCode: '', admissionDate: new Date().toISOString().substring(0, 10), emiDate: '',
    firstName: '', middleName: '', lastName: '', dob: '', gender: '',
    mobileSelf: '', mobileSelfWhatsapp: false, mobileParent: '', mobileParentWhatsapp: false, address: '',
    education: '', examEvent: '', course: '', batchTime: '',
    installment: '', fees: '', discount: '', total: '', feePaid: '', paidBy: '', balance: '', emi: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [installmentPlan, setInstallmentPlan] = useState([]);
  const [courses, setCourses] = useState([]);
  const [educations, setEducations] = useState([]);
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const themeColor = localStorage.getItem('theme_color') || '#10B981';

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success('Admission Saved');
    onClose();
    setTab(0);
  };

  useEffect(() => {
    axios.get(`${BASE_URL}/api/courses`).then(res => setCourses(res.data)).catch(() => {});
    axios.get(`${BASE_URL}/api/education`).then(res => setEducations(res.data)).catch(() => {});
    axios.get(`${BASE_URL}/api/exams`).then(res => setExams(res.data)).catch(() => {});
    axios.get(`${BASE_URL}/api/batches`).then(res => setBatches(res.data)).catch(() => {});
    axios.get(`${BASE_URL}/api/paymentmode`).then(res => setPaymentModes(res.data)).catch(() => {});
  }, []);

  return {
    form, handleChange, handleSubmit, installmentPlan, editingId, themeColor,
    paymentModes, courses, educations, exams, batches
  };
};

export default useAdmissionForm;
