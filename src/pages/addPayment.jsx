import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from '../config';

export default function AddPayment() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [creditAccount, setCreditAccount] = useState('');
  const [debitAccount, setDebitAccount] = useState('');
  const [allAccounts, setAllAccounts] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerOptions, setCustomerOptions] = useState([]);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const institute_uuid = localStorage.getItem("institute_uuid");
  const [loading, setLoading] = useState(false);

  // Keep track of last selected customer name for validation
  const lastSelectedCustomerName = useRef('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) setLoggedInUser(user.name);
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/account/GetAccountList`)
      .then(res => {
        if (res.data.success) setAllAccounts(res.data.result || []);
      });
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/paymentmode`)
      .then(res => setPaymentModes(res.data));
  }, []);

  // Update customer options as user types (do not touch creditAccount here!)
  useEffect(() => {
    if (customerSearch) {
      const opts = allAccounts.filter(a =>
        a.Account_group === "ACCOUNT" &&
        a.Account_name?.toLowerCase().includes(customerSearch.toLowerCase())
      );
      setCustomerOptions(opts);
      setShowCustomerList(true);

      // If user types or edits, and it does not match last selected, clear selection
      if (customerSearch !== lastSelectedCustomerName.current) {
        setCreditAccount('');
      }
    } else {
      setCustomerOptions([]);
      setShowCustomerList(false);
      setCreditAccount('');
      lastSelectedCustomerName.current = '';
    }
  }, [customerSearch, allAccounts]);

  // Is customer selection valid?
  const selectedCustomer = allAccounts.find(a => a.Account_uuid === creditAccount);
  const isValidCustomer = !!creditAccount;

  const isValidPaymentMode = !!debitAccount;

  // Mouse or Enter selects customer, stores name for validation
  function handleCustomerPick(account) {
    setCustomerSearch(account.Account_name);
    setCreditAccount(account.Account_uuid);
    setShowCustomerList(false);
    lastSelectedCustomerName.current = account.Account_name;
  }

  // Allow Enter key to select first customer if list visible
  function handleCustomerInputKeyDown(e) {
    if (e.key === "Enter" && customerOptions.length === 1) {
      e.preventDefault();
      handleCustomerPick(customerOptions[0]);
    }
  }

  async function handleSubmit(e, { forWhatsApp = false } = {}) {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) return alert("Enter valid amount");
    if (!isValidCustomer) return alert("Please select a customer from the list.");
    if (!isValidPaymentMode) return alert("Select payment mode.");

    const customer = selectedCustomer;
    const paymentMode = paymentModes.find(m => m.mode === debitAccount);
    if (!customer || !paymentMode) return alert("Invalid customer or payment mode");

    const today = new Date().toISOString().slice(0, 10);

    const journal = [
      { Account_id: debitAccount, Type: 'Debit', Amount: Number(amount) },
      { Account_id: creditAccount, Type: 'Credit', Amount: Number(amount) }
    ];

    const payload = {
      Description: description,
      Total_Credit: Number(amount),
      Total_Debit: Number(amount),
      Payment_mode: debitAccount,
      Created_by: loggedInUser,
      Transaction_date: transactionDate || today,
      Journal_entry: journal,
      institute_uuid
    };

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/transaction/addTransaction`, payload);
      if (!forWhatsApp) {
        if (res.data.success) {
          alert("Payment added!");
          navigate("/home");
        } else {
          alert("Failed to add Transaction");
        }
      }
      setLoading(false);
      return {
        name: customer.Account_name,
        phone: customer.Mobile_number,
        amount,
        date: transactionDate || today,
        mode: paymentMode.mode
      };
    } catch (e) {
      setLoading(false);
      alert("Error submitting form.");
      return null;
    }
  }

  async function handleWhatsAppClick(e) {
    e.preventDefault();
    const info = await handleSubmit(e, { forWhatsApp: true });
    if (!info) return;
    const { name, phone, amount, date, mode } = info;
    if (!phone) return alert("No customer phone number.");

    const message = `Hello ${name}, we have received your payment of ₹${amount} on ${date} via ${mode}. Thank you!`;
    if (!window.confirm(`Send WhatsApp message?\n\n${message}`)) return;

    try {
      await fetch('https://misbackend-e078.onrender.com/usertask/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: phone, userName: name, type: 'customer', message }),
      });
      alert("Message sent!");
      navigate("/home");
    } catch {
      alert("Failed to send WhatsApp message.");
    }
  }

  return (
    <div className="flex justify-center items-center bg-secondary min-h-screen">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Payment</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Date</label>
          <input type="date" className="form-control mb-3"
            value={transactionDate}
            onChange={e => setTransactionDate(e.target.value)}
          />

          <label className="block mb-2">Customer</label>
          <input
            type="text"
            className="form-control mb-1"
            value={customerSearch}
            placeholder="Search customer"
            onChange={e => setCustomerSearch(e.target.value)}
            onFocus={() => setShowCustomerList(true)}
            onKeyDown={handleCustomerInputKeyDown}
            autoComplete="off"
          />
          {showCustomerList && customerOptions.length > 0 &&
            <ul className="list-group mb-2 max-h-40 overflow-y-auto z-10 position-absolute bg-white border w-full">
              {customerOptions.map(opt =>
                <li key={opt.Account_uuid} className="list-group-item cursor-pointer"
                  onClick={() => handleCustomerPick(opt)}>
                  {opt.Account_name}
                </li>
              )}
            </ul>
          }
          {/* Only show if user has typed and not picked from list */}
          {customerSearch && !isValidCustomer && (
            <div className="text-red-600 text-sm mb-2">
              Please select a customer from the list.
            </div>
          )}

          <label className="block mb-2">Amount</label>
          <input type="number" className="form-control mb-3"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="0"
            required
          />

          <label className="block mb-2">Payment Mode</label>
          <select className="form-control mb-3"
            value={debitAccount}
            onChange={e => setDebitAccount(e.target.value)}
            required
          >
            <option value="">Select Payment</option>
            {paymentModes.map(pm =>
              <option key={pm.mode} value={pm.mode}>{pm.mode}</option>
            )}
          </select>

          <label className="block mb-2">Description</label>
          <input type="text" className="form-control mb-4"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
          />

          <button type="submit"
            className="w-full py-2 mb-2 bg-green-600 text-white rounded"
            disabled={loading || !isValidCustomer || !isValidPaymentMode || !amount}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
          <button type="button"
            className="w-full py-2 mb-2 bg-green-500 text-white rounded"
            onClick={handleWhatsAppClick}
            disabled={loading || !isValidCustomer || !isValidPaymentMode || !amount}>
            WhatsApp
          </button>
          <button type="button" className="w-full py-2 bg-red-500 text-white rounded"
            onClick={() => navigate("/home")}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
}
