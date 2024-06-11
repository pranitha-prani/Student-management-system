import React, { Fragment, useState, useEffect } from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { isLoggedIn } from 'utils'; // Update with your actual utility function
import { PrivateRoutesConfig } from 'config';
import { CommonLayout } from '../components/common';
import MapAllowedRoutes from 'routes/MapAllowedRoutes';

function PrivateRoutes() {
    const match = useRouteMatch('/app');
    const [allowedRoutes, setAllowedRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const roles = localStorage.getItem('roles');
        console.log('Roles:', roles);
    
        if (roles) {
            // Roles are present in local storage, parse and filter routes based on roles
            try {
                const userRoles = JSON.parse(roles);
    
                const filteredRoutes = PrivateRoutesConfig.filter(route => {
                    // Check if route has permissions defined and if user has any of those permissions
                    if (route.permission) {
                        return route.permission.some(role => userRoles.includes(role));
                    } else {
                        // If no permissions are defined, allow the route
                        return true;
                    }
                });
    
                console.log('Filtered Routes:', filteredRoutes);
                setAllowedRoutes(filteredRoutes);
                setLoading(false);
            } catch (error) {
                console.error('Error parsing roles:', error);
                setLoading(false);
            }
        } else {
            // No roles found in local storage, handle as necessary (e.g., redirect to login)
            console.log('No roles found in local storage.');
            setLoading(false);
        }
    }, []);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn()) {
        return <Redirect to="/" />;
    }

    return (
        <CommonLayout>
            <MapAllowedRoutes routes={allowedRoutes} basePath="/app" isAddNotFound />
        </CommonLayout>
    );
}

export default PrivateRoutes;
