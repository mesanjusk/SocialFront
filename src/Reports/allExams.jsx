
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import BASE_URL from '../config';
import ManageExamModal from '../components/common/ManageExamModal';

const AllExams = () => {
  const [admissions, setAdmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const institute_uuid = localStorage.getItem('institute_uuid');

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/admissions`, {
        params: { institute_uuid },
      });
      setAdmissions(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      toast.error('Failed to load admissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/courses`, {
        params: { institute_uuid },
      });
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchExams = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/exams`, {
        params: { institute_uuid },
      });
      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
  };

  useEffect(() => {
    fetchAdmissions();
    fetchCourses();
    fetchExams();
  }, []);

  const getCourseName = (uuid) => {
    const course = courses.find(c => c.Course_uuid === uuid || c.uuid === uuid);
    return course?.name || 'Course N/A';
  };

  const filteredAdmissions = admissions.filter((a) => {
    const name = `${a.studentData?.firstName || a.student?.firstName || ''} ${a.studentData?.lastName || a.student?.lastName || ''}`.toLowerCase();
    const mobile = a.studentData?.mobileSelf || a.student?.mobileSelf || '';
    return name.includes(search.toLowerCase()) || mobile.includes(search);
  });

  const grouped = filteredAdmissions.reduce((acc, adm) => {
    const exam = adm.examEvent || 'Unassigned';
    if (!acc[exam]) acc[exam] = [];
    acc[exam].push(adm);
    return acc;
  }, {});

  const handleWhatsApp = (mobile, name) => {
    if (!mobile) return toast.error('Mobile number not available');
    const message = `Hello ${name || ''}, regarding your course.`;
    window.open(`https://wa.me/91${mobile}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = (mobile) => {
    if (!mobile) return toast.error('Mobile number not available');
    window.open(`tel:${mobile}`);
  };

  return (
    <div className="p-4">
      <Toaster />
      <div className="flex items-center gap-2 mb-4 w-full">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or mobile"
          className="border p-2 rounded flex-1 min-w-0"
        />
      </div>
      {loading && <div>Loading students...</div>}
      {!loading && Object.keys(grouped).length === 0 && <div>No students found.</div>}
      {!loading && Object.entries(grouped).map(([exam, list]) => (
        <div key={exam} className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{exam}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-12 gap-4">
            {list.map((admission) => (
              <div
                key={admission._id}
                
                 onClick={() => setSelectedAdmission(admission)}
                className="border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {admission.studentData?.firstName || admission.student?.firstName} {admission.studentData?.lastName || admission.student?.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {getCourseName(admission.course)}
                  </p>
                </div>
              </div>
            ))}
          </div>
         {selectedAdmission && (
        <ManageExamModal
          admission={selectedAdmission}
          onClose={() => setSelectedAdmission(null)}
          onUpdated={fetchAdmissions}
        />
      )}
        </div>
      ))}
    </div>
  );
};

export default AllExams;
