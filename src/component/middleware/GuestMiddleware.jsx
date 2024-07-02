import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const GuestMiddleware = () => {
	const role = sessionStorage.getItem('role')

	if (!role) {
		return <Outlet />
	} else if (role === 'admin') {
		return <Navigate to="/asdhakdls/dashboard" />
	} else if (role === 'user') {
		return <Navigate to="/wallet" />
	}
}

export default GuestMiddleware
