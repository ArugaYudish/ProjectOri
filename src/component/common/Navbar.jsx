import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/OriNeko-Logo.png';
import '../../assets/css/navbar.css';

const Navbar = () => {
  const [scrollBackground, setScrollBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrollBackground) {
        setScrollBackground(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollBackground]);
  return (
    <>
      <nav
        className={` navbar-color fixed w-full z-20 top-0 start-0 ${
          scrollBackground ? 'navbar-gradient-bg' : 'navbar-default-bg'
        }`}>
        <div class='sticky padding-general  mx-auto flex flex-wrap items-center justify-between mx-auto p-4'>
          <a
            href='https://flowbite.com/'
            class='flex items-center space-x-3 rtl:space-x-reverse'>
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
            <ul class='font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 '>
              <li>
                <a
                  href='/wallet'
                  class='navbar-text-color block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href='#about'
                  class='navbar-text-color block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  About Us
                </a>
              </li>
              <li>
                <a
                  href='#contact'
                  class='block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href='#key-features'
                  class='block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Key Features
                </a>
              </li>
              <li>
                <a
                  href='#performance'
                  class='block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Performance
                </a>
              </li>
              <li>
                <a
                  href='#subscription'
                  class='block py-2 px-3  rounded   md:border-0  md:p-0 dark:text-white  dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>
                  Subscription Plan
                </a>
              </li>
              <li>
                <a href='/register' class='register-button'>
                  Register
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
