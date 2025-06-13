import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios"

export default function Register() {
    const navigate = useNavigate();

    const [name,setName]=useState('')
    const [password,setPassword]=useState('')
    const [mobile,setMobile]=useState('')
    const [type,setType]=useState('')

    async function submit(e){
        e.preventDefault();
        try{
            await axios.post("https://socialbackend-iucy.onrender.com/api/auth/register",{
                name, password, mobile, type
            })
            .then(res=>{
                if(res.data=="exist"){
                    alert("User already exists")
                }
                else if(res.data=="notexist"){
                    alert("User added successfully")
                    navigate("/")
                }
            })
            .catch(e=>{
                alert("wrong details")
                console.log(e);
            })
        }
        catch(e){
            console.log(e);

        }
    }


    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
           
            <div className="bg-white p-3 rounded w-90">
            <h2>Add User</h2>

            <form action="POST">
                <div className="mb-3">
                    <label htmlFor="Username"><strong>Name</strong></label>
                <input type="name" autoComplete="off" onChange={(e) => { setName(e.target.value) }} placeholder="Enter Name" className="form-control rounded-0" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password"><strong>Password</strong></label>
                <input type="password" autoComplete="off" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" className="form-control rounded-0" />
                </div>
                <div className="mb-3">
                <label htmlFor="mobile"><strong>Mobile</strong></label>
                <input type="mobile" autoComplete="off" onChange={(e) => { setMobile(e.target.value) }} placeholder="Enter Number" className="form-control rounded-0" />
                </div>  
                <div className="mb-3">
                <label htmlFor="mobile"><strong>User Type</strong></label>
                <select value={type} onChange={(e) => { setType(e.target.value) }} className="p-2 border rounded" required>
                <option value="">Select User Type</option>
                <option value="Owner">Owner</option>
                <option value="Reseller">Reseller</option>
                <option value="Brand">Brand</option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Faculties">Faculties</option>
                <option value="Student">Student</option>
              </select>
                </div>              
                <button type="submit" onClick={submit} className="btn btn-success w-100 rounded-0"> Submit </button>

            </form>
            </div>
        </div>
    );
}

