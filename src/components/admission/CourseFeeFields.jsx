import React from 'react';

/**
 * Fields related to course selection and fee calculations.
 */
const CourseFeeFields = ({ form, onChange, courses, batches, exams }) => (
  <>
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
  </>
);

export default CourseFeeFields;
