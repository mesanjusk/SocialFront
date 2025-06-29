import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EnquiryFormModal from '../components/admissions/EnquiryFormModal';

const AddEnquiry = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const { username } = useParams();

  const handleClose = () => {
    setShowModal(false);
    navigate(`/${username}/enquiry`); // Safely return to Enquiry page
  };

  if (!showModal) return null;

  return <EnquiryFormModal onClose={handleClose} />;
};

export default AddEnquiry;
