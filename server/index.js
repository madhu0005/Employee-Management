import express from "express";
import cors from 'cors';
import { adminRouter } from "./Routes/AdminRoute.js";
import jwt from "jsonwebtoken";  // Jwt case changed to lowercase
import cookieParser from "cookie-parser";
import Admin from './models/Admin.js'; // Admin model for checking/creating the default admin
import connectDB from './utils/db.js';  // MongoDB connection import
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env

const app = express();

// Connect to MongoDB using the connectDB utility
connectDB().then(() => {
    // Create default admin if it doesn't exist
    createDefaultAdmin();
}).catch((error) => {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure if the connection fails
}); // Connect to MongoDB when the app starts

// CORS Configuration
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}));

app.use(express.json());  // Parse JSON request bodies
app.use(cookieParser());  // Parse cookies

// Routes
app.use('/auth', adminRouter);
app.use(express.static('Public')); 

// Function to create the default admin user
async function createDefaultAdmin() {
    try {
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin@123', 10); // Hash the default password
            const newAdmin = new Admin({
                username: 'admin',
                password: hashedPassword,
            });
            await newAdmin.save();
            console.log('Default admin created with username: "admin" and password: "admin@123"');
        } else {
            console.log('Default admin already exists');
        }
    } catch (error) {
        console.error(`Error creating default admin: ${error.message}`);
    }
}// Serve static files from 'Public' directory

// Middleware for verifying user JWT tokens
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {  // Use JWT secret from .env
            if (err) return res.json({ Status: false, Error: "Wrong Token" });
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        });
    } else {
        return res.json({ Status: false, Error: "Not authenticated" });
    }
};

// Route to verify authentication
app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});

// Start server on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
