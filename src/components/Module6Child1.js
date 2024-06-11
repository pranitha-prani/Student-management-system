import React, { memo, useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Button, Form, Modal, Input, message, Select, Alert } from 'antd';

import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

function Module6Child1() {
	const [schools, setSchools] = useState([]);
	const [editingSchools, setEditingSchools] = useState(null);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [isViewModalVisible, setIsViewModalVisible] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchCriteria, setSearchCriteria] = useState('name');
	const [duplicateError, setDuplicateError] = useState('');
	const history = useHistory();
	const [form] = Form.useForm();
	const handleCreateSchool = () => {
		history.push('/app/createschool');
	};

	useEffect(() => {
		getAll();
	}, []);

	const getAll = () => {
		axios
			.post('http://localhost:8080/api/user/getallschool')
			.then((response) => {
				const data = response.data;
				// Sort data in descending order based on id
				const sortedData = data.sort((a, b) => b.id - a.id);
				setSchools(data);
				console.log(data);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleEditClick = (school) => {
		// Set the initial form values with the data of the selected school
		form.setFieldsValue({
			name: school.name,
			code: school.code,
			email: school.email,
			board: school.board,
			contactnumber: school.contactnumber,
			address: school.address,
			street: school.street,
			city: school.city,
			pincode: school.pincode,
			state: school.state,
			country: school.country,
			website: school.website,
		});
	
		setEditingSchools({
			id: school.id, // Set the id here
			name: school.name,
			code: school.code,
			email: school.email,
			board: school.board,
			contactnumber: school.contactnumber,
			address: school.address,
			street: school.street,
			city: school.city,
			pincode: school.pincode,
			state: school.state,
			country: school.country,
			website: school.website,
		});
	
		setIsEditModalVisible(true);
	};
	

	const handleViewClick = (school) => {
		setEditingSchools(school);
		setIsViewModalVisible(true);
	};
    const handleSelectChange = (values) => {
        setEditingSchools({
            ...editingSchools,
            board: values
        });
    };

	const handleEditModalOk = () => {
		if (!editingSchools) {
			console.error("No school data to update.");
			return;
		}
	
		// Convert board to array if it's a string (received from form select)
		const updatedBoard = Array.isArray(editingSchools.board)
			? editingSchools.board
			: editingSchools.board.split(',').map(item => item.trim());
	
		const editedSchoolData = {
			id: editingSchools.id,
			name: editingSchools.name,
			code: editingSchools.code,
			email: editingSchools.email,
			board: updatedBoard,
			contactnumber: editingSchools.contactnumber,
			address: editingSchools.address,
			street: editingSchools.street,
			city: editingSchools.city,
			pincode: editingSchools.pincode,
			state: editingSchools.state,
			country: editingSchools.country,
			website: editingSchools.website
		};
	
		axios.post('http://localhost:8080/api/school/updateschool', editedSchoolData)
			.then((response) => {
				console.log('Edit successful');
				setIsEditModalVisible(false);
				getAll();
				message.success('Edited successfully');
				setDuplicateError('');
			})
			.catch((error) => {
				console.error(error.response); // Log the error response for debugging
				if (error.response && error.response.data && error.response.data.error) {
					setDuplicateError(error.response.data.error);
				} else {
					setDuplicateError('Failed to edit school');
				}
			});
	};
	
	  

	const handleEditModalCancel = () => {
		setIsEditModalVisible(false);
	};

	const handleViewModalCancel = () => {
		setIsViewModalVisible(false);
	};

	const onFinish = () => {
		form
			.validateFields()
			.then((values) => {
				const updatedSchoolData = {
					...editingSchools,
					[editingSchools.id]: {
						...editingSchools[editingSchools.id],
						...values,
					},
				};
				setEditingSchools(updatedSchoolData);
				handleEditModalOk(); // Proceed with saving the data
			})
			.catch((errorInfo) => {
				console.log('Validation failed:', errorInfo);
			});
	};
	
	const handleDeleteClick = (school) => {
		const id = school.id;
		console.log(id);
		
		// Show confirmation dialog
		const confirmDelete = window.confirm("Are you sure you want to delete this school?");
		
		if (confirmDelete) {
			// If user confirms deletion, send delete request
			axios
			.get(`http://localhost:8080/api/school/deleteschool/${id}`)
				.then((response) => {
					console.log('Delete successful');
					getAll(); // Refresh the data after deletion
					message.success('Deleted successfully');
				})
				.catch((error) => {
					console.error(error);
					message.error('Failed to delete school');
				});
		}
	};
	
	const handleSearchCriteriaChange = (value) => {
		setSearchCriteria(value);
	};

	const filteredSchools = schools.filter((school) => {
		if (searchCriteria === 'contactnumber') {
			const fieldValue = String(school[searchCriteria]); // Convert to string
			return fieldValue.includes(searchTerm);
		} else {
			const fieldValue = school[searchCriteria];
			if (typeof fieldValue === 'string') {
				return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
			}
			return false;
		}
	});

	return (
		<div>
			<div className="App">
				<div>
					<h2>Schools </h2>
					<div
						style={{ display: 'flex', alignItems: 'center', float: 'right' }}
					>
						<Form.Item style={{ margin: 0 }}>
							<Select
								placeholder="Select Column"
								style={{ width: 150 }}
								onChange={handleSearchCriteriaChange}
							>
								<Option value="name">Name</Option>
								<Option value="email">Email</Option>
								<Option value="board">Board</Option>
								<Option value="contactnumber">Contact Number</Option>
							</Select>
						</Form.Item>
						<Form.Item style={{ margin: 0 }}>
							<Input
								placeholder="Search here"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								prefix={<SearchOutlined />}
								style={{ width: 160 }}
							/>
						</Form.Item>
					</div>
					<Form.Item style={{ margin: 0 }}>
						<Button
							type="primary"
							htmlType="submit"
							onClick={handleCreateSchool}
						>
							Create School
						</Button>
					</Form.Item>
					<br />
					<table className="fixed-header-table">
						<thead>
							<tr>
								{/* <th>Id</th> */}
								<th>Code</th>
								<th>Name</th>
								<th>Email</th>
								<th>Board</th>
								<th>Contact Number</th>
								{/* <th>Address</th>
                                <th>Street</th>
                                <th>City</th>
                                <th>PinCode</th>
                                <th>State</th>
                                <th>Country</th>
                                <th>Website</th> */}
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{filteredSchools.map((school) => (
								<tr key={school.id}>
									{/* <td>{school.id}</td> */}
									<td>{school.code}</td>
									<td>{school.name}</td>
									<td>{school.email}</td>
									<td>{school.board}</td>
									<td>{school.contactnumber}</td>
									{/* <td>{school.address}</td>
                                    <td>{school.street}</td>
                                    <td>{school.city}</td>
                                    <td>{school.pincode}</td>
                                    <td>{school.state}</td>
                                    <td>{school.country}</td>
                                    <td>{school.website}</td> */}
									<td>
										<Button
											type="primary"
											onClick={() => handleEditClick(school)}
										>
											Edit
										</Button>
										<Button onClick={() => handleViewClick(school)}>
											View
										</Button>
										<Button
											type="danger"
											className="deleteButton"
											onClick={() => handleDeleteClick(school)}
										>
											Delete
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<Modal
    title="Edit School"
    visible={isEditModalVisible}
    onOk={onFinish}
    onCancel={handleEditModalCancel}
    // Add footer to display duplicate error message
    footer={[
        <Button key="cancel" onClick={handleEditModalCancel}>
            Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onFinish}>
            Save
        </Button>,
    ]}
>
    {/* <Form form={form} initialValues={editingSchools}> */}
    <Form form={form} initialValues={editingSchools}>
        {duplicateError && <Alert message={duplicateError} type="error" />}
	  <Form.Item
  label="Name"
  name="name"
  rules={[{ required: true, message: 'Please input the name!' }]}
 
>
  <Input onChange={(e) =>
    setEditingSchools({
      ...editingSchools,
      name: e.target.value
    })
  } />
</Form.Item>

<Form.Item
  label="Code"
  name="code"
  rules={[{ required: true, message: 'Please input the code!' }]}
>
  <Input onChange={(e) =>
    setEditingSchools({
      ...editingSchools,
      code: e.target.value
    })
  } />
</Form.Item>

<Form.Item
  label="Email"
  name="email"
  rules={[
    { required: true, message: 'Please input your email!' },
    { type: 'email', message: 'Please enter a valid email address!' },
  ]}
>
  <Input onChange={(e) =>
    setEditingSchools({
      ...editingSchools,
      email: e.target.value
    })
  } />
</Form.Item>

<Form.Item label="Board" name="board">
  <Select mode="multiple" onChange={(values) =>
    setEditingSchools({
      ...editingSchools,
      board: values
    })
  }>
    <Option value="CBSE">CBSE</Option>
    <Option value="ICSE">ICSE</Option>
    <Option value="State Board">State Board</Option>
  </Select>
</Form.Item>

<Form.Item
    label="Contact Number"
    name="contactnumber"
    initialValue={editingSchools ? editingSchools.contactnumber : ''}
    rules={[
        { required: true, message: 'Please input your contact number!' },
        { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit contact number!' }
    ]}
>
    <Input onChange={(e) =>
        setEditingSchools({
            ...editingSchools,
            contactnumber: e.target.value
        })
    } />
</Form.Item>

						<Form.Item label="Address">
							<Input
								value={editingSchools ? editingSchools.address : ''}
								onChange={(e) =>
									setEditingSchools({
										...editingSchools,
										address: e.target.value
									})
								}
							/>
						</Form.Item>
						<Form.Item label="Street">
							<Input
								value={editingSchools ? editingSchools.street : ''}
								onChange={(e) =>
									setEditingSchools({
										...editingSchools,
										street: e.target.value
									})
								}
							/>
						</Form.Item>
						<Form.Item label="City">
							<Input
								value={editingSchools ? editingSchools.city : ''}
								onChange={(e) =>
									setEditingSchools({
										...editingSchools,
										city: e.target.value
									})
								}
							/>
						</Form.Item>
						<Form.Item
    label="Pincode"
    name="pincode"
    rules={[
        {
            required: true,
            message: 'Please input the Pincode!',
        },
        {
            pattern: /^[0-9]{6}$/, // Regex pattern to match 6-digit numbers
            message: 'Pincode must be a 6-digit number!',
        },
    ]}
>
    <Input />
</Form.Item>

						<Form.Item label="State">
    <Select
        placeholder="Select state"
        value={editingSchools ? editingSchools.state : ''}
        onChange={(value) =>
            setEditingSchools({
                ...editingSchools,
                state: value
            })
        }
    >
        <Option value="Goa">Goa</Option>
        <Option value="TamilNadu">Tamil Nadu</Option>
        <Option value="Karnataka">Karnataka</Option>
        <Option value="Maharashtra">Maharashtra</Option>
      
    </Select>
</Form.Item>
<Form.Item label="Country">
    <Select
        placeholder="Select country"
        value={editingSchools ? editingSchools.country : ''}
        onChange={(value) =>
            setEditingSchools({
                ...editingSchools,
                country: value
            })
        }
    >
        <Option value="India">India</Option>
        <Option value="United States">United States</Option>
        <Option value="United Kingdom">United Kingdom</Option>
        <Option value="Canada">Canada</Option>
        <Option value="Australia">Australia</Option>
     
    </Select>
</Form.Item>
						<Form.Item label="Website">
							<Input
								value={editingSchools ? editingSchools.website : ''}
								onChange={(e) =>
									setEditingSchools({
										...editingSchools,
										website: e.target.value
									})
								}
							/>
						</Form.Item>
					</Form>
				</Modal>
				<Modal
					title="View School Details"
					visible={isViewModalVisible}
					onCancel={handleViewModalCancel}
					footer={null}
				>
					<Form>
						<Form.Item label="Name">
							<Input
								value={editingSchools ? editingSchools.name : ''}
								readOnly
								
							/>
						</Form.Item>
						<Form.Item label="Code">
							<Input
								value={editingSchools ? editingSchools.code : ''}
								readOnly
								
							/>
						</Form.Item>
						<Form.Item label="Email">
							<Input
								value={editingSchools ? editingSchools.email : ''}
								readOnly
								 
							/>
						</Form.Item>
						<Form.Item label="Board">
							<Input
								value={editingSchools ? editingSchools.board : ''}
								readOnly
								
							/>
						</Form.Item>
						<Form.Item label="Contact Number">
							<Input
								value={editingSchools ? editingSchools.contactnumber : ''}
								readOnly
								
							/>
						</Form.Item>
						<Form.Item label="Address">
							<Input
								value={editingSchools ? editingSchools.address : ''}
								readOnly
								
							/>
						</Form.Item>
						<Form.Item label="Street">
							<Input
								value={editingSchools ? editingSchools.street : ''}
								readOnly
								 
							/>
						</Form.Item>
						<Form.Item label="City">
							<Input
								value={editingSchools ? editingSchools.city : ''}
								readOnly
								
							/>
						</Form.Item>
						<Form.Item label="Pincode">
							<Input
								value={editingSchools ? editingSchools.pincode : ''}
								readOnly
							
							/>
						</Form.Item>
						<Form.Item label="State">
							<Input
								value={editingSchools ? editingSchools.state : ''}
								readOnly
								
							/>
						</Form.Item>
						<Form.Item label="Country">
							<Input
								value={editingSchools ? editingSchools.country : ''}
								readOnly
							
							/>
						</Form.Item>
						<Form.Item label="Website">
							<Input
								value={editingSchools ? editingSchools.website : ''}
								readOnly
								
								
							/>
						</Form.Item>
					</Form>
				</Modal>
			</div>
		</div>
	);
}

export default memo(Module6Child1);