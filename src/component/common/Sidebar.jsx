import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/OriNeko-Logo.png';
import { Wallet } from 'iconsax-react';
import '../../assets/css/navbar.css';
import api from '../../utils/api';

import {
  BitcoinConvert,
  MessageAdd1,
  TableDocument,
  LogoutCurve,
} from 'iconsax-react';

const Sidebar = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate()

  const menuItems = [
    { href: '/wallet', icon: Wallet, label: 'My Wallet' },
    { href: '/withdraw', icon: BitcoinConvert, label: 'Withdraw' },
    { href: '/refferal', icon: MessageAdd1, label: 'Refferal' },
    { href: '/history', icon: TableDocument, label: 'History' },
  ];

  const handleLogout = async () => {
		try {
			const response = await api.get('/api/v1/auth/logout')
			if (response.status === 200) {
				localStorage.removeItem('userId')
				localStorage.removeItem('role')
				navigate('/')
			}
		} catch (error) {
			console.error('Logout failed', error)
		}
	}

  return (
    <div>
      <nav class='fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
        <div class='sticky  mx-auto flex flex-wrap items-center justify-between mx-auto p-4'>
          <a href='/' class='flex items-center space-x-3 rtl:space-x-reverse'>
            <img src={logo} class='h-8' alt='Flowbite Logo' />
          </a>
          <button
            data-collapse-toggle='navbar-default'
            type='button'
            class='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-900 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
            aria-controls='navbar-default'
            aria-expanded='false'>
            <span class='sr-only'>Open main menu</span>
            <svg
              class='w-5 h-5'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 17 14'>
              <path
                stroke='currentColor'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M1 1h15M1 7h15M1 13h15'
              />
            </svg>
          </button>
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
                  href='/wallet'
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
                  Admin
                </div>
              </li>
              <li className='block sm:hidden py-5 '>
                <button onClick={handleLogout} class=' mt-5 register-button'>
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
            {menuItems.map(item => (
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
								onClick={handleLogout}
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

      <div class='p-6 sm:ml-64'>
        <div class='p-4 mt-10'>
          <div id='content'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
