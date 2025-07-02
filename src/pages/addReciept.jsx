import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from '../config';

export default function AddReceipt() {
    const navigate = useNavigate();

    // --- State Declarations ---
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [accounts, setAccounts] = useState('');
    const [group, setGroup] = useState('');
    const [student, setStudent] = useState(null);
    const [allAccountOptions, setAllAccountOptions] = useState([]);
    const [accountOptions, setAccountOptions] = useState([]);
    const [paymentOptions, setPaymentOptions] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [isDateChecked, setIsDateChecked] = useState(false);

    // --- Load user from localStorage ---
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.name) setLoggedInUser(user.name);
    }, []);

    // --- Fetch all accounts ---
    useEffect(() => {
        axios.get(`${BASE_URL}/api/account/GetAccountList`)
            .then(res => {
                if (res.data.success) {
                    setAllAccountOptions(res.data.result);
                    const options = res.data.result.filter(item => item.Account_group === "ACCOUNT");
                    setAccountOptions(options);
                }
            }).catch(err => {
                alert("Error fetching accounts");
                console.error(err);
            });
    }, []);

    // --- Fetch payment modes ---
    useEffect(() => {
        axios.get(`${BASE_URL}/api/paymentmode`)
            .then(res => setPaymentOptions(res.data))
            .catch(err => {
                alert("Error fetching payment modes");
                console.error(err);
            });
    }, []);

    // --- Account Search Input Change ---
    const handleInputChange = (e) => {
        const value = e.target.value;
        setCustomerName(value);

        if (value) {
            const filtered = allAccountOptions.filter(option =>
                option.Account_name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredOptions(filtered);
            setShowOptions(true);
        } else {
            setShowOptions(false);
        }
    };

    // --- Account Option Select ---
    const handleOptionClick = (option) => {
        setCustomerName(option.Account_name);
        setAccounts(option.Account_uuid);
        setStudent(option);
        setShowOptions(false);
        setFilteredOptions([]); // Clear dropdown after select
    };

    // --- Form Submission (Save Receipt) ---
    async function submit(e) {
        e.preventDefault();

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        if (!accounts || !group) {
            alert("Select both account and payment mode.");
            return;
        }

        try {
            // Find selected account/mode objects
            const Account = allAccountOptions.find(option => option.Account_uuid === accounts);
            const Group = paymentOptions.find(option => option.mode === group);
            const todayDate = new Date().toISOString().split("T")[0];

            // Fetch admission by student uuid
            const admissionRes = await axios.get(`${BASE_URL}/api/admissions/by-student/${student?.student_uuid}`);
            const admissionData = admissionRes.data;
            if (!admissionData.success || !admissionData.admission) {
                alert("Admission not found for selected student.");
                return;
            }

            // Journal entry
            const journal = [
                {
                    Account_id: accounts,
                    Type: 'Debit',
                    Amount: Number(amount),
                },
                {
                    Account_id: Group.account_uuid || group,
                    Type: 'Credit',
                    Amount: Number(amount),
                }
            ];

            // Prepare payload
            const payload = {
                Description: description,
                Total_Credit: Number(amount),
                Total_Debit: Number(amount),
                Payment_mode: Group.mode,
                Created_by: loggedInUser,
                Transaction_date: transactionDate || todayDate,
                Journal_entry: journal,
                Admission_uuid: admissionData.admission.uuid,
            };

            // Save to backend
            const response = await axios.post(`${BASE_URL}/api/transaction/addTransaction`, payload);

            if (response.data.success) {
                alert(response.data.message);
                navigate("/dashboard");
            } else {
                alert("Failed to add Transaction");
            }
        } catch (e) {
            console.error("Error adding Transaction:", e);
            alert("Error occurred while submitting the form.");
        }
    }

    // --- Date Checkbox Change ---
    const handleDateCheckboxChange = () => {
        setIsDateChecked(prev => !prev);
        setTransactionDate('');
    };

    // --- Amount Input Change ---
    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
    };

    // --- Close Modal/Go Back ---
    const closeModal = () => {
        navigate("/home");
    };

    // --- Render ---
    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-90">
                <h2>Add Receipt</h2>
                <form onSubmit={submit}>
                    <div className="mb-3 position-relative">
                        <input
                            type="text"
                            placeholder="Search by Name"
                            className="form-control mb-3"
                            value={customerName}
                            onChange={handleInputChange}
                            onFocus={() => setShowOptions(true)}
                        />
                        {showOptions && filteredOptions.length > 0 && (
                            <ul className="list-group position-absolute w-100" style={{ zIndex: 999 }}>
                                {filteredOptions.map((option, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleOptionClick(option)}
                                    >
                                        {option.Account_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* --- REMOVED: Add Account Button --- */}
                    <div className="mb-3">
                        <label><strong>Description</strong></label>
                        <input
                            type="text"
                            autoComplete="off"
                            onChange={e => setDescription(e.target.value)}
                            value={description}
                            placeholder="Description"
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3">
                        <label><strong>Amount</strong></label>
                        <input
                            type="text"
                            autoComplete="off"
                            onChange={handleAmountChange}
                            value={amount}
                            placeholder="Amount"
                            className="form-control rounded-0"
                        />
                    </div>
                    <div className="mb-3 position-relative">
                        <label><strong>Mode</strong></label>
                        <select
                            className="form-control rounded-0"
                            onChange={e => setGroup(e.target.value)}
                            value={group}
                            required
                        >
                            <option value="">Select Payment</option>
                            {paymentOptions.map((g, idx) => (
                                <option key={idx} value={g.mode}>
                                    {g.mode}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="dateCheckbox"
                            checked={isDateChecked}
                            onChange={handleDateCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="dateCheckbox">
                            Save Date
                        </label>
                    </div>
                    {isDateChecked && (
                        <div className="mb-3">
                            <label><strong>Date</strong></label>
                            <input
                                type="date"
                                autoComplete="off"
                                onChange={e => setTransactionDate(e.target.value)}
                                value={transactionDate}
                                className="form-control rounded-0"
                            />
                        </div>
                    )}
                    <button type="submit" className="btn btn-success w-100">
                        Submit
                    </button>
                    <br />
                    {/* --- REMOVED: WhatsApp Button --- */}
                    <button type="button" className="btn btn-danger w-100 mt-2" onClick={closeModal}>
                        Close
                    </button>
                </form>
            </div>
        </div>
    );
}
