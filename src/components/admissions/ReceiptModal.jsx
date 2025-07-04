import React from 'react';

const ReceiptModal = ({ data, onPrint, onDownload, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h2 className="text-xl font-bold mb-2 text-center">Admission Successful!</h2>
      <div className="mb-3 text-center">
        <div><strong>Student:</strong> {data?.firstName} {data?.lastName}</div>
        <div><strong>Course:</strong> {data?.course}</div>
        <div><strong>Paid:</strong> ₹{data?.feePaid} / <strong>Balance:</strong> ₹{data?.balance}</div>
      </div>
      <p className="text-center mb-4">Would you like to print or download the receipt?</p>
      <div className="flex justify-center gap-3">
        <button onClick={onPrint} className="bg-green-500 text-white px-4 py-2 rounded">Print Receipt</button>
        <button onClick={onDownload} className="bg-blue-500 text-white px-4 py-2 rounded">Download PDF</button>
        <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">✕</button>
      </div>
    </div>
  </div>
);

export default ReceiptModal;
