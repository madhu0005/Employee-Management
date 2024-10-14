import React, { useEffect, useState } from "react";
import './style.css';
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Home = () => {
  const [genderData, setGenderData] = useState({ male: 0, female: 0 });
  const [designationData, setDesignationData] = useState([]); 
  const [courseData, setCourseData] = useState([]); // For courses

  // Fetch employee distribution by designation
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((response) => {
        if (response.data.Status) {
          const employees = response.data.Result;
          const designationCounts = {};
          const courseCounts = {}; // To count course distributions

          // Count employees by designation and courses
          employees.forEach((employee) => {
            const designation = employee.designation || "Unknown"; 
            if (!designationCounts[designation]) {
              designationCounts[designation] = 0;
            }
            designationCounts[designation]++;

            // Count courses
            const courses = employee.courses || [];
            courses.forEach((course) => {
              if (!courseCounts[course]) {
                courseCounts[course] = 0;
              }
              courseCounts[course]++;
            });
          });

          // Prepare data for designation and course pie charts
          const designations = Object.keys(designationCounts).map((designation) => ({
            label: designation,
            value: designationCounts[designation],
          }));

          const courses = Object.keys(courseCounts).map((course) => ({
            label: course,
            value: courseCounts[course],
          }));

          setDesignationData(designations);
          setCourseData(courses); // Set course data for pie chart
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Fetch employee distribution by gender
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((response) => {
        if (response.data.Status) {
          const employees = response.data.Result;
          const maleCount = employees.filter((e) => e.gender === "M").length;
          const femaleCount = employees.filter((e) => e.gender === "F").length;
          setGenderData({ male: maleCount, female: femaleCount });
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Prepare data for the designation pie chart
  const designationPieData = {
    labels: designationData.map(item => item.label),
    datasets: [
      {
        label: "Designation Distribution",
        data: designationData.map(item => item.value),
        backgroundColor: designationData.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
        hoverOffset: 4,
        borderWidth: 2,
        borderColor: '#fff',
        hoverBorderWidth: 3,
        hoverBorderColor: '#000',
      },
    ],
  };

  // Prepare data for the course pie chart
  const coursePieData = {
    labels: courseData.map(item => item.label),
    datasets: [
      {
        label: "Course Distribution",
        data: courseData.map(item => item.value),
        backgroundColor: courseData.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
        hoverOffset: 4,
        borderWidth: 2,
        borderColor: '#fff',
        hoverBorderWidth: 3,
        hoverBorderColor: '#000',
      },
    ],
  };

  // Prepare data for the pie chart (gender distribution)
  const genderPieData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Gender Distribution",
        data: [genderData.male, genderData.female],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4 font-weight-bold">Welcome to Admin Panel</h3>
  
      <div className="grid-container">
        {/* Pie Chart for Designation Distribution */}
        <div className="chart-card">
          <h5 className="text-center font-weight-bold">Designation Distribution</h5>
          <Pie data={designationPieData} />
        </div>
  
        {/* Pie Chart for Course Distribution */}
        <div className="chart-card">
          <h5 className="text-center font-weight-bold">Course Distribution</h5>
          <Pie data={coursePieData} />
        </div>
  
        {/* Pie Chart for Gender Distribution */}
        <div className="chart-card">
          <h5 className="text-center font-weight-bold">Employee Gender Distribution</h5>
          <Pie data={genderPieData} />
        </div>
      </div>
    </div>
  );
  
};

export default Home;
