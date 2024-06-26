import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/img/OriNeko-Logo.png';
import '../../../assets/css/navbar.css';

import {
  GalleryAdd,
  LogoutCurve,
  TransactionMinus,
  Grid3,
  ArrangeHorizontal,
  UserTick,
} from 'iconsax-react';

const SidebarAdmin = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { href: '/asdhakdls/dashboard', icon: Grid3, label: 'Dashboard' },
    {
      href: '/asdhakdls/transaction',
      icon: TransactionMinus,
      label: 'Transaction',
    },
    {
      href: '/asdhakdls/withdraw',
      icon: ArrangeHorizontal,
      label: 'Approve Withdrawal',
    },
    {
      href: '/asdhakdls/users',
      icon: UserTick,
      label: 'User Management',
    },
    {
      href: '/asdhakdls/content',
      icon: GalleryAdd,
      label: 'Content Management',
    },
    { href: '/logout', icon: LogoutCurve, label: 'Logout' },
  ];

  return (
    <div>
      <aside
        id='logo-sidebar'
        class=' fixed top-0 left-0 z-40 w-64 h-screen  transition-transform -translate-x-full  border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700'
        aria-label='Sidebar'>
        <a
          href='/'
          class='flex items-center pt-10 pb-10  justify-center space-x-3 rtl:space-x-reverse'>
          <img src={logo} class='h-8' alt='Flowbite Logo' />
        </a>
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

export default SidebarAdmin;
