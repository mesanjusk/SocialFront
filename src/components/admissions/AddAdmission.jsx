import React, { useState } from 'react';
import AdmissionFormModal from './AdmissionFormModal';

const AddAdmission = () => {
  const [showModal, setShowModal] = useState(true);

  if (!showModal) return null;

  return (
    <AdmissionFormModal
      onClose={() => setShowModal(false)}
    />
  );
};

export default AddAdmission;
