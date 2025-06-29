import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import AdmissionStudentInfoTab from './AdmissionStudentInfoTab';
import AdmissionCourseBatchTab from './AdmissionCourseBatchTab';
import AdmissionPaymentInstallmentTab from './AdmissionPaymentInstallmentTab';
import useAdmissionForm from './useAdmissionForm';

const AdmissionFormModal = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const { username } = useParams();

  const {
    form,
    handleChange,
    handleSubmit,
    installmentPlan,
    editingId,
    themeColor,
    paymentModes,
    courses,
    educations,
    exams,
    batches,
  } = useAdmissionForm(() => handleCloseRedirect(), setTab);

  const tabNames = ['Student Info', 'Course & Batch', 'Payment & Installments'];

  const handleCloseRedirect = () => {
    navigate(`/${username}/allAdmission`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Toaster />
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold" style={{ color: themeColor }}>
            {editingId ? 'Edit Admission' : 'Add New Admission'}
          </h2>
          <button onClick={handleCloseRedirect} className="text-gray-500 hover:text-black text-2xl">&times;</button>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-around border-b">
          {tabNames.map((tabName, idx) => (
            <button
              key={idx}
              onClick={() => setTab(idx)}
              className={`flex-1 py-2 text-sm font-medium ${tab === idx ? 'border-b-2' : ''}`}
              style={tab === idx ? { borderColor: themeColor, color: themeColor } : { color: '#4b5563' }}
            >
              {tabName}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          {tab === 0 && <AdmissionStudentInfoTab form={form} handleChange={handleChange} />}
          {tab === 1 && (
            <AdmissionCourseBatchTab
              form={form}
              handleChange={handleChange}
              courses={courses}
              educations={educations}
              exams={exams}
              batches={batches}
              setFormField={handleChange}
            />
          )}
          {tab === 2 && (
            <AdmissionPaymentInstallmentTab
              form={form}
              handleChange={handleChange}
              paymentModes={paymentModes}
              installmentPlan={installmentPlan}
            />
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCloseRedirect}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white px-4 py-2 rounded"
              style={{ backgroundColor: themeColor }}
            >
              {editingId ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionFormModal;
