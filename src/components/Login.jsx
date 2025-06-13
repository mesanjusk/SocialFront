import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    async function submit(e) {
        e.preventDefault();
    
        try {
            const response = await axios.post("https://socialbackend-iucy.onrender.com/api/auth/login", {
                name,
                password
            });
            const data = response.data;
    
            if (data.status === "notexist") {
                alert("User has not signed up");
                return;
            } else if (data.status === "invalid") {
                alert("Invalid credentials. Please check your username and password.");
                return;
            }
    
            const type = data.type; 
            
            if (!type) {
                alert("User type not found in API response");
                return;
            }
    
            localStorage.setItem('name', name);
            localStorage.setItem('type', type); 
            
navigate("/dashboard", { state: { id: name } });
          
        } catch (e) {
            alert("An error occurred during login. Please try again.");
            console.log(e);
        }
    }
    
    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-90">
                <h1>Login</h1>
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label htmlFor="name"><strong>Name</strong></label>
                        <input
                            type="text"
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="form-control rounded-0"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Password"><strong>Password</strong></label>
                        <input
                            type="password"
                            autoComplete="off"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="form-control rounded-0"
                            required
                        />
                    </div>
                    <button type="submit" className="w-100 h-10 bg-green-400 text-white shadow-lg flex items-center justify-center">Submit</button>
                </form>
            </div>
        </div>
    );
}
