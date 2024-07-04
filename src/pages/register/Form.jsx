import React, { useState } from 'react';
import '../../assets/css/auth.css';
import OrinekoCat from '../../assets/img/SignUp.svg';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);
  const [openModal, setOpenModal] = useState("none")
  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();

    const apiUrl = process.env.REACT_APP_API_URL;

    // if (password.length <= 8) {
    //   setError('Password  minimum 8 character!');
    //   return;
    // }

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          password_confirm: confirmPassword,
        }),
      });

      let data = await response.json();
      console.log(data)

      if (data.meta.code !== 200) {
        // throw new Error(data.message || 'Something went wrong');
        if (!Array.isArray(data.data)) {
          setError(data.data.Messsage)
          setFieldError(data.data.Field)
          console.log(data.data.Messsage)
        } else {
          setError(data.data[0].Message)
          setFieldError(data.data[0].Field)
          console.log(data.data[0].Message)
        }
      } else {
        // Handle successful registration, e.g., redirect to login page
        data.meta.message = "Verification Link Sent to Your Email"
        console.log('Registration successful', data);
        localStorage.setItem("email", email)
        localStorage.setItem("password", password)
        setOpenModal("flex")
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      {/* pupup */}
      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", display: openModal }} className='fixed inset-0 flex justify-center items-center'>
        <div style={{ backgroundColor: "white", padding: "40px" }} className='rounded-lg flex flex-col justify-center items-center'>
          <svg style={{ width: "100px", height: "100px", padding: "20px", backgroundColor: "#d2a41a", borderRadius: "100%" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path fill='white' d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
          </svg>
          <p style={{ color: "#d2a41a" }} className='text-center text-xl font-black mt-5'>Success!</p>
          <p className='text-center font-semibold'>Verification Link Sent to Your Email</p>
          <button onClick={() => { setOpenModal("none") }} style={{ backgroundColor: "#d2a41a", color: "white" }} className='w-full py-2 px-5 rounded-sm mt-5'>Ok</button>
        </div>
      </div>

      {/* form */}
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
          <form
            className='max-w-sm w-full mx-auto pt-8'
            onSubmit={handleSubmit}>
            <div className='text-2xl font-bold pb-3'>Create an Account 🌤️</div>
            <div className='pb-2'>
              <label
                htmlFor='name'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Full Name
              </label>
              <input
                type='text'
                id='name'
                className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='name'
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
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
                className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='name@orineko.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {error && fieldError === "Email" ? <div className='text-red-500 pb-3'>{error}</div> : null}
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
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error !== "Password and Password Confirm is not same!" && fieldError === "Password" ? <div className='text-red-500 pb-3'>{error}</div> : null}
            <div className='pb-3'>
              <label
                htmlFor='confirmPassword'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Confirmation Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error === "Password and Password Confirm is not same!" && fieldError === "Password" ? <div className='text-red-500 pb-3'>{error}</div> : null}
            <button
              type='submit'
              className='text-white bg-button-form hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800'>
              Sign Up
            </button>
            <div className='text-center pt-2'>
              Have an account?{' '}
              <a href='/login' className='text-blue-600'>
                Sign in
              </a>{' '}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
