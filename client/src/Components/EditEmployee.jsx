import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams(); // Get the employee ID from the URL
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    mobile: '',
    gender: '',
    designation: '',
    courses: [],
    image: '',
  });
  const navigate = useNavigate();

  // Fetch employee details by ID
  useEffect(() => {
    axios
      .get('http://localhost:3000/auth/employee/' + id)
      .then((result) => {
        const data = result.data.Result;
        setEmployee({
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          gender: data.gender,
          designation: data.designation,
          courses: data.courses,
          image: data.image,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('mobile', employee.mobile);
    formData.append('gender', employee.gender);
    formData.append('designation', employee.designation);
    formData.append('courses', employee.courses.join(','));

    if (typeof employee.image === 'object') {
      formData.append('image', employee.image); // only append if a new image is uploaded
    }

    axios
      .put('http://localhost:3000/auth/edit_employee/' + id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((result) => {
        if (result.data.Status) {
          navigate('/dashboard/employee'); // Navigate back to employee page
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  // Handle course checkbox changes
  const handleCourseChange = (e) => {
    const selectedCourses = employee.courses;
    if (e.target.checked) {
      setEmployee({ ...employee, courses: [...selectedCourses, e.target.value] });
    } else {
      setEmployee({ ...employee, courses: selectedCourses.filter((course) => course !== e.target.value) });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">Name</label>
            <input
              type="text"
              className="form-control rounded-0"
              name="name"
              value={employee.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Email */}
          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded-0"
              name="email"
              value={employee.email}
              onChange={handleInputChange}
            />
          </div>

          {/* Mobile */}
          <div className="col-12">
            <label htmlFor="inputMobile" className="form-label">Mobile No</label>
            <input
              type="text"
              className="form-control rounded-0"
              name="mobile"
              value={employee.mobile}
              onChange={handleInputChange}
            />
          </div>

          {/* Designation */}
          <div className="col-12">
            <label htmlFor="inputDesignation" className="form-label">Designation</label>
            <select
              name="designation"
              className="form-select"
              value={employee.designation}
              onChange={handleInputChange}
            >
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          {/* Gender */}
          <div className="col-12">
            <label className="form-label">Gender</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={employee.gender === 'M'}
                  onChange={handleInputChange}
                /> Male
              </label>
              <label className="ms-3">
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={employee.gender === 'F'}
                  onChange={handleInputChange}
                /> Female
              </label>
            </div>
          </div>

          {/* Courses */}
          <div className="col-12">
            <label className="form-label">Courses</label>
            <div>
              <label>
                <input
                  type="checkbox"
                  value="MCA"
                  checked={employee.courses.includes('MCA')}
                  onChange={handleCourseChange}
                /> MCA
              </label>
              <label className="ms-3">
                <input
                  type="checkbox"
                  value="BCA"
                  checked={employee.courses.includes('BCA')}
                  onChange={handleCourseChange}
                /> BCA
              </label>
              <label className="ms-3">
                <input
                  type="checkbox"
                  value="BSC"
                  checked={employee.courses.includes('BSC')}
                  onChange={handleCourseChange}
                /> BSC
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div className="col-12 mb-3">
            <label htmlFor="inputGroupFile01" className="form-label">Select Image (JPG/PNG)</label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              onChange={(e) => setEmployee({ ...employee, image: e.target.files[0] })}
            />
          </div>

          {/* Submit Button */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
