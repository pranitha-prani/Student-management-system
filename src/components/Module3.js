import React, { useState, useEffect } from 'react';
import { JumbotronWrapper } from './common';
import axios from 'axios';
import { Form, Input, Button, Select, Spin } from 'antd';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation

const { Option } = Select;

function Module3() {
    const [roles, setRoles] = useState([]);
    const [form] = Form.useForm();
    const history = useHistory(); // Access history for navigation
	const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/schoolClassList/getallschoolClassList");
            const data = response.data;
            setRoles(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/api/user/createrole", values);
            console.log('Received values of form: ', response.data);
            if (response.data.success) {
                alert('Role created successfully');
                // Redirect to another page
				history.push('/app/userroles'); // Change the route as per your requirement
			} else {
				alert('Failed to create school admin');
			}
		} catch (error) {
			console.error(error);
			alert('Role with the same school name and role already exists');
		} finally {
			setLoading(false); // Set loading back to false after form submission (whether successful or not)
		}
	};

    const handleReset = () => {
		form.resetFields(); // Reset form fields
	};

	const handleCancel = () => {
		// Redirect to another page when cancel button is clicked
		history.push('/app/userroles'); // Change the route as per your requirement
	};


    return (
        <JumbotronWrapper title="Create Role">
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ width: '520px' }}> {/* Increase the width of the form */}
                        {/* <Form.Item name="roleUserName" label="Name" rules={[{ required: true, message: 'Please input your name!' }]}>
                            <Input />
                        </Form.Item> */}
                        <Form.Item name="roleUserSchoolName" label="School Name" rules={[{ required: true, message: 'Please select a school!' }]}>
                            <Select>
                                {roles.map((school) => (
                                    <Option key={school.id} value={school.name}>{school.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="roleOfUser" label="Role" rules={[{ required: true, message: 'Please input the role!' }]}>
                            <Input />
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
        </JumbotronWrapper>
    );
}

export default Module3;