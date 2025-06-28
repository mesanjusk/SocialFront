import React from 'react';

/** Fields related to payments and balances */
const PaymentFields = ({ form, onChange, paymentModes }) => (
  <>
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
  </>
);

export default PaymentFields;
