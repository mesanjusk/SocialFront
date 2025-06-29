import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const LeadFormModal = ({ onClose, onSuccess, institute_uuid }) => {
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    mobileSelf: '',
  });
  const [leadData, setLeadData] = useState({
    branchCode: '',
    referredBy: '',
    leadStatus: 'open',
    followups: [
      {
        date: new Date().toISOString().substring(0, 10),
        status: 'open',
        remark: '',
        createdBy: 'System',
      },
    ],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/leads', {
        institute_uuid,
        studentData,
        leadData,
      });
      toast.success('Lead created successfully');
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Error creating lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Toaster />
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Lead</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Fields */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="First Name"
              value={studentData.firstName}
              onChange={(e) => setStudentData({ ...studentData, firstName: e.target.value })}
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={studentData.lastName}
              onChange={(e) => setStudentData({ ...studentData, lastName: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
          <input
            type="text"
            placeholder="Mobile"
            value={studentData.mobileSelf}
            onChange={(e) => setStudentData({ ...studentData, mobileSelf: e.target.value })}
            required
            className="border p-2 rounded w-full"
          />

          {/* Lead Fields */}
          <input
            type="text"
            placeholder="Branch Code"
            value={leadData.branchCode}
            onChange={(e) => setLeadData({ ...leadData, branchCode: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Referred By"
            value={leadData.referredBy}
            onChange={(e) => setLeadData({ ...leadData, referredBy: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <textarea
            placeholder="Remark"
            value={leadData.followups[0].remark}
            onChange={(e) => {
              const updatedFollowups = [...leadData.followups];
              updatedFollowups[0].remark = e.target.value;
              setLeadData({ ...leadData, followups: updatedFollowups });
            }}
            className="border p-2 rounded w-full"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;
