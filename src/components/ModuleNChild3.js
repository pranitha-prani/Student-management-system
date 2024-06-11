import React, { memo, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Form, Modal, Input, message, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { Option } = Select;

function ModuleNChild3() {
    const [schoolclass, setSchoolclass] = useState([]);
    const [editingSchoolClass, setEditingSchoolClass] = useState({});
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [schools, setSchools] = useState([]); // State variable to hold the list of schools
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('school_name'); // Default search criteria
    const userRoles = JSON.parse(localStorage.getItem('roles'));
    const [form] = Form.useForm();
    const [duplicateError, setDuplicateError] = useState('');
    useEffect(() => {
        getAll(); // Fetch data when the component mounts
        // Fetch list of schools when the component mounts
        axios.post("http://localhost:8080/api/user/getallschool")
            .then(response => {
                const data = response.data;
                setSchools(data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const getAll = () => {
        axios.post("http://localhost:8080/api/user/getallschoolclass")
            .then(response => {
                const data = response.data;
                const sortedData = data.sort((a, b) => b.id - a.id);
                setSchoolclass(sortedData);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleEditClick = (schoolClass) => {
        form.setFieldsValue({
            school_name: schoolClass.school_name,
            grade: schoolClass.grade,
        });
        setEditingSchoolClass({
            id: schoolClass.id,
            school_name: schoolClass.school_name,
            grade: schoolClass.grade,
        });
        setIsEditModalVisible(true);
    };
    
      
    

    const handleViewClick = (schoolClass) => {
        setEditingSchoolClass(schoolClass);
        setIsViewModalVisible(true);
    };
    const onFinish = () => {
        form
            .validateFields()
            .then((values) => {
                const updatedSchoolClassData = {
                    ...editingSchoolClass,
                    ...values,
                };
                setEditingSchoolClass(updatedSchoolClassData);
                handleEditModalOk(); // Proceed with saving the data
            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
            });
    };
    
    const handleDeleteClick = (schoolClass) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this school class?");
        
        if (confirmDelete) {
            // Make an axios DELETE request to delete the school class
            let id = schoolClass.id;
            axios
                .get(`http://localhost:8080/api/schoolclass/deleteschoolclass/${id}`)
                .then((response) => {
                    // Handle success, e.g., show a success message
                    console.log("Delete successful");
                    setIsEditModalVisible(false);
                    getAll(); 
                    message.success('Deleted successfully');
                })
                .catch((error) => {
                    console.error(error);
                    // Handle any errors that occur during the delete
                });
        }
    };
    const handleEditModalOk = () => {
        if (!editingSchoolClass || !editingSchoolClass.id) {
            console.error("No school class data or ID to update.");
            return;
        }
    
        axios.post("http://localhost:8080/api/schoolclass/updateschoolclass", editingSchoolClass)
            .then((response) => {
                const updatedSchoolClass = response.data.schoolclass; // Assuming the response contains updated data
    
                // Update the school class list with the updated data
                const updatedSchoolClasses = schoolclass.map((item) =>
                    item.id === updatedSchoolClass.id ? updatedSchoolClass : item
                );
                setSchoolclass(updatedSchoolClasses);
                setIsEditModalVisible(false);
                message.success("Edited successfully");
            })
            .catch((error) => {
                console.error("Error updating school class:", error);
                if (error.response && error.response.data && error.response.data.error) {
                    // Handle specific error message from backend
                    message.error(error.response.data.error);
                } else {
                    // Handle generic error message
                    message.error("Failed to update school class");
                }
            });
    };
    
    

    const handleEditModalCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleViewModalCancel = () => {
        setIsViewModalVisible(false);
    };

    // Handle search criteria change
    const handleSearchCriteriaChange = (value) => {
        setSearchCriteria(value);
    };

    // Filter school classes based on search criteria and term
    const filteredSchoolClasses = schoolclass ? schoolclass.filter((schoolClass) => {
        const fieldValue = schoolClass[searchCriteria]?.toLowerCase(); // Using optional chaining
        return fieldValue?.includes(searchTerm.toLowerCase());
    }) : [];


    return (
        <div className="App">
            <div>
                <h2>Grades</h2>
                <div style={{ display: 'flex', alignItems: 'center', float: 'right' }}>
                    <Form.Item style={{ margin: 0 }}>
                        <Select
                            placeholder="Select Column"
                            style={{ width: 150 }}
                            onChange={handleSearchCriteriaChange}
                            defaultValue="school_name"
                        >
                            <Option value="school_name">School Name</Option>
                            <Option value="grade">Grade</Option>
                            {/* Add more options for other search criteria */}
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ margin: 0 }}>
                        <Input
                            placeholder="Search here"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: 160 }}
                            prefix={<SearchOutlined />}
                        />
                    </Form.Item>
                </div>
                <Form.Item>
                    {userRoles.includes('SUPER_ADMIN') && (
                        <Button type="primary" htmlType="submit">
                            <Link to="/app/createclass">Create Grade</Link>
                        </Button>
                    )}
                </Form.Item>

                <table className="fixed-header-table">
                    <thead>
                        <tr>
                            <th>School Name</th>
                            <th>Grade</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSchoolClasses.map((filteredClass) => (
                            <tr key={filteredClass.id}>
                                <td>{filteredClass.school_name}</td>
                                <td>{filteredClass.grade}</td>
                                <td>
                                    {userRoles.includes('SUPER_ADMIN') && (
                                        <>
                                            <Button type="primary" onClick={() => handleEditClick(filteredClass)}>
                                                Edit
                                            </Button>
                                            <Button onClick={() => handleViewClick(filteredClass)}>
                                                View
                                            </Button>
                                            <div className="delete">
                                                <Button
                                                    type="danger"
                                                    className="deleteButton"
                                                    onClick={() => handleDeleteClick(filteredClass)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                    {(userRoles.includes('COORDINATOR') || userRoles.includes('SCHOOL_ADMIN') || userRoles.includes('TEACHER')) && (
                                        <Button onClick={() => handleViewClick(filteredClass)}>
                                            View
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                title="Edit School Class"
                visible={isEditModalVisible}
                onOk={onFinish}
                onCancel={handleEditModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleEditModalCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={onFinish}>
                        Save
                    </Button>,
                ]}
            >
               <Form form={form} initialValues={editingSchoolClass}>
        {duplicateError && <Alert message={duplicateError} type="error" />}
        <Form.Item label="School Name">
    <Select
        placeholder="Select School"
        value={editingSchoolClass.school_name}
        onChange={(value) =>
            setEditingSchoolClass({
                ...editingSchoolClass,
                school_name: value
            })
        }
        disabled  // Set disabled to make it read-only
    >
        {schools.map((school) => (
            <Option key={school.id} value={school.name}>
                {school.name}
            </Option>
        ))}
    </Select>
</Form.Item>

                    <Form.Item
    label="Grade"
    name="grade"
    rules={[{ required: true, message: 'Please input the grade!' }]}
>
    <Input
        // Remove the value prop to allow the actual grade to be displayed
        onChange={(e) =>
            setEditingSchoolClass({
                ...editingSchoolClass,
                grade: e.target.value
            })
        }
    />
</Form.Item>




                </Form>
            </Modal>
            <Modal
                title="View School Class Details"
                visible={isViewModalVisible}
                onCancel={handleViewModalCancel}
                footer={null}
            >
                <Form>
                    <Form.Item label="School Name">
                        <Input value={editingSchoolClass ? editingSchoolClass.school_name : ""} readOnly />
                    </Form.Item>
                    <Form.Item label="Grade">
                        <Input value={editingSchoolClass ? editingSchoolClass.grade : ""} readOnly />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default memo(ModuleNChild3);
