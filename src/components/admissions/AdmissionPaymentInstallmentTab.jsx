
import React from 'react';

const AdmissionPaymentInstallmentTab = ({ form, handleChange, installmentPlan, paymentModes }) => (
  <>
    <input placeholder="Fees" value={form.fees} type="number" className="border p-2" readOnly />
    <input placeholder="Discount" value={form.discount} type="number" onChange={handleChange('discount')} className="border p-2" />
    <input placeholder="Total" value={form.total} type="number" className="border p-2" readOnly />
    <input placeholder="Fee Paid" value={form.feePaid} type="number" onChange={handleChange('feePaid')} className="border p-2" />
    <input placeholder="Balance" value={form.balance} type="number" className="border p-2" readOnly />

    <select value={form.paidBy} onChange={handleChange('paidBy')} className="border p-2">
      <option value="">-- Select Payment Mode --</option>
      {paymentModes.map(p => <option key={p._id} value={p.mode}>{p.mode}</option>)}
    </select>

    <input placeholder="Installments" value={form.installment} onChange={handleChange('installment')} type="number" min="1" className="border p-2" />

    <input type="date" placeholder="EMI Start Date" value={form.emiDate} onChange={handleChange('emiDate')} className="border p-2" />
    <input placeholder="EMI" value={form.emi} type="number" className="border p-2" readOnly />

    {installmentPlan.length > 0 && (
      <table className="w-full border mt-2 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">#</th>
            <th className="border px-2 py-1">Due Date</th>
            <th className="border px-2 py-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          {installmentPlan.map(p => (
            <tr key={p.installmentNo}>
              <td className="border px-2 py-1 text-center">{p.installmentNo}</td>
              <td className="border px-2 py-1">{p.dueDate}</td>
              <td className="border px-2 py-1 text-right">{p.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </>
);

export default AdmissionPaymentInstallmentTab;
