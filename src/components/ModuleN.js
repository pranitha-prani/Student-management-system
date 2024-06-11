import React, { useState, useEffect, useRef } from 'react';
import { JumbotronWrapper } from './common';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import FormItem from 'antd/es/form/FormItem';
import {
	Steps,
	Card,
	Form,
	Input,
	Col,
	Button,
	Checkbox,
	Row,
	Select,
	Radio,
	Space,
	Tooltip,
	Spin
} from 'antd';
import {
	EditOutlined,
	SolutionOutlined,
	UserOutlined,
	EnvironmentOutlined,
	CheckOutlined
} from '@ant-design/icons';

const { Option } = Select;

const { Item } = Form;

const ModuleN = () => {
	const location = useLocation();
	const history = useHistory(); // Access history for navigation
	const [loading, setLoading] = useState(false);
	const [schoolType, setSchoolType] = useState('');
	const { applicationData } = location.state || {};
	const [selectValue, setSelectValue] = useState('No'); // State for select field
	const [physicalDetails, setPhysicalDetails] = useState(''); // State for input field

	const handleSchoolTypeChange = (value) => {
		setSchoolType(value);
	};

	const [formData, setFormData] = useState({
		academicYear: applicationData?.academicYear || '',
		board: applicationData?.board || '',
		school_name: applicationData?.school_name || '',
		emisNum: applicationData?.emisNum || '',
		aadharNumber: applicationData?.aadharNumber || '',
		name: applicationData?.name || '',
		gender: applicationData?.gender || '',
		grade:  applicationData?.grade || '',
		dob: applicationData?.dob || '',
		age: applicationData?.age || '',
		nationality: applicationData?.nationality || '',
		state: applicationData?.state || '',
		hometown: applicationData?.hometown || '',
		religion: applicationData?.religion || '',
		community: applicationData?.community || '',
		caste: applicationData?.caste || '',
		aboutcaste: applicationData?.aboutcaste || '',
		living: applicationData?.living || '',
		vaccinated: applicationData?.vaccinated || '',
		identificationmarks: applicationData?.identificationmarks || '',
		bloodGroup: applicationData?.bloodGroup || '',
		physical: applicationData?.physical || '',
		physicalDetails: applicationData?.physicalDetails || '',
		fatherName: applicationData?.fatherName || '',
		motherName: applicationData?.motherName || '',
		fatherOccupation: applicationData?.fatherOccupation || '',
		fatherIncome: applicationData?.fatherIncome || '',
		motherOccupation: applicationData?.motherOccupation || '',
		motherIncome: applicationData?.motherIncome || '',
		address: applicationData?.address || '',
		pincode: applicationData?.pincode || '',
		telephoneNumber: applicationData?.telephoneNumber || '',
		mobileNumber: applicationData?.mobileNumber || '',
		guardianName: applicationData?.guardianName || '',
		guardianOccupation: applicationData?.guardianOccupation || '',
		guardianIncome: applicationData?.guardianIncome || '',
		guardianaddress: applicationData?.guardianaddress || '',
		parentconsent: applicationData?.parentconsent || '',
		academicHistory: [],
		passorfail: applicationData?.passorfail || '',
		motherTongue: applicationData?.motherTongue || '',
		firstLanguage: applicationData?.firstLanguage || '',
		accountnumber: applicationData?.accountnumber || '',
		bankname: applicationData?.bankname || '',
		branchname: applicationData?.branchname || '',
		ifsccode: applicationData?.ifsccode || ''
	});

	const [formStep1] = Form.useForm();
	const [formStep2] = Form.useForm();
	const [formStep3] = Form.useForm();
	const [formStep4] = Form.useForm();
	const [formStep5] = Form.useForm();
	const [currentStep, setCurrentStep] = useState(0);

	const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
	const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
	const handleCheckboxChange = (e) => {
		setIsCheckboxChecked(e.target.checked);
		setIsSubmitButtonDisabled(!e.target.checked);
	};
	const totalSteps = 4;
	const completionPercentage = (currentStep / totalSteps) * 100;

	const [value, setValue] = useState({});
	const [selectedValue, setSelectedValue] = useState('defaultValue');
	const [studentStatus, setStudentStatus] = useState('');
	const [emisNum, setEmisNum] = useState(['', '', '', '', '', '', '', '']);

	const handleinputChange = (index, value) => {
		const newEmisNum = [...emisNum];
		newEmisNum[index] = value;
		setEmisNum(newEmisNum);
	};

	const handleCommunityChange = (value) => {
		setSelectedValue(value);
		setoveralldata({
			...overalldata,
			community: value
		});
	};
	const handleBloodGroupChange = (value) => {
		setSelectedValue(value);
		setoveralldata({
			...overalldata,
			bloodGroup: value
		});
	};
	const handleTceslcChange = (value) => {
		setSelectedValue(value);
		setoveralldata({
			...overalldata,
			tceslc: value
		});
	};
	const handlePhysicalChange = (e) => {
		console.log(e.target.value);
	};

	const handlePhysicalDetailsChange = (e) => {
		setPhysicalDetails(e.target.value);
	};
	const [telephoneNumber, setTelephoneNumber] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');
	const handleTelephoneNumberChange = (e) => {
		setTelephoneNumber(e.target.value);
	};
	const handleMobileNumberChange = (e) => {
		setMobileNumber(e.target.value);
	};
	const [academicHistory, setAcademicHistory] = useState([
		{ id: 1, schoolName: '', standard: '', duration: '' }
	]);

	const handleInputChange = (id, key, value) => {
		const updatedAcademicHistory = academicHistory.map((item) => {
			if (item.id === id) {
				return { ...item, [key]: value };
			}
			return item;
		});
		setAcademicHistory(updatedAcademicHistory);
	};

	const handleAddRow = () => {
		if (academicHistory.length < 4) {
			const newRow = {
				id: academicHistory.length + 1,
				schoolName: '',
				standard: '',
				duration: ''
			};
			setAcademicHistory([...academicHistory, newRow]);
		}
	};

	const handleRemoveRow = (id) => {
		const updatedAcademicHistory = academicHistory.filter(
			(item) => item.id !== id
		);
		setAcademicHistory(updatedAcademicHistory);
	};

	const [overalldata, setoveralldata] = useState({
		academicYear: '',
		board: '',
		school_name: '',
		emisNum: '',
		aadharNumber: '',
		name: '',
		gender: '',
		grade: '',
		dob: '',
		age: '',
		nationality: '',
		state: '',
		hometown: '',
		religion: '',
		community: '',
		caste: '',
		aboutcaste: '',
		living: '',
		vaccinated: '',
		identificationmarks: '',
		bloodGroup: '',
		physical: '',
		physicalDetails: '',
		fatherName: '',
		motherName: '',
		fatherOccupation: '',
		fatherIncome: '',
		motherOccupation: '',
		motherIncome: '',
		address: '',
		pincode: '',
		telephoneNumber: '',
		mobileNumber: '',
		guardianName: '',
		guardianOccupation: '',
		guardianIncome: '',
		guardianaddress: '',
		parentconsent: '',
		tceslc: '',
		academicHistory: [],
		passorfail: '',
		motherTongue: '',
		firstLanguage: '',
		accountnumber: '',
		bankname: '',
		branchname: '',
		ifsccode: ''
	});
	useEffect(() => {
		if (applicationData) {
			setFormData(applicationData);
		}
	}, [applicationData]);

	const onFinish = async () => {
		setLoading(true);
		try {
			const formData = {
				academicYear: formStep1.getFieldValue('academicYear'),
				board: formStep1.getFieldValue('board'),
				school_name: formStep1.getFieldValue('school_name'),
				emisNum: emisNum.join(''),
				aadharNumber: formStep1.getFieldValue('aadharNumber'),
				name: formStep2.getFieldValue('name'),
				gender: formStep2.getFieldValue('gender'),
				grade: formStep2.getFieldValue('grade'),
				dob: formStep2.getFieldValue('dob'),
				age: formStep2.getFieldValue('age'),
				nationality: formStep2.getFieldValue('nationality'),
				state: formStep2.getFieldValue('state'),
				hometown: formStep2.getFieldValue('hometown'),
				religion: formStep2.getFieldValue('religion'),
				community: formStep2.getFieldValue('community'),
				caste: formStep2.getFieldValue('caste'),
				aboutcaste: formStep2.getFieldValue('aboutcaste'),
				living: formStep2.getFieldValue('living'),
				vaccinated: formStep2.getFieldValue('vaccinated'),
				identificationmarks: formStep2.getFieldValue('identificationmarks'),
				bloodGroup: formStep2.getFieldValue('bloodGroup'),
				physical: formStep2.getFieldValue('physical'),
				physicalDetails: formStep2.getFieldValue('physicalDetails'),
				fatherName: formStep3.getFieldValue('fatherName'),
				motherName: formStep3.getFieldValue('motherName'),
				fatherOccupation: formStep3.getFieldValue('fatherOccupation'),
				fatherIncome: formStep3.getFieldValue('fatherIncome'),
				motherOccupation: formStep3.getFieldValue('motherOccupation'),
				motherIncome: formStep3.getFieldValue('motherIncome'),
				address: formStep3.getFieldValue('address'),
				pincode: formStep3.getFieldValue('pincode'),
				telephoneNumber: formStep3.getFieldValue('telephoneNumber'),
				mobileNumber: formStep3.getFieldValue('mobileNumber'),
				guardianName: formStep3.getFieldValue('guardianName'),
				guardianOccupation: formStep3.getFieldValue('guardianOccupation'),
				guardianIncome: formStep3.getFieldValue('guardianIncome'),
				guardianaddress: formStep3.getFieldValue('guardianaddress'),
				parentconsent: formStep3.getFieldValue('parentconsent'),
				tceslc: formStep3.getFieldValue('tceslc'),
				academicHistory: academicHistory.map((item) => ({
					schoolName: item.schoolName,
					standard: item.standard,
					duration: item.duration
				})),
				passorfail: formStep4.getFieldValue('passorfail'),
				motherTongue: formStep4.getFieldValue('motherTongue'),
				firstLanguage: formStep4.getFieldValue('firstLanguage'),
				accountnumber: formStep5.getFieldValue('accountnumber'),
				bankname: formStep5.getFieldValue('bankname'),
				branchname: formStep5.getFieldValue('branchname'),
				ifsccode: formStep5.getFieldValue('ifsccode')
			};
			if (applicationData) {
				// If applicationData exists, it means you are in edit mode.
				// Use the applicationData to update the existing data.
				const response = await axios.get(
					`http://localhost:8080/api/application/updateapplication/${applicationData.id}`,
					formData
				);
				console.log('Received response from server: ', response.data);
				alert('Application Updated successfully');
				setStudentStatus('applied'); // Update student status to "applied"
				history.push('/app/listofapplications');
			} else {
				// If applicationData is not available, it's a new application.
				// Create a new application.
				const response = await axios.post(
					'http://localhost:8080/api/user/createapplication',
					formData
				);
				console.log('Received response from server: ', response.data);
				alert('Application Created successfully');
				history.push('/app/listofapplications'); // Change the route as per your requirement
			}
		} catch (error) {
			console.error(error);
			alert('Server error. Failed to create application form');
		} finally {
			setLoading(false); // Set loading back to false after form submission (whether successful or not)
		}
	};

	const handleGenderChange = (e) => {
		console.log('Selected gender:', e.target.value);
	};
	const handleParentconsentChange = (e) => {
		console.log('Selected Parentconsent:', e.target.value);
	};
	const handleCasteChange = (e) => {
		console.log(e.target.value);
	};
	const handleVaccinatedChange = (e) => {
		console.log(e.target.value);
	};
	const handlePassorfailChange = (value) => {
		setSelectedValue(value);
		setoveralldata({
			...overalldata,
			passorfail: value
		});
	};
	const handleMotherTongueChange = (value) => {
		setSelectedValue(value);
		setoveralldata({
			...overalldata,
			motherTongue: value
		});
	};
	const renderStudentStatusField = () => {
		// Render student status field only if applicationData exists (i.e., editing an application)
		if (applicationData) {
			return (
				<Form.Item label="Student Status">
					<Input value={studentStatus} disabled />
				</Form.Item>
			);
		}
	};
	const [form] = Form.useForm();
	const [schoolClasses, setSchoolClasses] = useState([]);
	const [schools, setSchools] = useState([]);
	useEffect(() => {
		fetchSchools();
		fetchSchoolClasses();
	}, []);

	const fetchSchools = async () => {
		try {
			const response = await axios.post(
				'http://localhost:8080/api/schoolClassList/getallschoolClassList'
			); // Replace with your API endpoint for fetching schools
			const data = response.data;
			setSchools(data);
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
	const handleAcademicYearChange = (value) => {
		setSelectedValue(value); // Update selectedValue when the value changes
		setoveralldata({
			...overalldata,
			academicYear: value // Set the academicYear property
		});
	};

	// const handleBoardChange = (value) => {
	// 	setSelectedValue(value);
	// 	setoveralldata({
	// 		...overalldata,
	// 		board: value
	// 	});
	// };

	// const handleSchoolChange = (value) => {
	// 	setSelectedValue(value);
	// 	setoveralldata({
	// 		...overalldata,
	// 		school: value
	// 	});
	// };
	const handleContinue = async () => {
		try {
			if (currentStep === 0) {
				await formStep1.validateFields();
				setCurrentStep(currentStep + 1);
			} else if (currentStep === 1) {
				await formStep2.validateFields();
				setCurrentStep(currentStep + 1);
			} else if (currentStep === 2) {
				await formStep3.validateFields();
				setCurrentStep(currentStep + 1);
			} else if (currentStep === 3) {
				await formStep4.validateFields();
				setCurrentStep(currentStep + 1);
			}
		} catch (error) {
			console.error('Form validation error:', error);
		}
	};

	const handlePrevious = () => {
		setCurrentStep(currentStep - 1);
	};
	const handleCancel = () => {
		// Redirect to another page when cancel button is clicked
		history.push('/app/listofapplications'); // Change the route as per your requirement
	};

	return (
		<div>
			<br />
			<br />
			<div className="stepper">
				<Steps style={{ margin: '1px' }} current={currentStep}>
					<Steps.Step
						title="General Information"
						icon={<EditOutlined style={{ border: 'solid', padding: '4px' }} />}
					/>
					<Steps.Step
						title="Student Information"
						icon={
							<SolutionOutlined style={{ border: 'solid', padding: '4px' }} />
						}
					/>
					<Steps.Step
						title="Parent Information"
						icon={<UserOutlined style={{ border: 'solid', padding: '4px' }} />}
					/>
					<Steps.Step
						title="Academic Details"
						icon={
							<EnvironmentOutlined
								style={{ border: 'solid', padding: '4px' }}
							/>
						}
					/>
					<Steps.Step
						title="Bank Details"
						icon={<CheckOutlined style={{ border: 'solid', padding: '4px' }} />}
					/>
				</Steps>
				<br />
				<Form.Item
					label="School Type"
					name="schoolType"
					rules={[{ required: true, message: 'Please select a school type' }]}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-center'
					}}
				>
					<Select
						onChange={handleSchoolTypeChange}
						style={{ width: 200 }}
						placeholder="Select the Education level"
					>
						<Option value="Middle School">Middle School</Option>
						<Option value="High School">High School</Option>
					</Select>
				</Form.Item>
			</div>
			{/* First stepper */}
			{currentStep === 0 && (
				<div className="step-1 form">
					<Form
						form={formStep1}
						name="academic"
						onFinish={onFinish}
						onValuesChange={(changedValues, allValues) => {
							console.log('Changed values:', changedValues);
							console.log('All values:', allValues);
						}}
						scrollToFirstError
					>
						<Card
							style={{
								width: 1150,
								marginLeft: 5,
								backgroundColor: 'lightwhite'
							}}
						>
							<h3>General Information</h3>
							<br />
							<Card
								hoverable
								style={{
									width: 1100,
									height: 180,
									background: '#38598b'
								}}
							>
								<Row gutter={[3, 6]}>
									<Space size={[8, 16]} wrap>
										<FormItem
											style={{ width: 235 }}
											name="academicYear"
											label={
												<span style={{ color: 'white' }}>Academic Year</span>
											}
											rules={[
												{
													required: true,
													message: 'Select something!'
												}
											]}
										>
											<Select
												placeholder="Select"
												id="academicYear"
												value={selectedValue}
												onChange={handleAcademicYearChange}
											>
												<Option value="2024-2025">2024-2025</Option>
											</Select>
										</FormItem>
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										<Form.Item
                                style={{ width: 420 }}
                                name="school_name"
                                label={<span style={{ color: 'white' }}>School</span>}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Select Your School!'
                                    }
                                ]}>
                                <Select placeholder="Select the School" onChange={handleSchoolChange}>
                                    {schools.map((school) => (
                                        <Option key={school.id} value={school.name}>
                                            {school.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
										&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										<Form.Item
											name="emisNum"
											label={
												<span style={{ color: 'white' }}>EMIS Number</span>
											}
											rules={[
												({ getFieldValue }) => ({
													validator(_, value) {
														const isFilled = emisNum.every(
															(boxValue) => boxValue !== ''
														);
														if (isFilled) {
															return Promise.resolve();
														}
														return Promise.reject(
															'All 8 boxes must be filled with numbers'
														);
													}
												})
											]}
										>
											{emisNum.map((boxValue, index) => (
												<Input
													key={index}
													name={`emisNum[${index}]`}
													value={boxValue}
													onInput={(e) => {
														e.target.value = e.target.value
															.replace(/[^0-9]/g, '')
															.slice(0, 8);
													}}
													onChange={(e) =>
														handleinputChange(index, e.target.value)
													}
													maxLength={1}
													style={{ width: '2.5em', marginRight: '0.1em' }}
												/>
											))}
										</Form.Item>
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										<FormItem
											style={{ width: 290 }}
											name="aadharNumber"
											label={
												<span style={{ color: 'white' }}>Aadhar Number</span>
											}
											maxLength={16}
											onChange={(values) => {
												console.log(values.aadharNumber);
											}}
											rules={[
												{
													required: true,
												}
											]}
										>
											<Input
												placeholder="Enter Aadhar Number"
												onInput={(e) => {
													e.target.value = e.target.value
														.replace(/[^0-9]/g, '')
														.slice(0, 16);
												}}
											/>
										</FormItem>
										{/* {schoolType === 'High School' && (
											<FormItem
												style={{ width: 185 }}
												name="board"
												label={<span style={{ color: 'white' }}>Board</span>}
												rules={[
													{
														required: true,
														message: 'Select something!'
													}
												]}
											>
												<Select
													placeholder="Select"
													id="board"
													value={selectedValue}
													onChange={handleBoardChange}
												>
													<Option value="State Board">State Board</Option>
												</Select>
											</FormItem>
										)} */}
									</Space>
								</Row>
							</Card>
							<br />
							<div style={{ textAlign: 'center' }}>
								<Tooltip
									title={
										<div className="marquee">
											If you want to continue,don't click it
										</div>
									}
									placement="top"
								>
									<Button type="primary" htmlType="submit">
										Draft
									</Button>
								</Tooltip>
								&nbsp;&nbsp; &nbsp;&nbsp;
								<Tooltip
									title="If you want to continue, click Here!"
									placement="top"
								>
									<Button type="primary" onClick={handleContinue}>
										Continue
									</Button>
								</Tooltip>
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
							</div>
						</Card>
					</Form>
				</div>
			)}
			{/* Second Stepper */}
			{currentStep === 1 && (
				<div className="step-2 form">
					<Form
						form={formStep2}
						name="student"
						onFinish={onFinish}
						onValuesChange={(changedValues, allValues) => {
							console.log('Changed values:', changedValues);
							console.log('All values:', allValues);
						}}
						scrollToFirstError
					>
						<Card
							style={{
								width: 1150,
								marginLeft: 1,
								backgroundColor: 'lightwhite'
							}}
						>
							<h3>Student Information</h3>
							<Card
								hoverable
								style={{
									width: 1100,
									backgroundColor: '#38598b',
									borderwidth: '2px',
									height: 565
								}}>
								<Row gutter={[3, 6]}>
									<FormItem
										style={{ width: 260 }}
										name="name"
										label={<span style={{ color: 'white' }}>Name</span>}
										rules={[
											{
												required: true,
												message: 'Enter Your Fullname!'
											}
										]}
										onChange={(values) => {
											console.log(values.name);
										}}
									>
										<Input
											placeholder="Enter Your Name"
											maxLength={30}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 30);
											}}
										/>
									</FormItem>
									&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item
										// style={{ width: 200 }}
										name="gender"
										label={<span style={{ color: 'white' }}>Gender</span>}
										rules={[
											{
												required: true,
												message: 'Select something!'
											}
										]}
									>
										<Radio.Group onChange={handleGenderChange}>
											<Radio value="Male" style={{ color: 'white' }}>
												Male
											</Radio>
											<Radio value="Female" style={{ color: 'white' }}>
												Female
											</Radio>
											<Radio value="Others" style={{ color: 'white' }}>
												Others
											</Radio>
										</Radio.Group>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item
                                 style={{ width: 311 }} 
                                name="grade"
                                label={<span style={{ color: 'white' }}>Grade</span>}
                                rules={[
                                    {
										required: true,
                                        message: 'Please select grade!'
                                    }
                                ]}
                            >
                                <Select placeholder="Select Grade">
                                    {schoolClasses.map((schoolClass) => (
                                        <Option key={schoolClass.id} value={schoolClass.grade}>
                                            {schoolClass.grade}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
									<FormItem
										name="dob"
										style={{ width: 260 }}
										label={
											<span style={{ color: 'white' }}>Date of Birth</span>
										}
										type="date"
										rules={[
											{
												required: true,
												message: 'Please select your date of birth!'
											}
										]}
									>
										<Input type="date" placeholder="Select date" />
									</FormItem>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<FormItem
										style={{ width: 265 }}
										name="age"
										label={<span style={{ color: 'white' }}>Age</span>}
										rules={[
											{
												required: true,
												message: 'Enter valid age!'
											}
										]}
										onChange={(values) => {
											console.log(values.age);
										}}
									>
										<Input
											placeholder="Enter Age"
											maxLength={2}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^0-9]/g, '')
													.slice(0, 2);
											}}
										/>
									</FormItem>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<FormItem
										style={{ width: 300 }}
										name="nationality"
										label={<span style={{ color: 'white' }}>Nationality</span>}
										rules={[
											{
												required: true,
												message: 'Required!'
											}
										]}
										onChange={(values) => {
											console.log(values.nationality);
										}}
									>
										<Select placeholder="Select your Nationality">
											<Option value="America">America</Option>
											<Option value="India">India</Option>
											<Option value="Indonesia">Indonesia</Option>
											<Option value="USA">USA</Option>
											<Option value="UK">UK</Option>
											<Option value="Pakistan">Pakistan</Option>
										</Select>
									</FormItem>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item
										style={{ width: 280 }}
										name="state"
										label={<span style={{ color: 'white' }}>State</span>}
										onChange={(values) => {
											console.log(values.state);
										}}
									>
										<Input
											placeholder="Enter Your State"
											maxLength={50}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 50);
											}}
										/>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item
										style={{ width: 283 }}
										name="hometown"
										label={<span style={{ color: 'white' }}>Home Town</span>}
										onChange={(values) => {
											console.log(values.hometown);
										}}
									>
										<Input
											placeholder="Enter Your Home Town"
											maxLength={50}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 50);
											}}
										/>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<FormItem
										style={{ width: 284 }}
										name="religion"
										label={<span style={{ color: 'white' }}>Religion</span>}
										onChange={(values) => {
											console.log(values.religion);
										}}
									>
										<Input
											placeholder="Enter Your Religion"
											maxLength={20}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 20);
											}}
										/>
									</FormItem>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<FormItem
										style={{ width: 277 }}
										name="community"
										label={<span style={{ color: 'white' }}>Community</span>}
									>
										<Select
											placeholder="Select"
											id="community"
											value={selectedValue}
											onChange={handleCommunityChange}
										>
											<Option value="BC">BC</Option>
											<Option value="MBC">MBC</Option>
											<Option value="SC">SC</Option>
											<Option value="ST">ST</Option>
											<Option value="OC">OC</Option>
											<Option value="DNC">DNC</Option>
											<Option value="FC">FC</Option>
											<Option value="OBC">OBC</Option>
											<Option value="BCM">BCM</Option>
											<Option value="Others">Others</Option>
										</Select>
									</FormItem>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<FormItem
										style={{ width: 284 }}
										name="caste"
										label={<span style={{ color: 'white' }}>Caste</span>}
										onChange={(values) => {
											console.log(values.caste);
										}}
									>
										<Input
											placeholder="Enter Your Caste"
											maxLength={30}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 20);
											}}
										/>
									</FormItem>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item
										name="aboutcaste"
										label={
											<span style={{ color: 'white' }}>
												Is the student from scheduled tribe community? Is the
												caste entitled to get ex-gratia salary? Is the student a
												convert from Hinduism to Christianity?
											</span>
										}
										onChange={handleCasteChange}>
										<Radio.Group>
											<Radio value="Yes">Yes</Radio>
											<Radio value="No">No</Radio>
										</Radio.Group>
									</Form.Item>
									<FormItem
										style={{ width: 277 }}
										name="living"
										label={
											<span style={{ color: 'white' }}>Living with whom</span>
										}
									>
										<Select
											placeholder="Select"
											id="living"
											value={selectedValue}
										>
											<Option value="Parents">Parents</Option>
											<Option value="Guardian">Guardian</Option>
											<Option value="Others">Others</Option>
										</Select>
									</FormItem>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<FormItem
										name="vaccinated"
										label={
											<span style={{ color: 'white' }}>
												Is the student for chicken pox? Is scar Available?
											</span>
										}
										 onChange={handleVaccinatedChange} >
										<Radio.Group>
											<Radio value="Yes">Yes</Radio>
											<Radio value="No">No</Radio>
										</Radio.Group>
									</FormItem>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<FormItem
										style={{ width: 284 }}
										name="identificationmarks"
										label={
											<span style={{ color: 'white' }}>
												Identification Marks
											</span>
										}
										onChange={(values) => {
											console.log(values.identificationmarks);
										}}
									>
										<Input
											placeholder="Enter Identification Marks"
											maxLength={30}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 30);
											}}
										/>
									</FormItem>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<FormItem
										style={{ width: 278 }}
										name="bloodGroup"
										label={<span style={{ color: 'white' }}>Blood Group</span>}
										rules={[
											{
												required: true,
												message: 'Required!'
											}
										]}
									>
										<Select
											placeholder="Enter Your Group"
											id="bloodGroup"
											value={selectedValue}
											onChange={handleBloodGroupChange}
										>
											<Option value="O+ve">O+VE</Option>
											<Option value="O-ve">O-VE</Option>
											<Option value="A+ve">A+VE</Option>
											<Option value="A-ve">A-VE</Option>
											<Option value="B+ve">B+VE</Option>
											<Option value="B-ve">B-VE</Option>
											<Option value="AB+ve">AB+VE</Option>
											<Option value="AB-ve">AB-VE</Option>
											<Option value="A1+ve">A1+VE</Option>
											<Option value="A1-ve">A1-VE</Option>
											<Option value="A1B+ve">A1B+VE</Option>
											<Option value="A1B-ve">A1B-VE</Option>
											<Option value="A2B+ve">A2B+VE</Option>
											<Option value="A2B-ve">A2B-VE</Option>
										</Select>
									</FormItem>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item
										name="physical"
										label={
											<span style={{ color: 'white' }}>
												Is the student Physically challenged?
											</span>
										}
										onChange={handlePhysicalChange} >
										<Radio.Group>
											<Radio value="Yes">Yes</Radio>
											<Radio value="No">No</Radio>
										</Radio.Group>
									</Form.Item>
										<Form.Item
											name="physicalDetails"
											label={
												<span style={{ color: 'white' }}>If He/ She Physically challenged Specify, Otherwish Enter Null</span>
											}
										>
											<Input.TextArea
												autoSize={{ minRows: 1, maxRows: 2 }}
												placeholder="Enter Your Reason"
												maxLength={500}
												onChange={handlePhysicalDetailsChange}
											/>
										</Form.Item>
									
								</Row>
							</Card>
						</Card>
						<br />
						<FormItem style={{ textAlign: 'center' }}>
							<Tooltip
								title="If you want to continue, don't click the Draft button"
								placement="top"
							>
								<Button type="primary" htmlType="submit">
									Draft
								</Button>
							</Tooltip>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<Button
								type="primary"
								onClick={handlePrevious}
								style={{ marginRight: 16 }}
							>
								Previous
							</Button>
							<Tooltip
								title="If you want to continue, click Here!"
								placement="top"
							>
								<Button type="primary" onClick={handleContinue}>
									Continue
								</Button>
							</Tooltip>
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
						</FormItem>
					</Form>
				</div>
			)}
			{/* // Third Stepper */}
			{currentStep === 2 && (
				<div className="step-3 form">
					<Form
						form={formStep3}
						name="parents"
						onFinish={onFinish}
						onValuesChange={(changedValues, allValues) => {
							console.log('Changed values:', changedValues);
							console.log('All values:', allValues);
						}}
						scrollToFirstError
					>
						<Card
							style={{
								width: 1150,
								marginLeft: 1,
								backgroundColor: 'lightwhite'
							}}
						>
							<h3>Parent's Information</h3>
							<Card
								hoverable
								style={{
									width: 1100,
									height: 85,
									background: '#38598b'
								}}
							>
								<Row gutter={[3, 6]}>
									<Space size={[8, 16]} wrap>
										<FormItem
											style={{ width: 290 }}
											name="fatherName"
											label={
												<span style={{ color: 'white' }}>Father's Name</span>
											}
											rules={[
												{
													required: true,
													message: 'Required!'
												}
											]}
											onChange={(values) => {
												console.log(values.fatherName);
											}}
										>
											<Input
												placeholder="Enter Father Name"
												maxLength={100}
												onInput={(e) => {
													e.target.value = e.target.value
														.replace(/[^a-zA-Z]/g, '')
														.slice(0, 100);
												}}
											/>
										</FormItem>
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										<FormItem
											style={{ width: 286 }}
											name="motherName"
											label={
												<span style={{ color: 'white' }}>Mother's Name</span>
											}
											rules={[
												{
													required: true,
													message: 'Required!'
												}
											]}
											onChange={(values) => {
												console.log(values.motherName);
											}}
										>
											<Input
												placeholder="Enter Mother Name"
												maxLength={100}
												onInput={(e) => {
													e.target.value = e.target.value
														.replace(/[^a-zA-Z]/g, '')
														.slice(0, 100);
												}}
											/>
										</FormItem>
									</Space>
								</Row>
							</Card>
							<br />
							<Card
								hoverable
								style={{
									width: 1100,
									backgroundColor: '#38598b',
									borderwidth: '2px',
									height: 155
								}}
							>
								<Row gutter={[3, 6]}>
									<FormItem
										style={{ width: 310 }}
										name="fatherOccupation"
										label={
											<span style={{ color: 'white' }}>
												Father's Occupation
											</span>
										}
										rules={[
											{
												required: true,
												message: 'Required!'
											}
										]}
										onChange={(values) => {
											console.log(values.fatherOccupation);
										}}
									>
										<Input
											placeholder="Enter Occupation"
											maxLength={100}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 100);
											}}
										/>
									</FormItem>
									&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
									<FormItem
										style={{ width: 310 }}
										name="fatherIncome"
										label={
											<span style={{ color: 'white' }}>Father's Income</span>
										}
										rules={[
											{
												required: true,
												message: 'Required!'
											}
										]}
										onChange={(values) => {
											console.log(values.fatherIncome);
										}}
									>
										<Input
											placeholder="Enter your Father Income"
											onInput={(e) => {
												e.target.value = e.target.value.replace(
													/[^0-9]/g,
													',',
													''
												);
											}}
										/>
									</FormItem>
									&nbsp;&nbsp;&nbsp;
									<FormItem
										style={{ width: 310 }}
										name="motherOccupation"
										label={
											<span style={{ color: 'white' }}>
												Mother's Occupation
											</span>
										}
										rules={[
											{
												required: true,
												message: 'Required!'
											}
										]}
										onChange={(values) => {
											console.log(values.motherOccupation);
										}}
									>
										<Input
											placeholder="Enter Occupation"
											maxLength={100}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 100);
											}}
										/>
									</FormItem>
									&nbsp;&nbsp;&nbsp;&nbsp;
									<FormItem
										style={{ width: 310 }}
										name="motherIncome"
										label={
											<span style={{ color: 'white' }}>Mother's Income</span>
										}
										rules={[
											{
												required: true,
												message: 'Required!'
											}
										]}
										onChange={(values) => {
											console.log(values.motherIncome);
										}}
									>
										<Input
											placeholder="Enter your Mother Income"
											onInput={(e) => {
												e.target.value = e.target.value.replace(
													/[^0-9]/g,
													',',
													''
												);
											}}
										/>
									</FormItem>
								</Row>
							</Card>
							<br />
							<Card
								hoverable
								style={{
									width: 1100,
									backgroundColor: '#38598b',
									borderwidth: '2px',
									height: 155
								}}
							>
								<Row gutter={[3, 6]}>
									<FormItem
										style={{ width: 310 }}
										name="address"
										label={<span style={{ color: 'white' }}>Address</span>}
										rules={[
											{
												required: true,
												message: 'Required!'
											}
										]}
										onChange={(values) => {
											console.log(values.address);
										}}
									>
										<Input
											placeholder="Enter Your Address"
											maxLength={100}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 100);
											}}
										/>
									</FormItem>
									&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
									<Form.Item
										style={{ width: 280 }}
										name="pincode"
										label={<span style={{ color: 'white' }}>Pincode</span>}
										rules={[
											{
												required: true,
												message:
													" In case your country doesn't have pincode enter 0"
											}
										]}
										onChange={(values) => {
											console.log(values.pincode);
										}}
									>
										<Input
											placeholder="Enter your Pincode"
											maxLength={8}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^0-9]/g, '')
													.slice(0, 8);
											}}
										/>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;
									<FormItem
										style={{ width: 417 }}
										name="telephoneNumber"
										label={
											<span style={{ color: 'white' }}> Telephone Number</span>
										}
										onChange={(values) => {
											console.log(values.telephoneNumber);
										}}
									>
										<Input
											placeholder="Enter Your Telephone Number"
											id="telephoneNumber"
											maxLength={10}
											style={{
												width: '100%'
											}}
											value={telephoneNumber}
											onChange={handleTelephoneNumberChange}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^0-9]/g, '')
													.slice(0, 10);
											}}
										/>
									</FormItem>
									&nbsp;&nbsp;&nbsp;&nbsp;
									<FormItem
										style={{ width: 417 }}
										name="mobileNumber"
										label={
											<span style={{ color: 'white' }}> Mobile Number</span>
										}
										rules={[
											{
												required: true,
												message: 'Please enter your Mobile number!'
											}
										]}
										onChange={(values) => {
											console.log(values.mobileNumber);
										}}
									>
										<Input
											placeholder="Enter Your Mobile Number"
											id="mobileNumber"
											maxLength={10}
											style={{
												width: '100%'
											}}
											value={mobileNumber}
											onChange={handleMobileNumberChange}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^0-9]/g, '')
													.slice(0, 10);
											}}
										/>
									</FormItem>
								</Row>
							</Card>
							<br />
							<Card
								hoverable
								style={{
									width: 1100,
									backgroundColor: '#38598b',
									borderwidth: '2px',
									height: 220
								}}>
								<Row gutter={[3, 6]}>
									<FormItem
										style={{ width: 290 }}
										name="guardianName"
										label={
											<span style={{ color: 'white' }}>Guardian Name</span>
										}
										onChange={(values) => {
											console.log(values.guardianName);
										}}>
										<Input
											placeholder="Enter Guardian Name"
											maxLength={100}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 100);
											}}
										/>
									</FormItem>
									&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
									<FormItem
										style={{ width: 310 }}
										name="guardianOccupation"
										label={
											<span style={{ color: 'white' }}>
												Guardian's Occupation
											</span>
										}
										onChange={(values) => {
											console.log(values.guardianOccupation);
										}}
									>
										<Input
											placeholder="Enter Occupation"
											maxLength={100}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 100);
											}}
										/>
									</FormItem>
									&nbsp;&nbsp;&nbsp;
									<FormItem
										style={{ width: 310 }}
										name="guardianIncome"
										label={
											<span style={{ color: 'white' }}>Guardian's Income</span>
										}
										onChange={(values) => {
											console.log(values.guardianIncome);
										}}
									>
										<Input
											placeholder="Enter Guardian Income"
											onInput={(e) => {
												e.target.value = e.target.value.replace(
													/[^0-9]/g,
													',',
													''
												);
											}}
										/>
									</FormItem>
									<FormItem
										style={{ width: 310 }}
										name="guardianaddress"
										label={
											<span style={{ color: 'white' }}>Guardian Address</span>
										}
										onChange={(values) => {
											console.log(values.guardianaddress);
										}}>
										<Input
											placeholder="Enter Guardian Address"
											maxLength={100}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 100);
											}}/>
									</FormItem>
									&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
									<Form.Item
										// style={{ width: 200 }}
										name="parentconsent"
										label={
											<span style={{ color: 'white' }}>
												Is parent consent letter attached?
											</span>
										}
										rules={[
											{
												required: true,
												message: 'Select something!'
											}
										]}>
										<Radio.Group onChange={handleParentconsentChange}>
											<Radio value="yes" style={{ color: 'white' }}>
												Yes
											</Radio>
											<Radio value="No" style={{ color: 'white' }}>
												No
											</Radio>
										</Radio.Group>
									</Form.Item>
									<Form.Item
	style={{ width: 400 }}
	name="tceslc"
	label={
		<span style={{ color: 'white' }}>
			Is T.C/ E.S.L.C/ Record sheet submitted?
		</span>
	}
	rules={[
		{
			required: true,
			message: 'Required!'
		}
	]}>
	<Radio.Group onChange={handleTceslcChange}>
		<Radio value="Yes">Yes</Radio>
		<Radio value="No">No</Radio>
	</Radio.Group>
