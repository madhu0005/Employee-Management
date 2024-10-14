import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    designation: "",
    courses: [],
    image: null,  // Keep image as null initially
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation function
  const validateForm = () => {
    let formErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!employee.name) formErrors.name = "Name is required";
    if (!employee.email || !emailRegex.test(employee.email)) formErrors.email = "Valid email is required";
    if (!employee.mobile || !mobileRegex.test(employee.mobile)) formErrors.mobile = "Valid mobile number is required";
    if (!employee.gender) formErrors.gender = "Gender is required";
    if (!employee.designation) formErrors.designation = "Designation is required";
    if (employee.courses.length === 0) formErrors.courses = "At least one course must be selected";
    if (!employee.image) formErrors.image = "Image is required";
    else if (!employee.image.name.match(/\.(jpg|png)$/)) formErrors.image = "Only jpg/png files are allowed";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = new FormData();
      formData.append("name", employee.name);
      formData.append("email", employee.email);
      formData.append("mobile", employee.mobile);
      formData.append("gender", employee.gender);
      formData.append("designation", employee.designation);
      formData.append("courses", employee.courses.join(","));
      formData.append("image", employee.image); // Append image file

      axios
        .post("http://localhost:3000/auth/add_employee", formData)
        .then((result) => {
          if (result.data.Status) {
            navigate("/dashboard/employee"); // Redirect on success
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>

          {/* Name */}
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>

          {/* Email */}
          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail"
              placeholder="Enter Email"
              value={employee.email}
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          {/* Other fields */}
          {/* Mobile */}
          <div className="col-12">
            <label htmlFor="inputMobile" className="form-label">
              Mobile No
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputMobile"
              placeholder="Enter Mobile Number"
              value={employee.mobile}
              onChange={(e) => setEmployee({ ...employee, mobile: e.target.value })}
            />
            {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
          </div>

          {/* Designation */}
          <div className="col-12">
            <label htmlFor="inputDesignation" className="form-label">
              Designation
            </label>
            <select
              id="inputDesignation"
              className="form-select"
              value={employee.designation}
              onChange={(e) => setEmployee({ ...employee, designation: e.target.value })}
            >
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
            {errors.designation && <small className="text-danger">{errors.designation}</small>}
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
                  checked={employee.gender === "M"}
                  onChange={(e) => setEmployee({ ...employee, gender: e.target.value })}
                /> Male
              </label>
              <label className="ms-3">
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={employee.gender === "F"}
                  onChange={(e) => setEmployee({ ...employee, gender: e.target.value })}
                /> Female
              </label>
            </div>
            {errors.gender && <small className="text-danger">{errors.gender}</small>}
          </div>

          {/* Courses */}
          <div className="col-12">
            <label className="form-label">Courses</label>
            <div>
              <label>
                <input
                  type="checkbox"
                  value="MCA"
                  onChange={(e) =>
                    setEmployee({
                      ...employee,
                      courses: e.target.checked
                        ? [...employee.courses, "MCA"]
                        : employee.courses.filter((course) => course !== "MCA"),
                    })
                  }
                />{" "}
                MCA
              </label>
              <label className="ms-3">
                <input
                  type="checkbox"
                  value="BCA"
                  onChange={(e) =>
                    setEmployee({
                      ...employee,
                      courses: e.target.checked
                        ? [...employee.courses, "BCA"]
                        : employee.courses.filter((course) => course !== "BCA"),
                    })
                  }
                />{" "}
                BCA
              </label>
              <label className="ms-3">
                <input
                  type="checkbox"
                  value="BSC"
                  onChange={(e) =>
                    setEmployee({
                      ...employee,
                      courses: e.target.checked
                        ? [...employee.courses, "BSC"]
                        : employee.courses.filter((course) => course !== "BSC"),
                    })
                  }
                />{" "}
                BSC
              </label>
            </div>
            {errors.courses && <small className="text-danger">{errors.courses}</small>}
          </div>

          {/* Image Upload */}
          <div className="col-12 mb-3">
            <label htmlFor="inputGroupFile01" className="form-label">
              Select Image (JPG/PNG)
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              onChange={(e) => setEmployee({ ...employee, image: e.target.files[0] })}
            />
            {errors.image && <small className="text-danger">{errors.image}</small>}
          </div>

          {/* Submit Button */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
