// ✅ 2️⃣ AdmissionStudentInfoTab.jsx

import React from 'react';

const AdmissionStudentInfoTab = ({ form, handleChange }) => (
  <>
    <input
      placeholder="First Name"
      value={form.firstName}
      onChange={handleChange('firstName')}
      className="border p-2 rounded w-full"
      required
    />

    <input
      placeholder="Middle Name"
      value={form.middleName}
      onChange={handleChange('middleName')}
      className="border p-2 rounded w-full"
    />

    <input
      placeholder="Last Name"
      value={form.lastName}
      onChange={handleChange('lastName')}
      className="border p-2 rounded w-full"
      required
    />

    <label className="text-sm font-medium mt-2">Date of Birth</label>
    <input
      type="date"
      value={form.dob}
      onChange={handleChange('dob')}
      className="border p-2 rounded w-full"
      required
    />

    <div className="flex gap-4 mt-2">
      <label className="flex items-center gap-1">
        <input
          type="radio"
          name="gender"
          value="Male"
          checked={form.gender === 'Male'}
          onChange={handleChange('gender')}
          required
        /> Male
      </label>
      <label className="flex items-center gap-1">
        <input
          type="radio"
          name="gender"
          value="Female"
          checked={form.gender === 'Female'}
          onChange={handleChange('gender')}
          required
        /> Female
      </label>
    </div>

    <input
      placeholder="Mobile (Self)"
      value={form.mobileSelf}
      onChange={handleChange('mobileSelf')}
      inputMode="numeric"
      pattern="[0-9]{10}"
      maxLength={10}
      className="border p-2 rounded w-full"
      required
    />

    <input
      placeholder="Mobile (Parent)"
      value={form.mobileParent}
      onChange={handleChange('mobileParent')}
      inputMode="numeric"
      pattern="[0-9]{10}"
      maxLength={10}
      className="border p-2 rounded w-full"
    />

    <input
      placeholder="Address"
      value={form.address}
      onChange={handleChange('address')}
      className="border p-2 rounded w-full"
      required
    />
  </>
);

export default AdmissionStudentInfoTab;
