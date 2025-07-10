import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const LeadCard = ({ lead, courseName, onSelect, onWhatsApp }) => (
  <div
    onClick={() => onSelect(lead)}
    className="border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer flex flex-col justify-between"
  >
    <div>
      <h2 className="font-semibold text-lg text-gray-800">
        {lead.studentData?.firstName} {lead.studentData?.lastName}
      </h2>
      <p className="text-sm text-gray-600 mt-1">{courseName}</p>
    </div>
    <div className="flex justify-end items-center gap-3 mt-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onWhatsApp();
        }}
        className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
        title="WhatsApp"
      >
        <FaWhatsapp />
      </button>
    </div>
  </div>
);

export default LeadCard;
