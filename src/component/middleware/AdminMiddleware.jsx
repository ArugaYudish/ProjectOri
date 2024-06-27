import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const AdminRoleMiddleware = () => {
	const role = localStorage.getItem('role')

	if (role === 'admin') {
		return <Outlet />
	} else if (role === 'user') {
    return <Navigate to="/wallet" />
  } else {
		return <Navigate to="/login" />
	}
}

export default AdminRoleMiddleware
