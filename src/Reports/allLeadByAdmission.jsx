import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import BASE_URL from '../config';
import AdmissionFormModal from '../components/admissions/AdmissionFormModal';
import ConfirmAdmissionModal from '../components/admissions/ConfirmAdmissionModal';
import ManageBatchModal from '../components/common/ManageBatchModal';
import ManageExamModal from '../components/common/ManageExamModal';
import CertificateModal from '../components/admissions/CertificateModel';
import ReceiptModal from '../components/admissions/ReceiptModal';

// CSS to hide no-print elements on print
const style = `
@media print {
  .no-print { display: none !important; }
}
`;


const AllLeadByAdmission = () => {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [confirmLead, setConfirmLead] = useState(null);
   const [batchAdmission, setBatchAdmission] = useState(null);
    const [examAdmission, setExamAdmission] = useState(null);
   const [receiptData, setReceiptData] = useState(null);
   const [certificateData, setCertificateData] = useState(null);
  const [institute, setInstitute] = useState({});
  const navigate = useNavigate();
  const { username } = useParams();
  const institute_uuid = localStorage.getItem('institute_uuid');

  
// Institute/branding details
  const INSTITUTE = {
    name: institute?.name || "",
    contact: institute?.contact || "",
    code: institute?.code || "",
    logo: '/mnt/data/mkcl.png',
  };

  const fetchCourses = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/courses`, {
      params: { institute_uuid },
    });
    setCourses(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    toast.error('Failed to load courses');
  }
};

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/Leads`, {
        params: { institute_uuid },
      });
      const allLeads = Array.isArray(data?.data) ? data.data : [];
const leadsWithAdmission = allLeads.filter((lead) => !!lead.admission_uuid);
setLeads(leadsWithAdmission);

    } catch (error) {
      console.error('❌ Error fetching leads:', error.response?.data || error.message);
      toast.error('Error fetching leads');
    } finally {
      setLoading(false);
    }
  };
const fetchInstitute = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/institute/${institute_uuid}`);
      const inst = data?.result || data;
      setInstitute({
        name: inst.institute_title,
        contact: inst.institute_call_number,
        code: inst.gst,
        logo: (inst.theme && inst.theme.logo) || inst.institute_logo,
      });
    } catch (err) {
      console.error('Error fetching institute:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchCourses();
    fetchInstitute();
  }, []);
  
  const filteredLeads = leads.filter((a) => {
    const name = `${a.student?.firstName || ''} ${a.student?.lastName || ''}`.toLowerCase();
    const mobile = a.student?.mobileSelf || '';
    return name.includes(search.toLowerCase()) || mobile.includes(search);
  });

  const handleWhatsApp = (mobile, name) => {
    if (!mobile) return toast.error('Mobile number not available');
    const message = `Hello ${name || ''}, we are contacting you regarding your admission.`;
    window.open(`https://wa.me/91${mobile}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = (mobile) => {
    if (!mobile) return toast.error('Mobile number not available');
    window.open(`tel:${mobile}`);
  };

  const handleEditClick = async (lead) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/admissions/${lead.admission_uuid}`
    );
    const admission = data?.data || data;

    const enriched = {
      ...admission,
      studentData: lead.studentData || lead.student || {},
      course: admission.course || lead.course,
    };

    setEditLead(enriched);
    setSelectedLead(null);
  } catch (error) {
    console.error('Error fetching admission:', error);
    toast.error('Failed to load admission');
  }
};

const handleCertificateClick = async (lead) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/admissions/${lead.admission_uuid}`
    );
    const admission = data?.data || data;

    const enriched = {
      ...admission,
      studentData: lead.studentData || lead.student || {},
      course: admission.course || lead.course,
    };

    setCertificateData(enriched);
    setSelectedLead(null);
  } catch (error) {
    console.error('Error fetching admission:', error);
    toast.error('Failed to load admission');
  }
};

  const handleManageBatchClick = async (lead) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admissions/${lead.admission_uuid}`
      );
      const admission = data?.data || data;
      setBatchAdmission(admission);
      setSelectedLead(null);
    } catch (error) {
      console.error('Error fetching admission for batch:', error);
      toast.error('Failed to load admission');
    }
  };

   const handleManageExamClick = async (lead) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/admissions/${lead.admission_uuid}`
      );
      const admission = data?.data || data;
      setExamAdmission(admission);
      setSelectedLead(null);
    } catch (error) {
      console.error('Error fetching admission for exam:', error);
      toast.error('Failed to load admission');
    }
  };

  
