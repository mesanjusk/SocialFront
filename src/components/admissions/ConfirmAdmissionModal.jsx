import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from '../../config';

const ConfirmAdmissionModal = ({ admission, onClose, onUpdated }) => {
  const [confirmationStatus, setConfirmationStatus] = useState(admission?.confirmationStatus || '');
  const [dropoutReason, setDropoutReason] = useState(admission?.dropoutReason || '');
  const [loading, setLoading] = useState(false);
  const modalRef = useRef();
  const institute_uuid = localStorage.getItem('institute_uuid');

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleBackdrop = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  const handleSave = async () => {
    if (!confirmationStatus) {
      toast.error('Please select a status');
      return;
    }

    if (confirmationStatus === 'DropOut' && !dropoutReason.trim()) {
      toast.error('Please provide a reason for dropout');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/api/admissions/${admission.uuid}`, {
        confirmationStatus,
        dropoutReason: confirmationStatus === 'DropOut' ? dropoutReason : '',
        institute_uuid,
      });
      toast.success('Admission status updated');
      onUpdated?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      onMouseDown={handleBackdrop}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-sm"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Admission Status</h2>

        <label className="flex items-center gap-2 mb-2">
          <input
            type="radio"
            name="status"
            value="Confirmed"
            checked={confirmationStatus === 'Confirmed'}
            onChange={() => setConfirmationStatus('Confirmed')}
          />
          <span>Confirmed</span>
        </label>

        <label className="flex items-center gap-2 mb-2">
          <input
            type="radio"
            name="status"
            value="DropOut"
            checked={confirmationStatus === 'DropOut'}
            onChange={() => setConfirmationStatus('DropOut')}
          />
          <span>Drop Out</span>
        </label>

        {confirmationStatus === 'DropOut' && (
          <textarea
            placeholder="Enter reason for dropout"
            value={dropoutReason}
            onChange={(e) => setDropoutReason(e.target.value)}
            className="w-full border rounded p-2 mb-4"
            rows={3}
          />
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAdmissionModal;
