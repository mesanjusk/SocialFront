import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdmissionFormModal from "./AdmissionFormModal";

const AddAdmission = () => {
  const [showModal, setShowModal] = useState(true); // Modal opens by default
  const navigate = useNavigate();

  // When modal closes, redirect to All Leads by Admission page
  const handleClose = () => {
    setShowModal(false);
    navigate('/dashboard/allLeadByAdmission'); // Change this route as per your route setup
  };

  // Only show modal if true
  return (
    <>
      {showModal && <AdmissionFormModal onClose={handleClose} />}
    </>
  );
};

export default AddAdmission;
