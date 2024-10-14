import React, { useState } from 'react';
import './style.css';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [values, setValues] = useState({
        username: '',  
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/adminlogin', values)
        .then(result => {
            if (result.data.loginStatus) {
                localStorage.setItem("valid", true);
                localStorage.setItem("username", result.data.username); // Store username
                navigate('/dashboard');
            } else {
                setError(result.data.Error);
            }
        })
        .catch(err => console.log(err));
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>

            <div className='p-3 rounded w-25  border loginForm'>

                <div className='text-warning'>
                    {error && error}
                </div>
            {/* Flexbox for logo and heading side by side */}
        <div className='d-flex align-items-center justify-content-center mb-4'>
            <img src="/Images/logo.jpg" alt="Logo" className="logo-image mb-0" />
            <h2 className='mb-0'>Login Page</h2>
        </div>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Username:</strong></label>
                        <input 
                            type="text" 
                            name='username' 
                            autoComplete='off' 
                            placeholder='Enter Username'
                            onChange={(e) => setValues({ ...values, username: e.target.value })} 
                            className='form-control rounded-2' 
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password:</strong></label>
                        <input 
                            type="password" 
                            name='password' 
                            placeholder='Enter Password'
                            onChange={(e) => setValues({ ...values, password: e.target.value })} 
                            className='form-control rounded-2' 
                        />
                    </div>
                    <button className="custom-login-btn">Log in</button>
                    <div className='mb-1'>
                        <input type="checkbox" name="tick" id="tick" className='me-2'/>
                        <label htmlFor="password">You are Agree with terms & conditions</label>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
