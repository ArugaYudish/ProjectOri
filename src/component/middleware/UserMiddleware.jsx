import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const UserRoleMiddleware = () => {
  const role = sessionStorage.getItem('role');

  if (role === 'user') {
    return <Outlet />;
  } else if (role === 'admin') {
    return <Navigate to='/asdhakdls/dashboard' />;
  } else {
    return <Navigate to='/login' />;
  }
};

export default UserRoleMiddleware;
