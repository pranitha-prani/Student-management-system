import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import PropTypes from 'prop-types';
import { Link, useHistory, useLocation } from "react-router-dom";
import { isLoggedIn } from 'utils';
import SiderCom from 'components/SiderCom';

function TopNav(props) {
    let history = useHistory();
    const location = useLocation();
    const [visible, setVisible] = useState(true);

    function handleLogout() {
        localStorage.removeItem('roles');
        history.push('/');
    }

    function toggleDrawer() {
        setVisible(prevVisible => !prevVisible);
    }

    const onClose = () => {
        setVisible(false);
    };

    const isLandingPage = location.pathname === '/';

    if (isLandingPage) {
        return null; // Don't render anything for the landing page
    }

    return (
        <div className={`w3-bar w3-padding w3-card ${props.className}`}>
            <div className="w3-left">
                <Button type="primary" onClick={toggleDrawer}>
                    {visible ? 'Hide Slider' : 'Show Slider'}
                </Button>
            </div>
            {isLoggedIn() && (
                <div className="w3-right">
                    <Button onClick={handleLogout}>Logout</Button>
                </div>
            )}
            <Drawer
                title={<div style={{ textAlign: 'center' }}>Menu</div>}
                placement="left"
                closable={false}
                onClose={onClose}
                visible={visible}
                width="max-content"
                style={{ maxWidth: '100%' }}
            >
                <SiderCom routes={props.routes} />
            </Drawer>
        </div>
    );
}

TopNav.propTypes = {
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired
        })
    ).isRequired,
    className: PropTypes.string
};

TopNav.defaultProps = {
    className: ''
};

export default TopNav;
