import React, { memo, useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { Button, Form, Modal, Input, message, Select, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

function ModuleNChild5() {
    const [schoolsection, setSchoolsection] = useState([]);
    const [editingSchoolSection, setEditingSchoolSection] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('school_name');
    const [schools, setSchools] = useState([]);
    const [grades, setGrades] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null); // Add state for selected school
    const userRoles = JSON.parse(localStorage.getItem('roles'));
    const [duplicateError, setDuplicateError] = useState('');
    const history = useHistory();
    const [form] = Form.useForm();

    const handleCreateSection = () => {
        history.push('/app/createsection');
    };

    useEffect(() => {
        getAll();
        fetchSchools();
    }, []);

    const getAll = () => {
        axios.post("http://localhost:8080/api/user/getallschoolsection", editingSchoolSection)
            .then(response => {
                const data = response.data;
                const sortedData = data.sort((a, b) => b.id - a.id);
                setSchoolsection(sortedData);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const fetchSchools = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/schoolClassList/getallschoolClassList");
            setSchools(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchGrades = async (schoolName) => {
        try {
            const response = await axios.post("http://localhost:8080/api/gradeClassList/getallgradeClassList", { school_name: schoolName });
            setGrades(response.data);
        } catch (error) {
            console.error("Error fetching grades:", error);
            message.error('Failed to fetch grades. Please try again later.');
        }
    };

    const handleEditClick = (schoolSection) => {
        form.setFieldsValue({
            school_name: schoolSection.school_name,
            grade: schoolSection.grade,
            section_name: schoolSection.section_name,
            short_code: schoolSection.short_code,
        });

        setEditingSchoolSection({
            id: schoolSection.id,
            school_name: schoolSection.school_name,
            grade: schoolSection.grade,
            section_name: schoolSection.section_name,
            short_code: schoolSection.short_code,
        });

        setIsEditModalVisible(true);
    };

    const handleViewClick = (schoolSection) => {
        setEditingSchoolSection(schoolSection);
        setIsViewModalVisible(true);
    };

    const handleDeleteClick = (schoolSection) => {
        let id = schoolSection.id;

        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this school section?");

        if (confirmDelete) {
            // If user confirms deletion, send delete request
            axios
                .get(`http://localhost:8080/api/section/deleteschoolsection/${id}`)
                .then((response) => {
                    console.log("Delete successful");
                    setIsEditModalVisible(false);
                    getAll();
                    message.success('Deleted successfully');
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const handleEditModalOk = () => {
        form
            .validateFields()
            .then((values) => {
                const updatedData = { ...editingSchoolSection, ...values };
                axios
                    .post("http://localhost:8080/api/section/updateschoolsection", updatedData)
                    .then((response) => {
                        console.log('Edit successful');
                        setIsEditModalVisible(false); // Close the modal
                        getAll(); // Refresh the data
                        message.success('Edited successfully'); // Show success message
                        setDuplicateError(''); // Clear any previous error
                    })
                    .catch((error) => {
                        console.error(error);
                        if (error.response && error.response.data && error.response.data.error) {
                            setDuplicateError(error.response.data.error); // Set the specific error message
                        } else {
                            setDuplicateError('Failed to edit school section'); // Default error message
                        }
                    });
            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
            });
    };
    

    const onFinish = () => {
        form
            .validateFields()
            .then((values) => {
                const updatedSchoolSectionData = {
                    ...editingSchoolSection,
                    ...values,
                };
                setEditingSchoolSection(updatedSchoolSectionData);
                handleEditModalOk(); // Proceed with saving the data
            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
            });
    };
    

    const handleEditModalCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleViewModalCancel = () => {
        setIsViewModalVisible(false);
    };

    const handleSearchCriteriaChange = (value) => {
        setSearchCriteria(value);
    };

    const handleSchoolChange = (value) => {
        form.setFieldsValue({ grade: undefined }); // Reset grade field
        setSelectedSchool(value); // Update selected school state
        fetchGrades(value); // Fetch grades based on the selected school
    
        // Update editingSchoolSection to store the selected school name
        setEditingSchoolSection(prevState => ({
            ...prevState,
            school_name: value
        }));
    };
    

    const filteredSchoolSections = schoolsection.filter((schoolSection) => {
        const fieldValue = schoolSection[searchCriteria].toLowerCase();
        return fieldValue.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="App">
            <div>
                <h2>Sections</h2>
                <div style={{ display: 'flex', alignItems: 'center', float: 'right' }}>
                    <Form.Item style={{ margin: 0 }}>
                        <Select
                            placeholder="Select Column"
                            style={{ width: 150 }}
                            onChange={handleSearchCriteriaChange}
                        >
                            <Option value="school_name">School Name</Option>
                            <Option value="grade">Grade</Option>
                            <Option value="section_name">Section Name</Option>
                            <Option value="short_code">Short Code</Option>
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
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={handleCreateSection}
                        >
                            Create Section
                        </Button>
                    )}
                </Form.Item>
                <br />
                <table className="fixed-header-table">
                    <thead>
                        <tr>
                            <th>School Name</th>
                            <th>Grade</th>
                            <th>Section Name</th>
                            <th>Short Code</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSchoolSections.map((schoolSection) => (
                            <tr key={schoolSection.id}>
                                <td>{schoolSection.school_name}</td>
                                <td>{schoolSection.grade}</td>
                                <td>{schoolSection.section_name}</td>
                                <td>{schoolSection.short_code}</td>
                                <td>
                                    {userRoles.includes('SUPER_ADMIN') && (
                                        <>
                                            <Button type="primary" onClick={() => handleEditClick(schoolSection)}>
                                                Edit
                                            </Button>
                                            <Button onClick={() => handleViewClick(schoolSection)}>
                                                View
                                            </Button>
                                            <div className="delete">
                                                <Button
                                                    type="danger"
                                                    className="deleteButton"
                                                    onClick={() => handleDeleteClick(schoolSection)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                    {(userRoles.includes('COORDINATOR') || userRoles.includes('SCHOOL_ADMIN') || userRoles.includes('TEACHER')) && (
                                        <Button onClick={() => handleViewClick(schoolSection)}>
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
                title="Edit School Section"
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
                <Form form={form} initialValues={editingSchoolSection}>
                    {duplicateError && <Alert message={duplicateError} type="error" />}
                    <Form.Item
                        label="School Name"
                        name="school_name"
                        rules={[{ required: true, message: 'Please select a school' }]}
                    >
                        <Select
                            placeholder="Select School"
                            onChange={handleSchoolChange}>
                            {schools.map((school) => (
                                <Option key={school.id} value={school.name}>{school.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Grade"
                        name="grade"
                        rules={[{ required: true, message: 'Please select a grade' }]}
                    >
                        <Select
                            placeholder="Select Grade"
                            onChange={(value) =>
                                setEditingSchoolSection({
                                    ...editingSchoolSection,
                                    grade: value
                                })
                            }
                        >
                            {grades.map((grade) => (
                                <Option key={grade.id} value={grade.grade}>{grade.grade}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Short Code"
                        name="short_code"
                        rules={[{ required: true, message: 'Please enter a short code' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Section Name"
                        name="section_name"
                        rules={[{ required: true, message: 'Please enter a section name' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>


            <Modal
                title="View School Section"
                visible={isViewModalVisible}
                onCancel={handleViewModalCancel}
                footer={null}
            >
                <Form>
                    <Form.Item label="School Name">
                        <Input value={editingSchoolSection ? editingSchoolSection.school_name : ""} readOnly />
                    </Form.Item>
                    <Form.Item label="Grade">
                        <Input value={editingSchoolSection ? editingSchoolSection.grade : ""} readOnly />
                    </Form.Item>
                    <Form.Item label="Short Code">
                        <Input value={editingSchoolSection ? editingSchoolSection.short_code : ""} readOnly />
                    </Form.Item>
                    <Form.Item label="Section Name">
                        <Input value={editingSchoolSection ? editingSchoolSection.section_name : ""} readOnly />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default memo(ModuleNChild5);
