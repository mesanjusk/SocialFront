import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';

const AddEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpRemarks, setFollowUpRemarks] = useState('');
  const [search, setSearch] = useState('');
  const institute_uuid = localStorage.getItem('institute_uuid');

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/record/org/${institute_uuid}?type=enquiry`);
      setEnquiries(res.data || []);
    } catch {
      toast.error('Failed to fetch enquiries');
    }
  };

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/followup`, {
        enquiry_uuid: selectedEnquiry.uuid,
        followUpDate,
        remarks: followUpRemarks,
        updatedBy: localStorage.getItem('name') || 'admin',
      });
      toast.success('Follow-Up saved');
      setShowFollowUpModal(false);
      setFollowUpDate('');
      setFollowUpRemarks('');
      fetchEnquiries();
    } catch {
      toast.error('Failed to save follow-up');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/enquiry/${id}`);
      toast.success('Enquiry deleted');
      fetchEnquiries();
      setShowModal(false);
    } catch {
      toast.error('Failed to delete enquiry');
    }
  };

  const handleEdit = () => {
    toast('Edit action triggered');
    // Implement your edit modal logic here
    setShowModal(false);
  };

  const handleConvert = () => {
    toast('Convert to admission triggered');
    // Implement your convert modal logic here
    setShowModal(false);
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filtered = enquiries.filter(
    (e) =>
      e.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      e.mobileSelf?.includes(search)
  );

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <Toaster />
      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or mobile"
          className="border p-2 w-full max-w-xs"
        />
      </div>

      {/* Card View */}
      <div className="flex flex-col gap-2">
        {filtered.map((e, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded shadow cursor-pointer"
            onClick={() => {
              setSelectedEnquiry(e);
              setShowModal(true);
            }}
          >
            <div className="font-semibold text-lg">{e.firstName} {e.lastName}</div>
            <div className="text-gray-600 text-sm">📞 {e.mobileSelf}</div>
            <div className="text-gray-500 text-xs">{e.course || 'No course selected'}</div>
          </div>
        ))}
      </div>

      {/* Enquiry Detail Modal */}
      {showModal && selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-sm w-full">
            <h2 className="text-xl font-bold mb-2">
              {selectedEnquiry.firstName} {selectedEnquiry.lastName}
            </h2>
            <p className="text-sm text-gray-600 mb-2">📞 {selectedEnquiry.mobileSelf}</p>
            <p className="text-sm text-gray-600 mb-4">Course: {selectedEnquiry.course || 'N/A'}</p>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleEdit}
                className="bg-yellow-500 text-white py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(selectedEnquiry._id)}
                className="bg-red-500 text-white py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={handleConvert}
                className="bg-green-600 text-white py-2 rounded"
              >
                Convert to Admission
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setShowFollowUpModal(true);
                }}
                className="bg-blue-600 text-white py-2 rounded"
              >
                Add Follow-Up
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Follow-Up Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Add Follow-Up</h2>
            <form onSubmit={handleFollowUpSubmit} className="flex flex-col gap-3">
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="border p-2"
                required
              />
              <textarea
                value={followUpRemarks}
                onChange={(e) => setFollowUpRemarks(e.target.value)}
                placeholder="Remarks"
                className="border p-2"
                required
              ></textarea>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEnquiry;
