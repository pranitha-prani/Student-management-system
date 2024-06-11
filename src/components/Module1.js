import React, { memo, useState, useEffect } from 'react';
import axios from 'axios';
import { JumbotronWrapper } from './common';
import { Form, Input, Button, Select, Spin } from 'antd';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation

const { Option } = Select;

function Module1() {
	const [schools, setSchools] = useState([]); // State to store school data
	const [roles, setRoles] = useState([]);
	const [form] = Form.useForm();
	const history = useHistory(); // Access history for navigation
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchSchools();
	}, []);

	const fetchSchools = async () => {
		try {
			const response = await axios.post(
				'http://localhost:8080/api/schoolClassList/getallschoolClassList'
			); // Replace with your API endpoint for fetching schools
			const data = response.data;
			setSchools(data); // Store the fetched schools in the state
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		fetchRoles();
	}, []);

	const fetchRoles = async (schoolName) => {
		try {
		  const response = await axios.post(
			'http://localhost:8080/api/roleList/getallroleList',
			{ schoolname: schoolName } // Send schoolname in the request body
		  );
		  const data = response.data;
		  setRoles(data); // Store the fetched roles in the state
		} catch (error) {
		  console.error(error);
		}
	  };
	  
	  // Update handleChangeSchool function to trigger fetchRoles when school name changes
	  const handleChangeSchool = (value) => {
		fetchRoles(value); // Call fetchRoles with the selected school name
	  };
	  

	  const handleSubmit = async (values) => {
		setLoading(true);
		try {
			const response = await axios.post('http://localhost:8080/api/user/createadmin', values);
			if (response.data.success) {
				alert('School admin created successfully');
				history.push('/app/userslist');
			} else {
				if (response.data.error === 'Admin with the same school name and email already exists') {
					alert('Admin with the same school name and email already exists');
				} else {
					alert('Failed to create school admin');
				}
			}
		} catch (error) {
			console.error('Error creating school admin:', error);
			alert('Admin with the same school name and email already exists');
		} finally {
			setLoading(false);
		}
	};
	

	const handleReset = () => {
		form.resetFields(); // Reset form fields
	};

	const handleCancel = () => {
		// Redirect to another page when cancel button is clicked
		history.push('/app/userslist'); // Change the route as per your requirement
	};

	return (
		<JumbotronWrapper title="Create Users">
			<div className="container">
				<div className="row">
					<div className="col-md-6 offset-md-3">
						<Form form={form} onFinish={handleSubmit} layout="vertical">
							<Form.Item
								label="Name of the Employee"
								name="name"
								rules={[
									{
										required: true,
										message: 'Please input your name!'
									}
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item
  name="schoolname"
  label="School Name"
  rules={[
    {
      required: true,
      message: 'Please select a school!'
    }
  ]}
>
  <Select onChange={handleChangeSchool}>
    {schools.map((school) => (
      <Option key={school.id} value={school.name}>
        {school.name}
      </Option>
    ))}
  </Select>
</Form.Item>
<Form.Item
    label="Contact Number"
    name="phonenumber"
    rules={[
        {
            required: true,
            message: 'Please input your phone number!'
        },
        {
            pattern: /^[0-9]{10}$/, // Regular expression to match exactly 10 digits
            message: 'Please enter a valid 10-digit phone number!'
        }
    ]}
>
    <Input />
</Form.Item>

							<Form.Item
								label="User Email"
								name="email"
								rules={[
									{
										required: true,
										type: 'email',
										message: 'Please input valid email!'
									}
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								label="Password"
								name="password"
								rules={[
									{
										required: true,
										message: 'Please input your password!'
									}
								]}
							>
								<Input.Password />
							</Form.Item>
							<Form.Item
								label="Role"
								name="role"
								rules={[
									{
										required: true,
										message: 'Please select a role!'
									}
								]}
							>
								<Select>
									{roles.map((role) => (
										<Option key={role.id} value={role.roleOfUser}>
											{role.roleOfUser}
										</Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit" disabled={loading}>
									{loading ? <Spin /> : 'Create'}
									{/* Render Spin component when loading is true */}
								</Button>
								<Button
									type="default"
									onClick={handleReset}
									style={{ marginLeft: '10px', backgroundColor: 'gray', color: 'white' }}
								>
									Reset
								</Button>
								<Button
									type="default"
									onClick={handleCancel}
									style={{
										marginLeft: '10px',
										backgroundColor: 'navy',
										color: 'white',
										border: 'none'
									}}
								>
									Cancel
								</Button>
							</Form.Item>
						</Form>
					</div>
				</div>
			</div>
		</JumbotronWrapper>
	);
}

export default memo(Module1);