import React, { useEffect, useState } from 'react';
import Routes from './routes';
import { refreshToken } from './utils/api';

const App = () => {
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());

  useEffect(() => {
    const handleUserActivity = () => {
      setLastActivityTime(Date.now());
    };

    // Add event listeners to detect user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    const interval = setInterval(async () => {
      try {
        const currentTime = Date.now();
        const timeSinceLastActivity = currentTime - lastActivityTime;

        if (timeSinceLastActivity < 2 * 60 * 1000) { // 10 minutes in milliseconds
          await refreshToken();
        } else {
          sessionStorage.removeItem('userId')
          sessionStorage.removeItem('role')
          sessionStorage.removeItem('accessToken')
          sessionStorage.removeItem('userName')
          sessionStorage.removeItem('Ballance')
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    }, 60 * 2 * 1000); // 10 minutes in milliseconds

    // Cleanup on component unmount
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, [lastActivityTime]);

  return (
    <div className='App'>
      <Routes />
    </div>
  );
};

export default App;
