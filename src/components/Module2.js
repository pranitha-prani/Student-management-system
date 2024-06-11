import React, { useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { JumbotronWrapper } from './common';
import { Form, Input, Button, Spin, message, Select } from 'antd';

const { Option } = Select;

const Module2 = ({ history }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        email: '',
        logo: '',
        board: [],
        contactnumber: '',
        address: '',
        street: '',
        city: '',
        pincode: '',
        state: '',
        country: '',
        website: ''
    });

    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const formRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleBoardChange = (value) => {
        setFormData({
            ...formData,
            board: value
        });
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:8080/api/user/createschool',
                values
            );
            console.log('Response from server:', response);
            if (response.data.success) {
                message.error('Failed to create school');
            } else {
                message.success('School created successfully');
                history.push('/app/schools');
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                if (error.response.status === 409) {
                    setFormError(error.response.data.error);
                } else {
                    setFormError('Server error. Failed to create school');
                }
            } else {
                setFormError('Network error. Failed to communicate with the server');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        formRef.current.resetFields();
        setFormData({
            name: '',
            code: '',
            email: '',
            logo: '',
            board: [],
            contactnumber: '',
            address: '',
            street: '',
            city: '',
            pincode: '',
            state: '',
            country: '',
            website: ''
        });
    };

    const handleCancel = () => {
        history.push('/app/schools');
    };
    const validateName = (_, value) => {
        if (!/^[a-zA-Z]+$/.test(value)) {
            return Promise.reject('Name must contain only alphabets!');
        } else {
            return Promise.resolve();
        }
    };

    const validateCode = (_, value) => {
        if (!/^[a-zA-Z]+$/.test(value)) {
            return Promise.reject('Code must contain only alphabets!');
        } else {
            return Promise.resolve();
        }
    };
    const validateContactNumber = (_, value) => {
        if (!value) {
            return Promise.reject('Please input your contact number!');
        } else if (!/^\d{10}$/.test(value)) {
            return Promise.reject('Contact number must be 10 digits long and contain only numbers!');
        } else {
            return Promise.resolve();
        }
    };
    return (
        <JumbotronWrapper title="Create School">
            <div className="container mt-5">
                <Form layout="vertical" onFinish={handleSubmit} ref={formRef}>
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            {formError && (
                                <div className="alert alert-danger" role="alert">
                                    {formError}
                                </div>
                            )}
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                                <Input value={formData.name} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item
                                label="Code"
                                name="code"
                                rules={[{ required: true, message: 'Please input code!' }]}
                            >
                                <Input value={formData.code} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        type: 'email',
                                        message: 'Please input valid email!'
                                    }
                                ]}
                            >
                                <Input value={formData.email} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Logo" name="logo">
                                <Input value={formData.logo} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Board" name="board">
                                <Select
                                    mode="multiple"
                                    placeholder="Select board"
                                    value={formData.board}
                                    onChange={handleBoardChange}
                                >
                                    <Option value="CBSE">CBSE</Option>
                                    <Option value="ICSE">ICSE</Option>
                                    <Option value="State Board">State Board</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Contact Number"
                                name="contactnumber"
                                rules={[
                                    { validator: validateContactNumber }
                                ]}
                            >
                                <Input value={formData.contactnumber} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Address" name="address">
                                <Input value={formData.address} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Street" name="street">
                                <Input value={formData.street} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="City" name="city">
                                <Input value={formData.city} onChange={handleChange} />
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

                            <Form.Item label="State" name="state">
                                <Select
                                    placeholder="Select state"
                                    value={formData.state}
                                    onChange={(value) => setFormData({ ...formData, state: value })}
                                >
                                    <Option value="Goa">Goa</Option>
                                    <Option value="TamilNadu">Tamil Nadu</Option>
                                    <Option value="Karnataka">Karnataka</Option>
                                    <Option value="Maharashtra">Maharashtra</Option>
                                    {/* Add more state options as needed */}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Country" name="country">
                                <Select
                                    placeholder="Select country"
                                    value={formData.country}
                                    onChange={(value) =>
                                        setFormData({ ...formData, country: value })
                                    }
                                >
                                    <Option value="India">India</Option>
                                    <Option value="United States">United States</Option>
                                    <Option value="United Kingdom">United Kingdom</Option>
                                    <Option value="Canada">Canada</Option>
                                    <Option value="Australia">Australia</Option>
                                    {/* Add more options as needed */}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Website" name="website">
                                <Input value={formData.website} onChange={handleChange} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" disabled={loading}>
                                    {loading ? <Spin /> : 'Create'}
                                </Button>
                                <Button type="default" onClick={handleReset} style={{ marginLeft: '10px', backgroundColor: 'gray', color: 'white' }}>
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
                        </div>
                    </div>
                </Form>
            </div>
        </JumbotronWrapper>
    );
};

export default withRouter(Module2);
