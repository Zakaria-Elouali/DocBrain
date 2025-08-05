// routes/ProtectedRoutes.jsx
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '@/helpers/auth_helper';

// Layouts
import VerticalLayout from '../Layouts/Layout';
import {authProtectedRoutes, publicRoutes} from "./allRoutes";
import {AuthProtected} from "./AuthProtected";

const ProtectedRoutes = () => {
  const { loading } = useSelector((state) => state.LoginReducer);
  const { hasRole, userRoles } = useAuth();

  // Handle invitation URLs
  React.useEffect(() => {
    const from = window.location.href;
    const isInvitationUrl = [
      '/labs/validate_invitation',
      '/forum/validate_invitation',
      '/forum/validate_request'
    ].some(path => from.includes(path));

    if (isInvitationUrl) {
      localStorage.setItem('from', from);
    }
  }, []);

  // Helper to check if user has required role
  const hasRequiredRole = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.some(role => hasRole(role));
  };

  // Route renderer with role checking
  const renderProtectedRoute = (route) => {
    if (loading) {
      return null; // Or a loading component
    }

    if (!hasRequiredRole(route.role)) {
      return <Navigate to="/unauthorized" />;
    }

    return (
        <AuthProtected>
          <VerticalLayout>{route.component}</VerticalLayout>
        </AuthProtected>
    );
  };

  return (
      <React.Fragment>
        <Routes>
          {/* Public Routes */}
          <Route>
            {publicRoutes.map((route, idx) => (
                <Route
                    key={idx}
                    path={route.path}
                    element={route.component}
                    exact={true}
                />
            ))}
          </Route>

          {/* Protected Routes */}
          <Route>
            {authProtectedRoutes.map((route, idx) => (
                <Route
                    key={idx}
                    path={route.path}
                    element={renderProtectedRoute(route)}
                    exact={true}
                />
            ))}
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <ToastContainer />
      </React.Fragment>
  );
};

export default ProtectedRoutes;