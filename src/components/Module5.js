import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { JumbotronWrapper } from './common';
import { Form, Input, Select, Button, Spin } from 'antd';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

const Module5 = () => {
    const [schools, setSchools] = useState([]);
    const [schoolClasses, setSchoolClasses] = useState([]);
    const [form] = Form.useForm();
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSchools();
        fetchSchoolClasses();
    }, []);

    const fetchSchools = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/schoolClassList/getallschoolClassList");
            setSchools(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSchoolClasses = async (schoolName) => {
        try {
            const response = await axios.post("http://localhost:8080/api/gradeClassList/getallgradeClassList", { school_name: schoolName });
            const data = response.data.sort((a, b) => romanToDecimal(a.grade) - romanToDecimal(b.grade));
            setSchoolClasses(data);
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleSchoolChange = (value) => {
        form.setFieldsValue({ grade: undefined }); // Reset grade field
        fetchSchoolClasses(value);
    };

    const romanToDecimal = (roman) => {
        const romans = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
        let result = 0;
        for (let i = 0; i < roman.length; i++) {
            if (i > 0 && romans[roman[i]] > romans[roman[i - 1]]) {
                result += romans[roman[i]] - 2 * romans[roman[i - 1]];
            } else {
                result += romans[roman[i]];
            }
        }
        return result;
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const existingSection = schoolClasses.find(
                (schoolClass) =>
                    schoolClass.school_name === values.school_name &&
                    schoolClass.grade === values.grade &&
                    schoolClass.section_name === values.section_name
            );
    
            if (existingSection) {
                alert('Section with the same school, grade, and section name already exists.');
                setLoading(false);
                return;
            }
    
            const response = await axios.post("http://localhost:8080/api/user/createschoolsection", values);
            if (response.data.success) {
                alert('Section created Successfully');
                history.push('/app/sectionlist');
            } else {
                alert('Failed to create section');
            }
        } catch (error) {
            console.error('Error creating section:', error);
            let errorMessage = 'Server error. Failed to create section';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    
    const handleReset = () => {
        form.resetFields();
    };

    const handleCancel = () => {
        history.push('/app/sectionlist');
    };

    return (
        <JumbotronWrapper title="Create Section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <Form
                            form={form}
                            onFinish={handleSubmit}
                            layout="vertical"
                        >
                            <Form.Item
    label="School Name"
    name="school_name"
    rules={[{ required: true, message: 'Please select a school!' }]}
>
    <Select placeholder="Select School" onChange={handleSchoolChange}>
        {schools.map((school) => (
            <Option key={school.id} value={school.name}>{school.name}</Option>
        ))}
    </Select>
</Form.Item>

<Form.Item
    label="Grade"
    name="grade"
    rules={[{ required: true, message: 'Please select grade!' }]}
>
    <Select placeholder="Select Grade">
        {schoolClasses.map((schoolClass) => (
            <Option key={schoolClass.id} value={schoolClass.grade}>{schoolClass.grade}</Option>
        ))}
    </Select>
</Form.Item>
                            <Form.Item
                                label="Section Name"
                                name="section_name"
                                rules={[{ required: true, message: 'Please input the section name!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Short Code"
                                name="short_code"
                                rules={[{ required: true, message: 'Please input the short code!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
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

export default Module5;