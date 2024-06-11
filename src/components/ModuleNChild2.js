import React, { memo, useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Modal, Form, Input, message, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const ModuleNChild2 = () => {
    const [roles, setRoles] = useState([]);
    const [editingRole, setEditingRole] = useState({});
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('schoolname'); // Default search criteria
    const [schools, setSchools] = useState([]); // State for storing schools data
    const history = useHistory();
    const [form] = Form.useForm(); 
    const [duplicateError, setDuplicateError] = useState('');
    const handleCreateRole = () => {
        history.push('/app/createrole');
    };

    useEffect(() => {
        getAll(); // Fetch data when the component mounts
        fetchSchools(); // Fetch schools data when the component mounts
    }, []);

    const getAll = () => {
        axios
            .post('http://localhost:8080/api/user/getallrole')
            .then((response) => {
                const data = response.data;
                const sortedData = data.sort((a, b) => b.id - a.id);
                setRoles(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchSchools = () => {
        axios
            .post('http://localhost:8080/api/user/getallschool')
            .then((response) => {
                const data = response.data;
                setSchools(data); // Store the fetched schools in the state
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleEditClick = (roles) => {
        form.setFieldsValue({
            schoolname: roles.schoolname,
            role:roles.role,
        });

        setEditingRole({
            id: roles.id,
            schoolname: roles.schoolname,
            role:roles.role
        });

        setIsEditModalVisible(true);
    };

    const handleViewClick = (role) => {
        setEditingRole(role);
        setIsViewModalVisible(true);
    };

    const handleEditModalOk = () => {
        if (!editingRole) {
            console.error("No school section data to update.");
            return;
        }
        const editedSchoolData = {
            id: editingRole.id,
            schoolname: editingRole.schoolname,
            role:editingRole.role
        };
        axios
            .post('http://localhost:8080/api/role/updaterole',  editedSchoolData)
            .then((response) => {
                console.log('Edit successful');
                setIsEditModalVisible(false);
                getAll();
                message.success('Edited successfully');
                setDuplicateError(''); // Clear any previous error
            })
            .catch((error) => {
                // Handle edit failure
                console.error(error); // Log the error for debugging

                // Check if error response contains a specific error message
                if (error.response && error.response.data && error.response.data.error) {
                    setDuplicateError(error.response.data.error); // Set the specific error message
                } else {
                    setDuplicateError('Failed to edit Admin'); // Default error message
                }
            });
    };

    const handleEditModalCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleDeleteClick = (role) => {
        const id = role.id;
        console.log(id);
        
        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this role?");
        
        if (confirmDelete) {
          // If user confirms deletion, send delete request
          axios
            .get(`http://localhost:8080/api/role/deleterole/${id}`)
            .then(() => {
              console.log('Delete successful');
              setIsEditModalVisible(false);
              getAll(); // Refresh the data after deletion
              message.success('Deleted successfully');
            })
            .catch((error) => {
              console.error(error);
              message.error('Failed to delete role');
            });
        }
      };
      const onFinish = () => {
        form
          .validateFields()
          .then((values) => {
            const updatedRoleData = {
              ...editingRole,
              ...values,
            };
            setEditingRole(updatedRoleData); // Update the editingRole state
            handleEditModalOk(); // Proceed with saving the data
          })
          .catch((errorInfo) => {
            // Form validation failed, you can log the error info or handle it as needed
            console.log('Validation failed:', errorInfo);
          });
      };
      
    const handleViewModalCancel = () => {
        setIsViewModalVisible(false);
    };

    // Handle search criteria change
    const handleSearchCriteriaChange = (value) => {
        setSearchCriteria(value);
    };

    // Filter roles based on search criteria and term
    const filteredRoles = roles.filter((role) => {
        const fieldValue = role[searchCriteria].toLowerCase();
        return fieldValue.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="App">
            <div>
                <h2>User Roles</h2>
                <div style={{ display: 'flex', alignItems: 'center', float: 'right' }}>
                    <Form.Item style={{ margin: 0 }}>
                        <Select
                            placeholder="Select Column"
                            style={{ width: 150 }}
                            onChange={handleSearchCriteriaChange}
                        >
                            <Option value="schoolname">School Name</Option>
                            <Option value="role">Role</Option>
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
                    <Button type="primary" htmlType="submit" onClick={handleCreateRole}>
                        Create User Role
                    </Button>
                </Form.Item>
                <br />
                <table className="fixed-header-table">
                    <thead>
                        <tr>
                            <th>School Name</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRoles.map((role) => (
                            <tr key={role.id}>
                                <td>{role.schoolname}</td>
                                <td>{role.role}</td>
                                <td>
                                    <Button type="primary" onClick={() => handleEditClick(role)}>
                                        Edit
                                    </Button>
                                    <Button onClick={() => handleViewClick(role)}>View</Button>
                                    <div className="delete">
                                        <Button
                                            type="danger"
                                            className="deleteButton"
                                            onClick={() => handleDeleteClick(role)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
      title="Edit Role"
      visible={isEditModalVisible}
      onOk={onFinish} // Call onFinish when OK button is clicked
      onCancel={handleEditModalCancel}
    >
      <Form form={form} initialValues={editingRole}>
        <Form.Item
          label="School Name"
          name="schoolname"
          rules={[{ required: true, message: 'Please select a school' }]}
        >
          <Select
            placeholder="Select School"
            onChange={(value) => form.setFieldsValue({ schoolname: value })}
          >
            {schools.map((school) => (
              <Option key={school.id} value={school.name}>
                {school.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Please enter a role' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
<Modal
title="View Role Details"
visible={isViewModalVisible}
onCancel={handleViewModalCancel}
footer={null}
>
<Form>
<Form.Item label="School Name">
<Input value={editingRole.schoolname || ''} readOnly />
</Form.Item>
<Form.Item label="Role">
<Input value={editingRole.role || ''} readOnly />
</Form.Item>
</Form>
</Modal>
</div>
);
};

export default memo(ModuleNChild2);
