// src/utils/masterUtils.js

import axios from 'axios';
import BASE_URL from '../config';
import toast from 'react-hot-toast';

export const fetchAndStoreMasters = async () => {
  try {
    const institute_uuid = localStorage.getItem('institute_uuid');

    const [courses, educations, exams, paymentModes, batches] = await Promise.all([
      axios.get(`${BASE_URL}/api/courses`, { params: { institute_uuid } }),
      axios.get(`${BASE_URL}/api/education`, { params: { institute_uuid } }),
      axios.get(`${BASE_URL}/api/exams`, { params: { institute_uuid } }),
      axios.get(`${BASE_URL}/api/paymentmode`, { params: { institute_uuid } }),
      axios.get(`${BASE_URL}/api/batches`, { params: { institute_uuid } }),
    ]);

    localStorage.setItem('courses', JSON.stringify(courses.data.data || []));
    localStorage.setItem('educations', JSON.stringify(educations.data.data || []));
    localStorage.setItem('exams', JSON.stringify(exams.data.data || []));
    localStorage.setItem('paymentModes', JSON.stringify(paymentModes.data.data || []));
    localStorage.setItem('batches', JSON.stringify(batches.data.data || []));
  } catch (error) {
    console.error('Failed to fetch master data', error);
    toast.error('⚠️ Failed to fetch master data');
  }
};
