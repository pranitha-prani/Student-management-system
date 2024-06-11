import React from 'react';
import { Layout, Menu } from 'antd';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isLoggedIn } from 'utils';
import { LogoutOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

const SiderCom = (props) => {
    const { routes, collapsed } = props;
    const history = useHistory();
    const userRoles = JSON.parse(localStorage.getItem('roles'));

    function handleLogout() {
        localStorage.removeItem('roles');
        history.push('/');
    }

    const handleMenuClick = (path) => {
        history.push(`/app${path}`);
    };

    const renderMenuItems = (routes) => {
        return routes.map(({ path, title, icon, children, permission }) => {
            if (permission && !permission.some(role => userRoles.includes(role))) {
                return null; // Skip rendering if user doesn't have permission for this route
            }

            if (children && children.length > 0) {
                return (
                    <SubMenu key={path} icon={icon} title={title}>
                        {renderMenuItems(children)}
                    </SubMenu>
                );
            }

            // Exclude specific paths from rendering
            if (['/createschool', '/createadmin', '/createrole', '/createclass', '/createsection', '/createapplication', '/createTeacher'].includes(path)) {
                return null;
            }

            return (
                <Menu.Item key={path} icon={icon} onClick={() => handleMenuClick(path)}>
                    {title}
                </Menu.Item>
            );
        });
    };

    if (!isLoggedIn()) {
        return null; // Don't render anything if user is not logged in
    }

    return (
        <Sider
            width={200}
            breakpoint="md"
            collapsedWidth="0"
            style={{ background: '#e7f2ff', paddingTop: "63px" }} 
            collapsed={collapsed}
        >
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0, width: 256, overflowX: 'hidden', overflowY: 'auto' }}
            >
                {renderMenuItems(routes)}
                <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                    Logout
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

SiderCom.propTypes = {
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            icon: PropTypes.node,
            children: PropTypes.arrayOf(
                PropTypes.shape({
                    path: PropTypes.string.isRequired,
                    title: PropTypes.string.isRequired,
                    icon: PropTypes.node,
                    permission: PropTypes.arrayOf(PropTypes.string), // Add permission PropTypes for children
                })
            ),
            permission: PropTypes.arrayOf(PropTypes.string), // Define PropTypes for route permissions
        })
    ).isRequired,
    collapsed: PropTypes.bool.isRequired,
};

export default SiderCom;
