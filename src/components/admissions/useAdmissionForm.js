
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from '../../config';

const useAdmissionForm = (onClose) => {
  const [form, setForm] = useState({});
  const [tab, setTab] = useState(0);
  const [installmentPlan, setInstallmentPlan] = useState([]);
  const [courses, setCourses] = useState([]);
  const [educations, setEducations] = useState([]);
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [editingId, setEditingId] = useState(null);
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
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!institute_uuid) return toast.error('Missing institute ID');

    try {
      // Example submit payload
      const payload = { ...form, institute_uuid };
      await axios.post(`${BASE_URL}/api/admissions`, payload);
      toast.success('Admission saved');
      setForm({});
      setTab(0);
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save admission');
    }
  };

  return {
    form,
    tab,
    setTab,
    handleChange,
    handleSubmit,
    installmentPlan,
    courses,
    educations,
    exams,
    batches,
    paymentModes,
    editingId,
    themeColor
  };
};

export default useAdmissionForm;
