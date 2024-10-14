import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import Admin from "../models/Admin.js";  // Import Admin model
import Employee from "../models/Employee.js";  // Import Employee model
import dotenv from "dotenv";

dotenv.config();  // Load environment variables

const router = express.Router();

// Admin registration
router.post('/register_admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.json({ Status: false, Error: "Admin with this username already exists" });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new admin
        const newAdmin = new Admin({
            username,
            password: hashedPassword
        });

        // Save the new admin
        await newAdmin.save();
        return res.json({ Status: true, Result: "Admin registered successfully" });
    } catch (error) {
        console.error(error);
        return res.json({ Status: false, Error: "Query error" });
    }
});


// Admin login
router.post("/adminlogin", async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username });
        if (admin && await bcrypt.compare(req.body.password, admin.password)) {
            const token = jwt.sign(
                { role: "admin", username: admin.username },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });
            return res.json({ loginStatus: true, username: admin.username });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong username or password" });
        }
    } catch (error) {
        console.error(error);
        return res.json({ loginStatus: false, Error: "Query error" });
    }
});



// Set up multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'Public/Images');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
  router.post('/add_employee', upload.single('image'), async (req, res) => {
    try {
      const { name, email, mobile, gender, designation, courses } = req.body;
      const image = req.file ? req.file.filename : null;
  
      // Ensure required fields are present
      if (!name || !email || !mobile || !gender || !designation || !courses || !image) {
        return res.status(400).json({ Status: false, Error: 'All fields are required' });
      }
  
      const newEmployee = new Employee({
        name,
        email,
        mobile,
        gender,
        designation,
        courses: courses.split(','),
        image,
      });
  
      await newEmployee.save();
      res.status(200).json({ Status: true });
    } catch (err) {
      console.error(err);  // Log exact error for debugging
      res.status(500).json({ Status: false, Error: 'Failed to add employee' });
    }
  });
  // Search employees by keyword
router.get('/employee/search', async (req, res) => {
    const keyword = req.query.keyword;
    try {
      const employees = await Employee.find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } },
          { mobile: { $regex: keyword, $options: 'i' } },
          { designation: { $regex: keyword, $options: 'i' } },
        ]
      });
      return res.json({ Status: true, Result: employees });
    } catch (error) {
      return res.json({ Status: false, Error: "Search Query Error" });
    }
  });
  

// Get all employees
router.get('/employee', async (req, res) => {
    try {
        const employees = await Employee.find();
        return res.json({ Status: true, Result: employees });
    } catch (error) {
        return res.json({ Status: false, Error: "Query Error" });
    }
});

// Get a specific employee by ID
router.get('/employee/:id', async (req, res) => {
    const id = req.params.id;  // Extract the employee ID from the URL
    try {
        const employee = await Employee.findById(id);  // Find the employee by ID
        if (employee) {
            return res.json({ Status: true, Result: employee });  // Return employee if found
        } else {
            return res.json({ Status: false, Error: "Employee not found" });  // Return error if no employee found
        }
    } catch (error) {
        return res.json({ Status: false, Error: "Query Error" });  // Return error for database query issues
    }
});

// Edit an existing employee by ID
router.put('/edit_employee/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;
    try {
        const { name, email, mobile, gender, designation, courses } = req.body;
        const image = req.file ? req.file.filename : null;

        // Find and update the employee
        const updatedEmployee = await Employee.findById(id);
        if (!updatedEmployee) {
            return res.status(404).json({ Status: false, Error: "Employee not found" });
        }

        // Update fields
        updatedEmployee.name = name || updatedEmployee.name;
        updatedEmployee.email = email || updatedEmployee.email;
        updatedEmployee.mobile = mobile || updatedEmployee.mobile;
        updatedEmployee.gender = gender || updatedEmployee.gender;
        updatedEmployee.designation = designation || updatedEmployee.designation;
        updatedEmployee.courses = courses ? courses.split(',') : updatedEmployee.courses;
        if (image) {
            updatedEmployee.image = image; // Update image only if new image uploaded
        }

        // Save the updated employee
        await updatedEmployee.save();
        return res.status(200).json({ Status: true, Result: updatedEmployee });
    } catch (error) {
        return res.status(500).json({ Status: false, Error: "Query Error" });
    }
});


// Delete an employee by ID
router.delete('/delete_employee/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Employee.findByIdAndDelete(id);
        return res.json({ Status: true, Result: "Employee deleted" });
    } catch (error) {
        return res.json({ Status: false, Error: "Query Error" });
    }
});

// Admin logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});

export { router as adminRouter };
