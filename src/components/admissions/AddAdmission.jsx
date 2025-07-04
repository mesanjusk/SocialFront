import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdmissionFormModal from "./AdmissionFormModal";
import ReceiptModal from "./ReceiptModal";
import jsPDF from 'jspdf';

const AddAdmission = () => {
  const [showModal, setShowModal] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const navigate = useNavigate();

  // Simple print handler (can use window.print or custom logic)
  const handlePrint = () => {
    // Print admission details in a new window, or use a print component
    window.print();
    setShowReceipt(false);
    navigate('/dashboard/allLeadByAdmission');
  };

  // Simple PDF download using jsPDF
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text('Admission Receipt', 10, 10);
    doc.text(`Student: ${receiptData.firstName} ${receiptData.lastName}`, 10, 20);
    doc.text(`Course: ${receiptData.course}`, 10, 30);
    doc.text(`Paid: ₹${receiptData.feePaid}`, 10, 40);
    doc.text(`Balance: ₹${receiptData.balance}`, 10, 50);
    doc.save('admission-receipt.pdf');
    setShowReceipt(false);
    navigate('/dashboard/allLeadByAdmission');
  };

  // On modal close (before submit)
  const handleClose = () => {
    setShowModal(false);
    navigate('/dashboard/allLeadByAdmission');
  };

  // On successful submit, show receipt
  const handleSuccess = (admissionData) => {
    setShowModal(false);
    setShowReceipt(true);
    setReceiptData(admissionData);
  };

  return (
    <>
      {showModal && (
        <AdmissionFormModal
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}
      {showReceipt && receiptData && (
        <ReceiptModal
          data={receiptData}
          onPrint={handlePrint}
          onDownload={handleDownload}
          onClose={() => {
            setShowReceipt(false);
            navigate('/dashboard/allLeadByAdmission');
          }}
        />
      )}
    </>
  );
};

export default AddAdmission;
