import React from 'react';

const LeadDetailsModal = ({
  lead,
  receiptInfo,
  institute,
  onEdit,
  onManageBatch,
  onManageExam,
  onConfirm,
  onReceipt,
  onCertificate,
  onClose,
}) => {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          {(lead.student?.firstName || lead.studentData?.firstName) || ''}{' '}
          {(lead.student?.lastName || lead.studentData?.lastName) || ''}
        </h2>

        <div className="flex flex-row justify-between items-start mb-2">
          <div className="flex flex-col items-start" style={{ width: 130 }}>
            <img src={institute.logo} alt="Logo" className="w-16 h-16 mb-1" />
            <div className="text-xs font-semibold text-yellow-800 leading-tight">{institute.tagline}</div>
            <div className="text-xs text-gray-500">{institute.website}</div>
          </div>

          <div className="flex-1 flex flex-col items-end gap-0">
            <div className="text-xs font-semibold text-gray-800">
              ALC Name - <span className="font-bold uppercase">{institute.name}</span>
            </div>
            <div className="text-xs font-semibold text-gray-800">
              ALC Contact Person - <span className="font-bold">{institute.contact}</span>
            </div>
            <div className="text-xs font-semibold text-gray-800">
              ALC Code - <span className="font-bold">{institute.code}</span>
            </div>
          </div>
        </div>

        <hr className="my-1 border-gray-200" />

        <div className="flex flex-row justify-between items-center text-xs mb-4">
          <div></div>
          <div>
            <span className="font-semibold">Receipt Date: </span>{receiptInfo.receiptDate}
            <br />
            <span className="font-semibold">Receipt Number: </span>{receiptInfo.receiptNumber}
          </div>
        </div>

        <div className="mt-3 mb-2">
          <span className="text-lg font-semibold">Course Name:</span>
          <span className="text-lg font-bold"> {receiptInfo.courseName}</span>
        </div>

        <div className="mb-3">
          <div>
            <span className="font-semibold">Name of the Learner: </span>
            <span className="font-bold uppercase"> {receiptInfo.learnerName}</span>
          </div>
          <div>
            <span className="font-semibold">Learner Code: </span>
            <span className="font-bold">{receiptInfo.learnerCode}</span>
          </div>
          <div>
            <span className="font-semibold">Examination Event: </span>
            <span className="font-bold">{receiptInfo.examEvent}</span>
          </div>
        </div>

        <div className="bg-gray-100 rounded-md px-4 py-3 mb-3">
          <div className="text-base font-medium">Amount Received:</div>
          <div className="mt-1 font-bold">{receiptInfo.amountWords}</div>
        </div>

        <div className="bg-gray-100 rounded-md px-4 py-3 mb-2">
          <div className="text-base font-medium">Amount in Words:</div>
          <div className="mt-1 font-bold">{receiptInfo.amountWords}</div>
        </div>

        <div className="bg-gray-100 rounded-md px-4 py-3 mb-2">
          <div className="text-base font-medium">Installment:</div>
          <div className="overflow-x-auto">
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
        </div>

        <div className="flex gap-2">
          <button onClick={() => onEdit(lead)} className="bg-yellow-500 text-white px-4 py-2 rounded text-sm">
            Edit
          </button>
          <button onClick={() => onManageBatch(lead)} className="bg-purple-600 text-white px-4 py-2 rounded text-sm">
            Manage Batch
          </button>
          <button onClick={() => onManageExam(lead)} className="bg-pink-600 text-white px-4 py-2 rounded text-sm">
            Manage Exam
          </button>
          <button onClick={() => onConfirm(lead)} className="bg-green-600 text-white px-4 py-2 rounded text-sm">
            Confirm
          </button>
          <button onClick={() => onReceipt(lead)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            Download Receipt
          </button>
          <button onClick={() => onCertificate(lead)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            Certificate
          </button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded text-sm ml-auto">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;
