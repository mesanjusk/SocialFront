import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from '../../config';

const LeadStatusModal = ({ lead, onClose, refresh }) => {
  const [status, setStatus] = useState(lead.leadStatus || 'open');
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/leads/${lead.uuid}`, { leadStatus: status });
      toast.success('Status updated successfully');
      refresh();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Update Lead Status</h2>
        <div className="mb-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="open">Open</option>
            <option value="follow-up">Follow Up</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={updateStatus}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadStatusModal;
