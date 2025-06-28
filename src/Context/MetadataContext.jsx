import React, { createContext, useContext, useEffect, useState } from 'react';
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
  const [state, setState] = useState({
    courses: [],
    educations: [],
    exams: [],
    batches: [],
    paymentModes: [],
  });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const uuid = localStorage.getItem('institute_uuid');
      const data = await fetchMetadata(uuid);
      setState({
        courses: Array.isArray(data.courses) ? data.courses : [],
        educations: Array.isArray(data.educations) ? data.educations : [],
        exams: Array.isArray(data.exams) ? data.exams : [],
        batches: Array.isArray(data.batches) ? data.batches : [],
        paymentModes: Array.isArray(data.paymentModes) ? data.paymentModes : [],
      });
    } catch (err) {
      console.warn('Failed to load metadata', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <MetadataContext.Provider value={{ ...state, refresh: load, loading }}>
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = () => useContext(MetadataContext);

export default MetadataProvider;
