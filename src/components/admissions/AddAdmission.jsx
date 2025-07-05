import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdmissionFormModal from "./AdmissionFormModal";
import ReceiptModal from "./ReceiptModal";
import jsPDF from 'jspdf';
import axios from 'axios';
import BASE_URL from '../../config';

const AddAdmission = () => {
  const [showModal, setShowModal] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Name maps:
  const [studentsMap, setStudentsMap] = useState({});
  const [coursesMap, setCoursesMap] = useState({});
  const [institute, setInstitute] = useState({});

  const navigate = useNavigate();

  // Fetch and build maps on mount
  useEffect(() => {
    // Students map
    axios.get(`${BASE_URL}/api/students?institute_uuid=${localStorage.getItem('institute_uuid')}`)
      .then(res => {
        const map = {};
        res.data.forEach(s => {
          map[s.uuid || s._id] = `${s.firstName || ''} ${s.lastName || ''}`.trim();
        });
        setStudentsMap(map);
      });

    // Courses map
    axios.get(`${BASE_URL}/api/courses`)
      .then(res => {
        const map = {};
        res.data.forEach(c => {
          map[c.uuid || c._id] = c.name || c.title;
        });
        setCoursesMap(map);
      });

    // Institute branding
    axios.get(`${BASE_URL}/api/institute/${localStorage.getItem('institute_uuid')}`)
      .then(res => {
        const i = res.data.result;
        setInstitute({
          name: i.institute_title,
          address: i.address,
          phone: i.institute_call_number,
          gst: i.gst,
          logo: (i.theme && i.theme.logo) || i.institute_logo,
          brandColor: (i.theme && i.theme.color) || "#1E40AF"
        });
      });
  }, []);

  // DEBUG: Show what your maps and receiptData look like
  useEffect(() => {
    if (receiptData) {
      console.log('=== RECEIPT DATA ===', receiptData);
      console.log('studentsMap', studentsMap);
      console.log('coursesMap', coursesMap);
    }
  }, [receiptData, studentsMap, coursesMap]);

  const handlePrint = () => {
    window.print();
    setShowReceipt(false);
    navigate('/dashboard/allLeadByAdmission');
  };

  // Custom PDF download (optional, modal has its own)
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

  // On modal close
  const handleClose = () => {
    setShowModal(false);
    navigate('/dashboard/allLeadByAdmission');
  };

  // On successful admission, show receipt
  const handleSuccess = (admissionData) => {
    // Merge in uuid fields for mapping if not present
    setShowModal(false);
    setShowReceipt(true);

    setReceiptData({
      ...admissionData,
      // Add uuid fields if you only have names in admissionData
      student_uuid: admissionData.student_uuid || admissionData.student?.uuid,
      course_uuid: admissionData.course_uuid || admissionData.course, // if course is uuid
    });
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
          studentsMap={studentsMap}
          coursesMap={coursesMap}
          institute={institute}
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
