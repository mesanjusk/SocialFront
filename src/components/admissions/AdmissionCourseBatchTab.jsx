// ✅ AdmissionCourseBatchTab.jsx - Final

import React from 'react';

const AdmissionCourseBatchTab = ({
  form,
  handleChange,
  courses,
  educations,
  exams,
  batches,
  setFormField,
}) => (
  <>
    <label className="text-sm font-medium">Education</label>
    <select
      value={form.education}
      onChange={handleChange('education')}
      className="border p-2 rounded w-full"
      required
    >
      <option value="">Select Education</option>
      {educations.map((e) => (
        <option key={e._id} value={e.education}>
          {e.education || 'Unnamed Education'}
        </option>
      ))}
    </select>

    <label className="text-sm font-medium mt-2">Course</label>
    <select
      value={form.course}
      onChange={(e) => {
        const selectedCourse = courses.find((c) => c.name === e.target.value);
        const courseFee = Number(selectedCourse?.courseFees || 0);
        const discount = Number(form.discount || 0);
        const feePaid = Number(form.feePaid || 0);
        const total = courseFee - discount;
        const balance = total - feePaid;

        // update dependent fields
        setFormField('course')({ target: { value: e.target.value } });
        setFormField('fees')({ target: { value: courseFee } });
        setFormField('total')({ target: { value: total } });
        setFormField('balance')({ target: { value: balance } });
      }}
      className="border p-2 rounded w-full"
      required
    >
      <option value="">Select Course</option>
      {courses.map((c) => (
        <option key={c._id} value={c.name}>
          {c.name || 'Unnamed Course'}
        </option>
      ))}
    </select>

    <label className="text-sm font-medium mt-2">Batch</label>
    <select
      value={form.batchTime}
      onChange={handleChange('batchTime')}
      className="border p-2 rounded w-full"
      required
    >
      <option value="">Select Batch</option>
      {batches.map((b) => (
        <option key={b._id} value={b.time || b.batchTime || b.name || ''}>
          {b.time || b.batchTime || b.name || 'Unnamed Batch'}
        </option>
      ))}
    </select>

    <label className="text-sm font-medium mt-2">Exam</label>
    <select
      value={form.examEvent}
      onChange={handleChange('examEvent')}
      className="border p-2 rounded w-full"
      required
    >
      <option value="">Select Exam</option>
      {exams.map((e) => (
        <option key={e._id} value={e.exam}>
          {e.exam || 'Unnamed Exam'}
        </option>
      ))}
    </select>
  </>
);

export default AdmissionCourseBatchTab;
