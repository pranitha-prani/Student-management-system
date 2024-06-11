import React, { memo, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';
import {
	Button,
	Form,
	Modal,
	message,
	Row,
	Card,
	Space,
	Col,
	Steps,
	Input,
	Radio,
	Tooltip,
	Select
} from 'antd';
import { Progress } from 'antd';
import {
	SearchOutlined,
	EditOutlined,
	SolutionOutlined,
	UserOutlined,
	EnvironmentOutlined,
	CheckOutlined
} from '@ant-design/icons';

const { Option } = Select;

const ModuleNChild6 = () => {
	const [applications, setApplications] = useState([]);
	const [selectedApplication, setSelectedApplication] = useState(null);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [isViewModalVisible, setIsViewModalVisible] = useState(false);
	const [editingApplications, setEditingApplications] = useState({});
	const [searchTerm, setSearchTerm] = useState('');
	const [searchCriteria, setSearchCriteria] = useState('academicYear');
	const userRoles = JSON.parse(localStorage.getItem('roles'));
	const location = useLocation();
	const { application } = location.state || {};
	const [formStep1] = Form.useForm();
	const [formStep2] = Form.useForm();
	const [formStep3] = Form.useForm();
	const [formStep4] = Form.useForm();
	const [formStep5] = Form.useForm();
	const [currentStep, setCurrentStep] = useState(0);
	const history = useHistory();

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

	const handleCreateApplication = () => {
		// Here you will generate the application number before navigating
		const applicationNumber = generateApplicationNumber(
			'Rajah Muthiah Higher Secondary School',
			'2023/2024',
			applications
		);
		console.log('Generated Application Number:', applicationNumber);
		history.push('/app/createapplication');
	};

	useEffect(() => {
		getAll();
	}, []);

	const getAll = () => {
		axios
			.post('http://localhost:8080/api/user/getallapplication')
			.then((response) => {
				const data = response.data.filter(
					(application) => application.studentStatus === 'Applied'
				);
				const sortedData = data.sort((a, b) => b.id - a.id);
				setApplications(data);
				console.log(data); // Log fetched data
			})
			.catch((error) => {
				console.error(error); // Log any errors
			});
	};

	const [schools, setSchools] = useState([]);
	const [schoolClasses, setSchoolClasses] = useState([]);
	useEffect(() => {
		fetchSchools();
		fetchSchoolClasses();
	}, []);

	const fetchSchools = async () => {
		try {
			const response = await axios.post(
				'http://localhost:8080/api/schoolClassList/getallschoolClassList'
			);
			const data = response.data;
			setSchools(data);
		} catch (error) {
			console.error(error);
		}
	};
	const fetchSchoolClasses = async (schoolName) => {
		try {
			const response = await axios.post(
				'http://localhost:8080/api/gradeClassList/getallgradeClassList',
				{ school_name: schoolName }
			);
			const data = response.data.sort(
				(a, b) => romanToDecimal(a.grade) - romanToDecimal(b.grade)
			);
			setSchoolClasses(data);
		} catch (error) {
			console.error(error);
		}
	};

	const generateApplicationNumber = (
		schoolName,
		academicYear,
		applications
	) => {
		const schoolCodeMap = {
			'Rajah Muthiah Higher Secondary School': 'RMHSS',
			'Ranilady Meyyammai Higher Secondary School': 'RLMHSS',
			'Ramasamy Chettiyar Town Higher Secondary School': 'RCTHSS',
			'Ramasamy Chettiyar Town Primary School': 'RCTPS',
			'Rani Seethai Achi Higher Secondary School': 'RSAHSS',
			'Sri Meenakshi Primary School': 'SMPS',
			'Sigapi Ramasamy Primary School': 'SRPS'
		};
		const schoolCode = schoolCodeMap[schoolName];
		const academicYearPart = academicYear.replace('/', '-');
		const filteredApplications = applications.filter(
			(application) =>
				application.school_name === schoolName &&
				application.academicYear === academicYear
		);
		const sequentialNumber = filteredApplications.length + 1;
		const sequentialNumberPart = sequentialNumber.toString().padStart(4, '0');

		return `${schoolCode}/${academicYearPart}/${sequentialNumberPart}`;
	};

	const handleEditClick = (application) => {
		setEditingApplications(application);
		setIsEditModalVisible(true);
	};

	const handleSave = () => {
		axios
			.put(
				`http://localhost:8080/api/application/updateapplication/${editingApplications.id}`, // Use editingApplications.id
				editingApplications // Pass the editingApplications object
			)
			.then((response) => {
				console.log('Edit successful');
				alert('Updated Successfully');
			})
			.catch((error) => {
				console.error(error);
				alert('Failed to update application!! Please try again later');
			});
	};

	const handleViewClick = (application) => {
		setSelectedApplication(application);
		setIsViewModalVisible(true);
	};

	const handleAdmitClick = (applicationData) => {
		// Generate the admission number based on the school name
		const admissionNumber = generateAdmissionNumber(
			applicationData.school,
			applications
		);

		// Update the application status to "Admitted" and set the admission number
		const updatedApplicationData = {
			...applicationData,
			studentStatus: 'Admitted',
			admissionNumber: admissionNumber // Add admissionNumber to applicationData
		};

		// Make a POST request to create a new student page with the admitted student's data
		axios
			.post(
				'http://localhost:8080/api/studentpage/createstudentpage',
				updatedApplicationData
			)
			.then((response) => {
				console.log('Student admitted successfully');
				message.success('Student admitted successfully');
				// Now, update the application data on the server with the new student status and admission number
				axios
					.put(
						`http://localhost:8080/api/application/updateapplication/${updatedApplicationData.id}`,
						updatedApplicationData
					)
					.then((response) => {
						console.log('Application updated successfully');
						// Remove the admitted application from the applications state
						setApplications((prevApplications) =>
							prevApplications.filter(
								(application) => application.id !== applicationData.id
							)
						);
					})
					.catch((error) => {
						console.error('Failed to update application:', error);
						message.error('Failed to update application');
					});
			})
			.catch((error) => {
				console.error('Failed to admit the student:', error);
				message.error('Failed to admit the student');
			});
	};

	// Function to generate admission number based on school name
	const generateAdmissionNumber = (schoolName, applications) => {
		const schoolCodeMap = {
			'Rajah Muthiah Higher Secondary School': 'RMHSS',
			'Ranilady Meyyammai Higher Secondary School': 'RLMHSS',
			'Ramasamy Chettiyar Town Higher Secondary School': 'RCTHSS',
			'Ramasamy Chettiyar Town Primary School': 'RCTPS',
			'Rani Seethai Achi Higher Secondary School': 'RSAHSS',
			'Sri Meenakshi Primary School': 'SMPS',
			'Sigapi Ramasamy Primary School': 'SRPS'
		};

		const filteredApplications = applications.filter(
			(application) => application.school === schoolName
		);

		const sequentialNumber = filteredApplications.length + 1;
		const sequentialNumberPart = sequentialNumber.toString().padStart(4, '0');

		return `${schoolCodeMap[schoolName]}${sequentialNumberPart}`;
	};

	const handleEditModalOk = () => {
		// Perform the edit operation and update the data on the server
		console.log('Editing Application:', editingApplications);
		axios
			.put(
				`http://localhost:8080/api/application/updateapplication/${editingApplications.id}`,
				editingApplications
			)
			.then((response) => {
				console.log('Edit successful');
				setIsEditModalVisible(false);
				getAll();
				message.success('Edited successfully');
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleEditModalCancel = () => {
		setIsEditModalVisible(false);
	};
	const handleDeleteClick = (Applications) => {
		let id = Applications.id;
		console.log(id);
		axios
			.get(`http://localhost:8080/api/application/deleteapplication/${id}`)
			.then((response) => {
				console.log('Delete successful');
				setIsEditModalVisible(false);
				getAll();
				message.success('Deleted successfully');
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const calculateProgress = (application) => {
		const requiredFields = [
			'academicYear',
			'school_name',
			'emisNum',
			'aadharNumber',
			//   'board',
			'name',
			'gender',
			'dob',
			'age',
			'nationality',
			'state',
			'hometown',
			'religion',
			'community',
			'caste',
			// 'aboutcaste',
			// 'living',
			// 'vaccinated',
			// 'identificationmarks',
			// 'bloodGroup',
			// 'physical',
			// 'fatherName',
			// 'motherName',
			// 'fatherOccupation',
			// 'fatherIncome',
			// 'motherOccupation',
			'motherIncome',
			'address',
			'pincode',
			// 'telephoneNumber',
			// 'mobileNumber',
			// 'guardianName',
			// 'guardianaddress',
			// 'guardianIncome',
			// 'guardianOccupation',
			// 'parentconsent',
			// 'tceslc',
			//   'academicHistory',
			// 'passorfail',
			// 'motherTongue',
			// 'firstLanguage',
			// 'accountnumber',
			// 'branchname',
			// 'bankname',
			'ifsccode'
		];

		const completedFields = requiredFields.filter(
			(field) => application[field]
		);
		const progressPercentage =
			(completedFields.length / requiredFields.length) * 100;
		return progressPercentage.toFixed(1) + '%';
	};

	const getProgressColor = (percentage) => {
		const percent = parseFloat(percentage);
		if (percent < 25) {
			return 'darkred';
		} else if (percent < 50) {
			return 'red';
		} else if (percent < 75) {
			return 'orange';
		} else if (percent < 85) {
			return 'yellow';
		} else {
			return 'green';
		}
	};

	const handleSearchCriteriaChange = (value) => {
		setSearchCriteria(value);
	};

	const filteredApplications = applications.filter((application) => {
		if (
			searchCriteria === 'emisNum' ||
			searchCriteria === 'aadharNumber' ||
			searchCriteria === 'fatherPhoneNumber' ||
			searchCriteria === 'motherPhoneNumber'
		) {
			const fieldValue = String(application[searchCriteria]); // Convert to string
			return fieldValue.includes(searchTerm);
		} else {
			const fieldValue = application[searchCriteria];
			if (typeof fieldValue === 'string') {
				return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
			}
			return false;
		}
	});

	//ediapplication field declaratio  here
	const [selectValue, setSelectValue] = useState('');
	const handleFieldChange = (fieldName, value) => {
		setEditingApplications({
			...editingApplications,
			[fieldName]: value
		});
	};
	const [emisNum, setEmisNum] = useState(
		editingApplications.emisNum
			? Array.from(editingApplications.emisNum)
			: Array(16).fill('')
	);
	const handleGenderChange = (e) => {
		console.log('Selected gender:', e.target.value);
		handleFieldChange('gender', e.target.value); // Update the gender field in the state
	};
	const handleCasteChange = (e) => {
		console.log('Selected value:', e.target.value);
		handleFieldChange('aboutcaste', e.target.value); // Update the aboutcaste field in the state
	};
	const handleVaccinatedChange = (e) => {
		console.log('Selected value:', e.target.value);
		handleFieldChange('vaccinated', e.target.value); // Update the aboutcaste field in the state
	};
	const handlePhysicalChange = (e) => {
		console.log('Selected value:', e.target.value);
		handleFieldChange('physical', e.target.value); // Update the aboutcaste field in the state
	};
	const handleParentconsentChange = (e) => {
		console.log('Selected value:', e.target.value);
		handleFieldChange('vaccinated', e.target.value); // Update the aboutcaste field in the state
	};
	const handleTceslcChange = (e) => {
		console.log('Selected value:', e.target.value);
		handleFieldChange('tceslc', e.target.value); // Update the aboutcaste field in the state
	};

	return (
		<div className="App">
			<div>
				<h2>Applications</h2>
				<div style={{ display: 'flex', alignItems: 'center', float: 'right' }}>
					<Form.Item style={{ margin: 0 }}>
						<Select
							placeholder="Select Column"
							style={{ width: 185 }}
							onChange={setSearchCriteria}
						>
							<Option value="academicYear">Academic Year</Option>
							<Option value="board">Board</Option>
							<Option value="school">School</Option>
							<Option value="emisNum">EMIS Number</Option>
							<Option value="firstName">First Name</Option>
							<Option value="aadharNumber">Aadhar Number</Option>
							<Option value="fatherName">Father Name</Option>
							<Option value="fatherPhoneNumber">Father Phone Number</Option>
							<Option value="motherName">Mother Name</Option>
							<Option value="motherPhoneNumber">Mother Phone Number</Option>
							<Option value="district">District</Option>
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
						<Button
							type="primary"
							htmlType="submit"
							onClick={handleCreateApplication}
						>
							Create Application
						</Button>
					)}
				</Form.Item>
				<br />
				<table className="fixed-header-table">
					<thead>
						<tr>
							<th>Application Number</th>
							{/* <th>ID</th> */}
							<th>School</th>
							<th>Name</th>
							<th>Student Status</th>
							<th>Rate of Completion</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{filteredApplications.map((application) => (
							<tr key={application.id}>
								<td>{application.applicationNumber}</td>
								{/* <td className="sticky">{application.id}</td> */}
								{/* <td>{application.academicYear}</td> */}
								{/* <td>{application.board}</td> */}
								<td>{application.school_name}</td>
								<td>{application.name}</td>
								{/* <td>{application.middleName}</td>
                  <td>{application.lastName}</td>
                  <td>{application.gender}</td>
                  <td>{application.dob}</td>
                  <td>{application.age}</td>
                  <td>{application.community}</td>
                  <td>{application.religion}</td>
                  <td>{application.nationality}</td>
                  <td>{application.aadharNumber}</td>
                  <td>{application.bloodGroup}</td>        
                  <td>{application.motherTongue}</td>
                  <td>{application.fatherName}</td>
                  <td>{application.fatherOccupation}</td>
                  <td>{application.motherName}</td>
                  <td>{application.motherOccupation}</td>
                  <td>{application.guardianName}</td>
                  <td>{application.country}</td>
                  <td>{application.state}</td>
                  <td>{application.city}</td>                                  
                  <td>{application.address}</td>
                  <td>{application.pincode}</td>*/}
								<td>{application.studentStatus}</td>
								<td>
									<Progress
										percent={parseFloat(calculateProgress(application))}
										strokeColor={getProgressColor(
											calculateProgress(application)
										)}
									/>
								</td>
								<td>
									{/* Render buttons based on completion rate */}
									{parseFloat(calculateProgress(application)) === 100 && (
										<Button
											type="primary"
											style={{
												backgroundColor: '#1a3d1a',
												borderColor: '#FFD700'
											}}
											className="button"
											onClick={() => handleAdmitClick(application)}
										>
											Admit
										</Button>
									)}
									&nbsp;
									<Button
										type="primary"
										onClick={() => handleEditClick(application)}
									>
										Edit
									</Button>
									&nbsp;
									<Button onClick={() => handleViewClick(application)}>
										View
									</Button>
									&nbsp;
									{userRoles.includes('SUPER_ADMIN') && (
										<div className="delete">
											<Button
												type="danger"
												className="deleteButton"
												onClick={() => handleDeleteClick(application)}
											>
												Delete
											</Button>
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Modal
				title="Edit Application"
				visible={isEditModalVisible}
				footer={null}
				onCancel={handleEditModalCancel}
				style={{ minWidth: '95%', minHeight: '80%' }}
			>
				<Steps style={{ margin: '20px' }} current={currentStep}>
					<Steps.Step
						title="General Information"
						icon={<EditOutlined style={{ border: 'solid', padding: '2px' }} />}
					/>
					<Steps.Step
						title="Student Information"
						icon={
							<SolutionOutlined style={{ border: 'solid', padding: '4px' }} />
						}
					/>
					<Steps.Step
						title="Parent Details"
						icon={<UserOutlined style={{ border: 'solid', padding: '2px' }} />}
					/>
					<Steps.Step
						title="Address Details"
						icon={
							<EnvironmentOutlined
								style={{ border: 'solid', padding: '2px' }}
							/>
						}
					/>
					<Steps.Step
						title="Declaration"
						icon={<CheckOutlined style={{ border: 'solid', padding: '2px' }} />}
					/>
				</Steps>
				{currentStep === 0 && (
					<div className="step-1 form">
						<Form>
							<h3>General Information</h3>
							<Card
								hoverable
								style={{
									width: 1100,
									height: 260,
									background: '#ffdb58'
								}}
							>
								<Row gutter={[3, 6]}>
									<Space size={[8, 16]} wrap>
										<Form.Item label="Academic Year">
											<Select
												value={editingApplications.academicYear}
												onChange={(value) =>
													setEditingApplications({
														...editingApplications,
														academicYear: value
													})
												}
											>
												<Select.Option value="2024-2025">
													2024-2025
												</Select.Option>
											</Select>
										</Form.Item>
										<Form.Item label="School">
											<Select
												value={editingApplications.school_name}
												onChange={(value) =>
													setEditingApplications({
														...editingApplications,
														school_name: value
													})
												}
											>
												{schools.map((school_name) => (
													<Select.Option
														key={school_name.id}
														value={school_name.name}
													>
														{school_name.name}
													</Select.Option>
												))}
											</Select>
										</Form.Item>
										<Form.Item style={{ width: 311 }} label="EMIS Number">
											<Input
												placeholder="Enter EMIS Number"
												value={editingApplications.emisNum || ''}
												onChange={(e) => {
													const updatedEmisNum = e.target.value
														.replace(/[^0-9]/g, '')
														.slice(0, 16);
													handleFieldChange('emisNum', updatedEmisNum);
												}}
											/>
										</Form.Item>
										<Form.Item style={{ width: 278 }} label="Aadhar Number">
											<Input
												placeholder="Enter Aadhar Number"
												value={editingApplications.aadharNumber || ''}
												onChange={(e) => {
													handleFieldChange('aadharNumber', e.target.value);
												}}
												onInput={(e) => {
													e.target.value = e.target.value
														.replace(/[^0-9]/g, '')
														.slice(0, 16);
												}}
											/>
										</Form.Item>
									</Space>
								</Row>
							</Card>
							<br />
							<br />
							<div style={{ textAlign: 'center' }}>
								<Tooltip title="Save now, Thank me later 😉" placement="top">
									<Button
										type="primary"
										onClick={handleSave}
										style={{ marginRight: 16 }}
									>
										Save
									</Button>
								</Tooltip>
								<Tooltip title="Continue to the next step" placement="top">
									<Button
										type="primary"
										onClick={handleContinue}
										style={{ marginRight: 16 }}
									>
										{' '}
										Continue{' '}
									</Button>
								</Tooltip>
							</div>
						</Form>
					</div>
				)}
				{/* Second Stepper */}
				{currentStep === 1 && (
					<div className="step-2 form">
						<Form form={formStep2} name="student">
							<h3>Student Information</h3>
							<Card
								hoverable
								style={{
									width: 1100,
									backgroundColor: '#ffdb58',
									borderwidth: '2px',
									height: 510
								}}
							>
								<Row gutter={[3, 6]}>
									<Form.Item
										style={{ width: 260 }}
										label="Name"
										rules={[
											{
												required: true,
												message: 'Enter Your Fullname!'
											}
										]}
									>
										<Input
											placeholder="Enter Name"
											value={editingApplications.name || ''}
											onChange={(e) =>
												handleFieldChange('name', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 30);
											}}
										/>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;
									<Form.Item
										label="Gender"
										rules={[
											{
												required: true,
												message: 'Select something!'
											}
										]}
									>
										<Radio.Group
											onChange={handleGenderChange}
											value={editingApplications.gender}
										>
											<Radio value="Male">Male</Radio>
											<Radio value="Female">Female</Radio>
											<Radio value="Others">Others</Radio>
										</Radio.Group>
									</Form.Item>
									&nbsp;&nbsp;
									<Form.Item style={{ width: 260 }} label="Grade">
										<Select
											value={editingApplications.grade}
											onChange={(value) =>
												setEditingApplications({
													...editingApplications,
													grade: value
												})
											}
										>
											{schoolClasses.map((schoolClass) => (
												<Select.Option
													key={schoolClass.id}
													value={schoolClass.grade}
												>
													{schoolClass.grade}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;
									<Form.Item style={{ width: 342 }} label="Nationality">
										<Select
											placeholder="Select your Nationality"
											value={editingApplications.nationality || 'America'}
											onChange={(value) => handleFieldChange('America', value)}
										>
											<Option value="America">America</Option>
											<Option value="India">India</Option>
											<Option value="Indonesia">Indonesia</Option>
											<Option value="USA">USA</Option>
											<Option value="UK">UK</Option>
											<Option value="Pakistan">Pakistan</Option>
										</Select>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item style={{ width: 280 }} label="State">
										<Input
											placeholder="Enter Your State"
											value={editingApplications.state || ''}
											onChange={(e) =>
												handleFieldChange('state', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 50);
											}}
										/>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item style={{ width: 280 }} label="Home Town">
										<Input
											placeholder="Enter Your Home Town"
											value={editingApplications.hometown || ''}
											onChange={(e) =>
												handleFieldChange('hometown', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 50);
											}}
										/>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item style={{ width: 280 }} label="Religion">
										<Input
											placeholder="Enter Your Religion"
											value={editingApplications.religion || ''}
											onChange={(e) =>
												handleFieldChange('religion', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 50);
											}}
										/>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item style={{ width: 277 }} label="Community">
										<Select
											placeholder="Select"
											value={editingApplications.community || 'BC'}
											onChange={(value) =>
												handleFieldChange('community', value)
											}
										>
											<Select.Option value="BC">BC</Select.Option>
											<Select.Option value="MBC">MBC</Select.Option>
											<Select.Option value="SC">SC</Select.Option>
											<Select.Option value="ST">ST</Select.Option>
											<Select.Option value="OC">OC</Select.Option>
											<Select.Option value="FC">FC</Select.Option>
											<Select.Option value="OBC">OBC</Select.Option>
											<Select.Option value="BCM">BCM</Select.Option>
											<Select.Option value="Others">Others</Select.Option>
										</Select>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item style={{ width: 280 }} label="Caste">
										<Input
											placeholder="Enter Your Caste"
											value={editingApplications.caste || ''}
											onChange={(e) =>
												handleFieldChange('caste', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 50);
											}}
										/>
									</Form.Item>
									<Form.Item
										label={
											<span style={{ color: 'black' }}>
												Is the student from scheduled tribe community? Is the
												caste entitled to get ex-gratia salary? Is the student a
												convert from Hinduism to Christianity?
											</span>
										}
									>
										<Radio.Group
											onChange={handleCasteChange}
											value={editingApplications.aboutcaste}
										>
											<Radio value="Yes">Yes</Radio>
											<Radio value="No">No</Radio>
										</Radio.Group>
									</Form.Item>
									&nbsp;&nbsp;
									<Form.Item style={{ width: 277 }} label="Living with whom">
										<Select
											placeholder="Select"
											value={editingApplications.living || 'Parents'}
											onChange={(value) => handleFieldChange('living', value)}
										>
											<Select.Option value="Parents">Parents</Select.Option>
											<Select.Option value="Guardian">Guardian</Select.Option>
											<Select.Option value="Others">Others</Select.Option>
										</Select>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item
										label={
											<span style={{ color: 'black' }}>
												Is the student for chicken pox? Is scar Available?
											</span>
										}
									>
										<Radio.Group
											onChange={handleVaccinatedChange}
											value={editingApplications.vaccinated}
										>
											<Radio value="Yes">Yes</Radio>
											<Radio value="No">No</Radio>
										</Radio.Group>
									</Form.Item>
									<Form.Item
										style={{ width: 280 }}
										label="Identification Marks"
									>
										<Input
											placeholder="Enter Identification Marks"
											value={editingApplications.identificationmarks || ''}
											onChange={(e) =>
												handleFieldChange('identificationmarks', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 50);
											}}
										/>
									</Form.Item>
									<Form.Item
										style={{ width: 278 }}
										label="Blood Group"
										rules={[
											{
												required: true,
												message: 'Required!'
											}
										]}
									>
										<Select
											placeholder="Enter Your Group"
											value={editingApplications.bloodGroup || 'O+ve'}
											onChange={(value) =>
												handleFieldChange('bloodGroup', value)
											}
										>
											<Select.Option value="O+ve">O+VE</Select.Option>
											<Select.Option value="O-ve">O-VE</Select.Option>
											<Select.Option value="A+ve">A+VE</Select.Option>
											<Select.Option value="A-ve">A-VE</Select.Option>
											<Select.Option value="B+ve">B+VE</Select.Option>
											<Select.Option value="B-ve">B-VE</Select.Option>
											<Select.Option value="AB+ve">AB+VE</Select.Option>
											<Select.Option value="AB-ve">AB-VE</Select.Option>
											<Select.Option value="A1+ve">A1+VE</Select.Option>
											<Select.Option value="A1-ve">A1-VE</Select.Option>
											<Select.Option value="A1B+ve">A1B+VE</Select.Option>
											<Select.Option value="A2B+ve">A2B+VE</Select.Option>
											<Select.Option value="A2B-ve">A2B-VE</Select.Option>
										</Select>
									</Form.Item>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Form.Item
										label={
											<span style={{ color: 'black' }}>
												Is the student Physically challenged?
											</span>
										}
									>
										<Radio.Group
											onChange={handlePhysicalChange}
											value={editingApplications.physical}
										>
											<Radio value="Yes">Yes</Radio>
											<Radio value="No">No</Radio>
										</Radio.Group>
									</Form.Item>
									&nbsp; &nbsp; &nbsp; &nbsp;
									<Form.Item
										style={{ width: 590 }}
										label="If He/ She Physically challenged Specify, Otherwish Enter Null"
									>
										<Input
											placeholder="Enter Reason"
											value={editingApplications.physicalDetails || ''}
											onChange={(e) =>
												handleFieldChange('physicalDetails', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 100);
											}}
										/>
									</Form.Item>
								</Row>
							</Card>
							<br />
							<div style={{ textAlign: 'center' }}>
								<Tooltip title="Save now, Thank me later 😉" placement="top">
									<Button
										type="primary"
										onClick={handleSave}
										style={{ marginRight: 16 }}
									>
										{' '}
										Save{' '}
									</Button>
								</Tooltip>
								<Tooltip title="Go back to the previous step" placement="top">
									<Button
										type="primary"
										onClick={handlePrevious}
										style={{ marginRight: 16 }}
									>
										{' '}
										Previous{' '}
									</Button>
								</Tooltip>
								<Tooltip title="Continue to the next step" placement="top">
									<Button
										type="primary"
										onClick={handleContinue}
										style={{ marginRight: 16 }}
									>
										{' '}
										Continue{' '}
									</Button>
								</Tooltip>
							</div>
						</Form>
					</div>
				)}
				{/* // Third Stepper */}
				{currentStep === 2 && (
					<div className="step-3 form">
						<Form form={formStep3} name="parents">
							<h3>Parent's Information</h3>
							<Card
								hoverable
								style={{
									width: 1100,
									height: 85,
									background: '#ffdb58'
								}}
							>
								<Row gutter={[3, 6]}>
									<Space size={[8, 16]} wrap>
										<Form.Item
											style={{ width: 290 }}
											label="Father's Name"
											rules={[
												{
													required: true,
													message: 'Required!'
												}
											]}
										>
											<Input
												placeholder="Enter Father Name"
												value={editingApplications.fatherName || ''}
												onChange={(e) =>
													handleFieldChange('fatherName', e.target.value)
												}
												onInput={(e) => {
													e.target.value = e.target.value
														.replace(/[^a-zA-Z]/g, '')
														.slice(0, 100);
												}}
											/>
										</Form.Item>
										&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;
										<Form.Item
											style={{ width: 286 }}
											label="Mother's Name"
											rules={[
												{
													required: true,
													message: 'Required!'
												}
											]}
										>
											<Input
												placeholder="Enter Mother Name"
												value={editingApplications.motherName || ''}
												onChange={(e) =>
													handleFieldChange('motherName', e.target.value)
												}
												onInput={(e) => {
													e.target.value = e.target.value
														.replace(/[^a-zA-Z]/g, '')
														.slice(0, 100);
												}}
											/>
										</Form.Item>
									</Space>
								</Row>
							</Card>
							<br />
							<Card
								hoverable
								style={{
									width: 1100,
									backgroundColor: '#ffdb58',
									borderwidth: '2px',
									height: 155
								}}
							>
								<Row gutter={[3, 6]}>
									<Form.Item
										style={{ width: 310 }}
										label="Father's Occupation"
										rules={[
											{
												required: true,
												message: 'Required!'
											}
										]}
									>
										<Input
											placeholder="Enter Occupation"
											value={editingApplications.fatherOccupation || ''}
											onChange={(e) =>
												handleFieldChange('fatherOccupation', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 100);
											}}
										/>
									</Form.Item>
									&nbsp; &nbsp;&nbsp;&nbsp;
									<Form.Item style={{ width: 295 }} label="Father's Income">
										<Input
											placeholder="Enter Father Income"
											value={editingApplications.fatherIncome || ''}
											onChange={(e) => {
												handleFieldChange('fatherIncome', e.target.value);
											}}
											onInput={(e) => {
												e.target.value = e.target.value.replace(/[^0-9]/g, ',');
											}}
										/>
									</Form.Item>
									<Form.Item
										style={{ width: 314 }}
										label="Mother's Occupation"
										rules={[
											{
												required: true,
												message: 'Required!'
											}
										]}
									>
										<Input
											placeholder="Enter Occupation"
											value={editingApplications.motherOccupation || ''}
											onChange={(e) =>
												handleFieldChange('motherOccupation', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 100);
											}}
										/>
									</Form.Item>
									<Form.Item style={{ width: 295 }} label="Mother's Income">
										<Input
											placeholder="Enter Mother Income"
											value={editingApplications.motherIncome || ''}
											onChange={(e) => {
												handleFieldChange('motherIncome', e.target.value);
											}}
											onInput={(e) => {
												e.target.value = e.target.value.replace(/[^0-9]/g, ',');
											}}
										/>
									</Form.Item>
								</Row>
							</Card>
							<br />
							<Card
								hoverable
								style={{
									width: 1100,
									backgroundColor: '#ffdb58',
									borderwidth: '2px',
									height: 155
								}}
							>
								<Row gutter={[3, 6]}>
									<Form.Item
										style={{ width: 333 }}
										label="Address"
										rules={[
											{
												required: true,
												message: 'Field is Mandatory!'
											}
										]}
									>
										<Input.TextArea
											autoSize={{ minRows: 2, maxRows: 6 }}
											placeholder="Enter Your Address"
											value={editingApplications.address || ''}
											onChange={(e) =>
												handleFieldChange('address', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 200);
											}}
										/>
									</Form.Item>
									<Form.Item
										style={{ width: 286 }}
										label="Pincode"
										rules={[
											{
												required: true,
												message:
													" In case your country doesn't have pincode, enter 0"
											}
										]}
									>
										<Input
											placeholder="Enter your Pincode"
											value={editingApplications.pincode || ''}
											onChange={(e) =>
												handleFieldChange('pincode', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^0-9]/g, '')
													.slice(0, 6);
											}}
										/>
									</Form.Item>
									<Form.Item
										style={{ width: 425 }}
										label=" Telephone Number"
										rules={[
											{
												required: true,
												message: 'Please input your phone number!'
											}
										]}
									>
										<Input
											placeholder="Enter TelephoneNumber"
											value={editingApplications.telephoneNumber || ''}
											onChange={(e) => {
												handleFieldChange('telephoneNumber', e.target.value);
											}}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^0-9]/g, '')
													.slice(0, 10);
											}}
										/>
									</Form.Item>
									<Form.Item
										style={{ width: 425 }}
										label="Mobile Number"
										rules={[
											{
												required: true,
												message: 'Please enter your phone number!'
											}
										]}
									>
										<Input
											placeholder="Enter MobileNumber"
											value={editingApplications.mobileNumber || ''}
											onChange={(e) => {
												handleFieldChange('mobileNumber', e.target.value);
											}}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^0-9]/g, '')
													.slice(0, 10);
											}}
										/>
									</Form.Item>
								</Row>
							</Card>
							<br />
							<Card
								hoverable
								style={{
									width: 1100,
									backgroundColor: '#ffdb58',
									borderwidth: '2px',
									height: 220
								}}
							>
								<Row gutter={[3, 6]}>
									<Form.Item style={{ width: 290 }} label="Guardian Name">
										<Input
											placeholder="Enter Guardian Name"
											value={editingApplications.guardianName || ''}
											onChange={(e) =>
												handleFieldChange('guardianName', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 100);
											}}
										/>
									</Form.Item>
									<Form.Item
										style={{ width: 405 }}
										label="Guardian's Occupation"
									>
										<Input.TextArea
											autoSize={{ minRows: 1, maxRows: 1 }}
											placeholder="Enter Occupation"
											value={editingApplications.guardianOccupation || ''}
											onChange={(e) => {
												handleFieldChange('guardianOccupation', e.target.value);
											}}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 200);
											}}
										/>
									</Form.Item>
									<Form.Item style={{ width: 295 }} label="Guardian's Income">
										<Input
											placeholder="Enter Guardian Income"
											value={editingApplications.guardianIncome || ''}
											onChange={(e) => {
												handleFieldChange('guardianIncome', e.target.value);
											}}
											onInput={(e) => {
												e.target.value = e.target.value.replace(/[^0-9]/g, ',');
											}}
										/>
									</Form.Item>
									<Form.Item style={{ width: 405 }} label="Guardian Address">
										<Input.TextArea
											autoSize={{ minRows: 1, maxRows: 2 }}
											placeholder="Enter Guardian Address"
											value={editingApplications.guardianaddress || ''}
											onChange={(e) => {
												handleFieldChange('guardianaddress', e.target.value);
											}}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 200);
											}}
										/>
									</Form.Item>
									<Form.Item
										label={
											<span style={{ color: 'black' }}>
												Is parent consent letter attached?
											</span>
										}
									>
										<Radio.Group
											onChange={handleParentconsentChange}
											value={editingApplications.handleParentconsentChange}
										>
											<Radio value="Yes">Yes</Radio>
											<Radio value="No">No</Radio>
										</Radio.Group>
									</Form.Item>
									<Form.Item
										label={
											<span style={{ color: 'black' }}>
												Is T.C/ E.S.L.C/ Record sheet submitted?
											</span>
										}
									>
										<Radio.Group
											onChange={handleTceslcChange}
											value={editingApplications.handleTceslcChange}
										>
											<Radio value="Yes">Yes</Radio>
											<Radio value="No">No</Radio>
										</Radio.Group>
									</Form.Item>
								</Row>
							</Card>
							<br />
							<br />
							<div style={{ textAlign: 'center' }}>
								<Tooltip title="Save now, Thank me later 😉" placement="top">
									<Button
										type="primary"
										onClick={handleSave}
										style={{ marginRight: 16 }}
									>
										{' '}
										Save{' '}
									</Button>
								</Tooltip>
								<Tooltip title="Go back to the previous step" placement="top">
									<Button
										type="primary"
										onClick={handlePrevious}
										style={{ marginRight: 16 }}
									>
										{' '}
										Previous{' '}
									</Button>
								</Tooltip>
								<Tooltip title="Continue to the next step" placement="top">
									<Button
										type="primary"
										onClick={handleContinue}
										style={{ marginRight: 16 }}
									>
										{' '}
										Continue{' '}
									</Button>
								</Tooltip>
							</div>
						</Form>
					</div>
				)}
				{/* // Fourth Stepper */}
				{currentStep === 3 && (
					<div className="step-4 form">
						<Form form={formStep4} name="location">
							<Row gutter={[24, 24]}>
								<h3>Academic Details</h3>
								<Card
									hoverable
									style={{
										width: 1100,
										height: 300,
										background: '#ffdb58'
									}}
								>
									<Row gutter={[3, 6]}>
										<Space size={[8, 16]} wrap>
											<Form.Item style={{ width: 330 }} label="Mother Tongue">
												<Select
													placeholder="Select"
													value={editingApplications.motherTongue || 'Tamil'}
													onChange={(value) =>
														handleFieldChange('motherTongue', value)
													}
												>
													<Select.Option value="Tamil">Tamil</Select.Option>
													<Select.Option value="English">English</Select.Option>
													<Select.Option value="Hindi">Hindi</Select.Option>
													<Select.Option value="Bengali">Bengali</Select.Option>
													<Select.Option value="Telugu">Telugu</Select.Option>
													<Select.Option value="Marathi">Marathi</Select.Option>
													<Select.Option value="Gujarati">
														Gujarati{' '}
													</Select.Option>
													<Select.Option value="Urdu">Urdu</Select.Option>
													<Select.Option value="Kannada">Kannada</Select.Option>
													<Select.Option value="Odia">Odia</Select.Option>
													<Select.Option value="Malayalam">
														Malayalam
													</Select.Option>
													<Select.Option value="Punjabi">Punjabi</Select.Option>
													<Select.Option value="Assamese">
														Assamese
													</Select.Option>
													<Select.Option value="Others">Others</Select.Option>
												</Select>
											</Form.Item>
											<Form.Item
												style={{ width: 405 }}
												label="First Language Preference"
											>
												<Input.TextArea
													autoSize={{ minRows: 1, maxRows: 1 }}
													placeholder="Enter Your Preference"
													value={editingApplications.firstLanguage || ''}
													onChange={(e) => {
														handleFieldChange('firstLanguage', e.target.value);
													}}
													onInput={(e) => {
														e.target.value = e.target.value
															.replace(/[^a-zA-Z]/g, '')
															.slice(0, 200);
													}}
												/>
											</Form.Item>
										</Space>
									</Row>
								</Card>
							</Row>
							<br />
							<div style={{ textAlign: 'center' }}>
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
							</div>
						</Form>
					</div>
				)}
				{/* // Fifth Stepper */}
				{currentStep === 4 && (
					<div className="step-4 form">
						<Form form={formStep5} name="declaration">
							<h3>Bank Details</h3>
							<Card
								hoverable
								style={{
									width: 1100,
									height: 195,
									background: '#ffdb58'
								}}
							>
								<Row gutter={8}>
									<Form.Item style={{ width: 278 }} label="Account Number">
										<Input
											placeholder="Enter Account Number"
											value={editingApplications.accountnumber || ''}
											onChange={(e) => {
												handleFieldChange('accountnumber', e.target.value);
											}}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^0-9]/g, '')
													.slice(0, 16);
											}}
										/>
									</Form.Item>
									<Form.Item style={{ width: 290 }} label="Bank Name">
										<Input
											placeholder="Enter Bank Name"
											value={editingApplications.bankname || ''}
											onChange={(e) =>
												handleFieldChange('bankname', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 100);
											}}
										/>
									</Form.Item>
									<Form.Item style={{ width: 290 }} label="Branch Name">
										<Input
											placeholder="Enter Branch Name"
											value={editingApplications.branchname || ''}
											onChange={(e) =>
												handleFieldChange('branchname', e.target.value)
											}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^a-zA-Z]/g, '')
													.slice(0, 100);
											}}
										/>
									</Form.Item>
									<Form.Item style={{ width: 278 }} label="IFSC Code">
										<Input
											placeholder="Enter IFSC Code"
											value={editingApplications.ifsccode || ''}
											onChange={(e) => {
												handleFieldChange('ifsccode', e.target.value);
											}}
											onInput={(e) => {
												e.target.value = e.target.value
													.replace(/[^0-9]/g, '')
													.slice(0, 10);
											}}
										/>
									</Form.Item>
								</Row>
							</Card>
							<br />
							<div style={{ textAlign: 'center' }}>
								<Tooltip title="Go back to the previous step" placement="top">
									<Button
										type="primary"
										onClick={handlePrevious}
										style={{ marginRight: 16 }}
									>
										{' '}
										Previous{' '}
									</Button>
								</Tooltip>
							</div>
						</Form>
					</div>
				)}
			</Modal>

			<Modal
				title="View Application"
				visible={isViewModalVisible}
				onCancel={() => setIsViewModalVisible(false)}
				footer={null}
			>
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<table>
							<tbody>
								<tr>
									<td>Academic Year:</td>
									<td>{selectedApplication?.academicYear}</td>
								</tr>
								<tr>
									<td>Board:</td>
									<td>{selectedApplication?.board}</td>
								</tr>
								<tr>
									<td>School:</td>
									<td>{selectedApplication?.school}</td>
								</tr>
								{/* <tr>
                        <td>Admission Sought:</td>
                        <td>{selectedApplication?.admissionSought}</td>
                    </tr>
                    <tr>
                        <td>Admission Number:</td>
                        <td>{selectedApplication?.admissionNumber}</td>
                    </tr>
                    <tr>
                        <td>Admission Date:</td>
                        <td>{selectedApplication?.admissionDate}</td>
                    </tr>
                    <tr>
                        <td>Medium:</td>
                        <td>{selectedApplication?.medium}</td>
                    </tr>
                    <tr>
                        <td>Student Status:</td>
                        <td>{selectedApplication?.studentStatus}</td>
                    </tr>
                    <tr>
                        <td>EMIS Number:</td>
                        <td>{selectedApplication?.emisNum}</td>
                    </tr>
                    <tr>
                        <td>Current Class:</td>
                        <td>{selectedApplication?.currentClass}</td>
                    </tr>
                    <tr>
                        <td>Exam Year:</td>
                        <td>{selectedApplication?.examYear}</td>
                    </tr>
                    <tr>
                        <td>Tamil:</td>
                        <td>{selectedApplication?.tamil}</td>
                    </tr>
                    <tr>
                        <td>English:</td>
                        <td>{selectedApplication?.english}</td>
                    </tr>
                    <tr>
                        <td>Mathematics:</td>
                        <td>{selectedApplication?.maths}</td>
                    </tr>
                    <tr>
                        <td>Science:</td>
                        <td>{selectedApplication?.science}</td>
                    </tr>
                    <tr>
                        <td>Social Science:</td>
                        <td>{selectedApplication?.social}</td>
                    </tr>
                    <tr>
                        <td>Total Marks:</td>
                        <td>{selectedApplication?.total}</td>
                    </tr>
                    <tr>
                        <td>Percentage:</td>
                        <td>{selectedApplication?.percentage}</td>
                    </tr>
                    <tr>
                        <td>Student Title:</td>
                        <td>{selectedApplication?.studentTitle}</td>
                    </tr> */}
							</tbody>
						</table>
					</Col>
					<Col span={9}>
						<table>
							<tbody>
							<tr>
                        <td>Aadhar Number:</td>
                        <td>{selectedApplication?.aadharNumber}</td>
                    </tr>
								<tr>
									<td>First Name:</td>
									<td>{selectedApplication?.firstName}</td>
								</tr>
								{/* <tr>
                        <td>Middle Name:</td>
                        <td>{selectedApplication?.middleName}</td>
                    </tr> */}
								<tr>
									<td>Last Name:</td>
									<td>{selectedApplication?.lastName}</td>
								</tr>
								{/* <tr>
                        <td>Gender:</td>
                        <td>{selectedApplication?.gender}</td>
                    </tr>
                    <tr>
                        <td>Date of Birth:</td>
                        <td>{selectedApplication?.dob}</td>
                    </tr>
                    <tr>
                        <td>Age:</td>
                        <td>{selectedApplication?.age}</td>
                    </tr>
                    <tr>
                        <td>Place of Birth:</td>
                        <td>{selectedApplication?.birthPlace}</td>
                    </tr>
                    <tr>
                        <td>Community:</td>
                        <td>{selectedApplication?.community}</td>
                    </tr>
                    <tr>
                        <td>Religion:</td>
                        <td>{selectedApplication?.religion}</td>
                    </tr>
                    <tr>
                        <td>Nationality:</td>
                        <td>{selectedApplication?.nationality}</td>
                    </tr>
                    <tr>
                        <td>Aadhar Number:</td>
                        <td>{selectedApplication?.aadharNumber}</td>
                    </tr>
                    <tr>
                        <td>Blood Group:</td>
                        <td>{selectedApplication?.bloodGroup}</td>
                    </tr>
                    <tr>
                        <td>Height:</td>
                        <td>{selectedApplication?.height}</td>
                    </tr>
                    <tr>
                        <td>Weight:</td>
                        <td>{selectedApplication?.weight}</td>
                    </tr>
                    <tr>
                        <td>Second Language:</td>
                        <td>{selectedApplication?.secondLanguage}</td>
                    </tr>
                    <tr>
                        <td>Mother Tongue:</td>
                        <td>{selectedApplication?.motherTongue}</td>
                    </tr>
                    <tr>
                        <td>Last Attended:</td>
                        <td>{selectedApplication?.lastAttended}</td>
                    </tr>
                    <tr>
                        <td>Last Board:</td>
                        <td>{selectedApplication?.lastBoard}</td>
                    </tr>
                    <tr>
                        <td>Old School:</td>
                        <td>{selectedApplication?.oldSchool}</td>
                    </tr>
                    <tr>
                        <td>Reason of Leaving:</td>
                        <td>{selectedApplication?.reasonOfLeaving}</td>
                    </tr>
                    <tr>
                        <td>Major Ailment:</td>
                        <td>{selectedApplication?.majorAilment}</td>
                    </tr>
                    <tr>
                        <td>Allergies:</td>
                        <td>{selectedApplication?.allergies}</td>
                    </tr>
                    <tr>
                        <td>Specific Medication:</td>
                        <td>{selectedApplication?.specificMedication}</td>
                    </tr>
                    <tr>
                        <td>Father Title:</td>
                        <td>{selectedApplication?.fatherTitle}</td>
                    </tr> */}
								<tr>
									<td>Father Name:</td>
									<td>{selectedApplication?.fatherName}</td>
								</tr>
								{/* <tr>
                        <td>Father Phone Number:</td>
                        <td>{selectedApplication?.fatherPhoneNumber}</td>
                    </tr>
                    <tr>
                        <td>Father Mail:</td>
                        <td>{selectedApplication?.fatherMail}</td>
                    </tr>
                    <tr>
                        <td>Father Occupation:</td>
                        <td>{selectedApplication?.fatherOccupation}</td>
                    </tr>
                    <tr>
                        <td>Father Qualification:</td>
                        <td>{selectedApplication?.fatherQualification}</td>
                    </tr>
                    <tr>
                        <td>Mother Title:</td>
                        <td>{selectedApplication?.motherTitle}</td>
                    </tr> */}
								<tr>
									<td>Mother Name:</td>
									<td>{selectedApplication?.motherName}</td>
								</tr>
								{/* <tr>
                        <td>Mother Phone Number:</td>
                        <td>{selectedApplication?.motherPhoneNumber}</td>
                    </tr>
                    <tr>
                        <td>Mother Mail:</td>
                        <td>{selectedApplication?.motherMail}</td>
                    </tr>
                    <tr>
                        <td>Mother Occupation:</td>
                        <td>{selectedApplication?.motherOccupation}</td>
                    </tr>
                    <tr>
                        <td>Mother Qualification:</td>
                        <td>{selectedApplication?.motherQualification}</td>
                    </tr>
                    <tr>
                        <td>Family Structure:</td>
                        <td>{selectedApplication?.familyStructure}</td>
                    </tr>
                    <tr>
                        <td>Family Income:</td>
                        <td>{selectedApplication?.familyIncome}</td>
                    </tr>
                    <tr>
                        <td>Guardian Title:</td>
                        <td>{selectedApplication?.guardianTitle}</td>
                    </tr>
                    <tr>
                        <td>Guardian Name:</td>
                        <td>{selectedApplication?.guardianName}</td>
                    </tr>
                    <tr>
                        <td>Guardian Phone:</td>
                        <td>{selectedApplication?.guardianPhone}</td>
                    </tr>
                    <tr>
                        <td>Guardian Mail:</td>
                        <td>{selectedApplication?.guardianMail}</td>
                    </tr>
                    <tr>
                        <td>Local Address:</td>
                        <td>{selectedApplication?.localAddress}</td>
                    </tr> */}
								<tr>
									<td>Country:</td>
									<td>{selectedApplication?.country}</td>
								</tr>
								<tr>
									<td>State:</td>
									<td>{selectedApplication?.state}</td>
								</tr>
								{/* <tr>
                        <td>District:</td>
                        <td>{selectedApplication?.district}</td>
                    </tr>
                    <tr>
                        <td>City:</td>
                        <td>{selectedApplication?.city}</td>
                    </tr>
                    <tr>
                        <td>Address1:</td>
                        <td>{selectedApplication?.address1}</td>
                    </tr>
                    <tr>
                        <td>Address2:</td>
                        <td>{selectedApplication?.address2}</td>
                    </tr>
                    <tr>
                        <td>Pincode:</td>
                        <td>{selectedApplication?.pincode}</td>
                    </tr>
                    <tr>
                        <td>Permanent Address:</td>
                        <td>{selectedApplication?.permanentAddress}</td>
                    </tr>
                    <tr>
                        <td>Permanent Country:</td>
                        <td>{selectedApplication?.permanentCountry}</td>
                    </tr>
                    <tr>
                        <td>Home Address:</td>
                        <td>{selectedApplication?.homeAddress}</td>
                    </tr>
                    <tr>
                        <td>Permanent Pincode:</td>
                        <td>{selectedApplication?.permanentPin}</td>
                    </tr> */}
							</tbody>
						</table>
					</Col>
				</Row>
			</Modal>
		</div>
	);
};

export default memo(ModuleNChild6);
