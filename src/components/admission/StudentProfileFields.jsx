import React from 'react';

/**
 * Basic student details used in enquiry and admission forms.
 */
const StudentProfileFields = ({ form, onChange, educations }) => (
  <>
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
  </>
);

export default StudentProfileFields;
