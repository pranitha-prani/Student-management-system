import React, { memo } from 'react';
import { useHistory } from "react-router-dom";
import backgroundImage from '../components/GreenBoard.jpeg';

function LandingPage() {
    let history = useHistory();

    function handleLogin() {
        history.push('/login');
    }

    return (
        <div
            className="bgimg w3-display-container w3-animate-opacity w3-text-white"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                height: '100vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}
        >
            <div className="bgimg w3-display-container w3-animate-opacity w3-text-white">
                <div className="w3-display-topright w3-padding">
                    <button className="w3-button w3-white w3-round w3-hover-white w3-opacity w3-hover-opacity-off" onClick={handleLogin}>Login</button>
                </div>
                <div className="w3-display-middle">
                    <h1 className="w3-jumbo w3-animate-top">WELCOME</h1>
                    <hr className="w3-border-grey" style={{ margin: 'auto', width: '40%' }} />
                    <p className="w3-large w3-center">Our Chettinad Site</p>
                </div>
            </div>
        </div>
    );
}

export default memo(LandingPage);
