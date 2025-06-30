import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from '../../config';
import { useNavigate } from 'react-router-dom';

const LeadStatusModal = ({ lead, onClose, refresh }) => {
  const [status, setStatus] = useState(lead.leadStatus || 'open');
  const [remark, setRemark] = useState('');
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().substring(0, 10));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateStatus = async () => {
    if (status === 'lost' && remark.trim() === '') {
      toast.error('Please provide a remark for lost status');
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/leads/${lead.uuid}`, {
        leadStatus: status,
        remark: remark,
        followUpDate: status === 'follow-up' ? followUpDate : null,
        createdBy: 'System',
      });
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

  const handleConvertToAdmission = () => {
    window.open(`/addadmission?lead_uuid=${lead.uuid}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Update Lead Status</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Status</label>
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

        {status === 'follow-up' && (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Follow-Up Date</label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        )}

        {(status === 'follow-up' || status === 'lost') && (
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              {status === 'lost' ? 'Loss Remark' : 'Remark'}
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              required={status === 'lost'}
              className="w-full border p-2 rounded"
              placeholder={status === 'lost' ? 'Reason for loss' : 'Add remark (optional)'}
            />
          </div>
        )}

        {status === 'converted' && (
          <div className="mb-4">
            <button
              onClick={handleConvertToAdmission}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Convert to Admission
            </button>
          </div>
        )}

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
