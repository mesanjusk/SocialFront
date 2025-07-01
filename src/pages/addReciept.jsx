import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from '../config';

export default function AddReciept() {
    const navigate = useNavigate();

    const [Description, setDescription] = useState('');
    const [Amount, setAmount] = useState('');
    const [Transaction_date, setTransaction_date] = useState('');
    const [Total_Debit, setTotal_Debit] = useState('');
    const [Total_Credit, setTotal_Credit] = useState('');
     const [userGroup, setUserGroup] = useState("");
    const [accounts, setAccounts] = useState(''); 
    const [group, setGroup] = useState(''); 
    const [Student, setStudent] = useState(null);
    const [allAccountOptions, setAllAccountOptions] = useState([]); 
    const [accountOptions, setAccountOptions] = useState([]); 
    const [paymentOptions, setPaymentOptions] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [Customer_name, setCustomer_Name] = useState('');
    const [isDateChecked, setIsDateChecked] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
        setLoggedInUser(user.name); 
    }
}, []);


    useEffect(() => {
           axios.get(`${BASE_URL}/api/account/GetAccountList`)
               .then(res => {
                   if (res.data.success) {
                       setAllAccountOptions(res.data.result);
   
                       const accountOptions = res.data.result.filter(item => item.Account_group === "ACCOUNT");
                       setAccountOptions(accountOptions);
                   }
               })
               .catch(err => {
                   console.error("Error fetching customer options:", err);
               });
       }, []);

       useEffect(() => {
           axios.get(`${BASE_URL}/api/paymentmode`)
               .then(res => {
                   
                       setPaymentOptions(res.data);
   
                       
                   
               })
               .catch(err => {
                   console.error("Error fetching payment options:", err);
               });
       }, []);
   

function addAccount() {
        navigate("/addAccount");
    }
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
    
    async function submit(e) {
    e.preventDefault();

    if (!Amount || isNaN(Amount) || Amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    try {
        const Account = allAccountOptions.find(option => option.Account_uuid === accounts);
        const Group = paymentOptions.find(option => option.mode === group);
        const todayDate = new Date().toISOString().split("T")[0];

        if (!Account || !Group) {
            alert("Please select valid customer and mode.");
            return;
        }

        // 👇 Fetch admission_uuid by student_uuid
        const admissionRes = await axios.get(`${BASE_URL}/api/admissions/by-student/${Student.student_uuid}`);
        const admissionData = admissionRes.data;

        if (!admissionData.success || !admissionData.admission) {
            alert("Admission not found for selected student.");
            return;
        }

        const journal = [
            {
                Account_id: accounts,
                Type: 'Debit',
                Amount: Number(Amount),
            },
            {
                Account_id: group,
                Type: 'Credit',
                Amount: Number(Amount),
            }
        ];

        const payload = {
    Description,
    Total_Credit: Number(Amount),
    Total_Debit: Number(Amount),
    Payment_mode: Group.mode,
    Created_by: loggedInUser,
    Transaction_date: Transaction_date || todayDate,
    Journal_entry: journal,
    Admission_uuid: admissionData.admission.uuid,
};


        const response = await axios.post(`${BASE_URL}/api/transaction/addTransaction`, payload);

        if (response.data.success) {
            alert(response.data.message);
            navigate("/dashboard");
        } else {
            alert("Failed to add Transaction");
        }

        return {
            name: Student.Customer_name,
            phone: Student.Mobile_number,
            amount: Amount,
            date: Transaction_date,
            mode: Group.Account_name
        };

    } catch (e) {
        console.error("Error adding Transaction:", e);
        if (e.response) {
            console.error("Response data:", e.response.data);
            console.error("Response status:", e.response.status);
            console.error("Response headers:", e.response.headers);
        }
        alert("Error occurred while submitting the form.");
    }
}

    
      const sendMessageToAPI = async (name, phone, message) => {
        const payload = {
            mobile: phone,
            userName: name,
            type: 'customer',
            message: message,
        };
    
        try {
            const res = await fetch('https://misbackend-e078.onrender.com/usertask/send-message', {
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
    const handleDateCheckboxChange = () => {
        setIsDateChecked(prev => !prev); 
        setTransaction_date(''); 
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
        setTotal_Debit(value);
        setTotal_Credit(value);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setCustomer_Name(value);

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

    const handleOptionClick = (option) => {
        setCustomer_Name(option.Account_name);
        setAccounts(option.Account_uuid); 
        setStudent(option);
        setShowOptions(false);
    };
    
    const closeModal = () => {
        if (userGroup === "Office User") {
            navigate("/home");
        } else if (userGroup === "Admin User") {
            navigate("/home");
        }
    };
    
    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-90">
                <h2>Add Reciept</h2>

                <form onSubmit={submit}>
                    <div className="mb-3 position-relative">
                        <input
                            type="text"
                            placeholder="Search by Name"
                            className="form-control mb-3"
                            value={Customer_name}
                            onChange={handleInputChange}
                            onFocus={() => setShowOptions(true)}
                        />
                        {showOptions && filteredOptions.length > 0 && (
                            <ul className="list-group position-absolute w-100">
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

                    <button onClick={addAccount} type="button" className="btn btn-primary mb-3">
                        Add Account
                    </button>

                    <div className="mb-3">
                        <label htmlFor="remark"><strong>Description</strong></label>
                        <input
                            type="text"
                            autoComplete="off"
                            onChange={(e) => setDescription(e.target.value)}
                            value={Description}
                            placeholder="Description"
                            className="form-control rounded-0"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="amount"><strong>Amount</strong></label>
                        <input
                            type="text"
                            autoComplete="off"
                            onChange={handleAmountChange}
                            value={Amount}
                            placeholder="Amount"
                            className="form-control rounded-0"
                        />
                    </div>

                    <div className="mb-3 position-relative">
                        <label htmlFor="debit-customer"><strong>Mode</strong></label>
                        <select
                            className="form-control rounded-0"
                            onChange={(e) => setGroup(e.target.value)}  
                            value={group}
                            required
                        >
                            <option value="">Select Payment</option>
                            {paymentOptions.map((g, index) => (
                                <option key={index} value={g.mode}>
                                    {g.mode}
                                </option>
                            ))}
                        </select>
                    </div>
                   
                    <div className="mb-3 ">
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
                            <label htmlFor="date"><strong>Date</strong></label>
                            <input
                                type="date"
                                id="date"
                                autoComplete="off"
                                onChange={(e) => setTransaction_date(e.target.value)}
                                value={Transaction_date}
                                className="form-control rounded-0"
                            />
                       </div>
                    )}
                    <button type="submit" className="w-100 h-10 bg-green-500 text-white shadow-lg flex items-center justify-center">
                        Submit
                    </button><br />
                    <button type="button" onClick={handleWhatsAppClick} className="w-100 h-10 bg-green-500 text-white shadow-lg flex items-center justify-center">
                     WhatsApp
                  </button><br />
                    <button type="button" className="w-100 h-10 bg-red-500 text-white shadow-lg flex items-center justify-center" onClick={closeModal}>Close</button>
                </form>
            </div>
        </div>
    );
}
