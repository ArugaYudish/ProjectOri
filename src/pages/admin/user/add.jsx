import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../../../component/common/admin/Sidebar';
import '../../../assets/css/auth.css';

const AddUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('accessToken')

  const handleSubmit = async event => {
    event.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          password_confirm: password,
          role: role
        }),
      });

      let data = await response.json();
      if (data.meta.code !== 200) {
        if (!Array.isArray(data.data)) {
          setError(data.data.Messsage);
          setFieldError(data.data.Field);
        } else {
          setError(data.data[0].Message);
          setFieldError(data.data[0].Field);
        }
      } else {
        navigate('/asdhakdls/users', { state: { message: data.meta.message, alert: "success" } })
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <SidebarAdmin>
      <div className='container mx-auto p-8'>
        <div className='text-2xl font-bold pb-3'>Add New User</div>
        {error && fieldError === null && <div className='text-red-500 pb-3'>{error}</div>}
        <form onSubmit={handleSubmit} className='w-full'>
          <div className='pb-2'>
            <label
              htmlFor='name'
              className='block mb-2 text-sm font-medium text-gray-900'>
              Full Name
            </label>
            <input
              type='text'
              id='name'
              className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              placeholder='Full Name'
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className='pb-2'>
            <label
              htmlFor='email'
              className='block mb-2 text-sm font-medium text-gray-900'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              placeholder='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          {error && fieldError === 'Email' ? (
            <div className='text-red-500 pb-3'>{error}</div>
          ) : null}
          <div className='pb-2'>
            <label
              htmlFor='password'
              className='block mb-2 text-sm font-medium text-gray-900'>
              Password
            </label>
            <input
              type='password'
              id='password'
              className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              placeholder='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error !== 'Password and Password Confirm is not same!' &&
            fieldError === 'Password' ? (
            <div className='text-red-500 pb-3'>{error}</div>
          ) : null}
          <div className='pb-3'>
            <label
              htmlFor='role'
              className='block mb-2 text-sm font-medium text-gray-900'>
              Role
            </label>
            <select
              id='role'
              className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              value={role}
              onChange={e => setRole(e.target.value)}
              required>
              <option value='user'>User</option>
              <option value='admin'>Admin</option>
            </select>
          </div>
          <button
            type='submit'
            className="text-white bg-color-orineko hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center">
            Add User
          </button>
        </form>
      </div>
    </SidebarAdmin>
  );
};

export default AddUserForm;
