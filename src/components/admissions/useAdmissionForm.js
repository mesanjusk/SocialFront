import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from '../../config';

const useAdmissionForm = (onClose, setTab) => {
  const nextMonthDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().substring(0, 10);
  })();

  const initialForm = {
    branchCode: '',
    admissionDate: new Date().toISOString().substring(0, 10),
    emiDate: nextMonthDate,
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
    examEvent: '',
    course: '',
    batchTime: '',
    installment: '',
    fees: '',
    discount: '',
    total: '',
    feePaid: '',
    paidBy: '',
    balance: '',
    emi: ''
  };

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [installmentPlan, setInstallmentPlan] = useState([]);
  const [courses, setCourses] = useState([]);
  const [educations, setEducations] = useState([]);
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);

  const themeColor = localStorage.getItem('theme_color') || '#10B981';
  const institute_uuid = localStorage.getItem('institute_uuid');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, e, ex, b, p] = await Promise.all([
          axios.get(`${BASE_URL}/api/courses`),
          axios.get(`${BASE_URL}/api/education`),
          axios.get(`${BASE_URL}/api/exams`),
          axios.get(`${BASE_URL}/api/batches`),
          axios.get(`${BASE_URL}/api/paymentmode`)
        ]);
        setCourses(c.data || []);
        setEducations(e.data || []);
        setExams(ex.data || []);
        setBatches(b.data || []);
        setPaymentModes(p.data || []);
      } catch {
        toast.error('Failed to load master data');
      }
    };
    fetchData();
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    let updatedForm = { ...form, [field]: value };

    if (field === 'admissionDate') {
      const d = new Date(value);
      d.setMonth(d.getMonth() + 1);
      const nextMonth = d.toISOString().substring(0, 10);
      const prevDefault = (() => {
        const pd = new Date(form.admissionDate);
        pd.setMonth(pd.getMonth() + 1);
        return pd.toISOString().substring(0, 10);
      })();
      if (form.emiDate === prevDefault || form.emiDate === '') {
        updatedForm.emiDate = nextMonth;
      }
    }

    if (field === 'course') {
      const selectedCourse = courses.find(c => c.name === value || c.uuid === value);
      const courseFee = Number(selectedCourse?.courseFees || 0);
      const discount = Number(form.discount || 0);
      const feePaid = Number(form.feePaid || 0);
      const total = courseFee - discount;
      const balance = total - feePaid;
      updatedForm = { ...updatedForm, fees: courseFee, total, balance };
    }

    const fees = Number(field === 'fees' ? value : form.fees || 0);
    const discount = Number(field === 'discount' ? value : form.discount || 0);
    const feePaid = Number(field === 'feePaid' ? value : form.feePaid || 0);

    if (['fees', 'discount', 'feePaid'].includes(field)) {
      const total = fees - discount;
      const balance = total - feePaid;
      updatedForm = { ...updatedForm, fees, discount, feePaid, total, balance };
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!institute_uuid) return toast.error('Missing institute ID');

    const mobileRegex = /^\d{10}$/;
    if (form.mobileSelf && !mobileRegex.test(form.mobileSelf)) return toast.error('Enter valid self mobile number');
    if (form.mobileParent && !mobileRegex.test(form.mobileParent)) return toast.error('Enter valid parent mobile number');

    const fees = Number(form.fees || 0);
    const discount = Number(form.discount || 0);
    const feePaid = Number(form.feePaid || 0);
    const total = fees - discount;
    if (discount > fees) return toast.error('Discount cannot exceed fees');
    if (feePaid > total) return toast.error('Fee paid cannot exceed total');

    const payload = {
      ...form,
      institute_uuid,
      type: 'admission',
      fees,
      discount,
      total,
      feePaid,
      balance: Number(form.balance || 0),
      emi: Number(form.emi || 0),
      installmentPlan,
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
      setInstallmentPlan([]);
      setTab(0);
      onClose();
    } catch {
      toast.error('Error saving admission');
    }
  };

  useEffect(() => {
    const inst = parseInt(form.installment, 10);
    const fees = Number(form.fees || 0);
    const discount = Number(form.discount || 0);
    const feePaid = Number(form.feePaid || 0);
    const bal = fees - discount - feePaid;

    if (!inst || inst <= 0 || bal <= 0) {
      setInstallmentPlan([]);
      if (form.emi !== '') setForm(prev => ({ ...prev, emi: '' }));
      return;
    }

    const emi = parseFloat((bal / inst).toFixed(2));
    const plan = [];
    let remaining = bal;
    const start = form.emiDate ? new Date(form.emiDate) : (() => { const d = new Date(form.admissionDate); d.setMonth(d.getMonth() + 1); return d; })();

    for (let i = 0; i < inst; i++) {
      const due = new Date(start);
      due.setMonth(due.getMonth() + i);
      const amount = i + 1 === inst ? parseFloat(remaining.toFixed(2)) : emi;
      remaining = parseFloat((remaining - amount).toFixed(2));
      plan.push({ installmentNo: i + 1, dueDate: due.toISOString().split('T')[0], amount });
    }

    setInstallmentPlan(plan);
    if (form.emi !== emi) setForm(prev => ({ ...prev, emi }));
  }, [form.installment, form.fees, form.discount, form.feePaid, form.admissionDate, form.emiDate]);

  return {
    form,
    handleChange,
    handleSubmit,
    installmentPlan,
    courses,
    educations,
    exams,
    batches,
    paymentModes,
    editingId,
    themeColor,
  };
};

export default useAdmissionForm;
