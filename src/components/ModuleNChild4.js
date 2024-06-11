import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Modal, Input, message, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const { Option } = Select;

function ModuleNChild4() {
  const [admins, setAdmins] = useState([]);
  const [editingAdmins, setEditingAdmins] = useState({});
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedRole, setSelectedRole] = useState(""); // State for selected role
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [schools, setSchools] = useState([]);
  const [roles, setRoles] = useState([]);
  const history = useHistory();
  const [form] = Form.useForm();
  const userRoles = JSON.parse(localStorage.getItem('roles'));

  
  const handleCreateAdmin = () => {
    history.push("/app/createadmin");
  };

  useEffect(() => {
    getAll();
    axios
      .post("http://localhost:8080/api/user/getallschool")
      .then((response) => {
        const data = response.data;
        setSchools(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getAll = () => {
    axios
      .post("http://localhost:8080/api/user/getalladmin")
      .then((response) => {
        const data = response.data;
        const sortedData = data.sort((a, b) => b.id - a.id);
        setAdmins(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getAll();
    fetchRoles();
  }, [selectedSchool, selectedRole]); // Fetch roles when selectedSchool or selectedRole changes

  const fetchRoles = async (selectedSchool) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/roleList/getallroleList",
        { schoolname: selectedSchool }
      );
      const data = response.data;
      setRoles(data);
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleEditClick = (admin) => {
    form.setFieldsValue({
      name: admin.name,
      schoolname: admin.schoolname,
      password: admin.password,
      phonenumber: admin.phonenumber,
      email: admin.email,
      role: admin.role,
    });

    setEditingAdmins({
      id: admin.id,
      name: admin.name,
      schoolname: admin.schoolname,
      password: admin.password,
      phonenumber: admin.phonenumber,
      email: admin.email,
      role: admin.role,
    });

    setIsEditModalVisible(true);
  };

  const handleViewClick = (admin) => {
    setEditingSchoolSection(admin);
    setIsViewModalVisible(true);
  };

  const handleEditModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedAdmin = { ...editingAdmins, ...values };
        axios
          .post("http://localhost:8080/api/admin/updateadmin", updatedAdmin)
          .then((response) => {
            message.success("Admin updated successfully");
            setIsEditModalVisible(false);
            getAll();
          })
          .catch((error) => {
            console.error(error);
            if (error.response && error.response.data && error.response.data.error) {
              alert(error.response.data.error);
            } else {
              alert("Failed to update admin");
            }
          });
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleViewModalCancel = () => {
    setIsViewModalVisible(false);
  };

  const handleDeleteClick = (admin) => {
    const id = admin.id;
    if (window.confirm("Are you sure you want to delete this admin?")) {
      axios
        .get(`http://localhost:8080/api/admin/deleteadmin/${id}`)
        .then((response) => {
          console.log("Delete successful");
          setIsEditModalVisible(false);
          getAll();
          message.success("Deleted successfully");
        })
        .catch((error) => {
          console.error(error);
          message.error("Failed to delete admin");
        });
    }
  };

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        handleEditModalOk();
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };
  const handleSchoolChange = (value) => {
    form.setFieldsValue({ role: undefined }); // Reset role field
    setSelectedSchool(value); // Update selected school state
    fetchRoles(value); // Fetch roles based on the selected school
  };
  
  const handleSearchCriteriaChange = (value) => {
    setSearchCriteria(value);
  };

  const filteredAdmins = admins.filter((admin) => {
    const fieldValue = admin[searchCriteria].toLowerCase();
    return fieldValue.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="App">
      <div>
        <h2>Users</h2>
        <div style={{ display: "flex", alignItems: "center", float: "right" }}>
          <Form.Item style={{ margin: 0 }}>
            <Select
              placeholder="Select Column"
              style={{ width: 150 }}
              onChange={handleSearchCriteriaChange}
            >
              <Option value="name">Name</Option>
              <Option value="schoolname">School Name</Option>
              <Option value="email">Email</Option>
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
        {userRoles.includes('SUPER_ADMIN') && (
          <Button type="primary" htmlType="submit" onClick={handleCreateAdmin}>
            Create User
          </Button>
       )}
       </Form.Item>
        <table className="fixed-header-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>School Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.name}</td>
                <td>{admin.schoolname}</td>
                <td>{admin.email}</td>
                <td>{admin.password}</td>
                <td>{admin.role}</td>
                <td>
                {userRoles.includes('SUPER_ADMIN') && (
                                        <>
                  <Button type="primary" onClick={() => handleEditClick(admin)}>
                    Edit
                  </Button>
                  <Button onClick={() => handleViewClick(admin)}>View</Button>
                  <div className="delete">
                    <Button
                      type="danger"
                      className="deleteButton"
                      onClick={() => handleDeleteClick(admin)}
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
  title="Edit Admin"
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
  <Form form={form} initialValues={editingAdmins}>
    <Form.Item
      label="Name"
      name="name"
      rules={[{ required: true, message: "Please enter a name" }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="School Name"
      name="schoolname"
      rules={[{ required: true, message: "Please select a school" }]}
    >
      <Select placeholder="Select school" onChange={handleSchoolChange}>
        {schools.map((school) => (
          <Option key={school.id} value={school.name}>
            {school.name}
          </Option>
        ))}
      </Select>
    </Form.Item>
   {/* Conditionally render the role field based on selectedSchool */}
{selectedSchool !== null && (
  <Form.Item
    label="Role"
    name="role"
    rules={[{ required: true, message: "Please select a role" }]}
  >
    <Select
      placeholder="Select role"
      onChange={(value) => setSelectedRole(value)}
    >
      {roles.length > 0 ? (
        roles.map((role) => (
          <Option key={role.id} value={role.roleOfUser}>
            {role.roleOfUser}
          </Option>
        ))
      ) : (
        <Option disabled>No roles available for selected school</Option>
      )}
    </Select>
  </Form.Item>
)}
{/* End of conditional rendering for role field */}

    <Form.Item
      label="Email"
      name="email"
      rules={[{ required: true, message: "Please enter an email" }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: "Please enter a password" }]}
    >
      <Input />
    </Form.Item>
  </Form>
</Modal>

      <Modal
        title="View Admin Details"
        visible={isViewModalVisible}
        onCancel={handleViewModalCancel}
        footer={null}
      >
        <Form>
          <Form.Item label="Name">
            <Input value={editingAdmins ? editingAdmins.name : ""} readOnly />
          </Form.Item>
          <Form.Item label="School Name">
            <Input value={editingAdmins ? editingAdmins.schoolname : ""} readOnly />
          </Form.Item>
          <Form.Item label="Phone Number">
            <Input value={editingAdmins ? editingAdmins.phonenumber : ""} readOnly />
          </Form.Item>
          <Form.Item label="Email">
            <Input value={editingAdmins ? editingAdmins.email : ""} readOnly />
          </Form.Item>
          <Form.Item label="Password">
            <Input value={editingAdmins ? editingAdmins.password : ""} readOnly />
          </Form.Item>
          <Form.Item label="Role">
            <Input value={editingAdmins ? editingAdmins.role : ""} readOnly />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ModuleNChild4;
