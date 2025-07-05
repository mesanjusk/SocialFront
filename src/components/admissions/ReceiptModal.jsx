import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Props:
 * - data: { ... } // All receipt fields (real DB data)
 * - institute: { name, address, phone, gst, logo, brandColor } // Institute branding (from API)
 * - onPrint, onClose: functions
 */
const ReceiptModal = ({ data, institute = {}, onPrint, onClose }) => {
  const receiptRef = useRef();

  // Fallbacks if some branding fields missing
  const INSTITUTE = {
    name: institute?.name || 'Bharat Institute of Excellence',
    address: institute?.address || 'MG Road, Gondia, Maharashtra - 441601',
    phone: institute?.phone || '+91 98765 43210',
    gst: institute?.gst || 'GSTIN: 27AABBC1234F1Z5',
    logo: institute?.logo || 'https://i.imgur.com/4M34hi2.png',
    brandColor: institute?.brandColor || '#1E40AF'
  };

  // PDF download logic
  const handleDownloadPDF = async () => {
    const input = receiptRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`Receipt-${data?.receiptNo || data?.uuid || '0001'}.pdf`);
  };

  // Smart date handling (prefer actual payment date)
  const receiptDate = data?.paymentDate
    ? new Date(data.paymentDate)
    : data?.createdAt
    ? new Date(data.createdAt)
    : new Date();

  // Render
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 print:bg-transparent">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-0 overflow-hidden print:shadow-none print:rounded-none" ref={receiptRef}>
        {/* HEADER */}
        <div
          className="border-b-2 border-dashed border-gray-400 px-6 py-4 flex flex-col items-center bg-gradient-to-r"
          style={{
            background: `linear-gradient(90deg, ${INSTITUTE.brandColor}11 0%, #fff 100%)`
          }}
        >
          <img src={INSTITUTE.logo} alt="Institute Logo" className="h-14 mb-1" />
          <h2 className="text-xl font-bold tracking-wide text-gray-800">{INSTITUTE.name}</h2>
          <div className="text-xs text-gray-600">{INSTITUTE.address}</div>
          <div className="text-xs text-gray-500 mb-1">{INSTITUTE.phone}</div>
          <div className="text-xs text-gray-400 mb-2">{INSTITUTE.gst}</div>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>
              Receipt No: <b>{data?.receiptNo || data?.uuid || 'R-0001'}</b>
            </span>
            <span>
              Date: {receiptDate.toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 print:p-4 text-sm">
          <div className="mb-1 flex justify-between">
            <span className="font-semibold">Student Name:</span>
            <span>
              {data?.student_name ||
                [data?.firstName, data?.lastName].filter(Boolean).join(' ') ||
                data?.studentName ||
                '-'}
            </span>
          </div>
          <div className="mb-1 flex justify-between">
            <span className="font-semibold">Mobile:</span>
            <span>{data?.mobileSelf || data?.mobile || data?.student_mobile || '-'}</span>
          </div>
          <div className="mb-1 flex justify-between">
            <span className="font-semibold">Course:</span>
            <span>{data?.course || data?.course_name || '-'}</span>
          </div>
          <div className="mb-1 flex justify-between">
            <span className="font-semibold">Admission Date:</span>
            <span>
              {data?.admissionDate
                ? new Date(data.admissionDate).toLocaleDateString()
                : data?.student_admission_date
                ? new Date(data.student_admission_date).toLocaleDateString()
                : '-'}
            </span>
          </div>
          <div className="mb-1 flex justify-between">
            <span className="font-semibold">Payment Mode:</span>
            <span>{data?.paidBy || data?.payment_mode || 'Cash'}</span>
          </div>
          <div className="mb-1 flex justify-between">
            <span className="font-semibold">Description:</span>
            <span>{data?.description || data?.desc || '-'}</span>
          </div>
          <hr className="my-3 border-dashed border-gray-300" />
          <div className="mb-1 flex justify-between">
            <span>Paid Amount</span>
            <span className="font-bold text-green-700">
              ₹
              {data?.feePaid ||
                data?.feesPaid ||
                data?.fees ||
                data?.amount ||
                '-'}
            </span>
          </div>
          <div className="mb-1 flex justify-between">
            <span>Total Fees</span>
            <span>
              ₹
              {data?.feeTotal ||
                data?.total ||
                (data?.feePaid && data?.balance
                  ? (parseFloat(data.feePaid) + parseFloat(data.balance)).toFixed(2)
                  : '-')}
            </span>
          </div>
          <div className="mb-1 flex justify-between">
            <span>Balance</span>
            <span className="font-bold text-red-700">
              ₹
              {data?.balance ||
                (data?.feeTotal && data?.feePaid
                  ? (parseFloat(data.feeTotal) - parseFloat(data.feePaid)).toFixed(2)
                  : data?.total && data?.feesPaid
                  ? (parseFloat(data.total) - parseFloat(data.feesPaid)).toFixed(2)
                  : '-')}
            </span>
          </div>
          {data?.remarks && (
            <div className="mt-2 flex justify-between">
              <span className="font-semibold">Remarks:</span>
              <span>{data.remarks}</span>
            </div>
          )}
          <div className="mt-6 text-center text-gray-600">
            <span>Thank you for your payment!</span>
          </div>
          <div className="mt-8 flex justify-between items-end print:mt-4">
            <div>
              <div className="text-xs text-gray-400">Receiver’s Signature</div>
              <div className="h-8 border-b border-gray-400 w-40"></div>
            </div>
            <div className="text-xs text-gray-400">{INSTITUTE.name}</div>
          </div>
        </div>

        {/* FOOTER: Actions (hidden on print) */}
        <div className="bg-gray-50 px-6 py-4 border-t border-dashed border-gray-300 flex flex-col sm:flex-row justify-center gap-3 print:hidden">
          <button
            onClick={onPrint}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            🖨 Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            ⬇ Download PDF
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
