import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from '../../config';

const ConfirmAdmissionModal = ({ admission, onClose, onUpdated }) => {
  const [confirmed, setConfirmed] = useState(!!admission?.confirmationStatus);
  const [loading, setLoading] = useState(false);
  const institute_uuid = localStorage.getItem('institute_uuid');
  const modalRef = useRef();

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleBackdrop = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/api/admissions/${admission._id}`, {
        confirmationStatus: confirmed,
        institute_uuid,
      });
      toast.success('Admission confirmation updated');
      if (onUpdated) onUpdated();
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
        <h2 className="text-lg font-semibold mb-4">Admission Confirmation</h2>
        <label htmlFor="admission-confirmed" className="flex items-center gap-2 mb-4">
          <input
            id="admission-confirmed"
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <span>Confirmed</span>
        </label>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            autoFocus
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
