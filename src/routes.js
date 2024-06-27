import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Subs from './pages/Subs.jsx'
import TestApi from './pages/Testapi.jsx'
import RegisterForm from './pages/register/Form.jsx'
import LoginForm from './pages/login/Form.jsx'
import ForgotForm from './pages/forgot/Form.jsx'
import Wallet from './pages/user/Index.jsx'
import Withdraw from './pages/user/Withdraw.jsx'
import Refferal from './pages/user/Refferal.jsx'
import History from './pages/user/History.jsx'
import Dashboard from './pages/admin/dashboard.jsx'
import Transaction from './pages/admin/Transaction.jsx'
import AdminWithdraw from './pages/admin/Withdraw.jsx'
import Users from './pages/admin/user/index.jsx'
import Content from './pages/admin/content/index.jsx'
import AddUsers from './pages/admin/user/add.jsx'
import UserRoleMiddleware from './component/middleware/UserMiddleware.jsx'
import AdminRoleMiddleware from './component/middleware/AdminMiddleware.jsx'
import GuestMiddleware from './component/middleware/GuestMiddleware.jsx'
import EditUserForm from './pages/admin/user/edit.jsx'
import Activation from './pages/register/Activation.jsx';
import ForgotVerification from './pages/forgot/ForgotVerification.jsx';

const RoutesComponent = () => {
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={<Home />}
				/>
				<Route
					path="/testapi"
					element={<TestApi />}
				/>
				<Route
					path="/package"
					element={<Subs />}
				/>
				<Route element={<GuestMiddleware />}>
					<Route
						path="/register"
						element={<RegisterForm />}
					/>
					<Route
						path='/activation/:id'
						element={<Activation />}
					/>
					<Route
						path="/login"
						element={<LoginForm />}
					/>
					<Route
						path="/forgot"
						element={<ForgotForm />}
					/>
					<Route
						path='/reset-password/:id'
						element={<ForgotVerification />}
					/>
				</Route>
				<Route element={<UserRoleMiddleware />}>
					<Route
						path="/wallet"
						element={<Wallet />}
					/>
					<Route
						path="/withdraw"
						element={<Withdraw />}
					/>
					<Route
						path="/refferal"
						element={<Refferal />}
					/>
					<Route
						path="/history"
						element={<History />}
					/>
				</Route>
				<Route element={<AdminRoleMiddleware />}>
					<Route
						path="/asdhakdls/dashboard"
						element={<Dashboard />}
					/>
					<Route
						path="/asdhakdls/transaction"
						element={<Transaction />}
					/>
					<Route
						path="/asdhakdls/withdraw"
						element={<AdminWithdraw />}
					/>
					<Route
						path="/asdhakdls/users"
						element={<Users />}
					/>
					<Route
						path="/asdhakdls/users/add"
						element={<AddUsers />}
					/>
					<Route
						path="/asdhakdls/users/edit/:id"
						element={<EditUserForm />}
					/>
					<Route
						path="/asdhakdls/content"
						element={<Content />}
					/>
				</Route>
			</Routes>
		</Router>
	)
}

export default RoutesComponent
