import React from 'react';

const SearchAddAdmissionBar = ({ search, setSearch, onAdd }) => (
  <div className="flex justify-between items-center mb-4 gap-2 flex-wrap sm:flex-nowrap">
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search by name or mobile"
      className="border p-2 rounded w-full max-w-xs"
    />
    <button
      onClick={onAdd}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      + New Admission
    </button>
  </div>
);

export default SearchAddAdmissionBar;
