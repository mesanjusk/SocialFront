
import React, { useState } from 'react';
import AdmissionFormModal from './AdmissionFormModal';

const AddAdmission = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    showModal && (
      <AdmissionFormModal onClose={() => setShowModal(false)} />
    )
  );
};

export default AddAdmission;

