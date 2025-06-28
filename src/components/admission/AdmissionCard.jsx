import React from 'react';

/** Card showing a brief overview of an admission record. */
const AdmissionCard = ({ data, onClick }) => (
  <div
    className="bg-white p-4 rounded shadow cursor-pointer hover:ring hover:ring-blue-400"
    onClick={onClick}
  >
    <div className="font-semibold text-lg">
      {data.firstName} {data.lastName}
    </div>
    <div className="text-gray-600 text-sm">📞 {data.mobileSelf}</div>
    <div className="text-gray-500 text-xs">{data.course || 'No course selected'}</div>
  </div>
);

export default AdmissionCard;
