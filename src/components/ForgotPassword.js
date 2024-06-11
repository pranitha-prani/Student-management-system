import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { JumbotronWrapper } from './common';

function ForgotPassword() {
    let [email, setEmail] = useState('');

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handleResetPassword() {
        // Implement logic to send reset password link to the provided email
        alert(`Reset password link sent to ${email}`);
    }

    return (
        <JumbotronWrapper title="Forgot Password">
            <div>
                <p>Please enter your email to receive a password reset link:</p>
                <input type="email" value={email} onChange={handleEmailChange} />
                <button onClick={handleResetPassword}>Reset Password</button>
            </div>
            <Link to="/login">Back to login</Link>
        </JumbotronWrapper>
    );
}

export default memo(ForgotPassword);