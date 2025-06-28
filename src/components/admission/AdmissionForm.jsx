import React from 'react';
import Modal from '../common/Modal';

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
    <Modal title={title} actions={actions}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          placeholder="First Name"
          value={form.firstName}
          onChange={onChange('firstName')}
          className="border p-2"
          required
        />
        <input
          placeholder="Middle Name"
          value={form.middleName}
          onChange={onChange('middleName')}
          className="border p-2"
        />
        <input
          placeholder="Last Name"
          value={form.lastName}
          onChange={onChange('lastName')}
          className="border p-2"
        />
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={form.dob?.substring(0, 10)}
            onChange={onChange('dob')}
            className="border p-2 flex-1"
            required
          />
          <label className="w-32 text-sm font-medium">Date of Birth</label>
        </div>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={form.gender === 'Male'}
              onChange={onChange('gender')}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={form.gender === 'Female'}
              onChange={onChange('gender')}
            />
            Female
          </label>
        </div>
        <input
          placeholder="Mobile (Self)"
          value={form.mobileSelf}
          onChange={onChange('mobileSelf')}
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          className="border p-2"
        />
        <input
          placeholder="Mobile (Parent)"
          value={form.mobileParent}
          onChange={onChange('mobileParent')}
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          className="border p-2"
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={onChange('address')}
          className="border p-2"
        />
        <select value={form.education} onChange={onChange('education')} className="border p-2">
          <option value="">-- Select Education --</option>
          {educations.map((e) => (
            <option key={e._id} value={e.education}>
              {e.education}
            </option>
          ))}
        </select>
        <select
          value={form.course}
          onChange={(e) => {
            const selected = courses.find((c) => c.name === e.target.value);
            const courseFee = Number(selected?.courseFees || 0);
            const discount = Number(form.discount || 0);
            const feePaid = Number(form.feePaid || 0);
            const total = courseFee - discount;
            const balance = total - feePaid;
            onChange('course')({ target: { value: e.target.value } });
            onChange('fees')({ target: { value: courseFee } });
            onChange('total')({ target: { value: total } });
            onChange('balance')({ target: { value: balance } });
          }}
          className="border p-2"
        >
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={form.batchTime} onChange={onChange('batchTime')} className="border p-2">
          <option value="">-- Select Batch --</option>
          {batches.map((b) => (
            <option key={b._id} value={b.time || b.batchTime || b.name || ''}>
              {b.time || b.batchTime || b.name || 'Unnamed Batch'}
            </option>
          ))}
        </select>
        <select value={form.examEvent} onChange={onChange('examEvent')} className="border p-2">
          <option value="">-- Select Exam --</option>
          {exams.map((e) => (
            <option key={e._id} value={e.exam}>
              {e.exam}
            </option>
          ))}
        </select>
        <input
          placeholder="Installment"
          value={form.installment}
          onChange={onChange('installment')}
          className="border p-2"
        />
        <input placeholder="Fees" value={form.fees} type="number" className="border p-2" readOnly />
        <input
          placeholder="Discount"
          value={form.discount}
          type="number"
          onChange={onChange('discount')}
          className="border p-2"
        />
        <input placeholder="Total" value={form.total} type="number" className="border p-2" readOnly />
        <input
          placeholder="Fee Paid"
          value={form.feePaid}
          type="number"
          onChange={onChange('feePaid')}
          className="border p-2"
        />
        <select value={form.paidBy} onChange={onChange('paidBy')} className="border p-2">
          <option value="">-- Select Payment Mode --</option>
          {paymentModes.map((p) => (
            <option key={p._id} value={p.mode}>
              {p.mode}
            </option>
          ))}
        </select>
        <input placeholder="Balance" value={form.balance} type="number" className="border p-2" readOnly />
      </form>
    </Modal>
  );
};

export default AdmissionForm;