</Form.Item>

								</Row>
							</Card>
							<br />
						</Card>
						<br />
						<br />
						{/* Continue and Previous Buttons */}
						<FormItem style={{ textAlign: 'center' }}>
							<Tooltip
								title="If you want to continue, don't click the Draft button"
								placement="top"
							>
								<Button type="primary" htmlType="submit">
									Draft
								</Button>
							</Tooltip>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<Button
								type="primary"
								onClick={handlePrevious}
								style={{ marginRight: 16 }}
							>
								Previous
							</Button>
							<Tooltip
								title="If you want to continue, click Here!"
								placement="top"
							>
								<Button type="primary" onClick={handleContinue}>
									Continue
								</Button>
							</Tooltip>
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
						</FormItem>
					</Form>
				</div>
			)}

			{/* // Fourth Stepper */}

			{currentStep === 3 && (
				<div className="step-4 form">
					<Form
						form={formStep4}
						name="location"
						onFinish={onFinish}
						onValuesChange={(changedValues, allValues) => {
							console.log('Changed values:', changedValues);
							console.log('All values:', allValues);
						}}
						scrollToFirstError
					>
						<Row gutter={[24, 24]}>
							{' '}
							<Col span={12}>
								{' '}
								<Card
									style={{
										width: 1150,
										marginLeft: 1,
										backgroundColor: 'lightwhite'
									}}
								>
									<h3>Academic Details</h3>
									<Card
										hoverable
										style={{
											width: 1100,
											height: 350,
											background: '#38598b'
										}}
									>
										<Row gutter={[3, 6]}>
											<Space size={[8, 16]} wrap>
												<Form.Item
													label={
														<span style={{ color: 'white' }}>
															Student's Academic History
														</span>
													}
												>
													{academicHistory.map((item) => (
														<Row key={item.id}>
															<Col span={6}>
																<Input
																	placeholder="Last SchoolName"
																	value={item.schoolName}
																	onChange={(e) =>
																		handleInputChange(
																			item.id,
																			'schoolName',
																			e.target.value
																		)
																	}
																/>
															</Col>
															<Col span={6}>
																<Input
																	placeholder="Standard"
																	value={item.standard}
																	onChange={(e) =>
																		handleInputChange(
																			item.id,
																			'standard',
																			e.target.value
																		)
																	}
																/>
															</Col>
															<Col span={6}>
																<Input
																	placeholder="Year (From & To)"
																	value={item.duration}
																	onChange={(e) =>
																		handleInputChange(
																			item.id,
																			'duration',
																			e.target.value
																		)
																	}
																	maxLength={50}
																	onInput={(e) => {
																		e.target.value = e.target.value.replace(
																			/[^0-9]/g,
																			'-',
																			''
																		);
																	}}
																/>
															</Col>
															<Col span={6}>
																{academicHistory.length > 1 && (
																	<Button
																		type="link"
																		onClick={() => handleRemoveRow(item.id)}
																	>
																		Remove
																	</Button>
																)}
															</Col>
														</Row>
													))}
													<Button
														type="dashed"
														onClick={handleAddRow}
														style={{ marginTop: '10px' }}
														disabled={academicHistory.length >= 4}
													>
														Add Row
													</Button>
												</Form.Item>
												<FormItem
													style={{ width: 450 }}
													name="passorfail"
													label={
														<span style={{ color: 'white' }}>
															Has He/ She passed in the last class studied?
														</span>
													}
													rules={[
														{
															required: true,
															message: 'Required!'
														}
													]}
													onChange={(values) => {
														console.log(values.passorfail);
													}}>
													<Select
														placeholder="Select"
														id="passorfail"
														value={selectedValue}
														onChange={handlePassorfailChange}
													>
														<Option value="Yes">Yes</Option>
														<Option value="No">No</Option>
													</Select>
												</FormItem>
												&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
												<FormItem
													style={{ width: 290 }}
													name="motherTongue"
													label={
														<span style={{ color: 'white' }}>
															Student's Mother Tongue
														</span>
													}>
													<Select
														placeholder="Select"
														id="motherTongue"
														value={selectedValue}
														onChange={handleMotherTongueChange}>
														<Option value="Tamil">Tamil</Option>
														<Option value="English">English</Option>
														<Option value="Hindi">Hindi</Option>
														<Option value="Bengali">Bengali</Option>
														<Option value="Telugu">Telugu</Option>
														<Option value="Marathi">Marathi</Option>
														<Option value="Gujarati">Gujarati</Option>
														<Option value="Urdu">Urdu</Option>
														<Option value="Kannada">Kannada</Option>
														<Option value="Odia">Odia</Option>
														<Option value="Malayalam">Malayalam</Option>
														<Option value="Punjabi">Punjabi</Option>
														<Option value="Assamese">Assamese</Option>
														<Option value="Others">Others</Option>
													</Select>
												</FormItem>
												<FormItem
													style={{ width: 335 }}
													name="firstLanguage"
													label={
														<span style={{ color: 'white' }}>
															First Language Preference
														</span>
													}>
													<Input
														placeholder="Enter Your Preference"
														maxLength={100}
														onInput={(e) => {
															e.target.value = e.target.value
																.replace(/[^a-zA-Z]/g, '')
																.slice(0, 100);
														}}/>
												</FormItem>
											</Space>
										</Row>
									</Card>
									<br />
						<br />
						<div style={{ textAlign: 'center' }}>
							<Tooltip
								title="If you want to continue, don't click the Draft button"
								placement="top">
								<Button type="primary" htmlType="submit">
									Draft
								</Button>
							</Tooltip>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<Button
								type="primary"
								onClick={handlePrevious}
								style={{ marginRight: 16 }}>
								Previous
							</Button>
							<Tooltip
								title="If you want to continue, click Here!"
								placement="top">
								<Button type="primary" onClick={handleContinue}>
									Continue
								</Button>
							</Tooltip>
							<Button
								type="default"
								onClick={handleCancel}
								style={{
									marginLeft: '10px',
									backgroundColor: 'navy',
									color: 'white',
									border: 'none'
								}}>
								Cancel
							</Button>
						</div>
								</Card>
							</Col>
						</Row>
					
					</Form>
				</div>
			)}
			{/* // Fifth Stepper */}
			{currentStep === 4 && (
				<div className="step-5 form">
					<Form
						form={formStep5}
						name="declaration"
						onFinish={onFinish}
						onValuesChange={(changedValues, allValues) => {
							console.log('Changed values:', changedValues);
							console.log('All values:', allValues);
						}}
						scrollToFirstError
					>
						<Card
							style={{
								width: 1150,
								marginLeft: 1,
								backgroundColor: 'lightwhite'
							}}
						>
							<h3>Bank Details</h3>
							<Card
								hoverable
								style={{
									width: 1100,
									height: 180,
									background: '#38598b'
								}}
							>
								<Row gutter={8}>
									<Form.Item
										style={{ width: 333 }}
										name="accountnumber"
										label={
											<span style={{ color: 'white' }}>
												Bank Account Number
											</span>
										}
										onChange={(values) => {
											console.log(values.accountnumber);
										}}
									>
										<Input
											placeholder="Enter Account Number"
											maxLength={50}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^0-9]/g, '')
													.slice(0, 20);
											}}
										/>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item
										style={{ width: 283 }}
										name="bankname"
										label={<span style={{ color: 'white' }}>Bank Name</span>}
										onChange={(values) => {
											console.log(values.bankname);
										}}
									>
										<Input
											placeholder="Enter Bank Name"
											maxLength={50}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 50);
											}}
										/>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item
										style={{ width: 283 }}
										name="branchname"
										label={<span style={{ color: 'white' }}>Branch Name</span>}
										onChange={(values) => {
											console.log(values.branchname);
										}}
									>
										<Input
											placeholder="Enter Branch Name"
											maxLength={50}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 50);
											}}
										/>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item
										style={{ width: 283 }}
										name="ifsccode"
										label={<span style={{ color: 'white' }}>IFSC Code</span>}
										onChange={(values) => {
											console.log(values.ifsccode);
										}}
									>
										<Input
											placeholder="Enter IFSC Code"
											maxLength={50}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^0-9]/g, '')
													.slice(0, 20);
											}}
										/>
									</Form.Item>
								</Row>
							</Card>
							<br />
							{renderStudentStatusField()}
							<br />
							{/* Checkbox */}
							<Row gutter={8}>
								<Form.Item name="acceptTerms" valuePropName="checked">
									<Checkbox
										className="black-border-checkbox"
										onChange={handleCheckboxChange}
									>
										I accept the terms and conditions
									</Checkbox>
								</Form.Item>
							</Row>
							<br />
						{/* Continue and Previous Buttons */}
						<div style={{ textAlign: 'center' }}>
							<Button
								type="primary"
								onClick={handlePrevious}
								style={{ marginRight: 16 }}
							>
								Previous
							</Button>
							<Tooltip
								title="Ensure the application once before submitting"
								placement="top"
							>
								<Button
									type="primary"
									htmlType="submit"
									disabled={isSubmitButtonDisabled}
								>
									Submit
								</Button>
							</Tooltip>
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
						</div>
						</Card>
						
					</Form>
				</div>
			)}
		</div>
	);
};
export default ModuleN;