const getCourseName = (courseId) => {
  const course = courses.find(
    (c) => c.Course_uuid === courseId || c._id === courseId
  );
  return course ? course.name : 'Course N/A';
};

const convertToWords = (num) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
  return formatter.format(num).replace('₹', '').trim() + ' Rupees';
};


  
const handleReceiptClick = () => {
  if (!receiptInfo || Object.keys(receiptInfo).length === 0) {
    return toast.error('Receipt info not available');
  }

  setReceiptData(receiptInfo);
};

const receiptInfo = selectedLead?.receiptInfo || {};

const handleSelectLead = async (lead) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/admissions/${lead.admission_uuid}`);
    const admission = data?.data || data;

    const { data: feesRes } = await axios.get(`${BASE_URL}/api/fees`, {
      params: { admission_uuid: lead.admission_uuid },
    });

    const feeRecord = Array.isArray(feesRes.data)
      ? feesRes.data.find((f) => f.admission_uuid === lead.admission_uuid)
      : null;

    const receiptInfo = {
      ...admission,
      learnerName: `${lead.studentData?.firstName || ''} ${lead.studentData?.lastName || ''}`,
      learnerCode: admission?.learnerCode || 'N/A',
      courseName: getCourseName(admission.course || lead.course),
      receiptDate: new Date().toLocaleDateString(),
      receiptNumber: admission?.receiptNumber || `R-${Math.floor(Math.random() * 100000)}`,
      examEvent: admission?.examEvent || 'August',
      amount: feeRecord?.feePaid?.toString() || '0',
      amountWords: convertToWords(feeRecord?.feePaid || 0),
      installmentPlan: feeRecord?.installmentPlan || [],
    };

    setSelectedLead({ ...lead, receiptInfo });
  } catch (error) {
    console.error('Failed to fetch admission for lead:', error);
    toast.error('Unable to fetch lead details');
  }
};



  return (
    <div className="p-4">
      <Toaster />

      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-3xl w-full max-h-[90vh] overflow-y-auto">
           <h2 className="text-lg font-bold mb-4">
  {(selectedLead.student?.firstName || selectedLead.studentData?.firstName) || ''}{" "}
  {(selectedLead.student?.lastName || selectedLead.studentData?.lastName) || ''}
</h2>

           
        
       
          <div className="flex flex-row justify-between items-start mb-2">
            {/* Logo and Info */}
            <div className="flex flex-col items-start" style={{ width: 130 }}>
              <img src={institute.logo} alt="Logo" className="w-16 h-16 mb-1" />
              <div className="text-xs font-semibold text-yellow-800 leading-tight">{institute.tagline}</div>
              <div className="text-xs text-gray-500">{institute.website}</div>
            </div>

            <div className="flex-1 flex flex-col items-end gap-0">
              <div className="text-xs font-semibold text-gray-800">ALC Name - <span className="font-bold uppercase">{institute.name}</span></div>
              <div className="text-xs font-semibold text-gray-800">ALC Contact Person - <span className="font-bold">{institute.contact}</span></div>
              <div className="text-xs font-semibold text-gray-800">ALC Code - <span className="font-bold">{institute.code}</span></div>
            </div>
          </div>

          <hr className="my-1 border-gray-200" />

          {/* Receipt Info */}
          <div className="flex flex-row justify-between items-center text-xs mb-4">
            <div></div>
            <div>
              <span className="font-semibold">Receipt Date: </span>{receiptInfo.receiptDate}<br />
              <span className="font-semibold">Receipt Number: </span>{receiptInfo.receiptNumber}
            </div>
          </div>

          {/* Course Info */}
          <div className="mt-3 mb-2">
            <span className="text-lg font-semibold">Course Name:</span>
            <span className="text-lg font-bold"> {receiptInfo.courseName}</span>
          </div>

          {/* Learner Info */}
          <div className="mb-3">
            <div><span className="font-semibold">Name of the Learner: </span>
              <span className="font-bold uppercase"> {receiptInfo.learnerName}</span></div>
            <div><span className="font-semibold">Learner Code: </span>
              <span className="font-bold">{receiptInfo.learnerCode}</span></div>
            <div><span className="font-semibold">Examination Event: </span>
              <span className="font-bold">{receiptInfo.examEvent}</span></div>
          </div>

          {/* Amount */}
          <div className="bg-gray-100 rounded-md px-4 py-3 mb-3">
            <div className="text-base font-medium">Amount Received:</div>
            <div className="mt-1 font-bold">{receiptInfo.amountWords}</div>
          </div>

          {/* Amount in Words */}
          <div className="bg-gray-100 rounded-md px-4 py-3 mb-2">
            <div className="text-base font-medium">Amount in Words:</div>
            <div className="mt-1 font-bold">{receiptInfo.amountWords}</div>
          </div>

          {/* Installment Plan Table */}
          <div className="bg-gray-100 rounded-md px-4 py-3 mb-2">
            <div className="text-base font-medium">Installment:</div>
            <table className="w-full border mt-2 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">#</th>
                  <th className="border px-2 py-1">Due Date</th>
                  <th className="border px-2 py-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(receiptInfo.installmentPlan || []).map((p) => (

                  <tr key={p.installmentNo}>
                    <td className="border px-2 py-1 text-center">{p.installmentNo}</td>
                    <td className="border px-2 py-1">{p.dueDate}</td>
                    <td className="border px-2 py-1 text-right">{p.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
      

            <div className="flex gap-2">
              <button
                   onClick={() => handleEditClick(selectedLead)}
                className="bg-yellow-500 text-white px-4 py-2 rounded text-sm"
              >
                Edit
              </button>
               <button
                onClick={() => handleManageBatchClick(selectedLead)}
                className="bg-purple-600 text-white px-4 py-2 rounded text-sm"
              >
                Manage Batch
              </button>
               <button
                onClick={() => handleManageExamClick(selectedLead)}
                className="bg-pink-600 text-white px-4 py-2 rounded text-sm"
              >
                Manage Exam
              </button>
             <button
  onClick={async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/admissions/${selectedLead.admission_uuid}`);
      const admission = data?.data || data;

      const enriched = {
        ...admission,
        student: selectedLead.student || selectedLead.studentData || {},
        course: selectedLead.course,
      };

      setConfirmLead(enriched);
      setSelectedLead(null);
    } catch (error) {
      console.error('Failed to fetch admission:', error);
      toast.error('Unable to fetch admission details');
    }
  }}
  className="bg-green-600 text-white px-4 py-2 rounded text-sm"
