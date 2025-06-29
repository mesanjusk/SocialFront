import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchMetadata } from '../utils/api';

const MetadataContext = createContext({
  courses: [],
  educations: [],
  exams: [],
  batches: [],
  paymentModes: [],
  refresh: () => {},
  loading: false,
});

export const MetadataProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [educations, setEducations] = useState([]);
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const uuid = localStorage.getItem('institute_uuid');
      const data = await fetchMetadata(uuid);

      setCourses(Array.isArray(data.courses) ? data.courses : []);
      setEducations(Array.isArray(data.educations) ? data.educations : []);
      setExams(Array.isArray(data.exams) ? data.exams : []);
      setBatches(Array.isArray(data.batches) ? data.batches : []);
      setPaymentModes(Array.isArray(data.paymentModes) ? data.paymentModes : []);

      console.log("Metadata loaded:", data); // Debugging aid
    } catch (err) {
      console.warn('Failed to load metadata', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <MetadataContext.Provider
      value={{
        courses,
        educations,
        exams,
        batches,
        paymentModes,
        refresh: load,
        loading,
      }}
    >
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = () => useContext(MetadataContext);

export default MetadataProvider;
