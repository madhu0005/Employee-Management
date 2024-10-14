import axios from 'axios';
import './style.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  // Fetch employees on load
  useEffect(() => {
    axios
      .get('http://localhost:3000/auth/employee')
      .then((result) => {
        setEmployees(result.data.Result);
        setFilteredEmployees(result.data.Result); // Initially show all employees
      })
      .catch((err) => console.log(err));
  }, []);

  // Search employees
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(keyword) ||
      employee.email.toLowerCase().includes(keyword) ||
      employee.mobile.includes(keyword) ||
      employee.designation.toLowerCase().includes(keyword)
    );
    setFilteredEmployees(filtered);
  };

  // Delete an employee
  const handleDelete = (id) => {
    axios
      .delete('http://localhost:3000/auth/delete_employee/' + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload(); // Reload the page to refresh employee data
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
<div className="custom-container">
{/* Header section with Total Count, Search Field, and Create Employee */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Employee List</h3>
        <div className="d-flex align-items-center">
          <span className="me-3 fs-5">Total Count: {filteredEmployees.length}</span>
          <div className="input-group me-4">
            <span className="input-group-text">
              <i className="fas fa-search"></i> {/* FontAwesome search icon */}
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Search Keyword"
              value={searchKeyword}
              onChange={handleSearch}
            />
          </div>
          <Link to="/dashboard/add_employee" className="btn btn-success btn-auto">
  Create Employee
</Link>

        </div>
      </div>

      {/* Employee Table */}
      <div className="table-responsive"> {/* Add responsive behavior */}
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Unique Id</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile No</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Courses</th>
              <th>Create Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee._id}</td>
                <td>
                  <img
                    src={`http://localhost:3000/Images/${employee.image}`}
                    alt="Employee"
                    className="img-fluid"
                    width="70"
                    height="70"
                  />
                </td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.mobile}</td>
                <td>{employee.designation}</td>
                <td>{employee.gender === 'M' ? 'Male' : 'Female'}</td>
                <td>{employee.courses.join(', ')}</td>
                <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/dashboard/edit_employee/${employee._id}`} className="btn btn-info btn-sm me-2">
                    Edit
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(employee._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
