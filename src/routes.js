// routes.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Subs from './pages/Subs.jsx';
import TestApi from './pages/Testapi.jsx';
import RegisterForm from './pages/register/Form.jsx';
import LoginForm from './pages/login/Form.jsx';
import ForgotForm from './pages/forgot/Form.jsx';
import Wallet from './pages/user/Index.jsx';
import Withdraw from './pages/user/Withdraw.jsx';
import Refferal from './pages/user/Refferal.jsx';
import History from './pages/user/History.jsx';
import Dashboard from './pages/admin/dashboard.jsx';
import Transaction from './pages/admin/Transaction.jsx';
import AdminWithdraw from './pages/admin/Withdraw.jsx';
import Users from './pages/admin/user/index.jsx';
import Content from './pages/admin/content/index.jsx';
import AddUsers from './pages/admin/user/add.jsx';

const RoutesComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />{' '}
        <Route path='/testapi' element={<TestApi />} />{' '}
        <Route path='/package' element={<Subs />} />{' '}
        <Route path='/register' element={<RegisterForm />} />{' '}
        <Route path='/login' element={<LoginForm />} />{' '}
        <Route path='/forgot' element={<ForgotForm />} />{' '}
        <Route path='/wallet' element={<Wallet />} />{' '}
        <Route path='/withdraw' element={<Withdraw />} />{' '}
        <Route path='/refferal' element={<Refferal />} />{' '}
        <Route path='/history' element={<History />} />{' '}
        <Route path='/asdhakdls/dashboard' element={<Dashboard />} />{' '}
        <Route path='/asdhakdls/transaction' element={<Transaction />} />{' '}
        <Route path='/asdhakdls/withdraw' element={<AdminWithdraw />} />{' '}
        <Route path='/asdhakdls/users' element={<Users />} />{' '}
        <Route path='/asdhakdls/users/add' element={<AddUsers />} />{' '}
        <Route path='/asdhakdls/content' element={<Content />} />{' '}
      </Routes>{' '}
    </Router>
  );
};

export default RoutesComponent;
