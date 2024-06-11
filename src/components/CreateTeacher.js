import React, { useEffect } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { JumbotronWrapper } from './common';
import { Form, Input, Button, message, Select, Radio,Upload  } from 'antd';
const { Option } = Select;
import { UploadOutlined } from '@ant-design/icons';
const CreateTeacher = ({ history }) => {
    const [schools, setSchools] = React.useState([]);
    const [form] = Form.useForm();

    const fetchSchools = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/schoolClassList/getallschoolClassList");
            setSchools(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/createTeacher', values);
            if (response.data && response.data.success) {
                message.success('Teacher created successfully');
                history.push('/app/teacher');
            } else {
                message.error('Failed to create teacher');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to create teacher');
        }
    };
    const validateAadharNumber = (_, value) => {
        if (!value) {
            return Promise.reject('Please input your Aadhar number!');
        } else if (!/^\d{12}$/.test(value)) {
            return Promise.reject('Aadhar number must be 16 digits long and contain only numbers!');
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
        <JumbotronWrapper title="Create Teacher">
            <div className="container mt-5">
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item
                        name="school_name"
                        label="School Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please select a school!',
                            },
                        ]}
                    >
                        <Select>
                            {schools.map((school) => (
                                <Option key={school.id} value={school.name}>
                                    {school.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Employee Name"
                        name="employeename"
                        rules={[{ required: true, message: 'Please input employee name!' }]}
                    >
                        <Input />
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
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Contact Number"
                        name="contactnumber"
                        rules={[
                            { validator: validateContactNumber }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Gender Ratio"
                        name="gender"
                        rules={[{ required: true, message: 'Please select gender ratio!' }]}
                    >
                        <Radio.Group>
                            <Radio value="male">Male</Radio>
                            <Radio value="female">Female</Radio>
                            <Radio value="other">Other</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="DOB" name="dob" rules={[{ required: true, message: 'Please input date of birth!' }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item label="DOJ" name="doj" rules={[{ required: true, message: 'Please input date of joining!' }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item
                        label="Present Address"
                        name="presentaddress"
                        rules={[{ required: true, message: 'Please input present address!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        label="Permanent Address"
                        name="permanentaddress"
                        rules={[{ required: true, message: 'Please input permanent address!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    
                    <Form.Item
                        label="Designation"
                        name="designation"
                        rules={[{ required: true, message: 'Please input designation!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Highest Education Qualification"
                        name="heq"
                        rules={[{ required: true, message: 'Please input Highest Education Qualification!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Aadhar Number"
                        name="aadharnumber"
                        rules={[
                            { required: true, message: 'Please input Aadhar number!' },
                            { validator: validateAadharNumber }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="PAN Number"
                        name="pannumber"
                        rules={[{ required: true, message: 'Please input PAN number!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Blood Group"
                        name="bloodgroup"
                        rules={[{ required: true, message: 'Please select blood group!' }]}
                    >
                        <Select>
                            <Option value="A+">A+</Option>
                            <Option value="A-">A-</Option>
                            <Option value="B+">B+</Option>
                            <Option value="B-">B-</Option>
                            <Option value="O+">O+</Option>
                            <Option value="O-">O-</Option>
                            <Option value="AB+">AB+</Option>
                            <Option value="AB-">AB-</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Nationality"
                        name="nationality"
                        rules={[{ required: true, message: 'Please select nationality!' }]}
                    >
                        <Select>
                            <Option value="indian">Indian</Option>
                            <Option value="american">American</Option>
                            <Option value="british">British</Option>
                            {/* Add more options as needed */}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        label="Marital Status"
                        name="maritalstatus"
                        rules={[{ required: true, message: 'Please select marital status!' }]}
                    >
                        <Select>
                            <Option value="single">Single</Option>
                            <Option value="married">Married</Option>
                            <Option value="divorced">Divorced</Option>
                            <Option value="widowed">Widowed</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Bank Account Number"
                        name="bankaccountnumber"
                        rules={[
                            { required: true, message: 'Please input bank account number!' },
                            { pattern: /^\d{9,18}$/, message: 'Bank account number must be between 9 and 18 digits!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Bank Name"
                        name="bankname"
                        rules={[{ required: true, message: 'Please input bank name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Bank Branch"
                        name="bankbranch"
                        rules={[{ required: true, message: 'Please input bank branch!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Photo"
                        name="photo"
                        rules={[{ required: true, message: 'Please upload a photo!' }]}
                    >
                        <Upload
                            maxCount={1}
                            listType="picture"
                            beforeUpload={() => false} // Prevent actual file upload for now
                        >
                            <Button icon={<UploadOutlined />}>Upload Photo</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create Teacher
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </JumbotronWrapper>
    );
};

export default withRouter(CreateTeacher);
