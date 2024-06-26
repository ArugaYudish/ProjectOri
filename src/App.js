import React, { useEffect } from 'react';
import Routes from './routes';
import { refreshToken } from './utils/api';

const App = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    }, 60 * 3 * 1000); // 10 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='App'>
      <Routes />
    </div>
  );
};

export default App;
