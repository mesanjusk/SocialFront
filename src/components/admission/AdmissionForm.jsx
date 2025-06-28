import React from 'react';
import Modal from '../common/Modal';
import StudentProfileFields from './StudentProfileFields';
import CourseFeeFields from './CourseFeeFields';
import PaymentFields from './PaymentFields';

/**
 * Form used for creating or updating an admission.
 * Receives form state and lists via props and delegates submission back to the parent.
 */
const AdmissionForm = ({
  form,
  editingId,
  educations,
  courses,
  exams,
  batches,
  paymentModes,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const title = editingId ? 'Edit Admission' : 'Add New Admission';

  const actions = (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingId ? 'Update' : 'Submit'}
      </button>
    </>
  );

  return (
    <Modal title={title} actions={actions} onClose={onCancel}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <StudentProfileFields form={form} onChange={onChange} educations={educations} />
        <CourseFeeFields
          form={form}
          onChange={onChange}
          courses={courses}
          batches={batches}
          exams={exams}
        />
        <PaymentFields form={form} onChange={onChange} paymentModes={paymentModes} />
      </form>
    </Modal>
  );
};

export default AdmissionForm;
