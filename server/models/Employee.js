import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  courses: {
    type: [String],
    required: true
  },
  image: {
    type: String, // This will store the image filename
    required: false // Optional field (you can set it as required based on your use case)
  }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
