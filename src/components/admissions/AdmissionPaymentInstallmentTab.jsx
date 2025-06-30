// ✅ 4️⃣ AdmissionPaymentInstallmentTab.jsx

import React from 'react';

const AdmissionPaymentInstallmentTab = ({
  form,
  handleChange,
  paymentModes,
  installmentPlan
}) => (
  <>
    <input
      placeholder="Fees"
      value={form.fees}
      type="number"
      className="border p-2 rounded w-full"
      readOnly
    />

    <input
      placeholder="Discount"
      value={form.discount}
      type="number"
      onChange={handleChange('discount')}
      className="border p-2 rounded w-full"
    />

    <input
      placeholder="Total"
      value={form.total}
      type="number"
      className="border p-2 rounded w-full"
      readOnly
    />

    <input
      placeholder="Fee Paid"
      value={form.feePaid}
      type="number"
      onChange={handleChange('feePaid')}
      className="border p-2 rounded w-full"
    />

    <input
      placeholder="Balance"
      value={form.balance}
      type="number"
      className="border p-2 rounded w-full"
      readOnly
    />

    <select
      value={form.paidBy}
      onChange={handleChange('paidBy')}
      className="border p-2 rounded w-full"
      required
    >
      <option value="">-- Select Payment Mode --</option>
      {paymentModes.map((p) => (
        <option key={p._id} value={p.mode}>
          {p.mode}
        </option>
      ))}
    </select>

    <input
      placeholder="Installments"
      value={form.installment}
      onChange={handleChange('installment')}
      type="number"
      min="1"
      className="border p-2 rounded w-full"
    />

    <input
      type="date"
      placeholder="EMI Start Date"
      value={form.emiDate}
      onChange={handleChange('emiDate')}
      className="border p-2 rounded w-full"
    />

    <input
      placeholder="EMI"
      value={form.emi}
      type="number"
      className="border p-2 rounded w-full"
      readOnly
    />

    {installmentPlan.length > 0 && (
      <table className="w-full border text-sm mt-2">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-1">#</th>
            <th className="border p-1">Due Date</th>
            <th className="border p-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          {installmentPlan.map((p, idx) => (
            <tr key={idx} className="text-center">
              <td className="border p-1">{p.installmentNo}</td>
              <td className="border p-1">{p.dueDate}</td>
              <td className="border p-1">{p.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </>
);

export default AdmissionPaymentInstallmentTab;
