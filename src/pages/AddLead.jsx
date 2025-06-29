import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LeadFormModal from '../components/leads/LeadFormModal';

const AddLead = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const { username } = useParams();

  const handleClose = () => {
    setShowModal(false);
    navigate(`/${username}/leads`); // ✅ Return to Leads page after adding
  };

  if (!showModal) return null;

  return (
    <LeadFormModal
      onClose={handleClose}
      onSuccess={() => {
        // Optionally trigger toast here or refresh parent on success
      }}
    />
  );
};

export default AddLead;
