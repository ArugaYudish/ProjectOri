import React, { useState } from 'react'
import api from '../../../utils/api'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../../assets/img/OriNeko-Logo.png'
import '../../../assets/css/navbar.css'
import { Dropdown, Space, Modal, message } from 'antd'
import { GalleryAdd, LogoutCurve, TransactionMinus, Grid3, ArrangeHorizontal, UserTick, Home } from 'iconsax-react'

const SidebarAdmin = ({ children }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const location = useLocation()
	const navigate = useNavigate()

	const handleLogout = async () => {
		try {
			const response = await api.get('/api/v1/auth/logout')
			if (response.status === 200) {
				localStorage.removeItem('userId')
				localStorage.removeItem('role')
				localStorage.removeItem('accessToken')
				localStorage.removeItem('userName')
				navigate('/')
			} else {
				message.error('Logout failed')
			}
		} catch (error) {
			console.error('Logout failed', error)
		}
	}

	const showModal = () => {
		setIsModalOpen(true)
	}

	const handleOk = async () => {
		await handleLogout()
	}

	const handleCancel = () => {
		setIsModalOpen(false)
	}

	const menuItems = [
		{ href: '/', icon: Home, label: 'Home' },
		{ href: '/asdhakdls/dashboard', icon: Grid3, label: 'Dashboard' },
		{
			href: '/asdhakdls/transaction',
			icon: TransactionMinus,
			label: 'Transaction'
		},
		{
			href: '/asdhakdls/withdraw',
			icon: ArrangeHorizontal,
			label: 'Approve Withdrawal'
		},
		{
			href: '/asdhakdls/users',
			icon: UserTick,
			label: 'User Management'
		},
		{
			href: '/asdhakdls/content',
			icon: GalleryAdd,
			label: 'Content Management'
		}
	]

	const items = menuItems.map((item, index) => ({
		label: (
			<Link
				to={item.href}
				className={`flex items-center p-2 rounded-lg bg-sidebar-sec ${
					location.pathname === item.href ? 'bg-sidebar' : 'bg-sidebar-sec '
				}`}
			>
				<item.icon
					className={`${location.pathname === item.href ? 'icon-Wallet ' : ' '}`}
					variant={location.pathname === item.href ? 'Bold' : 'Regular'}
				/>
				<span className={`ms-3 ${location.pathname === item.href ? 'sidebar-color font-bold' : 'text-sidebar '}`}>
					{item.label}
				</span>
			</Link>
		),
		key: String(index)
	}))

	items.push({
		label: (
			<button
				onClick={showModal}
				className="flex items-center p-2 rounded-lg bg-sidebar-sec w-full text-black"
			>
				<LogoutCurve variant="Regular" />
				<span className="ms-3 text-sidebar">Logout</span>
			</button>
		),
		key: 'logout'
	})

	return (
		<div>
			<aside
				id="logo-sidebar"
				className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full  border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
				aria-label="Sidebar"
			>
				<a
					href="/"
					className="flex items-center pt-10 pb-10  justify-center space-x-3 rtl:space-x-reverse"
				>
					<img
						src={logo}
						className="h-8"
						alt="Flowbite Logo"
					/>
				</a>
				<div className="h-full  px-3 pb-4 overflow-y-auto bg-white dark:bg-gre-800">
					<ul className="space-y-2 font-medium">
						{menuItems.map((item) => (
							<li key={item.href}>
								<Link
									to={item.href}
									className={`flex items-center p-2  rounded-lg  bg-sidebar-sec ${
										location.pathname === item.href ? 'bg-sidebar' : 'bg-sidebar-sec '
									}`}
								>
									<item.icon
										size="20"
										className={`  ${location.pathname === item.href ? 'icon-Wallet ' : ' '}`}
										variant={location.pathname === item.href ? 'Bold' : 'Regular'}
									/>
									<span
										className={`ms-3 ${location.pathname === item.href ? 'sidebar-color font-bold' : 'text-sidebar '}`}
									>
										{item.label}
									</span>
								</Link>
							</li>
						))}
						<li>
							<button
								onClick={showModal}
								className="flex items-center p-2 rounded-lg bg-sidebar-sec w-full"
							>
								<LogoutCurve
									size="20"
									variant="Regular"
								/>
								<span className="ms-3 text-sidebar">Logout</span>
							</button>
						</li>
					</ul>
				</div>
			</aside>

			<div className="block sm:hidden px-6 sm:ml-64">
				<div className="mt-10">
					<Dropdown
						menu={{ items }}
						trigger={['click']}
						overlayClassName="w-64"
					>
						<button onClick={(e) => e.preventDefault()}>
							<Space>
								<svg
									className="w-6 h-6 fill-current"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"
									/>
								</svg>
							</Space>
						</button>
					</Dropdown>
				</div>
			</div>

			<Modal
				title="Notifications"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				okButtonProps={{ style: { backgroundColor: '#ca9700' } }}
			>
				<p>Are you sure you want to logout?</p>
			</Modal>

			<div className="p-6 sm:ml-64">
				<div className="p-4 mt-10">
					<div id="content">{children}</div>
				</div>
			</div>
		</div>
	)
}

export default SidebarAdmin
