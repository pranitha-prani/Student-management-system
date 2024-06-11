import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Input, message, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const StudentPage = () => {
    const [studentPageData, setStudentPageData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('school');

    useEffect(() => {
        // Fetch student page data from the backend
        axios.get('http://localhost:8080/api/studentpage/getallstudentpage')
            .then(response => {
                setStudentPageData(response.data);
            })
            .catch(error => {
                console.error('Error fetching student page data:', error);
            });
    }, []); // Empty dependency array ensures useEffect runs only once

    // Handle search criteria change
    const handleSearchCriteriaChange = (value) => {
        setSearchCriteria(value);
    };

    // Filter student data based on search criteria and term
    const filteredStudentData = studentPageData.filter((studentData) => {
        const fieldValue = studentData[searchCriteria].toString().toLowerCase();
        return fieldValue.includes(searchTerm.toLowerCase());
    });

    return (
        <div>
            <h2>Student Page Details</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Select
                    placeholder="Select Column"
                    style={{ width: 150, marginRight: '1rem' }}
                    onChange={handleSearchCriteriaChange}
                >
                    <Option value="admissionNumber">Admission Number</Option>
                    <Option value="academicYear">Academic Year</Option>
                    <Option value="board">Board</Option>
                    <Option value="school">School</Option>
                    <Option value="firstName">First Name</Option>
                    <Option value="lastName">Last Name</Option>
                    <Option value="fatherName">Father Name</Option>
                    <Option value="motherName">Mother Name</Option>
                    <Option value="country">Country</Option>
                    <Option value="state">State</Option>
                </Select>
                <Input
                    placeholder="Search here"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 160, marginRight: '1rem' }}
                    prefix={<SearchOutlined />}
                />
            </div>
            <div>
                {filteredStudentData.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Admission Number</th>
                                <th>Academic Year</th>
                                <th>Board</th>
                                <th>School</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Father Name</th>
                                <th>Mother Name</th>
                                <th>Country</th>
                                <th>State</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudentData.map((studentData, index) => (
                                <tr key={index}>
                                    <td>{studentData.admissionNumber}</td>
                                    <td>{studentData.academicYear}</td>
                                    <td>{studentData.board}</td>
                                    <td>{studentData.school}</td>
                                    <td>{studentData.firstName}</td>
                                    <td>{studentData.lastName}</td>
                                    <td>{studentData.fatherName}</td>
                                    <td>{studentData.motherName}</td>
                                    <td>{studentData.country}</td>
                                    <td>{studentData.state}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No student data found</p>
                )}
            </div>
        </div>
    );
};

export default StudentPage;
