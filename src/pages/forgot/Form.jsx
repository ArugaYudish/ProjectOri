import React from 'react';
import '../../assets/css/auth.css';
import OrinekoCat from '../../assets/img/Forgot.svg';

const ForgotForm = () => {
  return (
    <>
      <div className='authForm sm:grid grid-cols-2'>
        <div className='col-span-1 image-form  flex items-center'>
          <img
            className='set-image-form pt-10'
            style={{ width: '400px' }}
            src={OrinekoCat}
            alt=''
          />
        </div>
        <div className='col-span-1 bg-white set-form flex items-center'>
          <form class='max-w-sm mx-auto w-full'>
            <div className='text-2xl font-bold pb-3  '>
              <div className='pt-6'> Create New Password 🔐</div>
            </div>
            <div className='pb-5 text-gray-600'>
              Input your new password to access your account!
            </div>

            <div class='pb-2'>
              <label
                for='password'
                class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                New Password
              </label>
              <input
                type='password'
                id='password'
                placeholder='at least 8 caracters'
                class=' border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                required
              />
            </div>
            <div class='pb-5'>
              <label
                for='confirmationPassword'
                class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Confirmation New Password
              </label>
              <input
                type='confirmationPassword'
                placeholder='at least 8 caracters'
                id='confirmationPassword'
                class=' border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                required
              />
            </div>

            <button
              type='submit'
              class=' text-white bg-button-form hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800'>
              Confirmation
            </button>

            <div className='text-center pt-3'>
              Remember your password?{' '}
              <a href='/register' className='text-blue-600'>
                Sign In
              </a>{' '}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotForm;
