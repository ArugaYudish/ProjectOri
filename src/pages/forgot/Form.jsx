import React, { useState } from 'react';
import '../../assets/css/auth.css';
import OrinekoCat from '../../assets/img/Forgot.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert } from 'antd';

const ForgotForm = () => {
  const location = useLocation();
  const verificationStatus =
    location.state && location.state.meta !== null
      ? location.state.meta.code
      : null;
  const verificationMessage =
    location.state && location.state.meta !== null
      ? location.state.meta.message
      : null;
  const id =
    location.state && location.state.id !== null ? location.state.id : null;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleForgotPassword = async event => {
    event.preventDefault();

    const apiUrl = process.env.REACT_APP_API_URL;

    try {
      const response = await fetch(`${apiUrl}/api/v1/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      console.log(data.meta.message, data);
      switch (data.meta.code) {
        case 200:
          navigate('/login', { state: data });
          break;
        default:
          navigate('/login', { state: data });
          break;
      }
    } catch (error) {
      console.log(error.message);
      const data = {
        meta: {
          code: 500,
          message: error.message,
        },
      };

      navigate('/login', { state: data });
    }
  };

  const handleResetPassword = async event => {
    event.preventDefault();

    const apiUrl = process.env.REACT_APP_API_URL;

    try {
      const response = await fetch(
        `${apiUrl}/api/v1/users/reset-password/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: password,
            password_confirm: passwordConfirm,
          }),
        },
      );

      const data = await response.json();

      console.log(data.meta.message, data);
      switch (data.meta.code) {
        case 200:
          navigate('/login', { state: data });
          break;
        default:
          navigate('/login', { state: data });
          break;
      }
    } catch (error) {
      console.log(error.message);
      const data = {
        meta: {
          code: 500,
          message: error.message,
        },
      };

      navigate('/login', { state: data });
    }
  };

  return (
    <>
      {verificationStatus !== null ? (
        <div className='absolute top-0 right-0 left-0 pt-4 flex justify-center'>
          <Alert
            message={verificationMessage}
            type={verificationStatus === 200 ? 'success' : 'error'}
            showIcon
            closable
          />
        </div>
      ) : null}
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
          {id !== null ? (
            <form
              onSubmit={handleResetPassword}
              className='max-w-sm mx-auto w-full'>
              <div className='text-2xl font-bold pb-3  '>
                <div className='pt-6'> Create New Password 🔐</div>
              </div>
              <div className='pb-5 text-gray-600'>
                Input yfour new password to access your account!
              </div>

              <div className='pb-2'>
                <label
                  htmlFor='password'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  New Password
                </label>
                <input
                  type='password'
                  id='password'
                  placeholder='at least 8 caracters'
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                  }}
                  className=' border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  required
                />
              </div>
              <div className='pb-5'>
                <label
                  htmlFor='confirmationPassword'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Confirmation New Password
                </label>
                <input
                  type='confirmationPassword'
                  placeholder='at least 8 caracters'
                  value={passwordConfirm}
                  onChange={e => {
                    setPasswordConfirm(e.target.value);
                  }}
                  id='confirmationPassword'
                  className=' border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  required
                />
              </div>

              <button
                type='submit'
                className=' text-white bg-button-form hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800'>
                Confirmation
              </button>

              <div className='text-center pt-3'>
                Remember your password?{' '}
                <a href='/register' className='text-blue-600'>
                  Sign In
                </a>{' '}
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleForgotPassword}
              className='max-w-sm mx-auto w-full'>
              <div className='text-2xl font-bold pb-3  '>
                <div className='pt-6'> Create New Password 🔐</div>
              </div>
              <div className='pb-5 text-gray-600'>
                Input your Email to access your account!
              </div>

              <div className='pb-2'>
                <label
                  htmlFor='email'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Your email
                </label>
                <input
                  type='email'
                  id='email'
                  placeholder='name@arineko.com'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className=' border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  required
                />
              </div>

              <button
                type='submit'
                className=' text-white bg-button-form hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800'>
                Confirmation
              </button>

              <div className='text-center pt-3'>
                Remember your password?{' '}
                <a href='/register' className='text-blue-600'>
                  Sign In
                </a>{' '}
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotForm;
