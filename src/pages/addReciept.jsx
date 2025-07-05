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
    const institute_uuid = localStorage.getItem("institute_uuid");


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
        setAccounts(option.uuid);
        setStudent(option);
        setShowOptions(false);
        setFilteredOptions([]); // Clear dropdown after select
    };

     const handleWhatsAppClick = async (e) => {
        e.preventDefault(); 
    
        try {
            const whatsappInfo = await submit(e);  
            if (!whatsappInfo) return;
    
            const { name, phone, amount, date, mode } = whatsappInfo;
    
            if (!phone) {
                alert("Customer phone number is missing.");
                return;
            }
    
            const message = `Hello ${name}, we have received your payment of ₹${amount} on ${date} via ${mode}. Thank you!`;
    
            const confirmed = window.confirm(`Send WhatsApp message to ${name}?\n\n"${message}"`);
            if (!confirmed) return;
    
            await sendMessageToAPI(name, phone, message);
    
            navigate("/home");
    
        } catch (error) {
            console.error("Failed to process WhatsApp order flow:", error);
        }
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
            const Account = allAccountOptions.find(option => option.uuid === accounts);
            const Group = paymentOptions.find(option => option.mode === group);
            const todayDate = new Date().toISOString().split("T")[0];

          
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
                institute_uuid,
            };

            // Save to backend
            const response = await axios.post(`${BASE_URL}/api/transaction/addTransaction`, payload);

            if (response.data.success) {
                alert(response.data.message);
                navigate("/dashboard");
            } else {
                alert("Failed to add Transaction");
            }
             return {
                name: Account.Account_name,
                phone: Account.Mobile_number,
                amount: amount,
                date: transactionDate,
                mode: Group.mode
            };
        } catch (e) {
            console.error("Error adding Transaction:", e);
            alert("Error occurred while submitting the form.");
        }
    }

   

    // --- Amount Input Change ---
    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
    };

   const sendMessageToAPI = async (name, phone, message) => {
        const payload = {
            mobile: phone,
            userName: name,
            type: 'customer',
            message: message,
        };
    
        try {
            const res = await fetch(`${BASE_URL}/api/institute/send-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
    
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to send message: ${errorText}`);
            }
    
            const result = await res.json();
            if (result.error) {
                alert("Failed to send: " + result.error);
            } else {
                alert("Message sent successfully.");
            }
        } catch (error) {
            console.error("Request failed:", error);
            alert("Failed to send message: " + error.message);
        }
    
  };


    // --- Render ---
    return (
        <div className="flex justify-center items-center bg-secondary min-h-screen">
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Add Receipt</h2>
                <form onSubmit={submit}>
                    
                            <label className="block mb-2">Date</label>
                            <input
                                type="date"
                                onChange={e => setTransactionDate(e.target.value)}
                                value={transactionDate}
                                className="form-control mb-3"
                            />
                    
                    <label className="block mb-2">Customer</label>
                        <input
                            type="text"
                            placeholder="Search customer"
                            className="form-control mb-1"
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
                    
                    {/* --- REMOVED: Add Account Button --- */}
                    
                    
                       <label className="block mb-2">Amount</label>
                        <input
                            type="number"
                            onChange={handleAmountChange}
                            value={amount}
                            placeholder="Amount"
                            className="form-control mb-3"
                             min="0"
                             required
                        />
                                   
                        <label className="block mb-2">Payment Mode</label>
                        <select
                            className="form-control mb-3"
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
                    
                 <label className="block mb-2">Description</label>
                        <input
                            type="text"
                            onChange={e => setDescription(e.target.value)}
                            value={description}
                            placeholder="Description"
                            className="form-control mb-4"
                        />
                   
                    <button type="submit" className="w-full py-2 mb-2 bg-green-600 text-white rounded">
                        Submit
                    </button>
                    <button type="button" className="w-full py-2 mb-2 bg-green-500 text-white rounded" onClick={handleWhatsAppClick}>
                        WhatsApp
                    </button>
                    {/* --- REMOVED: WhatsApp Button --- */}
                    <button type="button" className="w-full py-2 bg-red-500 text-white rounded" onClick={() => navigate("/home")}>
                        Close
                    </button>
                </form>
            </div>
        </div>
    );
}
