import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/OriNeko-Logo.png';
import { Wallet } from 'iconsax-react';
import '../../assets/css/navbar.css';
import api from '../../utils/api';
import { Dropdown, Space, Modal, message } from 'antd';
import {
  BitcoinConvert,
  MessageAdd1,
  TableDocument,
  LogoutCurve,
  Home,
} from 'iconsax-react';

const Sidebar = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isTransaction = sessionStorage.getItem('isTransaction');
  const name = sessionStorage.getItem('userName');
  const role = sessionStorage.getItem('role');

  const handleLogout = async () => {
    try {
      const response = await api.get('/api/v1/auth/logout');
      if (response.status === 200) {
        sessionStorage.clear();
        setIsModalOpen(false);
        navigate('/');
      } else {
        message.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await handleLogout();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const menuItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/wallet', icon: Wallet, label: 'My Wallet' },
    { href: '/withdraw', icon: BitcoinConvert, label: 'Withdraw' },
    { href: '/refferal', icon: MessageAdd1, label: 'Refferal' },
    { href: '/history', icon: TableDocument, label: 'History' },
  ];

  const filteredItems = menuItems.filter(item => {
    if (isTransaction === 'true') {
      return true;
    }
    return (
      item.href !== '/refferal' &&
      item.href !== '/wallet' &&
      item.href !== '/withdraw'
    );
  });

  const items = filteredItems.map((item, index) => ({
    label: (
      <Link
        to={item.href}
        className={`flex items-center p-2  rounded-lg  bg-sidebar-sec ${
          location.pathname === item.href ? 'bg-sidebar' : 'bg-sidebar-sec '
        }`}>
        <item.icon
          className={`${
            location.pathname === item.href ? 'icon-Wallet ' : ' '
          }`}
          variant={location.pathname === item.href ? 'Bold' : 'Regular'}
        />
        <span
          className={`ms-3 ${
            location.pathname === item.href
              ? 'sidebar-color font-bold'
              : 'text-sidebar '
          }`}>
          {item.label}
        </span>
      </Link>
    ),
    key: String(index),
  }));

  items.push({
    label: (
      <button
        onClick={showModal}
        className='flex items-center p-2 rounded-lg bg-sidebar-sec w-full'>
        <LogoutCurve variant='Regular' />
        <span className='ms-3 text-sidebar'>Logout</span>
      </button>
    ),
    key: 'logout',
  });

  return (
    <div>
      <nav class='fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
        <div class='sticky  mx-auto flex flex-wrap items-center justify-between mx-auto p-4'>
          <a href='/' class='flex items-center space-x-3 rtl:space-x-reverse'>
            <img src={logo} class='h-8' alt='Flowbite Logo' />
          </a>
          <Dropdown
            menu={{ items }}
            trigger={['click']}
            className='block sm:hidden items-center inline-flex'
            overlayClassName='w-64'>
            <button onClick={e => e.preventDefault()}>
              <Space>
                <svg
                  className='w-6 h-6 fill-current'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z'
                  />
                </svg>
              </Space>
            </button>
          </Dropdown>
          <div class='hidden w-full md:block md:w-auto' id='navbar-default'>
            <ul class='font-medium flex items-center flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 '>
              <li className='block sm:hidden'>
                <a
                  href='/wallet'
                  class=' block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  My Wallet
                </a>
              </li>
              <li className='block sm:hidden'>
                <a
                  href='/withdraw'
                  class=' block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Withdraw
                </a>
              </li>
              <li className='block sm:hidden'>
                <a
                  href='/refferal'
                  class=' block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Refferal
                </a>
              </li>
              <li className='block sm:hidden'>
                <a
                  href='/history'
                  class=' block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  History
                </a>
              </li>
              <li>
                <a
                  href='/history'
                  class=' block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href='/#about'
                  class=' block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  About Us
                </a>
              </li>
              <li>
                <a
                  href='/#contact'
                  class='block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href='/#key-features'
                  class='block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Key Features
                </a>
              </li>
              <li>
                <a
                  href='/#performance'
                  class='block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Performance
                </a>
              </li>
              <li>
                <a
                  href='/#subscription'
                  class='block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Subscription Plan
                </a>
              </li>
              <li>
                <div href='#' class='register-button '>
                  {name && role && (
                    <>
                      {name} - {role}
                    </>
                  )}
                </div>
              </li>
              <li className='block sm:hidden py-5 '>
                <button onClick={showModal} class=' mt-5 register-button'>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <aside
        id='logo-sidebar'
        class=' fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full  border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700'
        aria-label='Sidebar'>
        <div class='h-full  px-3 pb-4 overflow-y-auto bg-white dark:bg-gre-800'>
          <ul className='space-y-2 font-medium'>
            {filteredItems.map(item => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center p-2  rounded-lg  bg-sidebar-sec ${
                    location.pathname === item.href
                      ? 'bg-sidebar'
                      : 'bg-sidebar-sec '
                  }`}>
                  <item.icon
                    size='20'
                    className={`  ${
                      location.pathname === item.href ? 'icon-Wallet ' : ' '
                    }`}
                    variant={
                      location.pathname === item.href ? 'Bold' : 'Regular'
                    }
                  />
                  <span
                    className={`ms-3 ${
                      location.pathname === item.href
                        ? 'sidebar-color font-bold'
                        : 'text-sidebar '
                    }`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={showModal}
                className='flex items-center p-2 rounded-lg bg-sidebar-sec w-full'>
                <LogoutCurve size='20' variant='Regular' />
                <span className='ms-3 text-sidebar'>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <Modal
        title='Notifications'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { backgroundColor: '#ca9700' } }}>
        <p>Are you sure you want to logout?</p>
      </Modal>

      <div class='p-6 sm:ml-64'>
        <div class='p-4 mt-10'>
          <div id='content'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
