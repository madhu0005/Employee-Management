import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import './style.css';
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername); // Load username from localStorage
    }
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
      .then(result => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          localStorage.removeItem("username"); // Clear username on logout
          navigate('/');
        }
      });
  };

  return (
    <>
      <header className="bg-dark text-white py-3 shadow">
        <div className="container d-flex justify-content-between align-items-center">
          
          {/* Left section with logo, Home, and Employee List */}
          <div className="d-flex align-items-center">
          {/* Logo */}
<Link to="/dashboard" className="text-white text-decoration-none me-4">
  <img src="/Images/dealsdray_logo.jpeg" alt="Logo" className="header-logo" />
</Link>


            {/* Navigation Links */}
            <nav className="ms-4"> {/* Add margin-left to increase distance */}
            <ul className="nav">
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link text-white">
                    <i className="bi bi-house"></i> Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard/employee" className="nav-link text-white">
                    <i className="bi bi-people"></i> Employee List
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Right section with Profile and Logout */}
          <div className="d-flex align-items-center">
            
            <span className="nav-link text-white me-3">
              <i className="bi bi-person"></i> {username || "Profile"}
            </span>
            <button onClick={handleLogout} className="btn nav-link text-white ms-4">
              <i className="bi bi-power"></i> Logout
            </button>
          </div>

        </div>
      </header>

      <div>
        <Outlet />
      </div>
    </>
  );
};

export default Header;
