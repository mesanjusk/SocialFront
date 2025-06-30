
import React from 'react';

const AdmissionCourseBatchTab = ({ form, handleChange, courses, educations, exams, batches }) => (
  <>
    <select value={form.education} onChange={handleChange('education')} className="border p-2">
      <option value="">-- Select Education --</option>
      {educations.map(e => <option key={e._id} value={e.education}>{e.education}</option>)}
    </select>

    <select
      value={form.course}
      onChange={handleChange('course')}
      className="border p-2"
    >
      <option value="">-- Select Course --</option>
      {courses.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
    </select>

    <select value={form.batchTime} onChange={handleChange('batchTime')} className="border p-2">
      <option value="">-- Select Batch --</option>
      {batches.map(b => (
        <option key={b._id} value={b.time || b.batchTime || b.name || ''}>
          {b.time || b.batchTime || b.name || 'Unnamed Batch'}
        </option>
      ))}
    </select>

    <select value={form.examEvent} onChange={handleChange('examEvent')} className="border p-2">
      <option value="">-- Select Exam --</option>
      {exams.map(e => <option key={e._id} value={e.exam}>{e.exam}</option>)}
    </select>
  </>
);

export default AdmissionCourseBatchTab;