>
  Confirm
</button>

                 <button
                onClick={() => handleReceiptClick(selectedLead)}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                Download Receipt
              </button>
               <button
                onClick={() => handleCertificateClick(selectedLead)}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                Certificate
              </button>
              <button
                onClick={() => setSelectedLead(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded text-sm ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap sm:flex-nowrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or mobile"
          className="border p-2 rounded w-full max-w-xs"
        />
        <button
          onClick={() => navigate(`/${username}/addNewAdd`)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + New Admission
        </button>
      </div>

      {loading && <div>Loading admissions...</div>}
     {!loading && filteredLeads.length === 0 && <div>No leads with admissions found.</div>}

      {!loading && filteredLeads.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-10 gap-4">
          {filteredLeads.map((admission) => (
            <div
              key={admission._id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              onClick={() => handleSelectLead(admission)}

            >
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  {admission.studentData?.firstName} {admission.studentData?.lastName}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {getCourseName(admission.course)}
                </p>
              </div>
              <div className="flex justify-end items-center gap-3 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWhatsApp(admission.student?.mobileSelf, admission.student?.firstName);
                  }}
                  className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
                  title="WhatsApp"
                >
                  <FaWhatsapp />
                </button>
                
              </div>
            </div>
          ))}
        </div>
      )}
       {editLead && (
        <AdmissionFormModal
          editingData={editLead}
          onClose={() => setEditLead(null)}
          onSuccess={() => {
            setEditLead(null);
            fetchLeads();
          }}
        />
      )}
      {confirmLead && (
        <ConfirmAdmissionModal
          admission={confirmLead}
          onClose={() => setConfirmLead(null)}
          onUpdated={() => {
            setConfirmLead(null);
            fetchLeads();
          }}
        />
      )}     {batchAdmission && (
        <ManageBatchModal
          admission={batchAdmission}
          onClose={() => setBatchAdmission(null)}
          onUpdated={() => {
            setBatchAdmission(null);
            fetchLeads();
          }}
        />
      )}
       {examAdmission && (
        <ManageExamModal
          admission={examAdmission}
          onClose={() => setExamAdmission(null)}
          onUpdated={() => {
            setExamAdmission(null);
            fetchLeads();
          }}
        />
      )}
      {receiptData && (
        <ReceiptModal
          data={receiptData}
          institute={institute}
          onClose={() => setReceiptData(null)}
        />
      )}
       {certificateData && (
        <CertificateModal
          certificate={certificateData}
          onClose={() => setCertificateData(null)}
          onSuccess={() => {
            setCertificateData(null);
            fetchLeads();
          }}
        />
      )}
    </div>
  );
};

export default AllLeadByAdmission;