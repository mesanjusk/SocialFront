import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../../config';

const LeadFormModal = ({ onClose, onSuccess, institute_uuid }) => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    mobileSelf: '',
    course: '',
  });
  const [leadData, setLeadData] = useState({
    referredBy: '',
    followups: [{
      date: new Date().toISOString().substring(0, 10),
      status: 'open',
      remark: '',
      createdBy: 'System',
    }],
  });

 useEffect(() => {
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/courses`, {
        params: { institute_uuid },
      });
      console.log("Courses API response:", res.data);
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      toast.error('Failed to load courses');
    }
  };
  if (institute_uuid) fetchCourses();
}, [institute_uuid]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(studentData.mobileSelf)) {
      toast.error('Mobile number must be exactly 10 digits');
      return;
    }
    if (!studentData.course) {
      toast.error('Please select a course');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/leads`, {
        institute_uuid,
        course: studentData.course,
        studentData,
        referredBy: leadData.referredBy,
        followups: leadData.followups,
      });
      toast.success('Lead created successfully');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating lead:', err);
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
            type="tel"
            placeholder="Mobile (10 digits)"
            value={studentData.mobileSelf}
            onChange={(e) => setStudentData({ ...studentData, mobileSelf: e.target.value })}
            required
            maxLength={10}
            pattern="[0-9]{10}"

            className="border p-2 rounded w-full"
          />
          <select
            value={studentData.course}
            onChange={(e) => setStudentData({ ...studentData, course: e.target.value })}
            required
            className="border p-2 rounded w-full"
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course.uuid}>{course.name}</option>
            ))}
          </select>
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
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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