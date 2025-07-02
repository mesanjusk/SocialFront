
import React from 'react';
import { Toaster } from 'react-hot-toast';
import useAdmissionForm from './useAdmissionForm';
import AdmissionStudentInfoTab from './AdmissionStudentInfoTab';
import AdmissionCourseBatchTab from './AdmissionCourseBatchTab';
import AdmissionPaymentInstallmentTab from './AdmissionPaymentInstallmentTab';

const AdmissionFormModal = ({ onClose }) => {
  const {
    form,
    setForm,
    tab,
    setTab,
    handleChange,
    handleSubmit,
    installmentPlan,
    courses,
    educations,
    exams,
    batches,
    paymentModes,
    editingId,
    themeColor,
  } = useAdmissionForm();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Toaster />
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold" style={{ color: themeColor }}>
            {editingId ? 'Edit Admission' : 'Add New Admission'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl">&times;</button>
        </div>
        <div className="flex justify-around border-b">
          {['Student Info', 'Course & Batch', 'Payment & Installments'].map((tabName, idx) => (
            <button
              key={idx}
              onClick={() => setTab(idx)}
              className="flex-1 py-2 text-sm font-medium"
              style={
                tab === idx
                  ? { borderBottomWidth: '2px', borderColor: themeColor, color: themeColor }
                  : { color: '#4b5563' }
              }
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
              setForm={setForm}
            />
          )}
          {tab === 2 && (
            <AdmissionPaymentInstallmentTab
              form={form}
              handleChange={handleChange}
              installmentPlan={installmentPlan}
              paymentModes={paymentModes}
            />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="text-white px-4 py-2 rounded" style={{ backgroundColor: themeColor }}>
              {editingId ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionFormModal;
