import React, { useState } from "react";
import { Card, Space, Input, Button, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { Meta } = Card;
const { Title } = Typography;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const loginFun = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user/checkadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      if (response.ok) {
        const data = await response.json();
        // Assuming roles are returned from the API
        const userRoles = data.roles;

        localStorage.setItem('roles', JSON.stringify(userRoles));
        // Store the retrieved data in localStorage
        localStorage.setItem("dbdatalocal", JSON.stringify(data));
        // Redirect to the app component after successful login
        window.location.href = '/app';
      } else {
        // Handle unsuccessful login
        alert('Login failed. Please try again');
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error during login. Please try again later.');
    }
  };

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
     <Card
  hoverable
  style={{
    width: '90%', // Adjust width for smaller screens
    maxWidth: 500, // Maximum width
    height: 450,
    borderRadius: 8,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)",
          transition: "transform 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 8px 16px rgba(0, 0, 255, 0.6)", // Change boxShadow on hover to blue
            border: '2px solid #1890ff', // Set border color to primary blue
    },
  }}
  cover={<img alt="CES" src={require("../assets/CES-logo.png")} style={{ width: '50%', maxWidth: '100%', paddingTop: 30, position: 'absolute', right: '23%'}} />}
>

        <br></br>
        <br></br>
        <br></br>
        <Space direction="vertical" style={{ width: '100%', padding: '5px', alignItems: 'center' ,marginTop: '10px' }}>
          <Meta title={<Title level={4} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}>School Management App</Title>} description="Please sign-in to your account and start the adventure" />
        </Space>

        <Space direction="vertical" style={{ width: '100%', padding: '5px' }}>
          <label htmlFor="email" style={{ fontWeight: 'bold', fontSize: '16px' }}>Email:</label>
          <Input
            type="email"
            placeholder="Enter your email address"
            name="email"
            value={email}
            onChange={handleChange}
            style={{ height: '35px' }}
          />
        </Space>
        <Space direction="vertical" style={{ width: '100%', padding: '5px' }}>
          <label htmlFor="password" style={{ fontWeight: 'bold' ,fontSize: '16px'}}>Password:</label>
          <Input.Password
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={handleChange}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Space>
        <Space direction="vertical" style={{ width: '100%', paddingTop: '20px', paddingLeft: '5px',marginTop: '10px' }}>
          <Button type="primary" onClick={loginFun} block>Login</Button>
        </Space>
      </Card>
    </div>
  );
};

export default Login;