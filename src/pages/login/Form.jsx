import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/css/auth.css';
import OrinekoCat from '../../assets/img/Login.svg';
import OriNekoLogo from '../../assets/img/OriNeko-Logo.png';
import { decryptUserData } from '../../utils/api';
import { useLocation } from 'react-router-dom';
import { Alert } from 'antd';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [userBallance, setUserBallance] = useState(null);
  const location = useLocation();
  const verificationStatus =
    location.state && location.state.meta !== null
      ? location.state.meta.code
      : null;
  const verificationMessage =
    location.state && location.state.meta !== null
      ? location.state.meta.message
      : null;
  const navigate = useNavigate();

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;

    try {
      const response = await axios.post(`${apiUrl}/api/v1/auth/login`, {
        email,
        password,
      });

      // Check if response contains data and access token
      if (
        response.data &&
        response.data.data &&
        response.data.data.access_token &&
        response.data.data.user_data
      ) {
        const accessToken = response.data.data.access_token;
        const encryptedUserData = response.data.data.user_data;

        console.log(accessToken);
        console.log(encryptedUserData);

        // Store access token in localStorage
        localStorage.setItem('accessToken', accessToken);
        console.log('Token stored:', localStorage.getItem('accessToken'));

        // Decrypt user data
        const decryptedUserData = await decryptUserData(encryptedUserData);
        setUserData(decryptedUserData);
        localStorage.setItem('userId', decryptedUserData.id); // Assuming decryptedUserData contains id field
        localStorage.setItem('role', decryptedUserData.role);
        localStorage.setItem('Ballance', decryptedUserData.balance); // Assuming decryptedUserData contains id field

        // Set login status to success
        setLoginStatus('success');
        setErrorMessage('');

        if (decryptedUserData.role === 'admin') {
          navigate('/asdhakdls/dashboard');
        } else {
          navigate('/wallet');
        }
        // Redirect user or handle successful login here
      } else {
        // Handle unexpected response format
        setLoginStatus('error');
        setErrorMessage('Login Failed: Unexpected response format');
      }
    } catch (error) {
      // Handle error from server
      setLoginStatus('error');
      setErrorMessage(error.response?.data?.meta?.message || 'Login Failed');
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
        <div className='col-span-1 image-form flex items-center'>
          <img
            className='set-image-form w-full'
            style={{ width: '400px' }}
            src={OrinekoCat}
            alt=''
          />
        </div>
        <div className='col-span-1 bg-white set-form flex items-center'>
          <form className='max-w-sm w-full mx-auto ' onSubmit={handleSubmit}>
            <div className='text-2xl font-bold pb-3'>
              <img src={OriNekoLogo} className='set-logo-login' alt='' />
              <div className='pt-3'> Welcome Back 👋</div>
            </div>
            <div className='pb-2 text-gray-600'>
              Today is a new day. It's your day. You shape it. Sign in to start
              creating form or help each other.
            </div>
            {loginStatus === 'success' && (
              <div className='pb-2 text-green-600'>Login successful!</div>
            )}
            {loginStatus === 'error' && (
              <div className='pb-2 text-red-600'>{errorMessage}</div>
            )}
            <div className='pb-2'>
              <label
                htmlFor='email'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Your email
              </label>
              <input
                type='email'
                id='email'
                className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='name@orineko.com'
                value={email}
                onChange={handleEmailChange}
                name='email'
                required
              />
            </div>
            <div className='pb-2'>
              <label
                htmlFor='password'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Password
              </label>
              <input
                type='password'
                id='password'
                className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                value={password}
                onChange={handlePasswordChange}
                name='password'
                required
              />
            </div>
            <div className='flex justify-end pb-3'>
              <a href='forgot' className='text-blue-600'>
                Forgot Password?
              </a>
            </div>
            <button
              type='submit'
              className='text-white bg-button-form hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800'>
              Sign In
            </button>
            <div className='text-center pt-3'>
              Don't you have an account{' '}
              <a href='/register' className='text-blue-600'>
                Sign up
              </a>{' '}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
