import React, { useEffect, useState } from 'react';
import Layout from '../component/common/Layout';
import api, { refreshToken } from '../utils/api';
import '../assets/css/style.css';

const TestApi = () => {
  const [users, setUsers] = useState([]);
  const [tokenStatus, setTokenStatus] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/v1/transactions/refferal');
      // console.log('Users fetched:', response.data);

      if (response.data && response.data.data && response.data.data.refferal) {
        const { referral_code, total_amount, total_refferal, refferal_user } =
          response.data.data.refferal;

        setUsers({
          referral_code,
          total_amount,
          total_refferal,
          refferal_user,
        });
      }
    } catch (error) {
      // console.error('Error fetching users:', error);
    }
  };

  const handleRefreshToken = async () => {
    try {
      const newAccessToken = await refreshToken();
      setTokenStatus(`Token refreshed successfully: ${newAccessToken}`);
    } catch (error) {
      setTokenStatus('Failed to refresh token');
    }
  };

  return (
    <Layout>
      <div className='mt-5 pt-5'>
        <button onClick={fetchUsers}>Fetch Users</button>
        <ul>
          <li>Referral Code: {users.referral_code}</li>
          <li>Total Amount: {users.total_amount}</li>
          <li>Total Referral: {users.total_refferal}</li>
          <li>Referral User: {users.refferal_user}</li>
        </ul>
        <button onClick={handleRefreshToken}>Refresh Token</button>
        {tokenStatus && <p>{tokenStatus}</p>}
      </div>
    </Layout>
  );
};

export default TestApi;
