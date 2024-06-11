import React, { useState } from 'react';
import { Layout, Button, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom
import SiderCom from 'components/SiderCom'; // Import SiderCom component
import { PrivateRoutesConfig } from 'config';
const { Header, Sider, Content, Footer } = Layout; // Destructure Footer from Layout

const CommonLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const history = useHistory(); // Get the history object

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('roles');
    history.push('/'); // Redirect to the login page
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
     <Header
        className="site-layout-background"
        style={{
          padding: 0,
          background: '#d9e0e9', // Change header background color
          display: 'flex',
          alignItems: 'center',
          position: 'fixed',
          width: '100%',
          zIndex: 1000, // Ensure the header stays on top of other elements
        }}
      >
        <div style={{ flex: '1' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
        </div>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ fontSize: '16px', paddingRight: '2px' }} // Apply consistent font size
        />
      </Header>

      <Layout>
        <SiderCom routes={PrivateRoutesConfig} collapsed={collapsed} /> {/* Pass collapsed state to SiderCom */}
        <Layout className="site-layout-content">
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              paddingTop: '60px',
              overflowY: 'auto',
            }}
          >
            {children}
          </Content>
          <Footer style={{ textAlign: 'center', background: colorBgContainer, position: 'fixed', bottom: 0, width: '100%' }}>© Copyright @ Chettinad Education & Services</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default CommonLayout;
