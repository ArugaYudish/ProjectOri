import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import SidebarAdmin from '../../../component/common/admin/Sidebar'
import api from '../../../utils/api'
import '../../../assets/css/auth.css'

const EditUserForm = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [role, setRole] = useState('user') // Default role is 'user'
  const [status, setStatus] = useState('')
	const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams();

	useEffect(() => {
		const fetchUser = async () => {
			try {
        const response = await api.get(`/api/v1/users/${id}`);
				if (response.data && response.data.data) {
					const user = response.data.data.users
					setName(user[0].name)
					setEmail(user[0].email)
					setRole(user[0].role)
          setStatus(user[0].status)
				}
			} catch (error) {
				console.error('Failed to fetch users:', error)
				message.error('Failed to fetch users')
			}
		}

		fetchUser()
	}, [id])

	const handleSubmit = async (event) => {
		event.preventDefault()

		try {
			const response = await api.post('/api/v1/users/update-user', {
				id: id,
				status: status,
			})

      console.log(response)

			if (response.data && response.data.data) {
				navigate('/asdhakdls/users') // Redirect to the users management page after success
			} else {
				setError('Failed to update user')
			}
		} catch (error) {
			setError(error.response?.data?.message || 'Failed to update user')
		}
	}

	return (
		<SidebarAdmin>
			<div className="container mx-auto p-8">
				<div className="text-2xl font-bold pb-3">Add New User</div>
				{error && <div className="text-red-500 pb-3">{error}</div>}
				<form
					onSubmit={handleSubmit}
					className="w-full"
				>
					<div className="pb-2">
						<label
							htmlFor="name"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Full Name
						</label>
						<input
							type="text"
							id="name"
							className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							placeholder="Full Name"
							value={name}
              disabled
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div className="pb-2">
						<label
							htmlFor="email"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							placeholder="Email"
							value={email}
              disabled
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="pb-3">
						<label
							htmlFor="role"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Role
						</label>
						<select
							id="role"
							className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							value={role}
              disabled
							onChange={(e) => setRole(e.target.value)}
							required
						>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					</div>
          <div className="pb-3">
						<label
							htmlFor="role"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Status
						</label>
						<select
							id="status"
							className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							required
						>
							<option value="Active">Active</option>
							<option value="Inactive">Inactive</option>
						</select>
					</div>
					<button
						type="submit"
						className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center"
					>
						Edit User
					</button>
				</form>
			</div>
		</SidebarAdmin>
	)
}

export default EditUserForm
