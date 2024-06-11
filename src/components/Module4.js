import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import { Button, Form, Input, Select, Spin } from 'antd';
import { JumbotronWrapper } from './common';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

const Module4 = () => {
    const [form] = Form.useForm();
    const [schools, setSchools] = useState([]);
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/schoolClassList/getallschoolClassList");
            const data = response.data;
            setSchools(data);
        } catch (error) {
            console.error(error);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/api/user/createschoolclass", values);
            setLoading(false);
            alert("Class Created successfully");
            history.push('/app/classlist'); // Navigate to the new URL
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 402) {
                // Handle duplicate error
                alert("Error: School name and grade already exists");
            } else {
                console.error(error);
                alert("Failed to create class. Server error occurred.");
            }
        }
    };
    

    const handleReset = () => {
        form.resetFields();
    };

    const handleCancel = () => {
        history.push('/app/classlist');
    };

    return (
        <JumbotronWrapper title="Create Grade">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <Form
                            form={form}
                            name="register"
                            onFinish={onFinish}
                            scrollToFirstError
                            layout="vertical"
                        >
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
                                name="grade"
                                label="Grade"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input the grade!',
                                        whitespace: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            {/* <Form.Item
                                name="short_code"
                                label="Short Code"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input the short code!',
                                        whitespace: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item> */}

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    {loading ? <Spin /> : 'Create'}
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
};

export default memo(Module4);
