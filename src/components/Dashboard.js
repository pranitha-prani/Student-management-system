import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSchool, FaUniversity, FaBuilding, FaChalkboardTeacher,FaLayerGroup} from 'react-icons/fa';
import '../components/TotalSchoolsComponent.css';

const TotalSchoolsComponent = () => {
  const [totalSchools, setTotalSchools] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  
  useEffect(() => {
    // Fetch total number of schools
    axios.post("http://localhost:8080/api/schoolId/getallschoolId")
      .then(response => {
        const totalSchools = response.data.length;
        setTotalSchools(totalSchools);
      })
      .catch(error => {
        console.error("Error fetching total number of schools:", error);
      });

    // Fetch total number of students
    axios.post("http://localhost:8080/api/applicationId/getallapplicationId")
      .then(response => {
        const totalStudents = response.data.length;
        setTotalStudents(totalStudents);
      })
      .catch(error => {
        console.error("Error fetching total number of students:", error);
      });

    // Fetch total number of classes
    axios.post("http://localhost:8080/api/classId/getallclassId")
      .then(response => {
        const totalClasses = response.data.length;
        setTotalClasses(totalClasses);
      })
      .catch(error => {
        console.error("Error fetching total number of classes:", error);
      });

      // Fetch total number of sections
    axios.post("http://localhost:8080/api/sectionId/getallsectionId")
    .then(response => {
      const totalSections = response.data.length;
      setTotalSections(totalSections);
    })
    .catch(error => {
      console.error("Error fetching total number of sections:", error);
    });
  }, []);


  return (
    <div className="dashboard-container">
      <div className="box">
        <FaSchool className="icon" />
        <h3>Total Schools</h3>
        <p>{totalSchools}</p>
      </div>
      
      <div className="box">
        <FaBuilding className="icon" />
        <h3>Total Grades</h3>
        <p>{totalClasses}</p>
      </div>
      <div className="box">
        <FaLayerGroup className="icon" />
        <h3>Total Sections</h3>
        <p>{totalSections}</p>
      </div>
      <div className="box">
        <FaUniversity className="icon" />
        <h3>Total Students</h3>
        <p>{totalStudents}</p>
      </div>
      <div className="box">
        <FaChalkboardTeacher className="icon" />
        <h3>Teachers</h3>
        <p>30</p>
      </div>
    </div>
  );
};

export default TotalSchoolsComponent;
