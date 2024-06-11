import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Input, message, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

function TeacherPage() {
    const [teachers, setTeachers] = useState([]);
    const [viewedTeacher, setViewedTeacher] = useState(null);

    const [editingTeacher, setEditingTeacher] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [form] = Form.useForm();
    const history = useHistory();
    const [searchTerm, setSearchTerm] = useState('');
    const [canCreate, setCanCreate] = useState(false);
    const [canEdit, setCanEdit] = useState(false); // Example: set based on user role
    const [canDelete, setCanDelete] = useState(false); // Example: set based on user role
    const [canView, setCanView] = useState(false); // Example: set based on user role
    const userRoles = JSON.parse(localStorage.getItem('roles'));
    
    const [formData, setFormData] = useState({
        school_name: '',
        employeename: '',
        email:'',
        contactnumber: '',
        dob: '',
        doj: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };
    useEffect(() => {
        getAllTeachers();
        // Simulate user permissions based on their role
        setCanCreate(true);
        setCanEdit(true);
        setCanDelete(true);
        setCanView(true);
    }, []);

    const getAllTeachers = () => {
        axios.post('http://localhost:8080/api/user/getallTeacher')
            .then((response) => {
                setTeachers(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleEditClick = (teacher) => {
        setEditingTeacher(teacher);
        setIsEditModalVisible(true);
    };
    const handleViewModalCancel = () => {
        setIsViewModalVisible(false);
      };
    
    const handleDeleteClick = (teacher) => {
        const { id } = teacher; // Assuming teacher object has an 'id' property
    
        if (window.confirm("Are you sure you want to delete this teacher?")) {
            axios.get(`http://localhost:8080/api/teacher/deleteteacher/${id}`)
                .then(() => {
                    message.success('Teacher deleted successfully');
                    getAllTeachers(); // Refresh teacher list
                })
                .catch((error) => {
                    console.error(error);
                    message.error('Failed to delete teacher');
                });
        }
    };
    
    const handleEditModalOk = () => {
        form.validateFields()
            .then((values) => {
                const updatedTeacher = { ...editingTeacher, ...values };
                axios.post(`http://localhost:8080/api/teacher/updateteacher`, updatedTeacher)
                    .then(() => {
                        message.success('Teacher updated successfully');
                        setIsEditModalVisible(false);
                        getAllTeachers(); // Refresh teacher list
                    })
                    .catch((error) => {
                        console.error(error);
                        if (error.response && error.response.data && error.response.data.error) {
                            alert(error.response.data.error); // Show specific error message from backend
                        } else {
                            alert('Failed to update teacher');
                        }
                    });
            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
            });
    };
    

    const handleEditModalCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleCreateTeacher = () => {
        history.push('/app/createTeacher');
    };
    const filteredTeachers = teachers.filter((teacher) => {
        const schoolName = teacher.school_name || ''; // Default to empty string if school_name is null or undefined
        const searchTermLower = (searchTerm || '').toLowerCase(); // Convert searchTerm to lowercase or default to empty string
    
        return schoolName.toLowerCase().includes(searchTermLower);
    });
    
    const handleSearchCriteriaChange = (value) => {
        console.log('Selected search criteria:', value);
        // You can add logic here to handle the search criteria change
    };
    const handleViewClick = (teacher) => {
        setEditingTeacher(teacher);
        setIsViewModalVisible(true);
    };
    

    return (
        <div className="App">
            <h2>Teachers</h2>
            <div style={{ display: "flex", alignItems: "center", float: "right" }}>
                <Form.Item style={{ margin: 0 }}>
                    <Select
                        placeholder="Select Column"
                        style={{ width: 150 }}
                        onChange={handleSearchCriteriaChange}
                    >
                        <Option value="dob">D.O.B</Option>
                        <Option value="school_name">School Name</Option>
                        <Option value="doj">D.O.J</Option>
                        <Option value="employeename">Employee Name</Option>
                    </Select>
                </Form.Item>
                <Form.Item style={{ margin: 0 }}>
                    <Input
                        placeholder="Search by school name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ marginRight: 16 }}
                        prefix={<SearchOutlined />}
                    />
                    {/* {canCreate && (
                        <Button type="primary" onClick={handleCreateTeacher}>
                            Create Teacher
                        </Button>
                    )} */}
                </Form.Item>
            </div>
            <Form.Item>
            {userRoles.includes('SUPER_ADMIN') && (
                <Button type="primary" htmlType="submit" onClick={handleCreateTeacher}>
                    Create Teacher
                </Button>
                 )}
            </Form.Item>
           
            <table>
                <thead>
                    <tr>
                        <th>School Name</th>
                        <th>Employee Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                        <th>DOB</th>
                        <th>DOJ</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTeachers.map((teacher) => (
                        <tr key={teacher.id}>
                            <td>{teacher.school_name}</td>
                            <td>{teacher.employeename}</td>
                            <td>{teacher.email}</td>
                            <td>{teacher.contactnumber}</td>
                            <td>{teacher.dob}</td>
                            <td>{teacher.doj}</td>
                            <td>
                            {userRoles.includes('SUPER_ADMIN') && (
                                        <>
                             
                                  <Button type="primary" onClick={() => handleEditClick(teacher)}>
                    Edit
                  </Button>
                  <Button onClick={() => handleViewClick(teacher)}>View</Button>
                  <div className="delete">
                    <Button
                      type="danger"
                      className="deleteButton"
                      onClick={() => handleDeleteClick(teacher)}
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
            <Modal
                title="Edit Teacher"
                visible={isEditModalVisible}
                onOk={handleEditModalOk}
                onCancel={handleEditModalCancel}
            >
                <Form form={form} initialValues={editingTeacher}>
                    <Form.Item label="School Name" name="school_name"rules={[{ required: true, message: 'Please enterSchool Name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Employee Name" name="employeename" rules={[{ required: true, message: 'Please enter Employee Name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="DOB" name="dob" rules={[{ required: true, message: 'Please input date of birth!' }]}>
                                <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="DOJ" name="doj" rules={[{ required: true, message: 'Please input date of joining!' }]}>
                                <Input type="date" name="doj" value={formData.doj} onChange={handleChange} />
                            </Form.Item> 
                </Form>
            </Modal>
            <Modal
    title="View Teacher Details"
    visible={isViewModalVisible}
    onCancel={handleViewModalCancel}
    footer={null}
>
    <Form>
        <Form.Item label="School Name">
            <Input value={editingTeacher ? editingTeacher.school_name : ""} readOnly />
        </Form.Item>
        <Form.Item label="Employee Name">
            <Input value={editingTeacher ? editingTeacher.employeename : ""} readOnly />
        </Form.Item>
        <Form.Item label="DOB">
            <Input value={editingTeacher ? editingTeacher.dob : ""} readOnly />
        </Form.Item>
        <Form.Item label="DOJ">
            <Input value={editingTeacher ? editingTeacher.doj : ""} readOnly />
        </Form.Item>
        <Form.Item label="Contact Number">
            <Input value={editingTeacher ? editingTeacher.contactnumber : ""} readOnly />
        </Form.Item>
        <Form.Item label="Email">
            <Input value={editingTeacher ? editingTeacher.email : ""} readOnly />
        </Form.Item>
        <Form.Item label="Gender">
            <Input value={editingTeacher ? editingTeacher.gender : ""} readOnly />
        </Form.Item>
        <Form.Item label="Present Address">
            <Input value={editingTeacher ? editingTeacher.presentaddress : ""} readOnly />
        </Form.Item>
        <Form.Item label="Designation">
            <Input value={editingTeacher ? editingTeacher.designation : ""} readOnly />
        </Form.Item>
        <Form.Item label="Highest Education Qualification">
            <Input value={editingTeacher ? editingTeacher.heq : ""} readOnly />
        </Form.Item>
        <Form.Item label="Aadhar Number">
            <Input value={editingTeacher ? editingTeacher.aadharnumber : ""} readOnly />
        </Form.Item>
        <Form.Item label="PAN Number">
            <Input value={editingTeacher ? editingTeacher.pannumber : ""} readOnly />
        </Form.Item>
        <Form.Item label="Blood Group">
            <Input value={editingTeacher ? editingTeacher.bloodgroup : ""} readOnly />
        </Form.Item>
        <Form.Item label="Nationality">
            <Input value={editingTeacher ? editingTeacher.nationality : ""} readOnly />
        </Form.Item>
        <Form.Item label="Marital Status">
            <Input value={editingTeacher ? editingTeacher.maritalstatus : ""} readOnly />
        </Form.Item>
        <Form.Item label="Bank Account Number">
            <Input value={editingTeacher ? editingTeacher.bankaccountnumber : ""} readOnly />
        </Form.Item>
        <Form.Item label="Bank Name">
            <Input value={editingTeacher ? editingTeacher.bankname : ""} readOnly />
        </Form.Item>
        <Form.Item label="Bank Branch">
            <Input value={editingTeacher ? editingTeacher.bankbranch : ""} readOnly />
        </Form.Item>
        <Form.Item label="Photo">
            <Input value={editingTeacher ? editingTeacher.photo : ""} readOnly />
        </Form.Item>
    </Form>
</Modal>


        </div>
    );
}

export default TeacherPage;
