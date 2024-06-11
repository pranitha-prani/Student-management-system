import React, { memo } from 'react';
import { Redirect } from 'react-router-dom';
import { isLoggedIn } from 'utils';
import PublicRoutes from './PublicRoutes';

function Auth() {
    // Check if the user is logged in
    const isAuthenticated = isLoggedIn();

    // If the user is logged in, redirect to the private routes
    if (isAuthenticated) {
        return <Redirect to="/app" />;
    } else {
        // If the user is not logged in, render the public routes
        return <PublicRoutes />;
    }
}

export default memo(Auth);