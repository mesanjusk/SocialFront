// ✅ 4️⃣ AdmissionPaymentInstallmentTab.jsx
import React from 'react';
const AdmissionPaymentInstallmentTab = ({ form, handleChange, paymentModes, installmentPlan }) => (
  <>
    <input placeholder="Fees" value={form.fees} onChange={handleChange('fees')} className="border p-2" />
    <input placeholder="Discount" value={form.discount} onChange={handleChange('discount')} className="border p-2" />
    <input placeholder="Total" value={form.total} readOnly className="border p-2" />
    <input placeholder="Fee Paid" value={form.feePaid} onChange={handleChange('feePaid')} className="border p-2" />
    <input placeholder="Balance" value={form.balance} readOnly className="border p-2" />
    <select value={form.paidBy} onChange={handleChange('paidBy')} className="border p-2">
      <option value="">Select Payment Mode</option>
      {paymentModes.map(p => <option key={p._id} value={p.mode}>{p.mode}</option>)}
    </select>
    <input placeholder="Installments" value={form.installment} onChange={handleChange('installment')} className="border p-2" />
    <input type="date" value={form.emiDate} onChange={handleChange('emiDate')} className="border p-2" />
    <input placeholder="EMI" value={form.emi} readOnly className="border p-2" />
    {installmentPlan.length > 0 && (
      <table className="w-full border text-sm mt-2">
        <thead><tr><th>#</th><th>Due Date</th><th>Amount</th></tr></thead>
        <tbody>
          {installmentPlan.map((p, idx) => (
            <tr key={idx}><td>{p.installmentNo}</td><td>{p.dueDate}</td><td>{p.amount}</td></tr>
          ))}
        </tbody>
      </table>
    )}
  </>
);
export default AdmissionPaymentInstallmentTab;
